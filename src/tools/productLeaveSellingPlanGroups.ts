import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductLeaveSellingPlanGroupsInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  sellingPlanGroupIds: z.array(z.string()).nonempty("At least one selling plan group ID is required")
});
type ProductLeaveSellingPlanGroupsInput = z.infer<typeof ProductLeaveSellingPlanGroupsInputSchema>;

let shopifyClient: GraphQLClient;

const productLeaveSellingPlanGroups = {
  name: "product-leave-selling-plan-groups",
  description: "Remove a product from selling plan groups",
  schema: ProductLeaveSellingPlanGroupsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductLeaveSellingPlanGroupsInput) => {
    const query = gql`
      mutation productLeaveSellingPlanGroups($productId: ID!, $sellingPlanGroupIds: [ID!]!) {
        productLeaveSellingPlanGroups(
          productId: $productId
          sellingPlanGroupIds: $sellingPlanGroupIds
        ) {
          product {
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
      productId: input.productId,
      sellingPlanGroupIds: input.sellingPlanGroupIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productLeaveSellingPlanGroups;
    } catch (error) {
      console.error("Error removing product from selling plan groups:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productLeaveSellingPlanGroups };