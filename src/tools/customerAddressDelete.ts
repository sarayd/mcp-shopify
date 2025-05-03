import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for deleting a customer's address
const CustomerAddressDeleteInputSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  addressId: z.string().min(1, "Address ID is required")
});

type CustomerAddressDeleteInput = z.infer<typeof CustomerAddressDeleteInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const customerAddressDelete = {
  name: "customer-address-delete",
  description: "Delete a customer's address in Shopify",
  schema: CustomerAddressDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CustomerAddressDeleteInput) => {
    try {
      const { customerId, addressId } = input;

      // Convert IDs to GID format if not already
      const formattedCustomerId = customerId.startsWith("gid://")
        ? customerId
        : `gid://shopify/Customer/${customerId}`;
      const formattedAddressId = addressId.startsWith("gid://")
        ? addressId
        : `gid://shopify/MailingAddress/${addressId}`;

      const query = gql`
        mutation customerAddressDelete($customerId: ID!, $addressId: ID!) {
          customerAddressDelete(customerId: $customerId, addressId: $addressId) {
            deletedCustomerAddressId
            customer {
              id
              email
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = {
        customerId: formattedCustomerId,
        addressId: formattedAddressId
      };

      const data = (await shopifyClient.request(query, variables)) as {
        customerAddressDelete: {
          deletedCustomerAddressId: string | null;
          customer: { id: string; email: string } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.customerAddressDelete.userErrors.length > 0) {
        throw new Error(
          `Failed to delete customer address: ${data.customerAddressDelete.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        deletedAddressId: data.customerAddressDelete.deletedCustomerAddressId,
        customer: data.customerAddressDelete.customer
          ? { id: data.customerAddressDelete.customer.id, email: data.customerAddressDelete.customer.email }
          : null
      };
    } catch (error) {
      console.error("Error deleting customer address:", error);
      throw new Error(
        `Failed to delete customer address: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { customerAddressDelete };