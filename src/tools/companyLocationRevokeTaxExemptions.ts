import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyLocationRevokeTaxExemptionsInputSchema = z.object({
  id: z.string().min(1, "Company location ID is required").describe("The ID of the company location.")
});
type CompanyLocationRevokeTaxExemptionsInput = z.infer<typeof CompanyLocationRevokeTaxExemptionsInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationRevokeTaxExemptions = {
  name: "company-location-revoke-tax-exemptions",
  description: "Revoke tax exemptions for a company location",
  schema: CompanyLocationRevokeTaxExemptionsInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationRevokeTaxExemptionsInput) => {
    const query = gql`
      mutation companyLocationRevokeTaxExemptions($id: ID!) {
        companyLocationRevokeTaxExemptions(id: $id) {
          companyLocation {
            id
          }
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
      return response.companyLocationRevokeTaxExemptions;
    } catch (error) {
      console.error("Error revoking company location tax exemptions:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationRevokeTaxExemptions };