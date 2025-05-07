import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FileDeleteInputSchema = z.object({
  fileIds: z.array(z.string()).nonempty("At least one file ID is required")
});
type FileDeleteInput = z.infer<typeof FileDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const fileDelete = {
  name: "file-delete",
  description: "Delete one or more files",
  schema: FileDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FileDeleteInput) => {
    const query = gql`
      mutation fileDelete($fileIds: [ID!]!) {
        fileDelete(fileIds: $fileIds) {
          deletedFileIds
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { fileIds: input.fileIds };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fileDelete;
    } catch (error) {
      console.error("Error deleting files:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fileDelete };