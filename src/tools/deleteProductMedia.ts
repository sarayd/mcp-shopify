import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for deleteProductMedia
const DeleteProductMediaInputSchema = z.object({
  mediaIds: z.array(z.string()).nonempty("At least one media ID is required"),
  productId: z.string().min(1, "Product ID is required")
});
type DeleteProductMediaInput = z.infer<typeof DeleteProductMediaInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const deleteProductMedia = {
  name: "delete-product-media",
  description: "Delete media from a product",
  schema: DeleteProductMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeleteProductMediaInput) => {
    const query = gql`
      mutation productDeleteMedia($mediaIds: [ID!]!, $productId: ID!) {
        productDeleteMedia(mediaIds: $mediaIds, productId: $productId) {
          deletedMediaIds
          deletedProductImageIds
          mediaUserErrors {
            field
            message
          }
          product {
            id
            title
            media(first: 5) {
              nodes {
                alt
                mediaContentType
                status
              }
            }
          }
        }
      }
    `;
    const variables = {
      mediaIds: input.mediaIds,
      productId: input.productId
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

export { deleteProductMedia };
