import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupAddProductVariantsInputSchema = z.object({
  sellingPlanGroupId: z.string().min(1, "Selling plan group ID is required"),
  productVariantIds: z.array(z.string()).nonempty("At least one product variant ID is required")
});
type SellingPlanGroupAddProductVariantsInput = z.infer<typeof SellingPlanGroupAddProductVariantsInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupAddProductVariants = {
  name: "selling-plan-group-add-product-variants",
  description: "Add product variants to a selling plan group",
  schema: SellingPlanGroupAddProductVariantsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupAddProductVariantsInput) => {
    const query = gql`
      mutation sellingPlanGroupAddProductVariants($sellingPlanGroupId: ID!, $productVariantIds: [ID!]!) {
        sellingPlanGroupAddProductVariants(
          sellingPlanGroupId: $sellingPlanGroupId
          productVariantIds: $productVariantIds
        ) {
          sellingPlanGroup {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      sellingPlanGroupId: input.sellingPlanGroupId,
      productVariantIds: input.productVariantIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupAddProductVariants;
    } catch (error) {
      console.error("Error adding product variants to selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupAddProductVariants };