import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductDeleteMediaInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  mediaIds: z.array(z.string()).nonempty("At least one media ID is required")
});
type ProductDeleteMediaInput = z.infer<typeof ProductDeleteMediaInputSchema>;

let shopifyClient: GraphQLClient;

const productDeleteMedia = {
  name: "product-delete-media",
  description: "Delete media from a product",
  schema: ProductDeleteMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductDeleteMediaInput) => {
    const query = gql`
      mutation productDeleteMedia($id: ID!, $mediaIds: [ID!]!) {
        productDeleteMedia(id: $id, mediaIds: $mediaIds) {
          deletedMediaIds
          mediaUserErrors {
            field
            message
          }
          product {
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
      mediaIds: input.mediaIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productDeleteMedia;
    } catch (error) {
      console.error("Error deleting product media:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productDeleteMedia };