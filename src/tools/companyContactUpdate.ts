import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactInputSchema = z.object({
  company: z.object({
    id: z.string()
  }).optional(),
  customer: z.object({
    id: z.string()
  }).optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  isMain: z.boolean().optional(),
  lastName: z.string().optional(),
  locale: z.string().optional(),
  phone: z.string().optional(),
  title: z.string().optional()
});

const CompanyContactUpdateInputSchema = z.object({
  companyContactId: z.string().min(1, "Company Contact ID is required"),
  input: CompanyContactInputSchema
});

type CompanyContactUpdateInput = z.infer<typeof CompanyContactUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const companyContactUpdate = {
  name: "company-contact-update",
  description: "Update a company contact",
  schema: CompanyContactUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyContactUpdateInput) => {
    const query = gql`
      mutation companyContactUpdate($companyContactId: ID!, $input: CompanyContactInput!) {
        companyContactUpdate(companyContactId: $companyContactId, input: $input) {
          companyContact {
            id
            firstName
            lastName
            email
            phone
            title
            locale
            isMain
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyContactUpdate;
    } catch (error) {
      console.error("Error updating company contact:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyContactUpdate };