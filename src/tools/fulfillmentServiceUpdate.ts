import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentServiceUpdateInputSchema = z.object({
  id: z.string().min(1, "Fulfillment service ID is required"),
  callbackUrl: z.string().url().optional(),
  fulfillmentOrdersOptIn: z.boolean().optional(),
  inventoryManagement: z.boolean().optional(),
  name: z.string().optional(),
  serviceName: z.string().optional(),
  trackingSupport: z.boolean().optional()
});
type FulfillmentServiceUpdateInput = z.infer<typeof FulfillmentServiceUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentServiceUpdate = {
  name: "fulfillment-service-update",
  description: "Update a fulfillment service",
  schema: FulfillmentServiceUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentServiceUpdateInput) => {
    const query = gql`
      mutation fulfillmentServiceUpdate($input: FulfillmentServiceInput!) {
        fulfillmentServiceUpdate(id: $id, input: $input) {
          fulfillmentService {
            id
            callbackUrl
            fulfillmentOrdersOptIn
            inventoryManagement
            name
            serviceName
            trackingSupport
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      id: input.id,
      input: {
        callbackUrl: input.callbackUrl,
        fulfillmentOrdersOptIn: input.fulfillmentOrdersOptIn,
        inventoryManagement: input.inventoryManagement,
        name: input.name,
        serviceName: input.serviceName,
        trackingSupport: input.trackingSupport
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentServiceUpdate;
    } catch (error) {
      console.error("Error updating fulfillment service:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentServiceUpdate };