import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const VariantInputSchema = z.object({
  barcode: z.string().optional(),
  compareAtPrice: z.string().optional(),
  harmonizedSystemCode: z.string().optional(),
  imageSrc: z.string().optional(),
  imageId: z.string().optional(),
  inventoryItem: z.object({
    cost: z.string().optional(),
    tracked: z.boolean().optional()
  }).optional(),
  inventoryManagement: z.enum(['NOT_MANAGED', 'SHOPIFY', 'FULFILLMENT_SERVICE']).optional(),
  inventoryPolicy: z.enum(['DENY', 'CONTINUE']).optional(),
  inventoryQuantities: z.array(z.object({
    availableQuantity: z.number().int(),
    locationId: z.string()
  })).optional(),
  mediaSrc: z.array(z.string()).optional(),
  metafields: z.array(z.object({
    key: z.string(),
    namespace: z.string(),
    type: z.string(),
    value: z.string()
  })).optional(),
  options: z.array(z.string()),
  price: z.string(),
  requiresShipping: z.boolean().optional(),
  sku: z.string().optional(),
  taxCode: z.string().optional(),
  taxable: z.boolean().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']).optional()
});

const ProductVariantsBulkCreateInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  variants: z.array(VariantInputSchema).nonempty("At least one variant is required")
});

type ProductVariantsBulkCreateInput = z.infer<typeof ProductVariantsBulkCreateInputSchema>;

let shopifyClient: GraphQLClient;

const productVariantsBulkCreate = {
  name: "product-variants-bulk-create",
  description: "Create multiple variants for a product",
  schema: ProductVariantsBulkCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantsBulkCreateInput) => {
    const query = gql`
      mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variants) {
          productVariants {
            id
            title
            sku
            price
            compareAtPrice
            inventoryQuantity
            selectedOptions {
              name
              value
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
      productId: input.productId,
      variants: input.variants
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productVariantsBulkCreate;
    } catch (error) {
      console.error("Error creating product variants:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productVariantsBulkCreate };