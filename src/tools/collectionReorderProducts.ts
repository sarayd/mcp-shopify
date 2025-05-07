import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoveInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  newPosition: z.number().int().nonnegative()
});
type MoveInput = z.infer<typeof MoveInputSchema>;

const CollectionReorderProductsInputSchema = z.object({
  id: z.string().min(1, "Collection ID is required"),
  moves: z.array(MoveInputSchema).nonempty("At least one move is required")
});
type CollectionReorderProductsInput = z.infer<typeof CollectionReorderProductsInputSchema>;

let shopifyClient: GraphQLClient;

const collectionReorderProducts = {
  name: "collection-reorder-products",
  description: "Reorder products within a collection",
  schema: CollectionReorderProductsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CollectionReorderProductsInput) => {
    const query = gql`
      mutation collectionReorderProducts($id: ID!, $moves: [MoveInput!]!) {
        collectionReorderProducts(id: $id, moves: $moves) {
          job {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      moves: input.moves
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.collectionReorderProducts;
    } catch (error) {
      console.error("Error reordering collection products:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { collectionReorderProducts };