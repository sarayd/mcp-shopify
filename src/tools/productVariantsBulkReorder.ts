import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoveInputSchema = z.object({
  id: z.string().min(1, "Variant ID is required"),
  position: z.number().int().positive("Position must be a positive integer")
});
type MoveInput = z.infer<typeof MoveInputSchema>;

const ProductVariantsBulkReorderInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  moves: z.array(MoveInputSchema).nonempty("At least one move is required")
});
type ProductVariantsBulkReorderInput = z.infer<typeof ProductVariantsBulkReorderInputSchema>;

let shopifyClient: GraphQLClient;

const productVariantsBulkReorder = {
  name: "product-variants-bulk-reorder",
  description: "Reorder multiple product variants in bulk",
  schema: ProductVariantsBulkReorderInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantsBulkReorderInput) => {
    const query = gql`
      mutation productVariantsBulkReorder($id: ID!, $moves: [ProductVariantPositionInput!]!) {
        productVariantsBulkReorder(id: $id, moves: $moves) {
          product {
            id
            variants(first: 250) {
              nodes {
                id
                position
              }
            }
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
      return response.productVariantsBulkReorder;
    } catch (error) {
      console.error("Error reordering product variants:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productVariantsBulkReorder };