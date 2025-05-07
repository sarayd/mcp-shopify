import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const BillingAddressInputSchema = z.object({
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
}).optional();

const CustomerPaymentMethodCreditCardUpdateInputSchema = z.object({
  id: z.string().min(1, "Payment method ID is required"),
  billingAddress: BillingAddressInputSchema,
  lastDigits: z.string().optional(),
  month: z.number().int().min(1).max(12).optional(),
  name: z.string().optional(),
  year: z.number().int().min(2000).optional()
});

let shopifyClient: GraphQLClient;

const customerPaymentMethodCreditCardUpdate = {
  name: "customer-payment-method-credit-card-update",
  description: "Update a customer's credit card payment method",
  schema: CustomerPaymentMethodCreditCardUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: z.infer<typeof CustomerPaymentMethodCreditCardUpdateInputSchema>) => {
    const query = gql`
      mutation customerPaymentMethodCreditCardUpdate($input: CustomerPaymentMethodCreditCardUpdateInput!) {
        customerPaymentMethodCreditCardUpdate(input: $input) {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodCreditCardUpdate;
    } catch (error) {
      console.error("Error updating customer payment method:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodCreditCardUpdate };