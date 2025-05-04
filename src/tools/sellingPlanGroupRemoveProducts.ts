import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupRemoveProductsInputSchema = z.object({
  id: z.string().min(1, "Selling plan group ID is required"),
  productIds: z.array(z.string()).nonempty("At least one product ID is required")
});
type SellingPlanGroupRemoveProductsInput = z.infer<typeof SellingPlanGroupRemoveProductsInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupRemoveProducts = {
  name: "selling-plan-group-remove-products",
  description: "Remove products from a selling plan group",
  schema: SellingPlanGroupRemoveProductsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupRemoveProductsInput) => {
    const query = gql`
      mutation sellingPlanGroupRemoveProducts($id: ID!, $productIds: [ID!]!) {
        sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
          removedProductIds
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      productIds: input.productIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupRemoveProducts;
    } catch (error) {
      console.error("Error removing products from selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupRemoveProducts };