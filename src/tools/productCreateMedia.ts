import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for CreateMediaInput
const CreateMediaInputSchema = z.object({
  alt: z.string().optional(),
  mediaContentType: z.string(),
  originalSource: z.string()
});
type CreateMediaInput = z.infer<typeof CreateMediaInputSchema>;

// Tool input schema
const ProductCreateMediaInputSchema = z.object({
  media: z.array(CreateMediaInputSchema).nonempty("At least one media object is required"),
  productId: z.string().min(1, "Product ID is required")
});
type ProductCreateMediaInput = z.infer<typeof ProductCreateMediaInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const productCreateMedia = {
  name: "product-create-media",
  description: "Create media for a product",
  schema: ProductCreateMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductCreateMediaInput) => {
    const query = gql`
      mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
        productCreateMedia(media: $media, productId: $productId) {
          media {
            alt
            mediaContentType
            status
          }
          mediaUserErrors {
            field
            message
          }
          product {
            id
            title
          }
        }
      }
    `;
    const variables = {
      media: input.media,
      productId: input.productId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productCreateMedia;
    } catch (error) {
      console.error("Error creating product media:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productCreateMedia };
