import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const EmailMarketingConsentSchema = z.object({
  state: z.enum(['SUBSCRIBED', 'UNSUBSCRIBED', 'PENDING']),
  marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN', 'UNKNOWN']).optional(),
  marketingState: z.enum(['NOT_SUBSCRIBED', 'PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED']).optional(),
  consentUpdatedAt: z.string().datetime().optional()
});

const CustomerEmailMarketingConsentUpdateInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  emailMarketingConsent: EmailMarketingConsentSchema
});

type CustomerEmailMarketingConsentUpdateInput = z.infer<typeof CustomerEmailMarketingConsentUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const customerEmailMarketingConsentUpdate = {
  name: "customer-email-marketing-consent-update",
  description: "Update email marketing consent for a customer",
  schema: CustomerEmailMarketingConsentUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerEmailMarketingConsentUpdateInput) => {
    const query = gql`
      mutation customerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
        customerEmailMarketingConsentUpdate(input: $input) {
          customer {
            id
            emailMarketingConsent {
              state
              marketingOptInLevel
              marketingState
              consentUpdatedAt
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
        customerId: input.customerId,
        emailMarketingConsent: input.emailMarketingConsent
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerEmailMarketingConsentUpdate;
    } catch (error) {
      console.error("Error updating customer email marketing consent:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerEmailMarketingConsentUpdate };