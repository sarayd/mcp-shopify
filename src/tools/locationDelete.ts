import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const LocationDeleteInputSchema = z.object({
  id: z.string().min(1, "Location ID is required")
});
type LocationDeleteInput = z.infer<typeof LocationDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const locationDelete = {
  name: "location-delete",
  description: "Delete a location",
  schema: LocationDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationDeleteInput) => {
    const query = gql`
      mutation locationDelete($id: ID!) {
        locationDelete(input: { id: $id }) {
          deletedLocationId
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
      return response.locationDelete;
    } catch (error) {
      console.error("Error deleting location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationDelete };