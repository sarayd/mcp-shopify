import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UtmParametersSchema = z.object({
  campaign: z.string().optional(),
  content: z.string().optional(),
  medium: z.string().optional(),
  source: z.string().optional(),
  term: z.string().optional()
});

const AdSpendSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const MarketingEngagementSchema = z.object({
  occurredOn: z.string(),
  utmParameters: UtmParametersSchema.optional(),
  marketingActivityId: z.string(),
  type: z.enum(["RETARGETING", "POPUP", "EMAIL", "ABANDONED_CART", "AD", "LINK", "CUSTOM"]),
  adSpend: AdSpendSchema.optional(),
  description: z.string().optional()
});

const MarketingEngagementCreateInputSchema = z.object({
  input: z.object({
    marketingEngagement: MarketingEngagementSchema
  })
});

type MarketingEngagementCreateInput = z.infer<typeof MarketingEngagementCreateInputSchema>;

let shopifyClient: GraphQLClient;

const marketingEngagementCreate = {
  name: "marketing-engagement-create",
  description: "Create a marketing engagement in Shopify",
  schema: MarketingEngagementCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketingEngagementCreateInput) => {
    const query = gql`
      mutation marketingEngagementCreate($input: MarketingEngagementCreateInput!) {
        marketingEngagementCreate(input: $input) {
          marketingEngagement {
            id
            type
            occurredOn
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.marketingEngagementCreate;
    } catch (error) {
      console.error("Error creating marketing engagement:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingEngagementCreate };