import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftFreeShippingDiscountUpdateInputSchema = z.object({
  discountId: z.string().min(1, "Discount ID is required"),
  subscriptionDraftId: z.string().min(1, "Subscription Draft ID is required"),
  targetAllLines: z.boolean().optional(),
  targetType: z.enum(['LINE_ITEMS', 'SHIPPING_LINES']).optional()
});
type SubscriptionDraftFreeShippingDiscountUpdateInput = z.infer<typeof SubscriptionDraftFreeShippingDiscountUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftFreeShippingDiscountUpdate = {
  name: "subscription-draft-free-shipping-discount-update",
  description: "Updates a free shipping discount on a subscription draft",
  schema: SubscriptionDraftFreeShippingDiscountUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftFreeShippingDiscountUpdateInput) => {
    const query = gql`
      mutation subscriptionDraftFreeShippingDiscountUpdate(
        $discountId: ID!
        $subscriptionDraftId: ID!
        $targetAllLines: Boolean
        $targetType: SubscriptionFreeShippingDiscountTargetType
      ) {
        subscriptionDraftFreeShippingDiscountUpdate(
          discountId: $discountId
          subscriptionDraftId: $subscriptionDraftId
          targetAllLines: $targetAllLines
          targetType: $targetType
        ) {
          draft {
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
      discountId: input.discountId,
      subscriptionDraftId: input.subscriptionDraftId,
      targetAllLines: input.targetAllLines,
      targetType: input.targetType
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftFreeShippingDiscountUpdate;
    } catch (error) {
      console.error("Error updating subscription draft free shipping discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftFreeShippingDiscountUpdate };