import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const PaymentCustomizationInputSchema = z.object({
  functionId: z.string().min(1, "Function ID is required"),
  title: z.string().min(1, "Title is required"),
  enabled: z.boolean().optional(),
  metafields: z.array(MetafieldInputSchema).optional()
});

const PaymentCustomizationCreateInputSchema = z.object({
  input: PaymentCustomizationInputSchema
});

type PaymentCustomizationCreateInput = z.infer<typeof PaymentCustomizationCreateInputSchema>;

let shopifyClient: GraphQLClient;

const paymentCustomizationCreate = {
  name: "payment-customization-create",
  description: "Create a payment customization",
  schema: PaymentCustomizationCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentCustomizationCreateInput) => {
    const query = gql`
      mutation paymentCustomizationCreate($input: PaymentCustomizationInput!) {
        paymentCustomizationCreate(input: $input) {
          paymentCustomization {
            id
            title
            enabled
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.paymentCustomizationCreate;
    } catch (error) {
      console.error("Error creating payment customization:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { paymentCustomizationCreate };