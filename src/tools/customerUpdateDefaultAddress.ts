import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerUpdateDefaultAddressInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  addressId: z.string().min(1, "Address ID is required")
});
type CustomerUpdateDefaultAddressInput = z.infer<typeof CustomerUpdateDefaultAddressInputSchema>;

let shopifyClient: GraphQLClient;

const customerUpdateDefaultAddress = {
  name: "customer-update-default-address",
  description: "Update a customer's default address",
  schema: CustomerUpdateDefaultAddressInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerUpdateDefaultAddressInput) => {
    const query = gql`
      mutation customerUpdateDefaultAddress($customerId: ID!, $addressId: ID!) {
        customerUpdateDefaultAddress(customerId: $customerId, addressId: $addressId) {
          customer {
            id
            defaultAddress {
              id
              address1
              city
              province
              country
              zip
              firstName
              lastName
              phone
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
      customerId: input.customerId,
      addressId: input.addressId
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.customerUpdateDefaultAddress;
    } catch (error) {
      console.error("Error updating customer default address:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { customerUpdateDefaultAddress };