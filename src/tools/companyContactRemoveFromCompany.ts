import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactRemoveFromCompanyInputSchema = z.object({
  companyContactId: z.string().min(1, "Company Contact ID is required"),
  companyId: z.string().min(1, "Company ID is required")
});
type CompanyContactRemoveFromCompanyInput = z.infer<typeof CompanyContactRemoveFromCompanyInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactRemoveFromCompany = {
  name: "company-contact-remove-from-company",
  description: "Remove a company contact from a company",
  schema: CompanyContactRemoveFromCompanyInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactRemoveFromCompanyInput) => {
    const query = gql`
      mutation companyContactRemoveFromCompany($companyContactId: ID!, $companyId: ID!) {
        companyContactRemoveFromCompany(companyContactId: $companyContactId, companyId: $companyId) {
          companyContact {
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
      companyContactId: input.companyContactId,
      companyId: input.companyId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactRemoveFromCompany;
    } catch (error) {
      console.error("Error removing company contact from company:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactRemoveFromCompany };