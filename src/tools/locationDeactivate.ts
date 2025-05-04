import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const LocationDeactivateInputSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  destinationLocationId: z.string().optional()
});
type LocationDeactivateInput = z.infer<typeof LocationDeactivateInputSchema>;

let shopifyClient: GraphQLClient;

const locationDeactivate = {
  name: "location-deactivate",
  description: "Deactivate a location in Shopify",
  schema: LocationDeactivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationDeactivateInput) => {
    const query = gql`
      mutation locationDeactivate($locationId: ID!, $destinationLocationId: ID) {
        locationDeactivate(
          locationId: $locationId
          destinationLocationId: $destinationLocationId
        ) {
          location {
            id
            isActive
          }
          locationDeactivateUserErrors {
            field
            message
            code
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
      destinationLocationId: input.destinationLocationId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.locationDeactivate;
    } catch (error) {
      console.error("Error deactivating location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationDeactivate };