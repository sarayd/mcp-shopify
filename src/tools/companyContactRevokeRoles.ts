import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactRevokeRolesInputSchema = z.object({
  companyContactId: z.string().min(1, "Company Contact ID is required"),
  revokeRoles: z.array(z.enum([
    'COMPANY_LOCATION_ADMIN',
    'COMPANY_LOCATION_CATALOG_MANAGER',
    'COMPANY_LOCATION_CUSTOMER_SUPPORT',
    'COMPANY_LOCATION_FULFILLMENT_AND_INVENTORY',
    'COMPANY_LOCATION_MARKETING',
    'COMPANY_LOCATION_PAYMENT_MANAGER',
    'COMPANY_LOCATION_STORE_MANAGEMENT'
  ])).nonempty("At least one role must be specified")
});
type CompanyContactRevokeRolesInput = z.infer<typeof CompanyContactRevokeRolesInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactRevokeRoles = {
  name: "company-contact-revoke-roles",
  description: "Revoke roles from a company contact",
  schema: CompanyContactRevokeRolesInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactRevokeRolesInput) => {
    const query = gql`
      mutation companyContactRevokeRoles($companyContactId: ID!, $revokeRoles: [CompanyContactRole!]!) {
        companyContactRevokeRoles(companyContactId: $companyContactId, revokeRoles: $revokeRoles) {
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
      companyContactId: input.companyContactId,
      revokeRoles: input.revokeRoles
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactRevokeRoles;
    } catch (error) {
      console.error("Error revoking company contact roles:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactRevokeRoles };