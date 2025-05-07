import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectBulkDeleteBySavedSearchInputSchema = z.object({
  savedSearchId: z.string().min(1, "Saved search ID is required")
});
type UrlRedirectBulkDeleteBySavedSearchInput = z.infer<typeof UrlRedirectBulkDeleteBySavedSearchInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectBulkDeleteBySavedSearch = {
  name: "url-redirect-bulk-delete-by-saved-search",
  description: "Bulk delete URL redirects using a saved search",
  schema: UrlRedirectBulkDeleteBySavedSearchInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectBulkDeleteBySavedSearchInput) => {
    const query = gql`
      mutation urlRedirectBulkDeleteBySavedSearch($savedSearchId: ID!) {
        urlRedirectBulkDeleteBySavedSearch(savedSearchId: $savedSearchId) {
          job {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { savedSearchId: input.savedSearchId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.urlRedirectBulkDeleteBySavedSearch;
    } catch (error) {
      console.error("Error executing urlRedirectBulkDeleteBySavedSearch:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectBulkDeleteBySavedSearch };