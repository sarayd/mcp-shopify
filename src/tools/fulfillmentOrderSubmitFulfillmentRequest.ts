import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderLineItemInputSchema = z.object({
  fulfillmentOrderLineItemId: z.string(),
  quantity: z.number().int().min(1)
});

const TrackingInfoInputSchema = z.object({
  company: z.string().optional(),
  number: z.string().optional(),
  url: z.string().url().optional()
});

const FulfillmentRequestOrderInputSchema = z.object({
  lineItems: z.array(FulfillmentOrderLineItemInputSchema),
  notifyCustomer: z.boolean().optional(),
  shippingMethod: z.string().optional(),
  trackingInfo: TrackingInfoInputSchema.optional(),
  message: z.string().optional()
});

const FulfillmentOrderSubmitRequestInputSchema = z.object({
  fulfillmentOrderId: z.string().min(1, "Fulfillment Order ID is required"),
  fulfillmentRequestOrder: FulfillmentRequestOrderInputSchema
});

type FulfillmentOrderSubmitRequestInput = z.infer<typeof FulfillmentOrderSubmitRequestInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderSubmitFulfillmentRequest = {
  name: "fulfillment-order-submit-fulfillment-request",
  description: "Submit a fulfillment request for a fulfillment order",
  schema: FulfillmentOrderSubmitRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderSubmitRequestInput) => {
    const query = gql`
      mutation fulfillmentOrderSubmitFulfillmentRequest($input: FulfillmentOrderSubmitFulfillmentRequestInput!) {
        fulfillmentOrderSubmitFulfillmentRequest(input: $input) {
          fulfillmentOrder {
            id
            status
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
        fulfillmentOrderId: input.fulfillmentOrderId,
        fulfillmentRequestOrder: input.fulfillmentRequestOrder
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderSubmitFulfillmentRequest;
    } catch (error) {
      console.error("Error submitting fulfillment request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderSubmitFulfillmentRequest };