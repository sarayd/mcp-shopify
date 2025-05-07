import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductFullSyncVariantInputSchema = z.object({
  barcode: z.string().optional(),
  compareAtPrice: z.string().optional(),
  harmonizedSystemCode: z.string().optional(),
  id: z.string().optional(),
  inventoryItem: z.object({
    cost: z.string().optional(),
    tracked: z.boolean().optional()
  }).optional(),
  inventoryPolicy: z.enum(['CONTINUE', 'DENY']).optional(),
  inventoryQuantities: z.array(z.object({
    availableQuantity: z.number(),
    locationId: z.string()
  })).optional(),
  mediaSrc: z.array(z.string()).optional(),
  options: z.array(z.string()).optional(),
  price: z.string().optional(),
  requiresShipping: z.boolean().optional(),
  sku: z.string().optional(),
  taxCode: z.string().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['GRAMS', 'KILOGRAMS', 'OUNCES', 'POUNDS']).optional()
});

const ProductFullSyncInputSchema = z.object({
  handle: z.string().optional(),
  id: z.string().optional(),
  options: z.array(z.string()).optional(),
  productCategory: z.object({
    productTaxonomyNodeId: z.string()
  }).optional(),
  productType: z.string().optional(),
  publications: z.array(z.object({
    publicationId: z.string(),
    publishDate: z.string().optional()
  })).optional(),
  seo: z.object({
    description: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  title: z.string(),
  vendor: z.string().optional(),
  variants: z.array(ProductFullSyncVariantInputSchema).optional()
});

type ProductFullSyncInput = z.infer<typeof ProductFullSyncInputSchema>;

let shopifyClient: GraphQLClient;

const productFullSync = {
  name: "product-full-sync",
  description: "Synchronize a product with all its details",
  schema: ProductFullSyncInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductFullSyncInput) => {
    const query = gql`
      mutation productFullSync($input: ProductFullSyncInput!) {
        productFullSync(input: $input) {
          product {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productFullSync;
    } catch (error) {
      console.error("Error executing productFullSync:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productFullSync };