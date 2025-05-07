import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BlogDeleteInputSchema = z.object({
  id: z.string().min(1, "Blog ID is required")
});
type BlogDeleteInput = z.infer<typeof BlogDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const blogDelete = {
  name: "blog-delete",
  description: "Delete a blog",
  schema: BlogDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: BlogDeleteInput) => {
    const query = gql`
      mutation blogDelete($id: ID!) {
        blogDelete(id: $id) {
          deletedBlogId
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
      return response.blogDelete;
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { blogDelete };