import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SavedSearchDeleteInputSchema = z.object({
  id: z.string().min(1, "Saved search ID is required")
});
type SavedSearchDeleteInput = z.infer<typeof SavedSearchDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const savedSearchDelete = {
  name: "saved-search-delete",
  description: "Delete a saved search",
  schema: SavedSearchDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SavedSearchDeleteInput) => {
    const query = gql`
      mutation savedSearchDelete($id: ID!) {
        savedSearchDelete(id: $id) {
          deletedSavedSearchId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.savedSearchDelete;
    } catch (error) {
      console.error("Error deleting saved search:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { savedSearchDelete };