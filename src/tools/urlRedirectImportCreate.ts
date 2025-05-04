import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FileInputSchema = z.object({
  content: z.string(),
  name: z.string()
});
type FileInput = z.infer<typeof FileInputSchema>;

const UrlRedirectImportCreateInputSchema = z.object({
  files: z.array(FileInputSchema).nonempty("At least one file is required"),
  importToken: z.string().optional()
});
type UrlRedirectImportCreateInput = z.infer<typeof UrlRedirectImportCreateInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectImportCreate = {
  name: "url-redirect-import-create",
  description: "Create URL redirects by importing files",
  schema: UrlRedirectImportCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectImportCreateInput) => {
    const query = gql`
      mutation urlRedirectImportCreate($input: UrlRedirectImportCreateInput!) {
        urlRedirectImportCreate(input: $input) {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.urlRedirectImportCreate;
    } catch (error) {
      console.error("Error importing URL redirects:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectImportCreate };