import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductChangeStatusInputSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  status: z.enum(["ACTIVE", "ARCHIVED", "DRAFT"]),
  unpublishOn: z.string().optional()
});
type ProductChangeStatusInput = z.infer<typeof ProductChangeStatusInputSchema>;

let shopifyClient: GraphQLClient;

const productChangeStatus = {
  name: "product-change-status",
  description: "Change the status of a product",
  schema: ProductChangeStatusInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductChangeStatusInput) => {
    const query = gql`
      mutation productChangeStatus($productId: ID!, $status: ProductStatus!, $unpublishOn: DateTime) {
        productChangeStatus(productId: $productId, status: $status, unpublishOn: $unpublishOn) {
          product {
            id
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
      productId: input.productId,
      status: input.status,
      unpublishOn: input.unpublishOn
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productChangeStatus;
    } catch (error) {
      console.error("Error changing product status:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productChangeStatus };