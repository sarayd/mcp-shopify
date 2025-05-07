import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderCancelInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required")
});
type FulfillmentOrderCancelInput = z.infer<typeof FulfillmentOrderCancelInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderCancel = {
  name: "fulfillment-order-cancel",
  description: "Cancel a fulfillment order",
  schema: FulfillmentOrderCancelInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderCancelInput) => {
    const query = gql`
      mutation fulfillmentOrderCancel($input: FulfillmentOrderCancelInput!) {
        fulfillmentOrderCancel(input: $input) {
          fulfillmentOrder {
            id
            status
            requestStatus
          }
          replacementFulfillmentOrder {
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
      input: {
        id: input.id
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderCancel;
    } catch (error) {
      console.error("Error canceling fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderCancel };