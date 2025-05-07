import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketingActivityCreateExternalInputSchema = z.object({
  marketingActivityId: z.string().optional(),
  marketingChannel: z.enum(['SEARCH', 'DISPLAY', 'SOCIAL', 'EMAIL', 'REFERRAL']),
  remoteId: z.string(),
  remoteUrl: z.string().url(),
  title: z.string(),
  type: z.enum(['ABANDONED_CART', 'AD', 'DIRECT_MARKETING', 'DISPLAY_AD', 'FOLLOW_UP', 'LOYALTY', 'MESSAGE', 'NEWSLETTER', 'NOTIFICATION', 'POST', 'RETARGETING', 'SEARCH_AD', 'TRANSACTIONAL']),
  adSpend: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  budget: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  description: z.string().optional(),
  endedAt: z.string().datetime().optional(),
  scheduledEndAt: z.string().datetime().optional(),
  scheduledStartAt: z.string().datetime().optional(),
  startedAt: z.string().datetime().optional(),
  targetStatus: z.enum(['ACTIVE', 'SCHEDULED', 'FAILED', 'COMPLETED']).optional(),
  utm: z.object({
    campaign: z.string().optional(),
    content: z.string().optional(),
    medium: z.string().optional(),
    source: z.string().optional(),
    term: z.string().optional()
  }).optional()
});

type MarketingActivityCreateExternalInput = z.infer<typeof MarketingActivityCreateExternalInputSchema>;

let shopifyClient: GraphQLClient;

const marketingActivityCreateExternal = {
  name: "marketing-activity-create-external",
  description: "Create an external marketing activity",
  schema: MarketingActivityCreateExternalInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketingActivityCreateExternalInput) => {
    const query = gql`
      mutation marketingActivityCreateExternal($input: MarketingActivityCreateExternalInput!) {
        marketingActivityCreateExternal(input: $input) {
          marketingActivity {
            id
            marketingChannel
            status
            remoteId
            remoteUrl
            title
            type
            utm {
              campaign
              content
              medium
              source
              term
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
      return response.marketingActivityCreateExternal;
    } catch (error) {
      console.error("Error creating external marketing activity:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingActivityCreateExternal };