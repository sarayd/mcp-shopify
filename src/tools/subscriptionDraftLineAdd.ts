import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SubscriptionLineInputSchema = z.object({
  productVariantId: z.string(),
  quantity: z.number().int().min(1),
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  sellingPlanId: z.string().optional()
});

const SubscriptionDraftLineAddInputSchema = z.object({
  draftId: z.string().min(1, "Subscription draft ID is required"),
  lines: z.array(SubscriptionLineInputSchema).nonempty("At least one line is required")
});

type SubscriptionDraftLineAddInput = z.infer<typeof SubscriptionDraftLineAddInputSchema>;

let shopifyClient: GraphQLClient;

const subscriptionDraftLineAdd = {
  name: "subscription-draft-line-add",
  description: "Add lines to a subscription draft",
  schema: SubscriptionDraftLineAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionDraftLineAddInput) => {
    const query = gql`
      mutation subscriptionDraftLineAdd($draftId: ID!, $lines: [SubscriptionLineInput!]!) {
        subscriptionDraftLineAdd(draftId: $draftId, lines: $lines) {
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
      lines: input.lines
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.subscriptionDraftLineAdd;
    } catch (error) {
      console.error("Error adding subscription draft lines:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { subscriptionDraftLineAdd };