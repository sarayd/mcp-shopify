import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PaymentCustomizationActivationInputSchema = z.object({
  id: z.string().min(1, "Payment customization ID is required"),
  enable: z.boolean(),
  metafields: z.array(z.object({
    key: z.string(),
    namespace: z.string(),
    value: z.string(),
    type: z.string()
  })).optional()
});
type PaymentCustomizationActivationInput = z.infer<typeof PaymentCustomizationActivationInputSchema>;

let shopifyClient: GraphQLClient;

const paymentCustomizationActivation = {
  name: "payment-customization-activation",
  description: "Activate or deactivate a payment customization",
  schema: PaymentCustomizationActivationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PaymentCustomizationActivationInput) => {
    const query = gql`
      mutation paymentCustomizationActivation($id: ID!, $enable: Boolean!, $metafields: [MetafieldInput!]) {
        paymentCustomizationActivate(id: $id, enable: $enable, metafields: $metafields) {
          paymentCustomization {
            id
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
      id: input.id,
      enable: input.enable,
      metafields: input.metafields
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.paymentCustomizationActivate;
    } catch (error) {
      console.error("Error activating payment customization:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { paymentCustomizationActivation };