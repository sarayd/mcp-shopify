import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ThemeFileInputSchema = z.object({
  key: z.string(),
  value: z.string()
});
type ThemeFileInput = z.infer<typeof ThemeFileInputSchema>;

const ThemeFilesUpsertInputSchema = z.object({
  files: z.array(ThemeFileInputSchema).nonempty("At least one file is required"),
  themeId: z.string().min(1, "Theme ID is required")
});
type ThemeFilesUpsertInput = z.infer<typeof ThemeFilesUpsertInputSchema>;

let shopifyClient: GraphQLClient;

const themeFilesUpsert = {
  name: "theme-files-upsert",
  description: "Upsert theme files in Shopify",
  schema: ThemeFilesUpsertInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ThemeFilesUpsertInput) => {
    const query = gql`
      mutation themeFilesUpsert($files: [ThemeFileInput!]!, $themeId: ID!) {
        themeFilesUpsert(files: $files, themeId: $themeId) {
          themeFiles {
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      files: input.files,
      themeId: input.themeId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.themeFilesUpsert;
    } catch (error) {
      console.error("Error upserting theme files:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { themeFilesUpsert };