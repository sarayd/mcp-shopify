import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SmsMarketingConsentSchema = z.object({
  marketingState: z.enum(['NOT_SUBSCRIBED', 'PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED']),
  marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN']).optional(),
  consentUpdatedAt: z.string().datetime().optional(),
  consentCollectedFrom: z.enum(['OTHER', 'SHOPIFY']).optional()
});

const CustomerSmsMarketingConsentUpdateInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  smsMarketingConsent: SmsMarketingConsentSchema
});
type CustomerSmsMarketingConsentUpdateInput = z.infer<typeof CustomerSmsMarketingConsentUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const customerSmsMarketingConsentUpdate = {
  name: "customer-sms-marketing-consent-update",
  description: "Update SMS marketing consent settings for a customer",
  schema: CustomerSmsMarketingConsentUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerSmsMarketingConsentUpdateInput) => {
    const query = gql`
      mutation customerSmsMarketingConsentUpdate($input: CustomerSmsMarketingConsentUpdateInput!) {
        customerSmsMarketingConsentUpdate(input: $input) {
          customer {
            id
            smsMarketingConsent {
              marketingState
              marketingOptInLevel
              consentUpdatedAt
              consentCollectedFrom
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
        smsMarketingConsent: input.smsMarketingConsent
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerSmsMarketingConsentUpdate;
    } catch (error) {
      console.error("Error updating customer SMS marketing consent:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerSmsMarketingConsentUpdate };