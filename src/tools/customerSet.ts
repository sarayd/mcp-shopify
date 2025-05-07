import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AddressInputSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  company: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string().optional()
});

const CustomerInputSchema = z.object({
  addresses: z.array(AddressInputSchema).optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  id: z.string(),
  lastName: z.string().optional(),
  locale: z.string().optional(),
  note: z.string().optional(),
  phone: z.string().optional(),
  tags: z.array(z.string()).optional(),
  taxExempt: z.boolean().optional(),
  taxExemptions: z.array(z.enum([
    'FEDERAL_GOVERNMENT',
    'STATE_GOVERNMENT',
    'OTHER',
    'DIPLOMATIC',
    'INDUSTRIAL_EQUIPMENT',
    'MANUFACTURING',
    'RESALE',
    'REDUCED_RATED',
    'POINT_OF_SALE_EXEMPT'
  ])).optional()
});

const CustomerSetInputSchema = z.object({
  input: CustomerInputSchema
});

type CustomerSetInput = z.infer<typeof CustomerSetInputSchema>;

let shopifyClient: GraphQLClient;

const customerSet = {
  name: "customer-set",
  description: "Update a customer's information",
  schema: CustomerSetInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerSetInput) => {
    const query = gql`
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            id
            firstName
            lastName
            email
            phone
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
      return response.customerUpdate;
    } catch (error) {
      console.error("Error updating customer:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerSet };