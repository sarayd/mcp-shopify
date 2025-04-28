import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for capturing order payment
const OrderCaptureInputSchema = z.object({
  id: z.string().min(1, "Order ID is required"),
  parentTransactionId: z.string().min(1, "Parent transaction ID is required"),
  amount: z.string().min(1, "Amount is required"),
  currency: z.string().optional(),
  finalCapture: z.boolean().optional()
});
type OrderCaptureInput = z.infer<typeof OrderCaptureInputSchema>;

let shopifyClient: GraphQLClient;

const orderCapture = {
  name: "capture-order",
  description: "Capture payment for an order",
  schema: OrderCaptureInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderCaptureInput) => {
    const query = gql`
      mutation captureOrder($input: OrderCaptureInput!) {
        orderCapture(input: $input) {
          transaction { id status }
          userErrors { field message }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderCapture;
    } catch (error) {
      console.error("Error capturing order payment:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderCapture };
