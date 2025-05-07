import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionLineInputSchema = z.object({
  currentPrice: z.number().optional(),
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  interval: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).optional(),
  intervalCount: z.number().int().optional(),
  lineId: z.string(),
  planId: z.string().optional(),
  productVariantId: z.string().optional(),
  quantity: z.number().int().optional(),
  sellingPlanId: z.string().optional(),
  title: z.string().optional()
});

const SubscriptionDraftLineUpdateInputSchema = z.object({
  draftId: z.string().min(1, "Draft ID is required"),
  lines: z.array(SubscriptionLineInputSchema).nonempty("At least one line is required")
});

type SubscriptionDraftLineUpdateInput = z.infer<typeof SubscriptionDraftLineUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftLineUpdate = {
  name: "subscription-draft-line-update",
  description: "Update subscription draft lines",
  schema: SubscriptionDraftLineUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftLineUpdateInput) => {
    const query = gql`
      mutation subscriptionDraftLineUpdate($draftId: ID!, $lines: [SubscriptionLineInput!]!) {
        subscriptionDraftLineUpdate(draftId: $draftId, lines: $lines) {
          draft {
            id
            lines {
              currentPrice
              interval
              intervalCount
              quantity
              title
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
      draftId: input.draftId,
      lines: input.lines
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftLineUpdate;
    } catch (error) {
      console.error("Error updating subscription draft lines:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftLineUpdate };