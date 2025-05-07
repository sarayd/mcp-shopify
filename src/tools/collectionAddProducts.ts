import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CollectionAddProductsInputSchema = z.object({
  collectionId: z.string().min(1, "Collection ID is required"),
  productIds: z.array(z.string()).nonempty("At least one product ID is required")
});
type CollectionAddProductsInput = z.infer<typeof CollectionAddProductsInputSchema>;

let shopifyClient: GraphQLClient;

const collectionAddProducts = {
  name: "collection-add-products",
  description: "Add products to a collection",
  schema: CollectionAddProductsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionAddProductsInput) => {
    const query = gql`
      mutation collectionAddProducts($collectionId: ID!, $productIds: [ID!]!) {
        collectionAddProducts(collectionId: $collectionId, productIds: $productIds) {
          collection {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      collectionId: input.collectionId,
      productIds: input.productIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.collectionAddProducts;
    } catch (error) {
      console.error("Error adding products to collection:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionAddProducts };