import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TaxAppConfigureInputSchema = z.object({
  id: z.string().min(1, "Tax app ID is required"),
  enabled: z.boolean(),
  taxCalculationMethod: z.enum(['ACTUAL', 'ESTIMATED']).optional(),
  registeredLocations: z.array(z.object({
    countryCode: z.string().length(2, "Country code must be 2 characters"),
    provinceCode: z.string().optional()
  })).optional()
});

const schema = z.object({
  input: TaxAppConfigureInputSchema
});

type TaxAppConfigureInput = z.infer<typeof schema>;

let shopifyClient: GraphQLClient;

const taxAppConfigure = {
  name: "tax-app-configure",
  description: "Configure tax app settings",
  schema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: TaxAppConfigureInput) => {
    const query = gql`
      mutation taxAppConfigure($input: TaxAppConfigureInput!) {
        taxAppConfigure(input: $input) {
          taxApp {
            id
            enabled
            taxCalculationMethod
            registeredLocations {
              countryCode
              provinceCode
            }
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
      return response.taxAppConfigure;
    } catch (error) {
      console.error("Error configuring tax app:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { taxAppConfigure };