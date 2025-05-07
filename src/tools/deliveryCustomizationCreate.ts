import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AutomaticDeliveryOptionEligibilitySchema = z.object({
  enabled: z.boolean(),
  methodTypes: z.array(z.enum(['LOCAL', 'SHIPPING', 'PICKUP_POINT', 'RETAIL', 'NONE'])).optional()
});

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const DeliveryCustomizationInputSchema = z.object({
  automaticDeliveryOptionEligibility: AutomaticDeliveryOptionEligibilitySchema.optional(),
  functionId: z.string(),
  metafields: z.array(MetafieldInputSchema).optional(),
  title: z.string()
});

const DeliveryCustomizationCreateInputSchema = z.object({
  input: DeliveryCustomizationInputSchema
});

type DeliveryCustomizationCreateInput = z.infer<typeof DeliveryCustomizationCreateInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryCustomizationCreate = {
  name: "delivery-customization-create",
  description: "Create a delivery customization",
  schema: DeliveryCustomizationCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryCustomizationCreateInput) => {
    const query = gql`
      mutation deliveryCustomizationCreate($input: DeliveryCustomizationInput!) {
        deliveryCustomizationCreate(input: $input) {
          deliveryCustomization {
            id
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.deliveryCustomizationCreate;
    } catch (error) {
      console.error("Error creating delivery customization:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryCustomizationCreate };