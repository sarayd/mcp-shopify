import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for bulk searching subscription billing cycles
const SubscriptionBillingCycleBulkSearchInputSchema = z.object({
  subscriptionContractIds: z
    .array(z.string())
    .nonempty("At least one subscription contract ID is required"),
  searchCriteria: z.string().optional().describe("Search criteria, e.g., date range or status")
});

type SubscriptionBillingCycleBulkSearchInput = z.infer<
  typeof SubscriptionBillingCycleBulkSearchInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const subscriptionBillingCycleBulkSearch = {
  name: "subscription-billing-cycle-bulk-search",
  description: "Search subscription billing cycles in bulk in Shopify",
  schema: SubscriptionBillingCycleBulkSearchInputSchema,

  // Add initialize method to set up the GraphQL client
  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SubscriptionBillingCycleBulkSearchInput) => {
    try {
      const { subscriptionContractIds, searchCriteria } = input;

      // Convert contract IDs to GID format if they aren't already
      const formattedContractIds = subscriptionContractIds.map(id =>
        id.startsWith('gid://') ? id : `gid://shopify/SubscriptionContract/${id}`
      );

      const query = gql`
        mutation subscriptionBillingCycleBulkSearch($contractIds: [ID!]!, $searchCriteria: String) {
          subscriptionBillingCycleBulkSearch(contractIds: $contractIds, searchCriteria: $searchCriteria) {
            billingCycles {
              id
              contract {
                id
                status
              }
              billingDate
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        contractIds: formattedContractIds,
        searchCriteria
      };

      const data = (await shopifyClient.request(query, variables)) as {
        subscriptionBillingCycleBulkSearch: {
          billingCycles: Array<{
            id: string;
            contract: { id: string; status: string } | null;
            billingDate: string;
            status: string;
          }> | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      // If there are user errors, throw an error
      if (data.subscriptionBillingCycleBulkSearch.userErrors.length > 0) {
        throw new Error(
          `Failed to search subscription billing cycles: ${data.subscriptionBillingCycleBulkSearch.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      // Format and return the billing cycles
      const billingCycles = data.subscriptionBillingCycleBulkSearch.billingCycles || [];

      return {
        billingCycles: billingCycles.map(cycle => ({
          id: cycle.id,
          contract: cycle.contract ? { id: cycle.contract.id, status: cycle.contract.status } : null,
          billingDate: cycle.billingDate,
          status: cycle.status
        }))
      };
    } catch (error) {
      console.error("Error searching subscription billing cycles:", error);
      throw new Error(
        `Failed to search subscription billing cycles: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { subscriptionBillingCycleBulkSearch };