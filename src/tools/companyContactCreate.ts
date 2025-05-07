import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  title: z.string().optional(),
  locale: z.string().optional(),
  phone: z.string().optional(),
  isMain: z.boolean().optional(),
  marketingAcceptsEmailMarketing: z.boolean().optional()
});
type CompanyContactInput = z.infer<typeof CompanyContactInputSchema>;

const CompanyContactCreateInputSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  input: CompanyContactInputSchema
});
type CompanyContactCreateInput = z.infer<typeof CompanyContactCreateInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactCreate = {
  name: "company-contact-create",
  description: "Create a new company contact",
  schema: CompanyContactCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactCreateInput) => {
    const query = gql`
      mutation companyContactCreate($companyId: ID!, $input: CompanyContactInput!) {
        companyContactCreate(companyId: $companyId, input: $input) {
          companyContact {
            id
            firstName
            lastName
            email
            title
            locale
            phone
            isMain
            marketingAcceptsEmailMarketing
            company {
              id
              name
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactCreate;
    } catch (error) {
      console.error("Error creating company contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactCreate };