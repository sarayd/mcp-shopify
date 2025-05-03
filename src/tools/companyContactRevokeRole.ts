import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for revoking a role from a company contact
const CompanyContactRevokeRoleInputSchema = z.object({
  companyContactId: z.string().min(1, "Company contact ID is required"),
  role: z.string().min(1, "Role is required")
});

type CompanyContactRevokeRoleInput = z.infer<
  typeof CompanyContactRevokeRoleInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const companyContactRevokeRole = {
  name: "company-contact-revoke-role",
  description: "Revoke a role from a company contact in Shopify",
  schema: CompanyContactRevokeRoleInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactRevokeRoleInput) => {
    try {
      const { companyContactId, role } = input;

      // Convert ID to GID format if not already
      const formattedId = companyContactId.startsWith("gid://")
        ? companyContactId
        : `gid://shopify/CompanyContact/${companyContactId}`;

      const query = gql`
        mutation companyContactRevokeRole($companyContactId: ID!, $role: CompanyContactRole!) {
          companyContactRevokeRole(companyContactId: $companyContactId, role: $role) {
            companyContact {
              id
              roles
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        companyContactId: formattedId,
        role
      };

      const data = (await shopifyClient.request(query, variables)) as {
        companyContactRevokeRole: {
          companyContact: {
            id: string;
            roles: string[];
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.companyContactRevokeRole.userErrors.length > 0) {
        throw new Error(
          `Failed to revoke role: ${data.companyContactRevokeRole.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { companyContact } = data.companyContactRevokeRole;
      return {
        companyContact: companyContact
          ? {
              id: companyContact.id,
              roles: companyContact.roles
            }
          : null
      };
    } catch (error) {
      console.error("Error revoking role:", error);
      throw new Error(
        `Failed to revoke role: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { companyContactRevokeRole };