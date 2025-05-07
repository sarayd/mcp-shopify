import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductDuplicateInputSchema = z.object({
  includeImages: z.boolean().optional(),
  newStatus: z.enum(['ACTIVE', 'ARCHIVED', 'DRAFT']).optional(),
  newTitle: z.string().optional(),
  productId: z.string().min(1, "Product ID is required")
});
type ProductDuplicateInput = z.infer<typeof ProductDuplicateInputSchema>;

let shopifyClient: GraphQLClient;

const productDuplicate = {
  name: "product-duplicate",
  description: "Duplicate a product in Shopify",
  schema: ProductDuplicateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductDuplicateInput) => {
    const query = gql`
      mutation productDuplicate($input: ProductDuplicateInput!) {
        productDuplicate(input: $input) {
          duplicatedProduct {
            id
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
    const variables = {
      input: {
        includeImages: input.includeImages,
        newStatus: input.newStatus,
        newTitle: input.newTitle,
        productId: input.productId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productDuplicate;
    } catch (error) {
      console.error("Error duplicating product:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productDuplicate };