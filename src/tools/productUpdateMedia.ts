import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for UpdateMediaInput
const UpdateMediaInputSchema = z.object({
  id: z.string(),
  alt: z.string().optional(),
});
type UpdateMediaInput = z.infer<typeof UpdateMediaInputSchema>;

// Tool input schema
const ProductUpdateMediaInputSchema = z.object({
  media: z.array(UpdateMediaInputSchema).nonempty("At least one media update is required"),
  productId: z.string().min(1, "Product ID is required")
});
type ProductUpdateMediaInput = z.infer<typeof ProductUpdateMediaInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const productUpdateMedia = {
  name: "update-product-media",
  description: "Update media for a product",
  schema: ProductUpdateMediaInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductUpdateMediaInput) => {
    const query = gql`
      mutation productUpdateMedia($media: [UpdateMediaInput!]!, $productId: ID!) {
        productUpdateMedia(media: $media, productId: $productId) {
          media { id alt status }
          mediaUserErrors { field message code }
        }
      }
    `;
    const variables = { media: input.media, productId: input.productId };
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
