import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentEventInputSchema = z.object({
  fulfillmentId: z.string().min(1, "Fulfillment ID is required"),
  status: z.enum([
    "LABEL_PRINTED",
    "LABEL_PURCHASED",
    "ATTEMPTED_DELIVERY",
    "READY_FOR_PICKUP",
    "PICKED_UP",
    "CONFIRMED",
    "IN_TRANSIT",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "FAILURE"
  ]),
  notify: z.boolean().optional()
});
type FulfillmentEventInput = z.infer<typeof FulfillmentEventInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentEventCreate = {
  name: "fulfillment-event-create",
  description: "Create a fulfillment event",
  schema: FulfillmentEventInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentEventInput) => {
    const query = gql`
      mutation fulfillmentEventCreate($fulfillmentId: ID!, $status: FulfillmentEventStatus!, $notify: Boolean) {
        fulfillmentEventCreate(fulfillmentId: $fulfillmentId, status: $status, notify: $notify) {
          fulfillmentEvent {
            id
            status
            happenedAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      fulfillmentId: input.fulfillmentId,
      status: input.status,
      notify: input.notify
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentEventCreate;
    } catch (error) {
      console.error("Error creating fulfillment event:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentEventCreate };