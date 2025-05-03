import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating a product
const ProductUpdateInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  title: z.string().optional(),
  descriptionHtml: z.string().optional(),
  variants: z
    .array(
      z.object({
        id: z.string().min(1, "Variant ID is required"),
        price: z.string().optional(),
        sku: z.string().optional()
      })
    )
    .optional(),
  metafields: z
    .array(
      z.object({
        namespace: z.string().min(1, "Metafield namespace is required"),
        key: z.string().min(1, "Metafield key is required"),
        value: z.string().min(1, "Metafield value is required"),
        type: z.string().min(1, "Metafield type is required")
      })
    )
    .optional()
});

type ProductUpdateInput = z.infer<typeof ProductUpdateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const productUpdate = {
  name: "product-update",
  description: "Update a product in Shopify",
  schema: ProductUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductUpdateInput) => {
    try {
      const { id, title, descriptionHtml, variants, metafields } = input;

      // Convert product ID to GID format if not already
      const formattedProductId = id.startsWith("gid://")
        ? id
        : `gid://shopify/Product/${id}`;

      const query = gql`
        mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product {
              id
              title
              descriptionHtml
              variants(first: 5) {
                edges {
                  node {
                    id
                    price
                    sku
                  }
                }
              }
              metafields(first: 5) {
                edges {
                  node {
                    id
                    namespace
                    key
                    value
                    type
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
        input: {
          id: formattedProductId,
          title,
          descriptionHtml,
          variants: variants?.map(v => ({
            id: v.id.startsWith("gid://") ? v.id : `gid://shopify/ProductVariant/${v.id}`,
            price: v.price,
            sku: v.sku
          })),
          metafields
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        productUpdate: {
          product: {
            id: string;
            title: string;
            descriptionHtml: string | null;
            variants: {
              edges: Array<{
                node: { id: string; price: string; sku: string | null };
              }>;
            } | null;
            metafields: {
              edges: Array<{
                node: { id: string; namespace: string; key: string; value: string; type: string };
              }>;
            } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.productUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update product: ${data.productUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { product } = data.productUpdate;
      return {
        product: product
          ? {
              id: product.id,
              title: product.title,
              descriptionHtml: product.descriptionHtml,
              variants: product.variants?.edges.map(edge => ({
                id: edge.node.id,
                price: edge.node.price,
                sku: edge.node.sku
              })) || [],
              metafields: product.metafields?.edges.map(edge => ({
                id: edge.node.id,
                namespace: edge.node.namespace,
                key: edge.node.key,
                value: edge.node.value,
                type: edge.node.type
              })) || []
            }
          : null
      };
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(
        `Failed to update product: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { productUpdate };