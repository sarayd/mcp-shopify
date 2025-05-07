import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionDraftLineRemoveInputSchema = z.object({
  draftId: z.string().min(1, "Subscription draft ID is required"),
  lineId: z.string().min(1, "Line ID is required")
});
type SubscriptionDraftLineRemoveInput = z.infer<typeof SubscriptionDraftLineRemoveInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftLineRemove = {
  name: "subscription-draft-line-remove",
  description: "Remove a line from a subscription draft",
  schema: SubscriptionDraftLineRemoveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftLineRemoveInput) => {
    const query = gql`
      mutation subscriptionDraftLineRemove($draftId: ID!, $lineId: ID!) {
        subscriptionDraftLineRemove(draftId: $draftId, lineId: $lineId) {
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
      draftId: input.draftId,
      lineId: input.lineId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftLineRemove;
    } catch (error) {
      console.error("Error removing subscription draft line:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftLineRemove };