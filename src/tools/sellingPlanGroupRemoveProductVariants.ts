import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupRemoveProductVariantsInputSchema = z.object({
  id: z.string().min(1, "Selling plan group ID is required"),
  productVariantIds: z.array(z.string()).nonempty("At least one product variant ID is required")
});
type SellingPlanGroupRemoveProductVariantsInput = z.infer<typeof SellingPlanGroupRemoveProductVariantsInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupRemoveProductVariants = {
  name: "selling-plan-group-remove-product-variants",
  description: "Remove product variants from a selling plan group",
  schema: SellingPlanGroupRemoveProductVariantsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupRemoveProductVariantsInput) => {
    const query = gql`
      mutation sellingPlanGroupRemoveProductVariants($id: ID!, $productVariantIds: [ID!]!) {
        sellingPlanGroupRemoveProductVariants(
          id: $id
          productVariantIds: $productVariantIds
        ) {
          removedProductVariants {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      productVariantIds: input.productVariantIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupRemoveProductVariants;
    } catch (error) {
      console.error("Error removing product variants from selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupRemoveProductVariants };