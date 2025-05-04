import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyDeleteInputSchema = z.object({
  companyId: z.string().min(1, "Company ID is required")
});
type CompanyDeleteInput = z.infer<typeof CompanyDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const companiesDelete = {
  name: "companies-delete",
  description: "Delete a B2B company",
  schema: CompanyDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyDeleteInput) => {
    const query = gql`
      mutation companiesDelete($companyId: ID!) {
        companiesDelete(companyId: $companyId) {
          deletedCompanyId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { companyId: input.companyId };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companiesDelete;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companiesDelete };