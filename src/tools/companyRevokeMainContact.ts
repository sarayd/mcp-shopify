import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyRevokeMainContactInputSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  companyContactId: z.string().min(1, "Company contact ID is required")
});
type CompanyRevokeMainContactInput = z.infer<typeof CompanyRevokeMainContactInputSchema>;

let shopifyClient: GraphQLClient;

const companyRevokeMainContact = {
  name: "company-revoke-main-contact",
  description: "Revoke a company contact as the main contact for a company",
  schema: CompanyRevokeMainContactInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyRevokeMainContactInput) => {
    const query = gql`
      mutation companyRevokeMainContact($companyId: ID!, $companyContactId: ID!) {
        companyRevokeMainContact(
          companyId: $companyId
          companyContactId: $companyContactId
        ) {
          company {
            id
            mainContact {
              id
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
      companyId: input.companyId,
      companyContactId: input.companyContactId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyRevokeMainContact;
    } catch (error) {
      console.error("Error revoking company main contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyRevokeMainContact };