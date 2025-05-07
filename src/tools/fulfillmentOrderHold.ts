import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const FulfillmentOrderHoldInputSchema = z.object({
  fulfillmentOrderId: z.string().min(1, "Fulfillment Order ID is required"),
  holdReason: z.enum([
    "AWAITING_PAYMENT",
    "BUYER_REQUESTED",
    "FRAUD_CHECK",
    "HIGH_RISK_OF_FRAUD",
    "INVENTORY_OUT_OF_STOCK",
    "PAYMENT_PENDING",
    "UNKNOWN"
  ]),
  notifyMerchant: z.boolean().optional(),
  reasonNotes: z.string().optional()
});

type FulfillmentOrderHoldInput = z.infer<typeof FulfillmentOrderHoldInputSchema>;

let shopifyClient: GraphQLClient;

const fulfillmentOrderHold = {
  name: "fulfillment-order-hold",
  description: "Places a fulfillment order on hold",
  schema: FulfillmentOrderHoldInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: FulfillmentOrderHoldInput) => {
    const query = gql`
      mutation fulfillmentOrderHold($fulfillmentOrderId: ID!, $holdReason: FulfillmentHoldReason!, $notifyMerchant: Boolean, $reasonNotes: String) {
        fulfillmentOrderHold(
          fulfillmentOrderId: $fulfillmentOrderId
          holdReason: $holdReason
          notifyMerchant: $notifyMerchant
          reasonNotes: $reasonNotes
        ) {
          fulfillmentOrder {
            id
            status
            requestStatus
            holdReason
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      fulfillmentOrderId: input.fulfillmentOrderId,
      holdReason: input.holdReason,
      notifyMerchant: input.notifyMerchant,
      reasonNotes: input.reasonNotes
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.fulfillmentOrderHold;
    } catch (error) {
      console.error("Error executing fulfillmentOrderHold:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { fulfillmentOrderHold };