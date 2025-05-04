import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CommentApproveInputSchema = z.object({
  id: z.string().min(1, "Comment ID is required")
});
type CommentApproveInput = z.infer<typeof CommentApproveInputSchema>;

let shopifyClient: GraphQLClient;

const commentApprove = {
  name: "comment-approve",
  description: "Approve a comment in Shopify",
  schema: CommentApproveInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CommentApproveInput) => {
    const query = gql`
      mutation commentApprove($id: ID!) {
        commentApprove(id: $id) {
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
      return response.commentApprove;
    } catch (error) {
      console.error("Error approving comment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { commentApprove };