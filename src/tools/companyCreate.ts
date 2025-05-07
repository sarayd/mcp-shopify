import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CompanyContactInputSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  title: z.string().optional(),
  locale: z.string().optional(),
  phone: z.string().optional(),
  isDefaultContact: z.boolean().optional()
});

const CompanyLocationInputSchema = z.object({
  name: z.string().optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  zip: z.string().optional(),
  phone: z.string().optional(),
  isDefaultLocation: z.boolean().optional()
});

const CompanyInputSchema = z.object({
  name: z.string(),
  externalId: z.string().optional(),
  note: z.string().optional(),
  customerSince: z.string().optional(),
  taxExempt: z.boolean().optional()
});

const CompanyCreateInputSchema = z.object({
  input: z.object({
    company: CompanyInputSchema,
    companyContact: CompanyContactInputSchema.optional(),
    companyLocation: CompanyLocationInputSchema.optional()
  })
});

type CompanyCreateInput = z.infer<typeof CompanyCreateInputSchema>;

let shopifyClient: GraphQLClient;

const companyCreate = {
  name: "company-create",
  description: "Create a new company in Shopify",
  schema: CompanyCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyCreateInput) => {
    const query = gql`
      mutation companyCreate($input: CompanyCreateInput!) {
        companyCreate(input: $input) {
          company {
            id
            name
            externalId
            mainContact {
              id
              firstName
              lastName
              email
              title
            }
            locations {
              nodes {
                id
                name
                address {
                  address1
                  address2
                  city
                  province
                  zip
                  country
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.companyCreate;
    } catch (error) {
      console.error("Error creating company:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyCreate };