import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftDiscountRemoveInputSchema = z.object({
  id: z.string().min(1, "Subscription draft ID is required"),
  discountId: z.string().min(1, "Discount ID is required")
});
type SubscriptionDraftDiscountRemoveInput = z.infer<typeof SubscriptionDraftDiscountRemoveInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftDiscountRemove = {
  name: "subscription-draft-discount-remove",
  description: "Remove a discount from a subscription draft",
  schema: SubscriptionDraftDiscountRemoveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftDiscountRemoveInput) => {
    const query = gql`
      mutation subscriptionDraftDiscountRemove($id: ID!, $discountId: ID!) {
        subscriptionDraftDiscountRemove(id: $id, discountId: $discountId) {
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
      id: input.id,
      discountId: input.discountId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftDiscountRemove;
    } catch (error) {
      console.error("Error removing subscription draft discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftDiscountRemove };