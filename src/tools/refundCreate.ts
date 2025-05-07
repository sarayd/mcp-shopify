import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RefundLineItemSchema = z.object({
  lineItemId: z.string(),
  locationId: z.string().optional(),
  quantity: z.number().int().positive(),
  restockType: z.enum(['CANCEL', 'LEGACY_RESTOCK', 'NO_RESTOCK', 'RETURN']).optional()
});

const RefundTransactionSchema = z.object({
  amount: z.number().positive(),
  gateway: z.string().optional(),
  kind: z.enum(['REFUND', 'VOID']),
  orderId: z.string().optional(),
  parentId: z.string().optional()
});

const RefundInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  shipping: z.object({
    amount: z.number().optional(),
    fullRefund: z.boolean().optional()
  }).optional(),
  refundLineItems: z.array(RefundLineItemSchema).optional(),
  transactions: z.array(RefundTransactionSchema).optional(),
  note: z.string().optional(),
  notify: z.boolean().optional()
});

type RefundInput = z.infer<typeof RefundInputSchema>;

let shopifyClient: GraphQLClient;

const refundCreate = {
  name: "refund-create",
  description: "Create a refund for an order",
  schema: RefundInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: RefundInput) => {
    const query = gql`
      mutation refundCreate($input: RefundInput!) {
        refundCreate(input: $input) {
          refund {
            id
            totalRefundedSet {
              presentmentMoney {
                amount
                currencyCode
              }
              shopMoney {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.refundCreate;
    } catch (error) {
      console.error("Error creating refund:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { refundCreate };