import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FileAcknowledgeUpdateFailedInputSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  failureReason: z.string().min(1, "Failure reason is required")
});
type FileAcknowledgeUpdateFailedInput = z.infer<typeof FileAcknowledgeUpdateFailedInputSchema>;

let shopifyClient: GraphQLClient;

const fileAcknowledgeUpdateFailed = {
  name: "file-acknowledge-update-failed",
  description: "Acknowledge that a file update has failed",
  schema: FileAcknowledgeUpdateFailedInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FileAcknowledgeUpdateFailedInput) => {
    const query = gql`
      mutation fileAcknowledgeUpdateFailed($input: FileAcknowledgeUpdateFailedInput!) {
        fileAcknowledgeUpdateFailed(input: $input) {
          file {
            id
            originalFileSize
            url
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        fileId: input.fileId,
        failureReason: input.failureReason
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fileAcknowledgeUpdateFailed;
    } catch (error) {
      console.error("Error acknowledging file update failed:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fileAcknowledgeUpdateFailed };