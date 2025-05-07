import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SavedSearchUpdateInputSchema = z.object({
  id: z.string().min(1, "Saved search ID is required"),
  input: z.object({
    name: z.string().optional(),
    query: z.string().optional()
  })
});
type SavedSearchUpdateInput = z.infer<typeof SavedSearchUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const savedSearchUpdate = {
  name: "saved-search-update",
  description: "Update a saved search",
  schema: SavedSearchUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SavedSearchUpdateInput) => {
    const query = gql`
      mutation savedSearchUpdate($id: ID!, $input: SavedSearchInput!) {
        savedSearchUpdate(id: $id, input: $input) {
          savedSearch {
            id
            name
            query
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.savedSearchUpdate;
    } catch (error) {
      console.error("Error updating saved search:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { savedSearchUpdate };