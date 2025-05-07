import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderReleaseHoldInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  holdIds: z.array(z.string()).optional(),
  externalId: z.string().optional()
});
type FulfillmentOrderReleaseHoldInput = z.infer<typeof FulfillmentOrderReleaseHoldInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderReleaseHold = {
  name: "fulfillment-order-release-hold",
  description: "Release hold on a fulfillment order",
  schema: FulfillmentOrderReleaseHoldInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderReleaseHoldInput) => {
    const query = gql`
      mutation fulfillmentOrderReleaseHold($id: ID!, $holdIds: [ID!], $externalId: String) {
        fulfillmentOrderReleaseHold(id: $id, holdIds: $holdIds, externalId: $externalId) {
          fulfillmentOrder {
            id
            status
            requestStatus
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      holdIds: input.holdIds,
      externalId: input.externalId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderReleaseHold;
    } catch (error) {
      console.error("Error releasing fulfillment order hold:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderReleaseHold };