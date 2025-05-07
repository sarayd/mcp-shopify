import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const SellingPlanGroupAddProductsInputSchema = z.object({
  id: z.string().min(1, "Selling plan group ID is required"),
  productIds: z.array(z.string()).nonempty("At least one product ID is required"),
  productVariantIds: z.array(z.string()).optional(),
  resourceIds: z.array(z.string()).optional()
});
type SellingPlanGroupAddProductsInput = z.infer<typeof SellingPlanGroupAddProductsInputSchema>;

let shopifyClient: GraphQLClient;

const sellingPlanGroupAddProducts = {
  name: "selling-plan-group-add-products",
  description: "Add products to a selling plan group",
  schema: SellingPlanGroupAddProductsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: SellingPlanGroupAddProductsInput) => {
    const query = gql`
      mutation sellingPlanGroupAddProducts($id: ID!, $productIds: [ID!]!, $productVariantIds: [ID!], $resourceIds: [ID!]) {
        sellingPlanGroupAddProducts(
          id: $id
          productIds: $productIds
          productVariantIds: $productVariantIds
          resourceIds: $resourceIds
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
      id: input.id,
      productIds: input.productIds,
      productVariantIds: input.productVariantIds,
      resourceIds: input.resourceIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.sellingPlanGroupAddProducts;
    } catch (error) {
      console.error("Error adding products to selling plan group:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { sellingPlanGroupAddProducts };