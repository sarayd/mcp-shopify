import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const OrderCreateManualPaymentInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  amount: MoneyInputSchema,
  note: z.string().optional()
});

type OrderCreateManualPaymentInput = z.infer<typeof OrderCreateManualPaymentInputSchema>;

let shopifyClient: GraphQLClient;

const orderCreateManualPayment = {
  name: "order-create-manual-payment",
  description: "Create a manual payment for an order",
  schema: OrderCreateManualPaymentInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderCreateManualPaymentInput) => {
    const query = gql`
      mutation orderCreateManualPayment($input: OrderCreateManualPaymentInput!) {
        orderCreateManualPayment(input: $input) {
          order {
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
      input: {
        orderId: input.orderId,
        amount: input.amount,
        note: input.note
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderCreateManualPayment;
    } catch (error) {
      console.error("Error creating manual payment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderCreateManualPayment };