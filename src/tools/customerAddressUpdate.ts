import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerAddressInputSchema = z.object({
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
type CustomerAddressInput = z.infer<typeof CustomerAddressInputSchema>;

const CustomerAddressUpdateInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  id: z.string().min(1, "Address ID is required"),
  address: CustomerAddressInputSchema
});
type CustomerAddressUpdateInput = z.infer<typeof CustomerAddressUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const customerAddressUpdate = {
  name: "customer-address-update",
  description: "Update a customer's address",
  schema: CustomerAddressUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerAddressUpdateInput) => {
    const query = gql`
      mutation customerAddressUpdate($customerId: ID!, $id: ID!, $address: MailingAddressInput!) {
        customerAddressUpdate(customerId: $customerId, id: $id, address: $address) {
          customerAddress {
            id
            address1
            address2
            city
            company
            country
            countryCode
            firstName
            lastName
            phone
            province
            provinceCode
            zip
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      customerId: input.customerId,
      id: input.id,
      address: input.address
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerAddressUpdate;
    } catch (error) {
      console.error("Error updating customer address:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerAddressUpdate };