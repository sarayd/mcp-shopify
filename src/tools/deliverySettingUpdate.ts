import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryMethodDefinitionOverrideSchema = z.object({
  id: z.string(),
  label: z.string().optional(),
  methodType: z.string().optional(),
  zoneId: z.string().optional()
});

const DeliverySettingUpdateInputSchema = z.object({
  id: z.string().min(1, "Delivery Setting ID is required"),
  automaticFulfillmentForDigitalProducts: z.boolean().optional(),
  deliveryMethodDefinitionOverrides: z.array(DeliveryMethodDefinitionOverrideSchema).optional(),
  legacyModeBlocked: z.boolean().optional(),
  requirePhoneNumber: z.boolean().optional()
});

type DeliverySettingUpdateInput = z.infer<typeof DeliverySettingUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const deliverySettingUpdate = {
  name: "delivery-setting-update",
  description: "Update delivery settings for a shop",
  schema: DeliverySettingUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliverySettingUpdateInput) => {
    const query = gql`
      mutation deliverySettingUpdate($input: DeliverySettingUpdateInput!) {
        deliverySettingUpdate(input: $input) {
          deliverySetting {
            id
            automaticFulfillmentForDigitalProducts
            legacyModeBlocked
            requirePhoneNumber
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
      return response.deliverySettingUpdate;
    } catch (error) {
      console.error("Error updating delivery settings:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliverySettingUpdate };