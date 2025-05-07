import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnRefundLineItemSchema = z.object({
  lineItemId: z.string(),
  quantity: z.number().int().positive(),
  refundAmount: z.number().optional()
});

const RefundDutySchema = z.object({
  dutyId: z.string(),
  refundAmount: z.number()
});

const RefundShippingSchema = z.object({
  amount: z.number().optional(),
  fullRefund: z.boolean().optional()
});

const ReturnRefundInputSchema = z.object({
  returnId: z.string().min(1, "Return ID is required"),
  returnRefundLineItems: z.array(ReturnRefundLineItemSchema).nonempty("At least one line item is required"),
  notifyCustomer: z.boolean().optional(),
  refundDuties: z.array(RefundDutySchema).optional(),
  refundShipping: RefundShippingSchema.optional()
});

type ReturnRefundInput = z.infer<typeof ReturnRefundInputSchema>;

let shopifyClient: GraphQLClient;

const returnRefund = {
  name: "return-refund",
  description: "Create a refund for a return",
  schema: ReturnRefundInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnRefundInput) => {
    const query = gql`
      mutation returnRefund($input: ReturnRefundInput!) {
        returnRefund(input: $input) {
          refund {
            id
            createdAt
            note
            transactions {
              id
              amount
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
      return response.returnRefund;
    } catch (error) {
      console.error("Error executing returnRefund:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnRefund };