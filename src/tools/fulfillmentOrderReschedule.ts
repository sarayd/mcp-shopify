import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderRescheduleInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  fulfillAt: z.string().datetime(),
  notifyCustomer: z.boolean().optional()
});
type FulfillmentOrderRescheduleInput = z.infer<typeof FulfillmentOrderRescheduleInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderReschedule = {
  name: "fulfillment-order-reschedule",
  description: "Reschedule a fulfillment order for a later date",
  schema: FulfillmentOrderRescheduleInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderRescheduleInput) => {
    const query = gql`
      mutation fulfillmentOrderReschedule($input: FulfillmentOrderRescheduleInput!) {
        fulfillmentOrderReschedule(input: $input) {
          fulfillmentOrder {
            id
            status
            fulfillAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id,
        fulfillAt: input.fulfillAt,
        notifyCustomer: input.notifyCustomer
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderReschedule;
    } catch (error) {
      console.error("Error rescheduling fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderReschedule };