import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountValueSchema = z.object({
  amount: z.number().optional(),
  percentage: z.number().optional(),
  appliesOnEachItem: z.boolean().optional()
}).refine(data => {
  const hasAmount = typeof data.amount === 'number';
  const hasPercentage = typeof data.percentage === 'number';
  return (hasAmount && !hasPercentage) || (!hasAmount && hasPercentage);
}, "Exactly one of 'amount' or 'percentage' must be provided");

const DiscountCodeSchema = z.object({
  code: z.string(),
  duration: z.object({
    period: z.enum(["FOREVER", "MULTIPLE_USE", "SINGLE_USE", "USAGE_LIMIT"]),
    usageLimit: z.number().optional()
  })
});

const SubscriptionDraftDiscountAddInputSchema = z.object({
  subscriptionDraftId: z.string().min(1, "Subscription Draft ID is required"),
  discount: z.object({
    value: DiscountValueSchema,
    type: z.enum(["FIXED_AMOUNT", "PERCENTAGE"]),
    title: z.string().optional(),
    description: z.string().optional(),
    codes: z.array(DiscountCodeSchema).optional()
  })
});

type SubscriptionDraftDiscountAddInput = z.infer<typeof SubscriptionDraftDiscountAddInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftDiscountAdd = {
  name: "subscription-draft-discount-add",
  description: "Add a discount to a subscription draft",
  schema: SubscriptionDraftDiscountAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftDiscountAddInput) => {
    const query = gql`
      mutation subscriptionDraftDiscountAdd($subscriptionDraftId: ID!, $discount: SubscriptionManualDiscountInput!) {
        subscriptionDraftDiscountAdd(subscriptionDraftId: $subscriptionDraftId, discount: $discount) {
          subscriptionDraft {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      subscriptionDraftId: input.subscriptionDraftId,
      discount: input.discount
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftDiscountAdd;
    } catch (error) {
      console.error("Error adding subscription draft discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftDiscountAdd };