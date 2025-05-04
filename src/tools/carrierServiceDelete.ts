import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CarrierServiceDeleteInputSchema = z.object({
  id: z.string().min(1, "Carrier service ID is required")
});
type CarrierServiceDeleteInput = z.infer<typeof CarrierServiceDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const carrierServiceDelete = {
  name: "carrier-service-delete",
  description: "Delete a carrier service",
  schema: CarrierServiceDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CarrierServiceDeleteInput) => {
    const query = gql`
      mutation carrierServiceDelete($id: ID!) {
        carrierServiceDelete(id: $id) {
          deletedId
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
      return response.carrierServiceDelete;
    } catch (error) {
      console.error("Error deleting carrier service:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { carrierServiceDelete };