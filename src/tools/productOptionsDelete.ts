import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductOptionsDeleteInputSchema = z.object({
  id: z.string().min(1, "Option ID is required")
});
type ProductOptionsDeleteInput = z.infer<typeof ProductOptionsDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const productOptionsDelete = {
  name: "product-options-delete",
  description: "Delete a product option",
  schema: ProductOptionsDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductOptionsDeleteInput) => {
    const query = gql`
      mutation productOptionsDelete($id: ID!) {
        productOptionsDelete(id: $id) {
          deletedOptionId
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
      return response.productOptionsDelete;
    } catch (error) {
      console.error("Error deleting product option:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productOptionsDelete };