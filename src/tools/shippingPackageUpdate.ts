import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ShippingPackageUpdateInputSchema = z.object({
  id: z.string().min(1, "Package ID is required"),
  weight: z.number().optional(),
  weightUnit: z.enum(['KILOGRAMS', 'POUNDS']).optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  dimensionUnit: z.enum(['CENTIMETERS', 'INCHES']).optional()
});
type ShippingPackageUpdateInput = z.infer<typeof ShippingPackageUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const shippingPackageUpdate = {
  name: "shipping-package-update",
  description: "Update a shipping package's dimensions and weight",
  schema: ShippingPackageUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ShippingPackageUpdateInput) => {
    const query = gql`
      mutation shippingPackageUpdate($input: ShippingPackageUpdateInput!) {
        shippingPackageUpdate(input: $input) {
          shippingPackage {
            id
            weight
            weightUnit
            length
            width
            height
            dimensionUnit
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.shippingPackageUpdate;
    } catch (error) {
      console.error("Error updating shipping package:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { shippingPackageUpdate };