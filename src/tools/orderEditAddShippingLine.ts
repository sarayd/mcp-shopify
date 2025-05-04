import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditAddShippingLineInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  shippingLine: z.object({
    price: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }),
    title: z.string()
  })
});
type OrderEditAddShippingLineInput = z.infer<typeof OrderEditAddShippingLineInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditAddShippingLine = {
  name: "order-edit-add-shipping-line",
  description: "Add a shipping line to an order edit",
  schema: OrderEditAddShippingLineInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditAddShippingLineInput) => {
    const query = gql`
      mutation orderEditAddShippingLine($id: ID!, $shippingLine: OrderEditAddShippingLineInput!) {
        orderEditAddShippingLine(id: $id, shippingLine: $shippingLine) {
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
          calculatedShippingLine {
            id
            title
            priceSet {
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
      id: input.id,
      shippingLine: input.shippingLine
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditAddShippingLine;
    } catch (error) {
      console.error("Error adding shipping line to order edit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditAddShippingLine };