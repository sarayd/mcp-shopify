import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductUnpublishInputSchema = z.object({
  id: z.string().min(1, "Product ID is required")
});
type ProductUnpublishInput = z.infer<typeof ProductUnpublishInputSchema>;

let shopifyClient: GraphQLClient;

const productUnpublish = {
  name: "product-unpublish",
  description: "Unpublish a product",
  schema: ProductUnpublishInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductUnpublishInput) => {
    const query = gql`
      mutation productUnpublish($id: ID!) {
        productUnpublish(id: $id) {
          product {
            id
            publishedOnCurrentChannel
          }
          shop {
            id
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
      return response.productUnpublish;
    } catch (error) {
      console.error("Error unpublishing product:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productUnpublish };