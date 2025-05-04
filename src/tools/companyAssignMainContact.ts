import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyAssignMainContactInputSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  companyContactId: z.string().min(1, "Company Contact ID is required")
});
type CompanyAssignMainContactInput = z.infer<typeof CompanyAssignMainContactInputSchema>;

let shopifyClient: GraphQLClient;

const companyAssignMainContact = {
  name: "company-assign-main-contact",
  description: "Assign a main contact to a company",
  schema: CompanyAssignMainContactInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyAssignMainContactInput) => {
    const query = gql`
      mutation companyAssignMainContact($companyId: ID!, $companyContactId: ID!) {
        companyAssignMainContact(companyId: $companyId, companyContactId: $companyContactId) {
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
      return response.companyAssignMainContact;
    } catch (error) {
      console.error("Error assigning company main contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyAssignMainContact };