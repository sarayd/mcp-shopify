import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for deleting subscription billing cycle edits
const SubscriptionBillingCycleEditsDeleteInputSchema = z.object({
  editIds: z.array(z.string()).nonempty("At least one edit ID is required")
});

type SubscriptionBillingCycleEditsDeleteInput = z.infer<
  typeof SubscriptionBillingCycleEditsDeleteInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const subscriptionBillingCycleEditsDelete = {
  name: "subscription-billing-cycle-edits-delete",
  description: "Delete subscription billing cycle edits in Shopify",
  schema: SubscriptionBillingCycleEditsDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleEditsDeleteInput) => {
    try {
      const { editIds } = input;

      // Convert IDs to GID format if not already
      const formattedIds = editIds.map(id =>
        id.startsWith("gid://") ? id : `gid://shopify/SubscriptionBillingCycleEdit/${id}`
      );

      const query = gql`
        mutation subscriptionBillingCycleEditsDelete($editIds: [ID!]!) {
          subscriptionBillingCycleEditsDelete(editIds: $editIds) {
            deletedEditIds
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { editIds: formattedIds };

      const data = (await shopifyClient.request(query, variables)) as {
        subscriptionBillingCycleEditsDelete: {
          deletedEditIds: string[] | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.subscriptionBillingCycleEditsDelete.userErrors.length > 0) {
        throw new Error(
          `Failed to delete subscription billing cycle edits: ${data.subscriptionBillingCycleEditsDelete.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        deletedEditIds: data.subscriptionBillingCycleEditsDelete.deletedEditIds || []
      };
    } catch (error) {
      console.error("Error deleting subscription billing cycle edits:", error);
      throw new Error(
        `Failed to delete subscription billing cycle edits: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { subscriptionBillingCycleEditsDelete };