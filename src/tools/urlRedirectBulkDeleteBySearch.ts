import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectBulkDeleteBySearchInputSchema = z.object({
  search: z.string().optional()
});
type UrlRedirectBulkDeleteBySearchInput = z.infer<typeof UrlRedirectBulkDeleteBySearchInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectBulkDeleteBySearch = {
  name: "url-redirect-bulk-delete-by-search",
  description: "Bulk delete URL redirects by search query",
  schema: UrlRedirectBulkDeleteBySearchInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectBulkDeleteBySearchInput) => {
    const query = gql`
      mutation urlRedirectBulkDeleteBySearch($search: String) {
        urlRedirectBulkDeleteBySearch(search: $search) {
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
    const variables = { search: input.search };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.urlRedirectBulkDeleteBySearch;
    } catch (error) {
      console.error("Error executing urlRedirectBulkDeleteBySearch:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectBulkDeleteBySearch };