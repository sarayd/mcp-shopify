import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyLocationRemoveStaffMembersInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company location ID is required"),
  staffMemberIds: z.array(z.string()).nonempty("At least one staff member ID is required")
});
type CompanyLocationRemoveStaffMembersInput = z.infer<typeof CompanyLocationRemoveStaffMembersInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationRemoveStaffMembers = {
  name: "company-location-remove-staff-members",
  description: "Remove staff members from a company location",
  schema: CompanyLocationRemoveStaffMembersInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationRemoveStaffMembersInput) => {
    const query = gql`
      mutation companyLocationRemoveStaffMembers($companyLocationId: ID!, $staffMemberIds: [ID!]!) {
        companyLocationRemoveStaffMembers(
          companyLocationId: $companyLocationId
          staffMemberIds: $staffMemberIds
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
      staffMemberIds: input.staffMemberIds
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationRemoveStaffMembers;
    } catch (error) {
      console.error("Error removing staff members from company location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationRemoveStaffMembers };