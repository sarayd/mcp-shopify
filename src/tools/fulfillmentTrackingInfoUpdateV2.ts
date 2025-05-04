import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TrackingDetailsSchema = z.object({
  number: z.string().optional(),
  url: z.string().optional()
});

const TrackingInfoUpdateInputSchema = z.object({
  notifyCustomer: z.boolean().optional(),
  trackingDetails: z.array(TrackingDetailsSchema).optional(),
  trackingNumbers: z.array(z.string()).optional(),
  trackingUrls: z.array(z.string()).optional()
});

const FulfillmentTrackingInfoUpdateV2InputSchema = z.object({
  fulfillmentId: z.string().min(1, "Fulfillment ID is required"),
  notifyCustomer: z.boolean().optional(),
  trackingInfoUpdateInput: TrackingInfoUpdateInputSchema
});

type FulfillmentTrackingInfoUpdateV2Input = z.infer<typeof FulfillmentTrackingInfoUpdateV2InputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentTrackingInfoUpdateV2 = {
  name: "fulfillment-tracking-info-update-v2",
  description: "Update tracking information for a fulfillment",
  schema: FulfillmentTrackingInfoUpdateV2InputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentTrackingInfoUpdateV2Input) => {
    const query = gql`
      mutation fulfillmentTrackingInfoUpdateV2($fulfillmentId: ID!, $notifyCustomer: Boolean, $trackingInfoUpdateInput: TrackingInfoUpdateInput!) {
        fulfillmentTrackingInfoUpdateV2(
          fulfillmentId: $fulfillmentId
          notifyCustomer: $notifyCustomer
          trackingInfoUpdateInput: $trackingInfoUpdateInput
        ) {
          fulfillment {
            id
            trackingInfo {
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
      notifyCustomer: input.notifyCustomer,
      trackingInfoUpdateInput: input.trackingInfoUpdateInput
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentTrackingInfoUpdateV2;
    } catch (error) {
      console.error("Error updating fulfillment tracking info:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentTrackingInfoUpdateV2 };