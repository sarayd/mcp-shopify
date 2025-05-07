import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoveInputSchema = z.object({
  id: z.string().min(1, "Media ID is required"),
  newPosition: z.number().int().nonnegative()
});
type MoveInput = z.infer<typeof MoveInputSchema>;

const ProductReorderMediaInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  moves: z.array(MoveInputSchema).nonempty("At least one move is required")
});
type ProductReorderMediaInput = z.infer<typeof ProductReorderMediaInputSchema>;

let shopifyClient: GraphQLClient;

const productReorderMedia = {
  name: "product-reorder-media",
  description: "Reorder media for a product",
  schema: ProductReorderMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductReorderMediaInput) => {
    const query = gql`
      mutation productReorderMedia($id: ID!, $moves: [MoveInput!]!) {
        productReorderMedia(id: $id, moves: $moves) {
          job {
            id
          }
          mediaUserErrors {
            field
            message
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
      return response.productReorderMedia;
    } catch (error) {
      console.error("Error reordering product media:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productReorderMedia };