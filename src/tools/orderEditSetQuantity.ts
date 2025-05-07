import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditSetQuantityInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  lineItemId: z.string().min(1, "Line item ID is required"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  restock: z.boolean().optional()
});
type OrderEditSetQuantityInput = z.infer<typeof OrderEditSetQuantityInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditSetQuantity = {
  name: "order-edit-set-quantity",
  description: "Set the quantity of a line item in an order edit",
  schema: OrderEditSetQuantityInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditSetQuantityInput) => {
    const query = gql`
      mutation orderEditSetQuantity($input: OrderEditSetQuantityInput!) {
        orderEditSetQuantity(input: $input) {
          calculatedOrder {
            id
          }
          orderEdit {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditSetQuantity;
    } catch (error) {
      console.error("Error setting order edit quantity:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditSetQuantity };