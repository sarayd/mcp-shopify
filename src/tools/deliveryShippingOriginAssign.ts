import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DeliveryShippingOriginAssignInputSchema = z.object({
  locationId: z.string().min(1, "Location ID is required"),
  deliveryProfileId: z.string().min(1, "Delivery Profile ID is required")
});
type DeliveryShippingOriginAssignInput = z.infer<typeof DeliveryShippingOriginAssignInputSchema>;

let shopifyClient: GraphQLClient;

const deliveryShippingOriginAssign = {
  name: "delivery-shipping-origin-assign",
  description: "Assign a location as the shipping origin for a delivery profile",
  schema: DeliveryShippingOriginAssignInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryShippingOriginAssignInput) => {
    const query = gql`
      mutation deliveryShippingOriginAssign($locationId: ID!, $deliveryProfileId: ID!) {
        deliveryShippingOriginAssign(locationId: $locationId, deliveryProfileId: $deliveryProfileId) {
          deliveryProfile {
            id
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
      deliveryProfileId: input.deliveryProfileId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.deliveryShippingOriginAssign;
    } catch (error) {
      console.error("Error assigning delivery shipping origin:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryShippingOriginAssign };