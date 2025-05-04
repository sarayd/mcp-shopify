import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountInputSchema = z.object({
  description: z.string().optional(),
  title: z.string()
});
type DiscountInput = z.infer<typeof DiscountInputSchema>;

const SubscriptionDraftFreeShippingDiscountAddInputSchema = z.object({
  subscriptionContractDraftId: z.string().min(1, "Subscription Contract Draft ID is required"),
  discount: DiscountInputSchema
});
type SubscriptionDraftFreeShippingDiscountAddInput = z.infer<typeof SubscriptionDraftFreeShippingDiscountAddInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftFreeShippingDiscountAdd = {
  name: "subscription-draft-free-shipping-discount-add",
  description: "Add a free shipping discount to a subscription draft",
  schema: SubscriptionDraftFreeShippingDiscountAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftFreeShippingDiscountAddInput) => {
    const query = gql`
      mutation subscriptionDraftFreeShippingDiscountAdd(
        $subscriptionContractDraftId: ID!
        $discount: SubscriptionManualDiscountInput!
      ) {
        subscriptionDraftFreeShippingDiscountAdd(
          subscriptionContractDraftId: $subscriptionContractDraftId
          discount: $discount
        ) {
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
      subscriptionContractDraftId: input.subscriptionContractDraftId,
      discount: input.discount
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftFreeShippingDiscountAdd;
    } catch (error) {
      console.error("Error adding subscription draft free shipping discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftFreeShippingDiscountAdd };