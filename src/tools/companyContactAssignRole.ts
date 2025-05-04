import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactAssignRoleInputSchema = z.object({
  companyContactId: z.string().min(1, "Company Contact ID is required"),
  roleId: z.string().min(1, "Role ID is required"),
  companyLocationId: z.string().optional()
});
type CompanyContactAssignRoleInput = z.infer<typeof CompanyContactAssignRoleInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactAssignRole = {
  name: "company-contact-assign-role",
  description: "Assign a role to a company contact",
  schema: CompanyContactAssignRoleInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactAssignRoleInput) => {
    const query = gql`
      mutation companyContactAssignRole($input: CompanyContactAssignRoleInput!) {
        companyContactAssignRole(input: $input) {
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
      input: {
        companyContactId: input.companyContactId,
        roleId: input.roleId,
        companyLocationId: input.companyLocationId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactAssignRole;
    } catch (error) {
      console.error("Error assigning role to company contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactAssignRole };