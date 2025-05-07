import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

// Input schema for PaymentCustomizationDeleteInput
const PaymentCustomizationDeleteInputSchema = z.object({ id: z.string() });
type PaymentCustomizationDeleteInput = z.infer<typeof PaymentCustomizationDeleteInputSchema>;

// Tool input schema
const PaymentCustomizationDeleteInputSchema = z.object({
  input: PaymentCustomizationDeleteInputSchema
});
type PaymentCustomizationDeleteInput = z.infer<typeof PaymentCustomizationDeleteInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const paymentCustomizationDelete = {
  name: "payment-customization-delete",
  description: "Perform paymentCustomizationDelete operation in Shopify",
  schema: PaymentCustomizationDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentCustomizationDeleteInput) => {
    const query = gql`
      mutation paymentCustomizationDelete($input: paymentCustomizationDeleteInput!) {
  paymentCustomizationDelete(input: $input) {
    result {
      id
    }
    userErrors {
      field
      message
    }
  }
}
    `;
    const variables = { input: input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.paymentCustomizationDelete;
    } catch (error) {
      console.error("Error executing paymentCustomizationDelete:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  },
};

export { paymentCustomizationDelete };
