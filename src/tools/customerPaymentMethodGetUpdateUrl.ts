import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerPaymentMethodGetUpdateUrlInputSchema = z.object({
  id: z.string().min(1, "Payment method ID is required").describe("The ID of the customer payment method to update.")
});
type CustomerPaymentMethodGetUpdateUrlInput = z.infer<typeof CustomerPaymentMethodGetUpdateUrlInputSchema>;

let shopifyClient: GraphQLClient;

const customerPaymentMethodGetUpdateUrl = {
  name: "customer-payment-method-get-update-url",
  description: "Get a URL that can be used to update a customer payment method",
  schema: CustomerPaymentMethodGetUpdateUrlInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerPaymentMethodGetUpdateUrlInput) => {
    const query = gql`
      mutation customerPaymentMethodGetUpdateUrl($id: ID!) {
        customerPaymentMethodGetUpdateUrl(id: $id) {
          updateUrl
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodGetUpdateUrl;
    } catch (error) {
      console.error("Error getting customer payment method update URL:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodGetUpdateUrl };