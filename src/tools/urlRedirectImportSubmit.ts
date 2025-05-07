import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const UrlRedirectImportSubmitInputSchema = z.object({
  files: z.array(z.object({
    id: z.string().min(1, "File ID is required")
  })).nonempty("At least one file is required"),
  importCollectionId: z.string().optional()
});
type UrlRedirectImportSubmitInput = z.infer<typeof UrlRedirectImportSubmitInputSchema>;

let shopifyClient: GraphQLClient;

const urlRedirectImportSubmit = {
  name: "url-redirect-import-submit",
  description: "Submit URL redirects for import",
  schema: UrlRedirectImportSubmitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: UrlRedirectImportSubmitInput) => {
    const query = gql`
      mutation urlRedirectImportSubmit($files: [FileInput!]!, $importCollectionId: ID) {
        urlRedirectImportSubmit(files: $files, importCollectionId: $importCollectionId) {
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
    const variables = {
      files: input.files,
      importCollectionId: input.importCollectionId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.urlRedirectImportSubmit;
    } catch (error) {
      console.error("Error submitting URL redirect import:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { urlRedirectImportSubmit };