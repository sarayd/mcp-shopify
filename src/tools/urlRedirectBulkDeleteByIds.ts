import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for bulk deleting URL redirects
const UrlRedirectBulkDeleteByIdsInputSchema = z.object({
  ids: z.array(z.string()).nonempty("At least one redirect ID is required")
});

type UrlRedirectBulkDeleteByIdsInput = z.infer<
  typeof UrlRedirectBulkDeleteByIdsInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const urlRedirectBulkDeleteByIds = {
  name: "url-redirect-bulk-delete-by-ids",
  description: "Bulk delete URL redirects in Shopify",
  schema: UrlRedirectBulkDeleteByIdsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectBulkDeleteByIdsInput) => {
    try {
      const { ids } = input;

      // Convert IDs to GID format if not already
      const formattedIds = ids.map(id =>
        id.startsWith("gid://") ? id : `gid://shopify/UrlRedirect/${id}`
      );

      const query = gql`
        mutation urlRedirectBulkDeleteByIds($ids: [ID!]!) {
          urlRedirectBulkDeleteByIds(ids: $ids) {
            deletedRedirectIds
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { ids: formattedIds };

      const data = (await shopifyClient.request(query, variables)) as {
        urlRedirectBulkDeleteByIds: {
          deletedRedirectIds: string[] | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.urlRedirectBulkDeleteByIds.userErrors.length > 0) {
        throw new Error(
          `Failed to delete URL redirects: ${data.urlRedirectBulkDeleteByIds.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        deletedRedirectIds: data.urlRedirectBulkDeleteByIds.deletedRedirectIds || []
      };
    } catch (error) {
      console.error("Error deleting URL redirects:", error);
      throw new Error(
        `Failed to delete URL redirects: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { urlRedirectBulkDeleteByIds };