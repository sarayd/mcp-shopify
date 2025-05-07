import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TrackingInfoSchema = z.object({
  number: z.string().optional(),
  url: z.string().optional(),
  company: z.string().optional()
});

const FulfillmentTrackingInfoUpdateInputSchema = z.object({
  fulfillmentId: z.string().min(1, "Fulfillment ID is required"),
  trackingInfo: TrackingInfoSchema,
  notifyCustomer: z.boolean().optional()
});

type FulfillmentTrackingInfoUpdateInput = z.infer<typeof FulfillmentTrackingInfoUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentTrackingInfoUpdate = {
  name: "fulfillment-tracking-info-update",
  description: "Update tracking information for a fulfillment",
  schema: FulfillmentTrackingInfoUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentTrackingInfoUpdateInput) => {
    const query = gql`
      mutation fulfillmentTrackingInfoUpdate(
        $fulfillmentId: ID!
        $trackingInfo: TrackingInput!
        $notifyCustomer: Boolean
      ) {
        fulfillmentTrackingInfoUpdate(
          fulfillmentId: $fulfillmentId
          trackingInfo: $trackingInfo
          notifyCustomer: $notifyCustomer
        ) {
          fulfillment {
            id
            trackingInfo {
              company
              number
              url
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
      fulfillmentId: input.fulfillmentId,
      trackingInfo: input.trackingInfo,
      notifyCustomer: input.notifyCustomer
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentTrackingInfoUpdate;
    } catch (error) {
      console.error("Error updating fulfillment tracking info:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentTrackingInfoUpdate };