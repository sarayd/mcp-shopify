import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketingActivityBudgetSchema = z.object({
  amount: z.number().optional(),
  currencyCode: z.string().optional()
});

const MarketingActivityUtmSchema = z.object({
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  term: z.string().optional(),
  content: z.string().optional()
});

const MarketingActivityCreateInputSchema = z.object({
  input: z.object({
    budget: MarketingActivityBudgetSchema.optional(),
    context: z.string().optional(),
    formData: z.string().optional(),
    marketingActivityExtensionId: z.string(),
    marketingActivityTitle: z.string(),
    status: z.enum(['ACTIVE', 'DELETED', 'DRAFT', 'FAILED', 'INACTIVE', 'SCHEDULED', 'SUCCEEDED']),
    targetStatus: z.enum(['ACTIVE', 'DELETED', 'DRAFT', 'FAILED', 'INACTIVE', 'SCHEDULED', 'SUCCEEDED']).optional(),
    urlParameterValue: z.string().optional(),
    utm: MarketingActivityUtmSchema.optional()
  })
});

type MarketingActivityCreateInput = z.infer<typeof MarketingActivityCreateInputSchema>;

let shopifyClient: GraphQLClient;

const marketingActivityCreate = {
  name: "marketing-activity-create",
  description: "Create a marketing activity",
  schema: MarketingActivityCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketingActivityCreateInput) => {
    const query = gql`
      mutation marketingActivityCreate($input: MarketingActivityCreateInput!) {
        marketingActivityCreate(input: $input) {
          marketingActivity {
            id
            title
            status
            marketingChannel
            createdAt
            updatedAt
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, { input: input.input });
      return response.marketingActivityCreate;
    } catch (error) {
      console.error("Error creating marketing activity:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingActivityCreate };