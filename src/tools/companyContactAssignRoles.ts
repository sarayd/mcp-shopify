import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactAssignRolesInputSchema = z.object({
  companyContactId: z.string().min(1, "Company contact ID is required"),
  roleIds: z.array(z.string()).nonempty("At least one role ID is required"),
  companyLocationId: z.string().optional()
});
type CompanyContactAssignRolesInput = z.infer<typeof CompanyContactAssignRolesInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactAssignRoles = {
  name: "company-contact-assign-roles",
  description: "Assign roles to a company contact",
  schema: CompanyContactAssignRolesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactAssignRolesInput) => {
    const query = gql`
      mutation companyContactAssignRoles(
        $companyContactId: ID!
        $roleIds: [ID!]!
        $companyLocationId: ID
      ) {
        companyContactAssignRoles(
          companyContactId: $companyContactId
          roleIds: $roleIds
          companyLocationId: $companyLocationId
        ) {
          companyContact {
            id
            roles {
              id
              title
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
      companyContactId: input.companyContactId,
      roleIds: input.roleIds,
      companyLocationId: input.companyLocationId
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactAssignRoles;
    } catch (error) {
      console.error("Error assigning roles to company contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactAssignRoles };