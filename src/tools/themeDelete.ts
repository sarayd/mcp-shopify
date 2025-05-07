import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemeDeleteInputSchema = z.object({
  id: z.string().min(1, "Theme ID is required")
});
type ThemeDeleteInput = z.infer<typeof ThemeDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const themeDelete = {
  name: "theme-delete",
  description: "Delete a theme",
  schema: ThemeDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemeDeleteInput) => {
    const query = gql`
      mutation themeDelete($id: ID!) {
        themeDelete(id: $id) {
          deletedThemeId
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
      return response.themeDelete;
    } catch (error) {
      console.error("Error deleting theme:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themeDelete };