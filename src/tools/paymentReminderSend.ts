import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PaymentReminderSendInputSchema = z.object({
  paymentScheduleId: z.string().min(1, "Payment schedule ID is required")
});
type PaymentReminderSendInput = z.infer<typeof PaymentReminderSendInputSchema>;

let shopifyClient: GraphQLClient;

const paymentReminderSend = {
  name: "payment-reminder-send",
  description: "Send a payment reminder for a payment schedule",
  schema: PaymentReminderSendInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentReminderSendInput) => {
    const query = gql`
      mutation paymentReminderSend($paymentScheduleId: ID!) {
        paymentReminderSend(paymentScheduleId: $paymentScheduleId) {
          paymentSchedule {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { paymentScheduleId: input.paymentScheduleId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.paymentReminderSend;
    } catch (error) {
      console.error("Error sending payment reminder:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { paymentReminderSend };