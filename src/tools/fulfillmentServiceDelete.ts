import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentServiceDeleteInputSchema = z.object({
  id: z.string().min(1, "Fulfillment service ID is required"),
  destinationLocationId: z.string().optional()
});
type FulfillmentServiceDeleteInput = z.infer<typeof FulfillmentServiceDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentServiceDelete = {
  name: "fulfillment-service-delete",
  description: "Delete a fulfillment service",
  schema: FulfillmentServiceDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentServiceDeleteInput) => {
    const query = gql`
      mutation fulfillmentServiceDelete($id: ID!, $destinationLocationId: ID) {
        fulfillmentServiceDelete(
          id: $id
          destinationLocationId: $destinationLocationId
        ) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      id: input.id,
      destinationLocationId: input.destinationLocationId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentServiceDelete;
    } catch (error) {
      console.error("Error deleting fulfillment service:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentServiceDelete };