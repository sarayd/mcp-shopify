import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PickupTimeInputSchema = z.object({
  maxUnit: z.enum(['MINUTES', 'HOURS', 'DAYS', 'WEEKS']),
  maxValue: z.number().int().min(0),
  minUnit: z.enum(['MINUTES', 'HOURS', 'DAYS', 'WEEKS']),
  minValue: z.number().int().min(0)
});

const LocationLocalPickupEnableInputSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  localPickupSettings: z.object({
    pickupTime: PickupTimeInputSchema
  })
});

type LocationLocalPickupEnableInput = z.infer<typeof LocationLocalPickupEnableInputSchema>;

let shopifyClient: GraphQLClient;

const locationLocalPickupEnable = {
  name: "location-local-pickup-enable",
  description: "Enable local pickup for a location",
  schema: LocationLocalPickupEnableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationLocalPickupEnableInput) => {
    const query = gql`
      mutation locationLocalPickupEnable($locationId: ID!, $localPickupSettings: DeliveryLocationLocalPickupSettingsInput!) {
        locationLocalPickupEnable(locationId: $locationId, localPickupSettings: $localPickupSettings) {
          location {
            id
            localPickupSettings {
              pickupTime {
                maxUnit
                maxValue
                minUnit
                minValue
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      locationId: input.locationId,
      localPickupSettings: input.localPickupSettings
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.locationLocalPickupEnable;
    } catch (error) {
      console.error("Error enabling local pickup:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationLocalPickupEnable };