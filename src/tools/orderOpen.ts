import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderOpenInputSchema = z.object({
  id: z.string().min(1, "Order ID is required")
});
type OrderOpenInput = z.infer<typeof OrderOpenInputSchema>;

let shopifyClient: GraphQLClient;

const orderOpen = {
  name: "order-open",
  description: "Open a closed order",
  schema: OrderOpenInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderOpenInput) => {
    const query = gql`
      mutation orderOpen($id: ID!) {
        orderOpen(input: { id: $id }) {
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
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderOpen;
    } catch (error) {
      console.error("Error opening order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderOpen };