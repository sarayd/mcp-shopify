import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderInputSchema = z.object({
  customAttributes: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).optional(),
  email: z.string().email().optional(),
  fulfillmentStatus: z.enum(['FULFILLED', 'IN_PROGRESS', 'ON_HOLD', 'OPEN', 'PARTIALLY_FULFILLED', 'PENDING_FULFILLMENT', 'RESTOCKED', 'SCHEDULED', 'UNFULFILLED']).optional(),
  inventoryBehavior: z.enum(['BYPASS', 'DECREMENT_IGNORING_POLICY', 'DECREMENT_OBEYING_POLICY']).optional(),
  lineItems: z.array(z.object({
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    originalUnitPrice: z.number().optional(),
    quantity: z.number().int().positive(),
    taxable: z.boolean().optional(),
    title: z.string().optional(),
    variantId: z.string().optional(),
    weight: z.number().optional(),
    weightUnit: z.enum(['GRAMS', 'KILOGRAMS', 'OUNCES', 'POUNDS']).optional()
  })).nonempty("At least one line item is required"),
  locationId: z.string().optional(),
  note: z.string().optional(),
  presentmentCurrencyCode: z.string().optional(),
  privateMetafields: z.array(z.object({
    key: z.string(),
    namespace: z.string(),
    value: z.string(),
    valueType: z.enum(['INTEGER', 'JSON_STRING', 'STRING']).optional()
  })).optional(),
  purchasingEntity: z.object({
    customerId: z.string().optional(),
    locationId: z.string().optional()
  }).optional(),
  shippingAddress: z.object({
    address1: z.string().optional(),
    address2: z.string().optional(),
    city: z.string().optional(),
    company: z.string().optional(),
    country: z.string().optional(),
    countryCode: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    province: z.string().optional(),
    provinceCode: z.string().optional(),
    zip: z.string().optional()
  }).optional(),
  shippingLine: z.object({
    price: z.number().optional(),
    shippingRateHandle: z.string().optional(),
    title: z.string().optional()
  }).optional(),
  sourceName: z.string().optional(),
  tags: z.array(z.string()).optional(),
  taxExempt: z.boolean().optional(),
  taxLines: z.array(z.object({
    price: z.number(),
    rate: z.number(),
    title: z.string()
  })).optional()
});

type OrderInput = z.infer<typeof OrderInputSchema>;

let shopifyClient: GraphQLClient;

const orderCreate = {
  name: "order-create",
  description: "Create a new order in Shopify",
  schema: OrderInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderInput) => {
    const query = gql`
      mutation orderCreate($input: OrderInput!) {
        orderCreate(input: $input) {
          order {
            id
            name
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
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
      return response.orderCreate;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderCreate };