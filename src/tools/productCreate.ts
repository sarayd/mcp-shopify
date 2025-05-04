import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const ProductOptionInputSchema = z.object({
  name: z.string(),
  values: z.array(z.string())
});

const SeoInputSchema = z.object({
  description: z.string().optional(),
  title: z.string().optional()
});

const ProductInputSchema = z.object({
  collectionsToJoin: z.array(z.string()).optional(),
  descriptionHtml: z.string().optional(),
  giftCard: z.boolean().optional(),
  handle: z.string().optional(),
  metafields: z.array(MetafieldInputSchema).optional(),
  options: z.array(ProductOptionInputSchema).optional(),
  productType: z.string().optional(),
  requiresSellingPlan: z.boolean().optional(),
  seo: SeoInputSchema.optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  tags: z.array(z.string()).optional(),
  templateSuffix: z.string().optional(),
  title: z.string(),
  vendor: z.string().optional()
});

const ProductCreateInputSchema = z.object({
  input: ProductInputSchema
});

type ProductCreateInput = z.infer<typeof ProductCreateInputSchema>;

let shopifyClient: GraphQLClient;

const productCreate = {
  name: "product-create",
  description: "Create a new product in Shopify",
  schema: ProductCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductCreateInput) => {
    const query = gql`
      mutation productCreate($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.productCreate;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productCreate };