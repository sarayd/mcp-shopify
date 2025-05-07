import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderCloseInputSchema = z.object({
  id: z.string().min(1, "Order ID is required")
});
type OrderCloseInput = z.infer<typeof OrderCloseInputSchema>;

let shopifyClient: GraphQLClient;

const orderClose = {
  name: "order-close",
  description: "Close an order in Shopify",
  schema: OrderCloseInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderCloseInput) => {
    const query = gql`
      mutation orderClose($input: OrderCloseInput!) {
        orderClose(input: $input) {
          order {
            id
            closed
            closedAt
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
      return response.orderClose;
    } catch (error) {
      console.error("Error closing order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderClose };