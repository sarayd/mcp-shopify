import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  description: z.string().optional(),
  id: z.string().optional(),
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const PrivateMetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  owner: z.string(),
  valueInput: z.object({
    value: z.string(),
    valueType: z.string()
  })
});

const ProductOptionInputSchema = z.object({
  name: z.string(),
  position: z.number().optional(),
  values: z.array(z.string())
});

const VariantInputSchema = z.object({
  barcode: z.string().optional(),
  compareAtPrice: z.string().optional(),
  harmonizedSystemCode: z.string().optional(),
  id: z.string().optional(),
  imageSrc: z.string().optional(),
  inventoryItem: z.object({
    cost: z.string().optional(),
    tracked: z.boolean().optional()
  }).optional(),
  inventoryPolicy: z.enum(['DENY', 'CONTINUE']).optional(),
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
  taxable: z.boolean().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']).optional()
});

const ProductSetInputSchema = z.object({
  input: z.object({
    category: z.string().optional(),
    collections: z.array(z.string()).optional(),
    descriptionHtml: z.string().optional(),
    giftCard: z.boolean().optional(),
    handle: z.string().optional(),
    id: z.string(),
    metafields: z.array(MetafieldInputSchema).optional(),
    privateMetafields: z.array(PrivateMetafieldInputSchema).optional(),
    productOptions: z.array(ProductOptionInputSchema).optional(),
    productType: z.string().optional(),
    redirectNewHandle: z.boolean().optional(),
    requiresSellingPlan: z.boolean().optional(),
    seo: z.object({
      description: z.string().optional(),
      title: z.string().optional()
    }).optional(),
    status: z.enum(['ACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
    tags: z.array(z.string()).optional(),
    templateSuffix: z.string().optional(),
    title: z.string().optional(),
    variants: z.array(VariantInputSchema).optional(),
    vendor: z.string().optional()
  })
});

type ProductSetInput = z.infer<typeof ProductSetInputSchema>;

let shopifyClient: GraphQLClient;

const productSet = {
  name: "product-set",
  description: "Update a product's properties",
  schema: ProductSetInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductSetInput) => {
    const query = gql`
      mutation productSet($input: ProductInput!) {
        productSet(input: $input) {
          product {
            id
            title
            handle
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input: input.input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productSet;
    } catch (error) {
      console.error("Error executing productSet:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productSet };