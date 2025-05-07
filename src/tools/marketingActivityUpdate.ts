import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MarketingActivityUpdateInputSchema = z.object({
  id: z.string().min(1, "Marketing Activity ID is required"),
  input: z.object({
    adSpend: z.object({
      amount: z.number(),
      currencyCode: z.string()
    }).optional(),
    budget: z.object({
      amount: z.number(),
      budgetType: z.enum(['DAILY', 'LIFETIME']),
      currencyCode: z.string()
    }).optional(),
    context: z.string().optional(),
    errors: z.array(z.string()).optional(),
    formData: z.string().optional(),
    marketedResources: z.array(z.string()).optional(),
    marketingRecommendationId: z.string().optional(),
    status: z.enum(['ACTIVE', 'DELETED', 'DRAFT', 'FAILED', 'INACTIVE', 'PENDING', 'SCHEDULED']).optional(),
    targetStatus: z.enum(['ACTIVE', 'DELETED', 'DRAFT', 'FAILED', 'INACTIVE', 'PENDING', 'SCHEDULED']).optional(),
    title: z.string().optional(),
    urlParameterValue: z.string().optional(),
    utm: z.object({
      source: z.string(),
      medium: z.string(),
      campaign: z.string(),
      content: z.string().optional(),
      term: z.string().optional()
    }).optional()
  })
});

type MarketingActivityUpdateInput = z.infer<typeof MarketingActivityUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const marketingActivityUpdate = {
  name: "marketing-activity-update",
  description: "Update a marketing activity",
  schema: MarketingActivityUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MarketingActivityUpdateInput) => {
    const query = gql`
      mutation marketingActivityUpdate($id: ID!, $input: MarketingActivityUpdateInput!) {
        marketingActivityUpdate(id: $id, input: $input) {
          marketingActivity {
            id
            title
            status
            budget {
              budgetType
              amount {
                amount
                currencyCode
              }
            }
            adSpend {
              amount
              currencyCode
            }
            utm {
              source
              medium
              campaign
              content
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

    const variables = {
      id: input.id,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.marketingActivityUpdate;
    } catch (error) {
      console.error("Error updating marketing activity:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { marketingActivityUpdate };