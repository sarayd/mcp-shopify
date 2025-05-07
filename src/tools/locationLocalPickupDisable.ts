import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const LocationLocalPickupDisableInputSchema = z.object({
  locationId: z.string().min(1, "Location ID is required").describe("The ID of the location to disable local pickup")
});
type LocationLocalPickupDisableInput = z.infer<typeof LocationLocalPickupDisableInputSchema>;

let shopifyClient: GraphQLClient;

const locationLocalPickupDisable = {
  name: "location-local-pickup-disable",
  description: "Disable local pickup for a location",
  schema: LocationLocalPickupDisableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationLocalPickupDisableInput) => {
    const query = gql`
      mutation locationLocalPickupDisable($locationId: ID!) {
        locationLocalPickupDisable(locationId: $locationId) {
          location {
            id
            localPickupSettings {
              enabled
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { locationId: input.locationId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.locationLocalPickupDisable;
    } catch (error) {
      console.error("Error disabling location local pickup:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationLocalPickupDisable };