import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PrivacyFeatureSchema = z.enum([
  'CUSTOMER_TRACKING',
  'THIRD_PARTY_TRACKING',
  'SHOPIFY_TRACKING'
]);

const PrivacyFeaturesDisableInputSchema = z.object({
  privacyFeatures: z.array(PrivacyFeatureSchema).min(1, "At least one privacy feature is required")
});
type PrivacyFeaturesDisableInput = z.infer<typeof PrivacyFeaturesDisableInputSchema>;

let shopifyClient: GraphQLClient;

const privacyFeaturesDisable = {
  name: "privacy-features-disable",
  description: "Disable specific privacy features for the shop",
  schema: PrivacyFeaturesDisableInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: PrivacyFeaturesDisableInput) => {
    const query = gql`
      mutation privacyFeaturesDisable($input: PrivacyFeaturesDisableInput!) {
        privacyFeaturesDisable(input: $input) {
          shop {
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
      input: {
        privacyFeatures: input.privacyFeatures
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.privacyFeaturesDisable;
    } catch (error) {
      console.error("Error disabling privacy features:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { privacyFeaturesDisable };