import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShippingPackageMakeDefaultInputSchema = z.object({
  id: z.string().min(1, "Shipping package ID is required").describe("The ID of the shipping package to make default")
});
type ShippingPackageMakeDefaultInput = z.infer<typeof ShippingPackageMakeDefaultInputSchema>;

let shopifyClient: GraphQLClient;

const shippingPackageMakeDefault = {
  name: "shipping-package-make-default",
  description: "Set a shipping package as the default package",
  schema: ShippingPackageMakeDefaultInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShippingPackageMakeDefaultInput) => {
    const query = gql`
      mutation shippingPackageMakeDefault($id: ID!) {
        shippingPackageMakeDefault(id: $id) {
          shippingPackage {
            id
            isDefault
          }
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
      return response.shippingPackageMakeDefault;
    } catch (error) {
      console.error("Error making shipping package default:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shippingPackageMakeDefault };