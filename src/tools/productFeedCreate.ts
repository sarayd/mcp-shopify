import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductFilterInputSchema = z.object({
  productId: z.string().optional(),
  productType: z.string().optional(),
  productVendor: z.string().optional(),
  tag: z.string().optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  collectionId: z.string().optional(),
  createdAt: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).optional(),
  updatedAt: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).optional(),
  publishedAt: z.object({
    min: z.string().optional(),
    max: z.string().optional()
  }).optional()
}).optional();

const ProductFeedCreateInputSchema = z.object({
  feedType: z.enum(['GOOGLE', 'FACEBOOK', 'MICROSOFT']),
  title: z.string(),
  countryCode: z.string().length(2),
  languageCode: z.string(),
  currency: z.string().length(3),
  productFilterInput: ProductFilterInputSchema
});

type ProductFeedCreateInput = z.infer<typeof ProductFeedCreateInputSchema>;

let shopifyClient: GraphQLClient;

const productFeedCreate = {
  name: "product-feed-create",
  description: "Create a product feed in Shopify",
  schema: ProductFeedCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductFeedCreateInput) => {
    const query = gql`
      mutation productFeedCreate($input: ProductFeedCreateInput!) {
        productFeedCreate(input: $input) {
          productFeed {
            id
            feedType
            title
            status
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
      return response.productFeedCreate;
    } catch (error) {
      console.error("Error creating product feed:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productFeedCreate };