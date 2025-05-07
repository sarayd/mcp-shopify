import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for creating a customer credit card payment method
const CustomerPaymentMethodCreditCardCreateInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  vaultId: z.string().min(1, "Vault ID is required"),
  billingAddress: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      address1: z.string().optional(),
      city: z.string().optional(),
      province: z.string().optional(),
      country: z.string().optional(),
      zip: z.string().optional()
    })
    .optional()
});

type CustomerPaymentMethodCreditCardCreateInput = z.infer<
  typeof CustomerPaymentMethodCreditCardCreateInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const customerPaymentMethodCreditCardCreate = {
  name: "customer-payment-method-credit-card-create",
  description: "Create a credit card payment method for a customer in Shopify",
  schema: CustomerPaymentMethodCreditCardCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerPaymentMethodCreditCardCreateInput) => {
    try {
      const { customerId, vaultId, billingAddress } = input;

      // Convert customer ID to GID format if not already
      const formattedCustomerId = customerId.startsWith("gid://")
        ? customerId
        : `gid://shopify/Customer/${customerId}`;

      const query = gql`
        mutation customerPaymentMethodCreditCardCreate($input: CustomerPaymentMethodCreditCardCreateInput!) {
          customerPaymentMethodCreditCardCreate(input: $input) {
            paymentMethod {
              id
              lastDigits
              brand
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
          customerId: formattedCustomerId,
          vaultId,
          billingAddress
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        customerPaymentMethodCreditCardCreate: {
          paymentMethod: {
            id: string;
            lastDigits: string;
            brand: string;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.customerPaymentMethodCreditCardCreate.userErrors.length > 0) {
        throw new Error(
          `Failed to create payment method: ${data.customerPaymentMethodCreditCardCreate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { paymentMethod } = data.customerPaymentMethodCreditCardCreate;
      return {
        paymentMethod: paymentMethod
          ? {
              id: paymentMethod.id,
              lastDigits: paymentMethod.lastDigits,
              brand: paymentMethod.brand
            }
          : null
      };
    } catch (error) {
      console.error("Error creating payment method:", error);
      throw new Error(
        `Failed to create payment method: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { customerPaymentMethodCreditCardCreate };