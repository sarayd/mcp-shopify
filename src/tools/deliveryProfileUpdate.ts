import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryProfileInputSchema = z.object({
  name: z.string().optional(),
  locationGroup: z.object({
    locationIds: z.array(z.string()).optional(),
    locationModelType: z.enum(['ALL', 'SINGLE', 'MULTIPLE']).optional()
  }).optional(),
  profileItems: z.array(z.object({
    id: z.string().optional(),
    countryHarmonizedSystemCodes: z.array(z.string()).optional(),
    productVariantId: z.string().optional()
  })).optional(),
  profileLocationGroups: z.array(z.object({
    locationGroupId: z.string().optional(),
    locationGroup: z.object({
      locationIds: z.array(z.string()).optional(),
      locationModelType: z.enum(['ALL', 'SINGLE', 'MULTIPLE']).optional()
    }).optional(),
    methodDefinitions: z.array(z.object({
      active: z.boolean().optional(),
      description: z.string().optional(),
      id: z.string().optional(),
      methodConditions: z.array(z.object({
        conditionCriteria: z.array(z.object({
          field: z.enum(['WEIGHT', 'PRICE']).optional(),
          operator: z.enum(['GREATER_THAN_OR_EQUAL_TO', 'LESS_THAN_OR_EQUAL_TO']).optional(),
          value: z.string().optional()
        })).optional(),
        id: z.string().optional(),
        methodDefinitionId: z.string().optional()
      })).optional(),
      name: z.string().optional(),
      rateProvider: z.object({
        id: z.string().optional(),
        percentageOfRates: z.number().optional(),
        serviceIds: z.array(z.string()).optional()
      }).optional()
    })).optional(),
    zone: z.object({
      countries: z.array(z.object({
        code: z.string().optional(),
        provinces: z.array(z.object({
          code: z.string().optional()
        })).optional()
      })).optional(),
      id: z.string().optional(),
      name: z.string().optional()
    }).optional()
  })).optional(),
  sellingPlanGroups: z.array(z.string()).optional()
});

const DeliveryProfileUpdateInputSchema = z.object({
  id: z.string().min(1, "Profile ID is required"),
  profile: DeliveryProfileInputSchema
});

type DeliveryProfileUpdateInput = z.infer<typeof DeliveryProfileUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryProfileUpdate = {
  name: "delivery-profile-update",
  description: "Update a delivery profile",
  schema: DeliveryProfileUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryProfileUpdateInput) => {
    const query = gql`
      mutation deliveryProfileUpdate($input: DeliveryProfileUpdateInput!) {
        deliveryProfileUpdate(input: $input) {
          profile {
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
    
    try {
      const response: any = await shopifyClient.request(query, { input });
      return response.deliveryProfileUpdate;
    } catch (error) {
      console.error("Error updating delivery profile:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryProfileUpdate };