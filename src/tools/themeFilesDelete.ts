import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemeFilesDeleteInputSchema = z.object({
  themeId: z.string().min(1, "Theme ID is required"),
  files: z.array(z.string()).nonempty("At least one file path is required")
});
type ThemeFilesDeleteInput = z.infer<typeof ThemeFilesDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const themeFilesDelete = {
  name: "theme-files-delete",
  description: "Delete theme files from a theme",
  schema: ThemeFilesDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemeFilesDeleteInput) => {
    const query = gql`
      mutation themeFilesDelete($themeId: ID!, $files: [String!]!) {
        themeFilesDelete(themeId: $themeId, files: $files) {
          deletedThemeFiles {
            filename
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      themeId: input.themeId,
      files: input.files
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.themeFilesDelete;
    } catch (error) {
      console.error("Error deleting theme files:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themeFilesDelete };