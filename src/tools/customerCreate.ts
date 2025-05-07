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

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const PrivateMetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  valueInput: z.object({
    value: z.string(),
    valueType: z.enum(['STRING', 'INTEGER', 'JSON_STRING'])
  })
});

const CustomerCreateInputSchema = z.object({
  input: z.object({
    acceptsMarketing: z.boolean().optional(),
    addresses: z.array(AddressInputSchema).optional(),
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    locale: z.string().optional(),
    marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN', 'UNKNOWN']).optional(),
    metafields: z.array(MetafieldInputSchema).optional(),
    note: z.string().optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
    privateMetafields: z.array(PrivateMetafieldInputSchema).optional(),
    tags: z.array(z.string()).optional(),
    taxExempt: z.boolean().optional(),
    taxExemptions: z.array(z.enum([
      'CA_STATUS_CARD_EXEMPTION',
      'CA_BC_RESELLER_EXEMPTION',
      'CA_MB_RESELLER_EXEMPTION',
      'CA_SK_RESELLER_EXEMPTION',
      'CA_BC_COMMERCIAL_FISHERY_EXEMPTION',
      'CA_MB_COMMERCIAL_FISHERY_EXEMPTION',
      'CA_NS_COMMERCIAL_FISHERY_EXEMPTION',
      'CA_PE_COMMERCIAL_FISHERY_EXEMPTION',
      'CA_SK_COMMERCIAL_FISHERY_EXEMPTION',
      'CA_BC_PRODUCTION_AND_MACHINERY_EXEMPTION',
      'CA_SK_PRODUCTION_AND_MACHINERY_EXEMPTION',
      'CA_BC_SUB_CONTRACTOR_EXEMPTION',
      'CA_SK_SUB_CONTRACTOR_EXEMPTION',
      'CA_BC_CONTRACTOR_EXEMPTION',
      'CA_SK_CONTRACTOR_EXEMPTION',
      'CA_ON_PURCHASE_EXEMPTION',
      'CA_MB_FARMER_EXEMPTION',
      'CA_NS_FARMER_EXEMPTION',
      'CA_SK_FARMER_EXEMPTION'
    ])).optional()
  })
});

type CustomerCreateInput = z.infer<typeof CustomerCreateInputSchema>;

let shopifyClient: GraphQLClient;

const customerCreate = {
  name: "customer-create",
  description: "Create a new customer in Shopify",
  schema: CustomerCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerCreateInput) => {
    const query = gql`
      mutation customerCreate($input: CustomerCreateInput!) {
        customerCreate(input: $input) {
          customer {
            id
            email
            firstName
            lastName
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
      return response.customerCreate;
    } catch (error) {
      console.error("Error creating customer:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerCreate };