import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductVariantJoinSellingPlanGroupsInputSchema = z.object({
  variantIds: z.array(z.string()).nonempty("At least one variant ID is required"),
  sellingPlanGroupIds: z.array(z.string()).nonempty("At least one selling plan group ID is required")
});
type ProductVariantJoinSellingPlanGroupsInput = z.infer<typeof ProductVariantJoinSellingPlanGroupsInputSchema>;

let shopifyClient: GraphQLClient;

const productVariantJoinSellingPlanGroups = {
  name: "product-variant-join-selling-plan-groups",
  description: "Join product variants to selling plan groups",
  schema: ProductVariantJoinSellingPlanGroupsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductVariantJoinSellingPlanGroupsInput) => {
    const query = gql`
      mutation productVariantJoinSellingPlanGroups($variantIds: [ID!]!, $sellingPlanGroupIds: [ID!]!) {
        productVariantJoinSellingPlanGroups(variantIds: $variantIds, sellingPlanGroupIds: $sellingPlanGroupIds) {
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
    const variables = {
      variantIds: input.variantIds,
      sellingPlanGroupIds: input.sellingPlanGroupIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productVariantJoinSellingPlanGroups;
    } catch (error) {
      console.error("Error joining product variants to selling plan groups:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productVariantJoinSellingPlanGroups };