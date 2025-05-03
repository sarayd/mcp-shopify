import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for deleting a page
const PageDeleteInputSchema = z.object({
  id: z.string().min(1, "Page ID is required")
});

type PageDeleteInput = z.infer<typeof PageDeleteInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const pageDelete = {
  name: "page-delete",
  description: "Delete a page in Shopify",
  schema: PageDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PageDeleteInput) => {
    try {
      const { id } = input;

      // Convert page ID to GID format if not already
      const formattedPageId = id.startsWith("gid://")
        ? id
        : `gid://shopify/OnlineStorePage/${id}`;

      const query = gql`
        mutation pageDelete($id: ID!) {
          pageDelete(id: $id) {
            deletedPageId
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { id: formattedPageId };

      const data = (await shopifyClient.request(query, variables)) as {
        pageDelete: {
          deletedPageId: string | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.pageDelete.userErrors.length > 0) {
        throw new Error(
          `Failed to delete page: ${data.pageDelete.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        deletedPageId: data.pageDelete.deletedPageId
      };
    } catch (error) {
      console.error("Error deleting page:", error);
      throw new Error(
        `Failed to delete page: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { pageDelete };