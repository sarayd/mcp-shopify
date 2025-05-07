import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderLineItemSchema = z.object({
  fulfillmentOrderLineItemId: z.string(),
  quantity: z.number().int().positive()
});

const FulfillmentOrderSplitSchema = z.object({
  fulfillmentOrderId: z.string(),
  newFulfillmentOrder: z.array(FulfillmentOrderLineItemSchema).nonempty()
});

const FulfillmentOrderSplitInputSchema = z.object({
  fulfillmentOrderSplits: z.array(FulfillmentOrderSplitSchema).nonempty()
});

type FulfillmentOrderSplitInput = z.infer<typeof FulfillmentOrderSplitInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderSplit = {
  name: "fulfillment-order-split",
  description: "Split a fulfillment order into multiple fulfillment orders",
  schema: FulfillmentOrderSplitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderSplitInput) => {
    const query = gql`
      mutation fulfillmentOrderSplit($fulfillmentOrderSplits: [FulfillmentOrderSplitInput!]!) {
        fulfillmentOrderSplit(fulfillmentOrderSplits: $fulfillmentOrderSplits) {
          fulfillmentOrders {
            id
            status
            lineItems(first: 10) {
              edges {
                node {
                  id
                  totalQuantity
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

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.fulfillmentOrderSplit;
    } catch (error) {
      console.error("Error splitting fulfillment order:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderSplit };