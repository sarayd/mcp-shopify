import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const VariantInputSchema = z.object({
  id: z.string(),
  barcode: z.string().optional(),
  compareAtPrice: z.string().optional(),
  fulfillmentServiceId: z.string().optional(),
  harmonizedSystemCode: z.string().optional(),
  imageId: z.string().optional(),
  inventoryItem: z.object({
    cost: z.string().optional(),
    tracked: z.boolean().optional()
  }).optional(),
  inventoryManagement: z.enum(['FULFILLMENT_SERVICE', 'NOT_MANAGED', 'SHOPIFY']).optional(),
  inventoryPolicy: z.enum(['CONTINUE', 'DENY']).optional(),
  inventoryQuantities: z.array(z.object({
    availableQuantity: z.number().int(),
    locationId: z.string()
  })).optional(),
  mediaSrc: z.array(z.string()).optional(),
  metafields: z.array(z.object({
    id: z.string().optional(),
    key: z.string(),
    namespace: z.string(),
    type: z.string(),
    value: z.string()
  })).optional(),
  price: z.string().optional(),
  privateMetafields: z.array(z.object({
    key: z.string(),
    namespace: z.string(),
    owner: z.string(),
    value: z.string(),
    valueType: z.enum(['INTEGER', 'JSON_STRING', 'STRING'])
  })).optional(),
  requiresShipping: z.boolean().optional(),
  sku: z.string().optional(),
  taxCode: z.string().optional(),
  taxable: z.boolean().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['GRAMS', 'KILOGRAMS', 'OUNCES', 'POUNDS']).optional()
});

const ProductVariantsBulkUpdateInputSchema = z.object({
  variants: z.array(VariantInputSchema).nonempty("At least one variant is required")
});

type ProductVariantsBulkUpdateInput = z.infer<typeof ProductVariantsBulkUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const productVariantsBulkUpdate = {
  name: "product-variants-bulk-update",
  description: "Bulk update product variants",
  schema: ProductVariantsBulkUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantsBulkUpdateInput) => {
    const query = gql`
      mutation productVariantsBulkUpdate($variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(variants: $variants) {
          productVariants {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { variants: input.variants };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productVariantsBulkUpdate;
    } catch (error) {
      console.error("Error executing productVariantsBulkUpdate:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productVariantsBulkUpdate };