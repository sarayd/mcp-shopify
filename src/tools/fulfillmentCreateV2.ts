import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const LineItemInputSchema = z.object({
  id: z.string(),
  quantity: z.number().int().optional()
});

const TrackingInfoInputSchema = z.object({
  company: z.string().optional(),
  number: z.string().optional(),
  url: z.string().optional()
});

const MetafieldInputSchema = z.object({
  key: z.string(),
  value: z.string()
});

const FulfillmentInputSchema = z.object({
  lineItems: z.array(LineItemInputSchema).optional(),
  trackingInfo: TrackingInfoInputSchema.optional(),
  notifyCustomer: z.boolean().optional(),
  locationId: z.string(),
  orderId: z.string(),
  allowPartial: z.boolean().optional(),
  trackingNumbers: z.array(z.string()).optional(),
  trackingUrls: z.array(z.string()).optional(),
  metadata: z.array(MetafieldInputSchema).optional()
});

type FulfillmentInput = z.infer<typeof FulfillmentInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentCreateV2 = {
  name: "fulfillment-create-v2",
  description: "Create a fulfillment for an order",
  schema: FulfillmentInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentInput) => {
    const query = gql`
      mutation fulfillmentCreateV2($input: FulfillmentV2Input!) {
        fulfillmentCreateV2(input: $input) {
          fulfillment {
            id
            status
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
      input: {
        lineItems: input.lineItems,
        trackingInfo: input.trackingInfo,
        notifyCustomer: input.notifyCustomer,
        locationId: input.locationId,
        orderId: input.orderId,
        allowPartial: input.allowPartial,
        trackingNumbers: input.trackingNumbers,
        trackingUrls: input.trackingUrls,
        metadata: input.metadata
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentCreateV2;
    } catch (error) {
      console.error("Error creating fulfillment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentCreateV2 };