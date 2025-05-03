import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for assigning a customer as a company contact
const CompanyAssignCustomerAsContactInputSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  customerId: z.string().min(1, "Customer ID is required")
});

type CompanyAssignCustomerAsContactInput = z.infer<
  typeof CompanyAssignCustomerAsContactInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const companyAssignCustomerAsContact = {
  name: "company-assign-customer-as-contact",
  description: "Assign a customer as a contact for a company in Shopify",
  schema: CompanyAssignCustomerAsContactInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyAssignCustomerAsContactInput) => {
    try {
      const { companyId, customerId } = input;

      // Convert IDs to GID format if not already
      const formattedCompanyId = companyId.startsWith("gid://")
        ? companyId
        : `gid://shopify/Company/${companyId}`;
      const formattedCustomerId = customerId.startsWith("gid://")
        ? customerId
        : `gid://shopify/Customer/${customerId}`;

      const query = gql`
        mutation companyAssignCustomerAsContact($companyId: ID!, $customerId: ID!) {
          companyAssignCustomerAsContact(companyId: $companyId, customerId: $customerId) {
            companyContact {
              id
              customer {
                id
                email
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
        companyId: formattedCompanyId,
        customerId: formattedCustomerId
      };

      const data = (await shopifyClient.request(query, variables)) as {
        companyAssignCustomerAsContact: {
          companyContact: {
            id: string;
            customer: { id: string; email: string } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.companyAssignCustomerAsContact.userErrors.length > 0) {
        throw new Error(
          `Failed to assign customer as contact: ${data.companyAssignCustomerAsContact.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { companyContact } = data.companyAssignCustomerAsContact;
      return {
        companyContact: companyContact
          ? {
              id: companyContact.id,
              customer: companyContact.customer
                ? { id: companyContact.customer.id, email: companyContact.customer.email }
                : null
            }
          : null
      };
    } catch (error) {
      console.error("Error assigning customer as contact:", error);
      throw new Error(
        `Failed to assign customer as contact: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { companyAssignCustomerAsContact };