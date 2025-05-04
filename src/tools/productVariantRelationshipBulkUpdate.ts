import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductVariantComponentSchema = z.object({
  id: z.string(),
  quantity: z.number().int(),
  variantId: z.string()
});

const ProductVariantRelationshipUpdateInputSchema = z.object({
  parentVariantId: z.string(),
  variantComponents: z.array(ProductVariantComponentSchema)
});

const ProductVariantRelationshipBulkUpdateInputSchema = z.object({
  input: z.array(ProductVariantRelationshipUpdateInputSchema).nonempty("At least one relationship update is required")
});

type ProductVariantRelationshipBulkUpdateInput = z.infer<typeof ProductVariantRelationshipBulkUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const productVariantRelationshipBulkUpdate = {
  name: "product-variant-relationship-bulk-update",
  description: "Bulk update product variant relationships",
  schema: ProductVariantRelationshipBulkUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantRelationshipBulkUpdateInput) => {
    const query = gql`
      mutation productVariantRelationshipBulkUpdate($input: [ProductVariantRelationshipUpdateInput!]!) {
        productVariantRelationshipBulkUpdate(input: $input) {
          parentProductVariants {
            id
            productVariantComponents(first: 10) {
              nodes {
                id
                quantity
                productVariant {
                  id
                  displayName
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

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.productVariantRelationshipBulkUpdate;
    } catch (error) {
      console.error("Error executing productVariantRelationshipBulkUpdate:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productVariantRelationshipBulkUpdate };