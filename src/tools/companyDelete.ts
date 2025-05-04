import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyDeleteInputSchema = z.object({
  id: z.string().min(1, "Company ID is required")
});
type CompanyDeleteInput = z.infer<typeof CompanyDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const companyDelete = {
  name: "company-delete",
  description: "Delete a company",
  schema: CompanyDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyDeleteInput) => {
    const query = gql`
      mutation companyDelete($id: ID!) {
        companyDelete(id: $id) {
          deletedCompanyId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { id: input.id };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyDelete;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyDelete };