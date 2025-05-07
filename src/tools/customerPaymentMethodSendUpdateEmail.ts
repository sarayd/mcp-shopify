import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerPaymentMethodSendUpdateEmailInputSchema = z.object({
  customerPaymentMethodId: z.string().min(1, "Customer payment method ID is required")
});
type CustomerPaymentMethodSendUpdateEmailInput = z.infer<typeof CustomerPaymentMethodSendUpdateEmailInputSchema>;

let shopifyClient: GraphQLClient;

const customerPaymentMethodSendUpdateEmail = {
  name: "customer-payment-method-send-update-email",
  description: "Send an email to the customer with a payment method update form",
  schema: CustomerPaymentMethodSendUpdateEmailInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerPaymentMethodSendUpdateEmailInput) => {
    const query = gql`
      mutation customerPaymentMethodSendUpdateEmail($customerPaymentMethodId: ID!) {
        customerPaymentMethodSendUpdateEmail(customerPaymentMethodId: $customerPaymentMethodId) {
          customer {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { customerPaymentMethodId: input.customerPaymentMethodId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodSendUpdateEmail;
    } catch (error) {
      console.error("Error sending customer payment method update email:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodSendUpdateEmail };