import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const LineItemInputSchema = z.object({
  id: z.string(),
  quantity: z.number().int().min(1).optional()
});

const TrackingInfoInputSchema = z.object({
  company: z.string().optional(),
  number: z.string().optional(),
  url: z.string().url().optional()
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
  trackingNumbers: z.array(z.string()).optional(),
  trackingUrls: z.array(z.string().url()).optional(),
  metadata: z.array(MetafieldInputSchema).optional()
});

type FulfillmentInput = z.infer<typeof FulfillmentInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentCreate = {
  name: "fulfillment-create",
  description: "Create a fulfillment for an order",
  schema: FulfillmentInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentInput) => {
    const query = gql`
      mutation fulfillmentCreate($input: FulfillmentInput!) {
        fulfillmentCreate(input: $input) {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentCreate;
    } catch (error) {
      console.error("Error creating fulfillment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentCreate };