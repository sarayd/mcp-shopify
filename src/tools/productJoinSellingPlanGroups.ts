import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductJoinSellingPlanGroupsInputSchema = z.object({
  id: z.string().min(1, "Product ID is required"),
  sellingPlanGroupIds: z.array(z.string()).nonempty("At least one selling plan group ID is required")
});
type ProductJoinSellingPlanGroupsInput = z.infer<typeof ProductJoinSellingPlanGroupsInputSchema>;

let shopifyClient: GraphQLClient;

const productJoinSellingPlanGroups = {
  name: "product-join-selling-plan-groups",
  description: "Join a product to selling plan groups",
  schema: ProductJoinSellingPlanGroupsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductJoinSellingPlanGroupsInput) => {
    const query = gql`
      mutation productJoinSellingPlanGroups($id: ID!, $sellingPlanGroupIds: [ID!]!) {
        productJoinSellingPlanGroups(id: $id, sellingPlanGroupIds: $sellingPlanGroupIds) {
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
      id: input.id,
      sellingPlanGroupIds: input.sellingPlanGroupIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productJoinSellingPlanGroups;
    } catch (error) {
      console.error("Error joining product to selling plan groups:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productJoinSellingPlanGroups };