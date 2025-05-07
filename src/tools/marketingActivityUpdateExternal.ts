import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const MarketingActivityUpdateExternalInputSchema = z.object({
  id: z.string().min(1, "Marketing Activity ID is required"),
  input: z.object({
    adSpend: MoneyInputSchema.optional(),
    budget: MoneyInputSchema.optional(),
    channel: z.enum(['SEARCH', 'DISPLAY', 'SOCIAL', 'EMAIL', 'REFERRAL']).optional(),
    end: z.string().datetime().optional(),
    marketingChannelType: z.enum(['SEARCH', 'DISPLAY', 'SOCIAL', 'EMAIL', 'REFERRAL']).optional(),
    referringDomain: z.string().optional(),
    remotePreviewImageUrl: z.string().url().optional(),
    remoteUrl: z.string().url().optional(),
    scheduledEnd: z.string().datetime().optional(),
    scheduledStart: z.string().datetime().optional(),
    start: z.string().datetime().optional(),
    status: z.enum(['ACTIVE', 'COMPLETED', 'DELETED', 'DRAFT', 'FAILED', 'PENDING', 'SCHEDULED']).optional(),
    tactic: z.enum(['ABANDONED_CART', 'AD', 'DIRECT_MARKETING', 'DISPLAY_AD', 'FOLLOW_UP', 'LOYALTY', 'MESSAGE', 'NEWSLETTER', 'NOTIFICATION', 'POST', 'RETARGETING', 'SEARCH_AD', 'TRANSACTIONAL']).optional(),
    title: z.string().optional()
  })
});

type MarketingActivityUpdateExternalInput = z.infer<typeof MarketingActivityUpdateExternalInputSchema>;

let shopifyClient: GraphQLClient;

const marketingActivityUpdateExternal = {
  name: "marketing-activity-update-external",
  description: "Update an external marketing activity",
  schema: MarketingActivityUpdateExternalInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketingActivityUpdateExternalInput) => {
    const query = gql`
      mutation marketingActivityUpdateExternal($id: ID!, $input: MarketingActivityUpdateExternalInput!) {
        marketingActivityUpdateExternal(id: $id, input: $input) {
          marketingActivity {
            id
            status
            title
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.marketingActivityUpdateExternal;
    } catch (error) {
      console.error("Error updating marketing activity:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingActivityUpdateExternal };