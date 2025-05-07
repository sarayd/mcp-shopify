import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CommentDeleteInputSchema = z.object({
  id: z.string().min(1, "Comment ID is required")
});
type CommentDeleteInput = z.infer<typeof CommentDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const commentDelete = {
  name: "comment-delete",
  description: "Delete a comment",
  schema: CommentDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CommentDeleteInput) => {
    const query = gql`
      mutation commentDelete($id: ID!) {
        commentDelete(id: $id) {
          deletedCommentId
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
      return response.commentDelete;
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { commentDelete };