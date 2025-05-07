import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MediaInputSchema = z.object({
  alt: z.string().optional(),
  mediaContentType: z.enum(['VIDEO', 'EXTERNAL_VIDEO', 'MODEL_3D', 'IMAGE']),
  originalSource: z.string(),
  id: z.string().optional()
});

const ProductUpdateMediaInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  media: z.array(MediaInputSchema).nonempty("At least one media object is required")
});

type ProductUpdateMediaInput = z.infer<typeof ProductUpdateMediaInputSchema>;

let shopifyClient: GraphQLClient;

const productUpdateMedia = {
  name: "product-update-media",
  description: "Update media for a product",
  schema: ProductUpdateMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductUpdateMediaInput) => {
    const query = gql`
      mutation productUpdateMedia($id: ID!, $media: [UpdateMediaInput!]!) {
        productUpdateMedia(id: $id, media: $media) {
          media {
            id
            mediaContentType
            status
            alt
          }
          mediaUserErrors {
            field
            message
          }
          product {
            id
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      media: input.media
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productUpdateMedia;
    } catch (error) {
      console.error("Error updating product media:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productUpdateMedia };