import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FileCreateInputSchema = z.object({
  alt: z.string().optional(),
  contentType: z.enum(['GENERIC_FILE', 'IMAGE', 'VIDEO']).optional(),
  duplicateResolutionMode: z.enum(['REPLACE', 'RENAME']).optional(),
  filename: z.string().optional(),
  originalSource: z.string()
});
type FileCreateInput = z.infer<typeof FileCreateInputSchema>;

const FileCreateToolInputSchema = z.object({
  files: z.array(FileCreateInputSchema).nonempty("At least one file is required")
});
type FileCreateToolInput = z.infer<typeof FileCreateToolInputSchema>;

let shopifyClient: GraphQLClient;

const fileCreate = {
  name: "file-create",
  description: "Create files in Shopify",
  schema: FileCreateToolInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FileCreateToolInput) => {
    const query = gql`
      mutation fileCreate($files: [FileCreateInput!]!) {
        fileCreate(files: $files) {
          files {
            ... on GenericFile {
              id
              fileStatus
              alt
              createdAt
            }
            ... on MediaImage {
              id
              fileStatus
              alt
              createdAt
            }
            ... on Video {
              id
              fileStatus
              alt
              createdAt
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { files: input.files };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fileCreate;
    } catch (error) {
      console.error("Error creating files:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fileCreate };