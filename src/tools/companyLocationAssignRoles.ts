import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RoleAssignmentSchema = z.object({
  roleId: z.string().min(1, "Role ID is required"),
  userIds: z.array(z.string()).nonempty("At least one user ID is required")
});

const CompanyLocationAssignRolesInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company location ID is required"),
  roleAssignments: z.array(RoleAssignmentSchema).nonempty("At least one role assignment is required")
});

type CompanyLocationAssignRolesInput = z.infer<typeof CompanyLocationAssignRolesInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationAssignRoles = {
  name: "company-location-assign-roles",
  description: "Assign roles to users for a company location",
  schema: CompanyLocationAssignRolesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationAssignRolesInput) => {
    const query = gql`
      mutation companyLocationAssignRoles($companyLocationId: ID!, $roleAssignments: [CompanyLocationRoleAssignmentInput!]!) {
        companyLocationAssignRoles(
          companyLocationId: $companyLocationId
          roleAssignments: $roleAssignments
        ) {
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

    const variables = {
      companyLocationId: input.companyLocationId,
      roleAssignments: input.roleAssignments
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationAssignRoles;
    } catch (error) {
      console.error("Error assigning company location roles:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationAssignRoles };