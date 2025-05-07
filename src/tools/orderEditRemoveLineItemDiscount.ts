import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditRemoveLineItemDiscountInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required").describe("The ID of the order edit."),
  lineItemId: z.string().min(1, "Line item ID is required").describe("The ID of the line item to remove the discount from.")
});
type OrderEditRemoveLineItemDiscountInput = z.infer<typeof OrderEditRemoveLineItemDiscountInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditRemoveLineItemDiscount = {
  name: "order-edit-remove-line-item-discount",
  description: "Remove a discount from a line item in an order edit",
  schema: OrderEditRemoveLineItemDiscountInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditRemoveLineItemDiscountInput) => {
    const query = gql`
      mutation orderEditRemoveLineItemDiscount($id: ID!, $lineItemId: ID!) {
        orderEditRemoveLineItemDiscount(id: $id, lineItemId: $lineItemId) {
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
    const variables = {
      id: input.id,
      lineItemId: input.lineItemId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditRemoveLineItemDiscount;
    } catch (error) {
      console.error("Error removing line item discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditRemoveLineItemDiscount };