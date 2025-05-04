import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TimeUnitSchema = z.enum(['HOURS', 'DAYS', 'WEEKS', 'MONTHS']);

const TransitTimeSchema = z.object({
  interval: z.number(),
  unit: TimeUnitSchema
});

const DeliveryPromiseProviderInputSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  type: z.enum(['MERCHANT_DEFINED', 'THIRD_PARTY']),
  active: z.boolean(),
  fulfillmentType: z.enum(['PICKUP', 'SHIPPING']),
  methodType: z.enum(['DELIVERY', 'PICKUP']),
  minDeliveryDateTime: z.string().datetime().optional(),
  maxDeliveryDateTime: z.string().datetime().optional(),
  minTransitTime: TransitTimeSchema.optional(),
  maxTransitTime: TransitTimeSchema.optional()
});

const DeliveryPromiseProviderUpsertSchema = z.object({
  input: DeliveryPromiseProviderInputSchema
});

type DeliveryPromiseProviderUpsertInput = z.infer<typeof DeliveryPromiseProviderUpsertSchema>;

let shopifyClient: GraphQLClient;

const deliveryPromiseProviderUpsert = {
  name: "delivery-promise-provider-upsert",
  description: "Create or update a delivery promise provider",
  schema: DeliveryPromiseProviderUpsertSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DeliveryPromiseProviderUpsertInput) => {
    const query = gql`
      mutation deliveryPromiseProviderUpsert($input: DeliveryPromiseProviderInput!) {
        deliveryPromiseProviderUpsert(input: $input) {
          deliveryPromiseProvider {
            id
            name
            type
            active
            fulfillmentType
            methodType
            minDeliveryDateTime
            maxDeliveryDateTime
            minTransitTime {
              interval
              unit
            }
            maxTransitTime {
              interval
              unit
            }
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
      return response.deliveryPromiseProviderUpsert;
    } catch (error) {
      console.error("Error executing deliveryPromiseProviderUpsert:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { deliveryPromiseProviderUpsert };