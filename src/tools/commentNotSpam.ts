import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CommentNotSpamSchema = z.object({
  id: z.string().min(1, "Comment ID is required")
});
type CommentNotSpamInput = z.infer<typeof CommentNotSpamSchema>;

let shopifyClient: GraphQLClient;

const commentNotSpam = {
  name: "comment-not-spam",
  description: "Mark a comment as not spam",
  schema: CommentNotSpamSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CommentNotSpamInput) => {
    const query = gql`
      mutation commentNotSpam($id: ID!) {
        commentNotSpam(id: $id) {
          comment {
            id
            status
          }
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
      return response.commentNotSpam;
    } catch (error) {
      console.error("Error marking comment as not spam:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { commentNotSpam };