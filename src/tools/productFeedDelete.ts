import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductFeedDeleteInputSchema = z.object({
  id: z.string().min(1, "Feed ID is required")
});
type ProductFeedDeleteInput = z.infer<typeof ProductFeedDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const productFeedDelete = {
  name: "product-feed-delete",
  description: "Delete a product feed",
  schema: ProductFeedDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductFeedDeleteInput) => {
    const query = gql`
      mutation productFeedDelete($id: ID!) {
        productFeedDelete(id: $id) {
          deletedId
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
      return response.productFeedDelete;
    } catch (error) {
      console.error("Error deleting product feed:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productFeedDelete };