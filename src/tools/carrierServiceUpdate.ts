import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryCarrierServiceUpdateInputSchema = z.object({
  id: z.string().min(1, "Carrier service ID is required"),
  active: z.boolean().optional(),
  callbackUrl: z.string().url().optional(),
  carrierServiceType: z.enum(['API', 'LEGACY']).optional(),
  format: z.enum(['JSON', 'XML']).optional(),
  name: z.string().optional(),
  serviceDiscovery: z.boolean().optional()
});

const CarrierServiceUpdateInputSchema = z.object({
  input: DeliveryCarrierServiceUpdateInputSchema
});

type CarrierServiceUpdateInput = z.infer<typeof CarrierServiceUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const carrierServiceUpdate = {
  name: "carrier-service-update",
  description: "Update a carrier service",
  schema: CarrierServiceUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CarrierServiceUpdateInput) => {
    const query = gql`
      mutation carrierServiceUpdate($input: DeliveryCarrierServiceUpdateInput!) {
        carrierServiceUpdate(input: $input) {
          carrierService {
            id
            name
            callbackUrl
            active
            format
            carrierServiceType
            serviceDiscovery
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
      return response.carrierServiceUpdate;
    } catch (error) {
      console.error("Error updating carrier service:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { carrierServiceUpdate };