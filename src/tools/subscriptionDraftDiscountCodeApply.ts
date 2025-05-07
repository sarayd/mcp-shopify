import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftDiscountCodeApplyInputSchema = z.object({
  draftId: z.string().min(1, "Subscription draft ID is required"),
  discountCode: z.string().min(1, "Discount code is required")
});
type SubscriptionDraftDiscountCodeApplyInput = z.infer<typeof SubscriptionDraftDiscountCodeApplyInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftDiscountCodeApply = {
  name: "subscription-draft-discount-code-apply",
  description: "Apply a discount code to a subscription draft",
  schema: SubscriptionDraftDiscountCodeApplyInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftDiscountCodeApplyInput) => {
    const query = gql`
      mutation subscriptionDraftDiscountCodeApply($draftId: ID!, $discountCode: String!) {
        subscriptionDraftDiscountCodeApply(draftId: $draftId, discountCode: $discountCode) {
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
      draftId: input.draftId,
      discountCode: input.discountCode
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftDiscountCodeApply;
    } catch (error) {
      console.error("Error applying discount code to subscription draft:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftDiscountCodeApply };