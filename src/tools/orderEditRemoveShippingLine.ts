import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditRemoveShippingLineInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required").describe("The ID of the order edit to update"),
  shippingLineId: z.string().min(1, "Shipping line ID is required").describe("The ID of the shipping line to remove")
});
type OrderEditRemoveShippingLineInput = z.infer<typeof OrderEditRemoveShippingLineInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditRemoveShippingLine = {
  name: "order-edit-remove-shipping-line",
  description: "Remove a shipping line from an order edit",
  schema: OrderEditRemoveShippingLineInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditRemoveShippingLineInput) => {
    const query = gql`
      mutation orderEditRemoveShippingLine($input: OrderEditRemoveShippingLineInput!) {
        orderEditRemoveShippingLine(input: $input) {
          calculatedOrder {
            id
            totalOutstandingSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
            totalPriceSet {
              presentmentMoney {
                amount
                currencyCode
              }
            }
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
        shippingLineId: input.shippingLineId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditRemoveShippingLine;
    } catch (error) {
      console.error("Error removing shipping line from order edit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditRemoveShippingLine };