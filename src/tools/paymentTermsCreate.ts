import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PaymentScheduleInputSchema = z.object({
  issuedAt: z.string().datetime().optional(),
  dueAt: z.string().datetime().optional(),
  amount: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional()
});

const PaymentTermsCreateInputSchema = z.object({
  paymentTermsTemplateId: z.string().min(1, "Payment terms template ID is required"),
  paymentSchedules: z.array(PaymentScheduleInputSchema).optional(),
  translatedAttributes: z.array(z.object({
    locale: z.string(),
    name: z.string(),
    description: z.string().optional()
  })).optional(),
  paymentTermsName: z.string().optional(),
  paymentTermsDescription: z.string().optional()
});

type PaymentTermsCreateInput = z.infer<typeof PaymentTermsCreateInputSchema>;

let shopifyClient: GraphQLClient;

const paymentTermsCreate = {
  name: "payment-terms-create",
  description: "Create payment terms in Shopify",
  schema: PaymentTermsCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentTermsCreateInput) => {
    const query = gql`
      mutation paymentTermsCreate($input: PaymentTermsCreateInput!) {
        paymentTermsCreate(input: $input) {
          paymentTerms {
            id
            name
            description
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

    const variables = { input };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.paymentTermsCreate;
    } catch (error) {
      console.error("Error creating payment terms:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { paymentTermsCreate };