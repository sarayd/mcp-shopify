import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditUpdateShippingLineInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  shippingLine: z.object({
    originalPriceSet: z.object({
      presentmentMoney: z.object({
        amount: z.number(),
        currencyCode: z.string()
      }),
      shopMoney: z.object({
        amount: z.number(),
        currencyCode: z.string()
      })
    }),
    title: z.string()
  })
});
type OrderEditUpdateShippingLineInput = z.infer<typeof OrderEditUpdateShippingLineInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditUpdateShippingLine = {
  name: "order-edit-update-shipping-line",
  description: "Updates a shipping line on an order edit",
  schema: OrderEditUpdateShippingLineInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditUpdateShippingLineInput) => {
    const query = gql`
      mutation orderEditUpdateShippingLine($id: ID!, $shippingLine: OrderEditShippingLineInput!) {
        orderEditUpdateShippingLine(id: $id, shippingLine: $shippingLine) {
          calculatedOrder {
            id
            totalShippingPrice {
              amount
              currencyCode
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
      id: input.id,
      shippingLine: input.shippingLine
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditUpdateShippingLine;
    } catch (error) {
      console.error("Error updating order edit shipping line:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditUpdateShippingLine };