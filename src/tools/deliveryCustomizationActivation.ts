import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryCustomizationActivationInputSchema = z.object({
  id: z.string().min(1, "Delivery customization ID is required"),
  activate: z.boolean(),
  automaticallyActivateNewLocations: z.boolean().optional()
});
type DeliveryCustomizationActivationInput = z.infer<typeof DeliveryCustomizationActivationInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryCustomizationActivation = {
  name: "delivery-customization-activation",
  description: "Activate or deactivate a delivery customization",
  schema: DeliveryCustomizationActivationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryCustomizationActivationInput) => {
    const query = gql`
      mutation deliveryCustomizationActivation(
        $id: ID!
        $activate: Boolean!
        $automaticallyActivateNewLocations: Boolean
      ) {
        deliveryCustomizationActivation(
          id: $id
          activate: $activate
          automaticallyActivateNewLocations: $automaticallyActivateNewLocations
        ) {
          deliveryCustomization {
            id
            active
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
      activate: input.activate,
      automaticallyActivateNewLocations: input.automaticallyActivateNewLocations
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.deliveryCustomizationActivation;
    } catch (error) {
      console.error("Error executing delivery customization activation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryCustomizationActivation };