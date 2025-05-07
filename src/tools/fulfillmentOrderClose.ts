import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderCloseInputSchema = z.object({
  id: z.string().min(1, "Fulfillment order ID is required"),
  message: z.string().optional()
});
type FulfillmentOrderCloseInput = z.infer<typeof FulfillmentOrderCloseInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderClose = {
  name: "fulfillment-order-close",
  description: "Close a fulfillment order in Shopify",
  schema: FulfillmentOrderCloseInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderCloseInput) => {
    const query = gql`
      mutation fulfillmentOrderClose($input: FulfillmentOrderCloseInput!) {
        fulfillmentOrderClose(input: $input) {
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
      input: {
        id: input.id,
        message: input.message
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderClose;
    } catch (error) {
      console.error("Error closing fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderClose };