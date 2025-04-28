import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for MoveInput
const MoveInputSchema = z.object({
  id: z.string(),
  newPosition: z.number().int().nonnegative()
});
type MoveInput = z.infer<typeof MoveInputSchema>;

// Tool input schema
const ProductReorderMediaInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  moves: z.array(MoveInputSchema).nonempty("At least one move is required")
});
type ProductReorderMediaInput = z.infer<typeof ProductReorderMediaInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const productReorderMedia = {
  name: "reorder-product-media",
  description: "Reorder media for a product",
  schema: ProductReorderMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductReorderMediaInput) => {
    const query = gql`
      mutation productReorderMedia($id: ID!, $moves: [MoveInput!]!) {
        productReorderMedia(id: $id, moves: $moves) {
          job { id }
          mediaUserErrors { field message }
          userErrors { field message }
        }
      }
    `;
    const variables = { id: input.id, moves: input.moves };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productReorderMedia;
    } catch (error) {
      console.error("Error reordering product media:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productReorderMedia };
