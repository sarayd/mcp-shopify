import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductDeleteInputSchema = z.object({
  id: z.string().min(1, "Product ID is required")
});
type ProductDeleteInput = z.infer<typeof ProductDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const productDelete = {
  name: "product-delete",
  description: "Delete a product",
  schema: ProductDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductDeleteInput) => {
    const query = gql`
      mutation productDelete($input: ProductDeleteInput!) {
        productDelete(input: $input) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productDelete;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productDelete };