import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderDeleteInputSchema = z.object({
  id: z.string().min(1, "Order ID is required")
});
type OrderDeleteInput = z.infer<typeof OrderDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const orderDelete = {
  name: "order-delete",
  description: "Delete an order in Shopify",
  schema: OrderDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderDeleteInput) => {
    const query = gql`
      mutation orderDelete($id: ID!) {
        orderDelete(input: { id: $id }) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderDelete;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderDelete };