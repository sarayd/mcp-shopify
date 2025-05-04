import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PaymentInstrumentSchema = z.object({
  type: z.enum(['PAYMENT_CARD', 'BANK_ACCOUNT']),
  brand: z.string().optional(),
  expireMonth: z.number().optional(),
  expireYear: z.number().optional(),
  sourceType: z.string().optional(),
  lastDigits: z.string().optional(),
  name: z.string().optional(),
  issuingCountry: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  transitNumber: z.string().optional(),
  institutionNumber: z.string().optional()
});

const CustomerPaymentMethodRemoteCreateInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  billingAddress: z.object({
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
  paymentMethod: z.object({
    remoteReference: z.string(),
    type: z.enum(['PAYMENT_CARD', 'BANK_ACCOUNT']),
    remoteUrl: z.string().optional(),
    instrument: PaymentInstrumentSchema.optional()
  })
});

type CustomerPaymentMethodRemoteCreateInput = z.infer<typeof CustomerPaymentMethodRemoteCreateInputSchema>;

let shopifyClient: GraphQLClient;

const customerPaymentMethodRemoteCreate = {
  name: "customer-payment-method-remote-create",
  description: "Create a remote payment method for a customer",
  schema: CustomerPaymentMethodRemoteCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerPaymentMethodRemoteCreateInput) => {
    const query = gql`
      mutation customerPaymentMethodRemoteCreate($input: CustomerPaymentMethodRemoteCreateInput!) {
        customerPaymentMethodRemoteCreate(input: $input) {
          customerPaymentMethod {
            id
            instrument {
              type
              brand
              lastDigits
              expiryMonth
              expiryYear
              name
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
      input: {
        customerId: input.customerId,
        billingAddress: input.billingAddress,
        paymentMethod: input.paymentMethod
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerPaymentMethodRemoteCreate;
    } catch (error) {
      console.error("Error creating customer payment method:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerPaymentMethodRemoteCreate };