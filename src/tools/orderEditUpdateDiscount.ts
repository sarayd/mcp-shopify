import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditUpdateDiscountInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  discount: z.object({
    amount: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }).optional(),
    percentage: z.number().optional(),
    description: z.string().optional(),
    title: z.string().optional(),
    value: z.number().optional(),
    valueType: z.enum(["FIXED_AMOUNT", "PERCENTAGE"]).optional(),
    targets: z.array(z.object({
      orderLineItemId: z.string()
    })).optional()
  })
});

type OrderEditUpdateDiscountInput = z.infer<typeof OrderEditUpdateDiscountInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditUpdateDiscount = {
  name: "order-edit-update-discount",
  description: "Updates a discount on an order edit",
  schema: OrderEditUpdateDiscountInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditUpdateDiscountInput) => {
    const query = gql`
      mutation orderEditUpdateDiscount($id: ID!, $discount: OrderEditAppliedDiscountInput!) {
        orderEditUpdateDiscount(id: $id, discount: $discount) {
          calculatedOrder {
            id
            totalPrice {
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
      discount: input.discount
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditUpdateDiscount;
    } catch (error) {
      console.error("Error updating order edit discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditUpdateDiscount };