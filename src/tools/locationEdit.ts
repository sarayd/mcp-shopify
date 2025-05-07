import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AddressInputSchema = z.object({
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string().optional()
}).optional();

const MetafieldInputSchema = z.object({
  description: z.string().optional(),
  id: z.string().optional(),
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
});

const LocationEditInputSchema = z.object({
  id: z.string().min(1, "Location ID is required"),
  input: z.object({
    address: AddressInputSchema,
    fulfillsOnlineOrders: z.boolean().optional(),
    metafields: z.array(MetafieldInputSchema).optional(),
    name: z.string().optional()
  })
});

type LocationEditInput = z.infer<typeof LocationEditInputSchema>;

let shopifyClient: GraphQLClient;

const locationEdit = {
  name: "location-edit",
  description: "Edit a location in Shopify",
  schema: LocationEditInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationEditInput) => {
    const query = gql`
      mutation locationEdit($id: ID!, $input: LocationInput!) {
        locationEdit(id: $id, input: $input) {
          location {
            id
            name
            address {
              address1
              address2
              city
              country
              countryCode
              phone
              province
              provinceCode
              zip
            }
            fulfillsOnlineOrders
            metafields(first: 10) {
              edges {
                node {
                  id
                  namespace
                  key
                  value
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

    const variables = {
      id: input.id,
      input: input.input
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.locationEdit;
    } catch (error) {
      console.error("Error editing location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationEdit };