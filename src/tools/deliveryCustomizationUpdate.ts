import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const DeliveryCustomizationInputSchema = z.object({
  active: z.boolean().optional(),
  functionId: z.string().optional(),
  metafields: z.array(MetafieldInputSchema).optional(),
  title: z.string().optional()
});

const DeliveryCustomizationUpdateInputSchema = z.object({
  id: z.string().min(1, "Delivery customization ID is required"),
  deliveryCustomization: DeliveryCustomizationInputSchema
});

type DeliveryCustomizationUpdateInput = z.infer<typeof DeliveryCustomizationUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryCustomizationUpdate = {
  name: "delivery-customization-update",
  description: "Update a delivery customization",
  schema: DeliveryCustomizationUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryCustomizationUpdateInput) => {
    const query = gql`
      mutation deliveryCustomizationUpdate($id: ID!, $deliveryCustomization: DeliveryCustomizationInput!) {
        deliveryCustomizationUpdate(id: $id, deliveryCustomization: $deliveryCustomization) {
          deliveryCustomization {
            id
            title
            active
            functionId
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
      deliveryCustomization: input.deliveryCustomization
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.deliveryCustomizationUpdate;
    } catch (error) {
      console.error("Error updating delivery customization:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryCustomizationUpdate };