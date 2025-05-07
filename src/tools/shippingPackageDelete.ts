import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShippingPackageDeleteInputSchema = z.object({
  id: z.string().min(1, "Shipping package ID is required")
});
type ShippingPackageDeleteInput = z.infer<typeof ShippingPackageDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const shippingPackageDelete = {
  name: "shipping-package-delete",
  description: "Delete a shipping package",
  schema: ShippingPackageDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShippingPackageDeleteInput) => {
    const query = gql`
      mutation shippingPackageDelete($id: ID!) {
        shippingPackageDelete(id: $id) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.shippingPackageDelete;
    } catch (error) {
      console.error("Error deleting shipping package:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shippingPackageDelete };