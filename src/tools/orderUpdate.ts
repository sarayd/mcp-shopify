import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderUpdateInputSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  input: z.object({
    allowPartialAddresses: z.boolean().optional(),
    customAttributes: z.array(z.object({
      key: z.string(),
      value: z.string()
    })).optional(),
    customerNote: z.string().optional(),
    email: z.string().email().optional(),
    fulfillmentStatus: z.enum(['FULFILLED', 'IN_PROGRESS', 'ON_HOLD', 'OPEN', 'PARTIALLY_FULFILLED', 'PENDING_FULFILLMENT', 'RESTOCKED', 'SCHEDULED', 'UNFULFILLED']).optional(),
    inventoryBehavior: z.enum(['BYPASS', 'DECREMENT_IGNORING_POLICY', 'DECREMENT_OBEYING_POLICY']).optional(),
    metafields: z.array(z.object({
      key: z.string(),
      namespace: z.string(),
      type: z.string(),
      value: z.string()
    })).optional(),
    note: z.string().optional(),
    phone: z.string().optional(),
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
    tags: z.array(z.string()).optional()
  })
});

type OrderUpdateInput = z.infer<typeof OrderUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const orderUpdate = {
  name: "order-update",
  description: "Update an existing order",
  schema: OrderUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderUpdateInput) => {
    const query = gql`
      mutation orderUpdate($id: ID!, $input: OrderInput!) {
        orderUpdate(id: $id, input: $input) {
          order {
            id
            email
            tags
            fulfillmentStatus
            note
            customerNote
            phone
            shippingAddress {
              address1
              address2
              city
              company
              country
              countryCode
              firstName
              lastName
              phone
              province
              provinceCode
              zip
            }
            metafields(first: 10) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
                }
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

    const variables = {
      id: input.id,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderUpdate;
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderUpdate };