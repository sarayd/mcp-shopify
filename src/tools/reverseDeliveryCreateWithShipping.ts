import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnShippingMethodSchema = z.object({
  code: z.string(),
  label: z.string(),
  source: z.string()
});

const WeightSchema = z.object({
  value: z.number(),
  unit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES'])
});

const ReturnAddressSchema = z.object({
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  company: z.string().optional(),
  countryCode: z.string(),
  phone: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string()
});

const ReverseDeliveryCreateWithShippingInputSchema = z.object({
  deliveryId: z.string(),
  notifyCustomer: z.boolean().optional(),
  returnShipping: z.object({
    shippingMethod: ReturnShippingMethodSchema,
    maxWeight: WeightSchema.optional(),
    returnAddress: ReturnAddressSchema
  }).optional()
});

type ReverseDeliveryCreateWithShippingInput = z.infer<typeof ReverseDeliveryCreateWithShippingInputSchema>;

let shopifyClient: GraphQLClient;

const reverseDeliveryCreateWithShipping = {
  name: "reverse-delivery-create-with-shipping",
  description: "Create a reverse delivery with shipping details",
  schema: ReverseDeliveryCreateWithShippingInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReverseDeliveryCreateWithShippingInput) => {
    const query = gql`
      mutation reverseDeliveryCreateWithShipping($deliveryId: ID!, $notifyCustomer: Boolean, $returnShipping: ReturnShippingInput) {
        reverseDeliveryCreateWithShipping(
          deliveryId: $deliveryId
          notifyCustomer: $notifyCustomer
          returnShipping: $returnShipping
        ) {
          reverseDelivery {
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

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.reverseDeliveryCreateWithShipping;
    } catch (error) {
      console.error("Error creating reverse delivery:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { reverseDeliveryCreateWithShipping };