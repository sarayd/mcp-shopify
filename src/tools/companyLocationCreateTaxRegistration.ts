import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const TaxRegistrationInputSchema = z.object({
  taxNumber: z.string(),
  taxNumberNormalized: z.string().optional(),
  expiresOn: z.string().optional(),
  registrationDate: z.string().optional(),
  type: z.enum(['VAT', 'GST', 'OTHER']),
  subType: z.string().optional()
});

const CompanyLocationCreateTaxRegistrationInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company location ID is required"),
  taxRegistration: TaxRegistrationInputSchema
});

type CompanyLocationCreateTaxRegistrationInput = z.infer<typeof CompanyLocationCreateTaxRegistrationInputSchema>;

let shopifyClient: GraphQLClient;

const companyLocationCreateTaxRegistration = {
  name: "company-location-create-tax-registration",
  description: "Create a tax registration for a company location",
  schema: CompanyLocationCreateTaxRegistrationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationCreateTaxRegistrationInput) => {
    const query = gql`
      mutation companyLocationCreateTaxRegistration($companyLocationId: ID!, $taxRegistration: TaxRegistrationInput!) {
        companyLocationCreateTaxRegistration(
          companyLocationId: $companyLocationId
          taxRegistration: $taxRegistration
        ) {
          companyLocationTaxRegistration {
            id
            taxNumber
            taxNumberNormalized
            expiresOn
            registrationDate
            type
            subType
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
      taxRegistration: input.taxRegistration
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.companyLocationCreateTaxRegistration;
    } catch (error) {
      console.error("Error creating company location tax registration:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { companyLocationCreateTaxRegistration };