import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RevokeInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  paymentMethodId: z.string().min(1, "Payment method ID is required")
});
type RevokeInput = z.infer<typeof RevokeInputSchema>;

let shopifyClient: GraphQLClient;

const customerPaymentMethodRevoke = {
  name: "customer-payment-method-revoke",
  description: "Revoke a customer payment method",
  schema: RevokeInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: RevokeInput) => {
    const query = gql`
      mutation customerPaymentMethodRevoke($customerId: ID!, $paymentMethodId: ID!) {
        customerPaymentMethodRevoke(customerId: $customerId, paymentMethodId: $paymentMethodId) {
          revokedPaymentMethod {
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
      customerId: input.customerId,
      paymentMethodId: input.paymentMethodId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodRevoke;
    } catch (error) {
      console.error("Error revoking customer payment method:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodRevoke };