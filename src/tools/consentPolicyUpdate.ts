import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ConsentPurposeSchema = z.object({
  purpose: z.enum(['ESSENTIAL', 'ANALYTICS', 'PERSONALIZATION', 'MARKETING', 'UNCLASSIFIED']),
  isRequired: z.boolean().optional(),
  isEnabled: z.boolean().optional()
});

const ConsentPolicyUpdateInputSchema = z.object({
  customText: z.string().optional(),
  purposes: z.array(ConsentPurposeSchema).optional()
});

type ConsentPolicyUpdateInput = z.infer<typeof ConsentPolicyUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const consentPolicyUpdate = {
  name: "consent-policy-update",
  description: "Update the shop's consent policy settings",
  schema: ConsentPolicyUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ConsentPolicyUpdateInput) => {
    const query = gql`
      mutation consentPolicyUpdate($input: ConsentPolicyUpdateInput!) {
        consentPolicyUpdate(input: $input) {
          consentPolicy {
            id
            customText
            purposes {
              purpose
              isRequired
              isEnabled
            }
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
      return response.consentPolicyUpdate;
    } catch (error) {
      console.error("Error updating consent policy:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { consentPolicyUpdate };