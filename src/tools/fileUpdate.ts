import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FileUpdateInputSchema = z.object({
  id: z.string().min(1, "File ID is required"),
  alt: z.string().optional(),
  filename: z.string().optional(),
  originalSource: z.string().optional(),
  previewImageSource: z.string().optional(),
  referencesToAdd: z.array(z.string()).optional(),
  referencesToRemove: z.array(z.string()).optional()
});
type FileUpdateInput = z.infer<typeof FileUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const fileUpdate = {
  name: "file-update",
  description: "Update a file's properties in Shopify",
  schema: FileUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FileUpdateInput) => {
    const query = gql`
      mutation fileUpdate($input: FileUpdateInput!) {
        fileUpdate(input: $input) {
          files {
            ... on GenericFile {
              id
              url
              alt
            }
            ... on MediaImage {
              id
              image {
                url
              }
              alt
            }
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
      return response.fileUpdate;
    } catch (error) {
      console.error("Error updating file:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fileUpdate };