import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for detaching media from a product variant
const ProductVariantDetachMediaInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variantId: z.string().min(1, "Variant ID is required"),
  mediaIds: z.array(z.string()).nonempty("At least one media ID is required")
});

type ProductVariantDetachMediaInput = z.infer<typeof ProductVariantDetachMediaInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const productVariantDetachMedia = {
  name: "product-variant-detach-media",
  description: "Detach media from a product variant in Shopify",
  schema: ProductVariantDetachMediaInputSchema,

  // Add initialize method to set up the GraphQL client
  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantDetachMediaInput) => {
    try {
      const { productId, variantId, mediaIds } = input;

      // Convert IDs to GID format if they aren't already
      const formattedProductId = productId.startsWith('gid://')
        ? productId
        : `gid://shopify/Product/${productId}`;
      const formattedVariantId = variantId.startsWith('gid://')
        ? variantId
        : `gid://shopify/ProductVariant/${variantId}`;
      const formattedMediaIds = mediaIds.map(id =>
        id.startsWith('gid://') ? id : `gid://shopify/MediaImage/${id}`
      );

      const query = gql`
        mutation productVariantDetachMedia($productId: ID!, $variantId: ID!, $mediaIds: [ID!]!) {
          productVariantDetachMedia(productId: $productId, variantId: $variantId, mediaIds: $mediaIds) {
            product {
              id
              title
            }
            variant {
              id
              title
              media(first: 5) {
                edges {
                  node {
                    id
                    alt
                    mediaContentType
                  }
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
        productId: formattedProductId,
        variantId: formattedVariantId,
        mediaIds: formattedMediaIds
      };

      const data = (await shopifyClient.request(query, variables)) as {
        productVariantDetachMedia: {
          product: { id: string; title: string } | null;
          variant: {
            id: string;
            title: string;
            media: { edges: Array<{ node: { id: string; alt: string | null; mediaContentType: string } }> } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      // If there are user errors, throw an error
      if (data.productVariantDetachMedia.userErrors.length > 0) {
        throw new Error(
          `Failed to detach media from product variant: ${data.productVariantDetachMedia.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      // Format and return the updated product and variant
      const { product, variant } = data.productVariantDetachMedia;

      return {
        product: product ? { id: product.id, title: product.title } : null,
        variant: variant
          ? {
              id: variant.id,
              title: variant.title,
              media: variant.media?.edges.map(edge => ({
                id: edge.node.id,
                alt: edge.node.alt,
                mediaContentType: edge.node.mediaContentType
              })) || []
            }
          : null
      };
    } catch (error) {
      console.error("Error detaching media from product variant:", error);
      throw new Error(
        `Failed to detach media from product variant: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { productVariantDetachMedia };