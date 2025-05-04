import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PaymentTermsAttributesSchema = z.object({
  paymentTermsTemplateId: z.string().optional(),
  paymentSchedules: z.array(z.object({
    issuedAt: z.string(),
    dueAt: z.string(),
    amount: z.object({
      amount: z.number(),
      currencyCode: z.string()
    })
  })).optional(),
  paymentTermsName: z.string().optional(),
  overdue: z.object({
    interestRate: z.object({
      percentage: z.number()
    }).optional(),
    grace: z.object({
      period: z.number(),
      periodUnit: z.string()
    }).optional()
  }).optional(),
  description: z.string().optional()
}).strict();

const PaymentTermsUpdateInputSchema = z.object({
  id: z.string().min(1, "Payment Terms ID is required"),
  paymentTermsAttributes: PaymentTermsAttributesSchema
}).strict();

type PaymentTermsUpdateInput = z.infer<typeof PaymentTermsUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const paymentTermsUpdate = {
  name: "payment-terms-update",
  description: "Update payment terms in Shopify",
  schema: PaymentTermsUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentTermsUpdateInput) => {
    const query = gql`
      mutation paymentTermsUpdate($id: ID!, $paymentTermsAttributes: PaymentTermsAttributesInput!) {
        paymentTermsUpdate(id: $id, paymentTermsAttributes: $paymentTermsAttributes) {
          paymentTerms {
            id
            paymentTermsName
            paymentSchedules {
              issuedAt
              dueAt
              amount {
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
      paymentTermsAttributes: input.paymentTermsAttributes
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.paymentTermsUpdate;
    } catch (error) {
      console.error("Error updating payment terms:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { paymentTermsUpdate };