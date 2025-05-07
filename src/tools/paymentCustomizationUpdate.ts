import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating payment customizations
const PaymentCustomizationUpdateInputSchema = z.object({
  id: z.string().min(1, "Customization ID is required"),
  rules: z
    .object({
      paymentMethodId: z.string().optional(),
      enabled: z.boolean().optional()
    })
    .optional()
});

type PaymentCustomizationUpdateInput = z.infer<
  typeof PaymentCustomizationUpdateInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const paymentCustomizationUpdate = {
  name: "payment-customization-update",
  description: "Update payment customizations in Shopify",
  schema: PaymentCustomizationUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentCustomizationUpdateInput) => {
    try {
      const { id, rules } = input;

      // Convert ID to GID format if not already
      const formattedId = id.startsWith("gid://")
        ? id
        : `gid://shopify/PaymentCustomization/${id}`;

      const query = gql`
        mutation paymentCustomizationUpdate($input: PaymentCustomizationInput!) {
          paymentCustomizationUpdate(input: $input) {
            paymentCustomization {
              id
              paymentMethodId
              enabled
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
          id: formattedId,
          ...rules
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        paymentCustomizationUpdate: {
          paymentCustomization: {
            id: string;
            paymentMethodId: string | null;
            enabled: boolean;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.paymentCustomizationUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update payment customization: ${data.paymentCustomizationUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { paymentCustomization } = data.paymentCustomizationUpdate;
      return {
        paymentCustomization: paymentCustomization
          ? {
              id: paymentCustomization.id,
              paymentMethodId: paymentCustomization.paymentMethodId,
              enabled: paymentCustomization.enabled
            }
          : null
      };
    } catch (error) {
      console.error("Error updating payment customization:", error);
      throw new Error(
        `Failed to update payment customization: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { paymentCustomizationUpdate };