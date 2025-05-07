import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerPaymentMethodPaypalBillingAgreementUpdateInputSchema = z.object({
  id: z.string().min(1, "Payment method ID is required"),
  paypalBillingAgreementId: z.string().min(1, "PayPal billing agreement ID is required")
});

type CustomerPaymentMethodPaypalBillingAgreementUpdateInput = z.infer<typeof CustomerPaymentMethodPaypalBillingAgreementUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const customerPaymentMethodPaypalBillingAgreementUpdate = {
  name: "customer-payment-method-paypal-billing-agreement-update",
  description: "Updates a customer payment method with a PayPal billing agreement",
  schema: CustomerPaymentMethodPaypalBillingAgreementUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerPaymentMethodPaypalBillingAgreementUpdateInput) => {
    const query = gql`
      mutation customerPaymentMethodPaypalBillingAgreementUpdate($input: CustomerPaymentMethodPaypalBillingAgreementUpdateInput!) {
        customerPaymentMethodPaypalBillingAgreementUpdate(input: $input) {
          customerPaymentMethod {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id,
        paypalBillingAgreementId: input.paypalBillingAgreementId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodPaypalBillingAgreementUpdate;
    } catch (error) {
      console.error("Error updating PayPal billing agreement:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodPaypalBillingAgreementUpdate };