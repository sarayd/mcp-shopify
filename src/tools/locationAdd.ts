import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AddressSchema = z.object({
  address1: z.string(),
  address2: z.string().optional(),
  city: z.string(),
  country: z.string(),
  countryCode: z.string().optional(),
  phone: z.string().optional(),
  province: z.string().optional(),
  provinceCode: z.string().optional(),
  zip: z.string()
});

const MetafieldSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  type: z.string(),
  value: z.string()
}).optional();

const LocationAddInputSchema = z.object({
  input: z.object({
    address: AddressSchema,
    fulfillsOnlineOrders: z.boolean().optional(),
    name: z.string(),
    metafields: z.array(MetafieldSchema).optional()
  })
});

type LocationAddInput = z.infer<typeof LocationAddInputSchema>;

let shopifyClient: GraphQLClient;

const locationAdd = {
  name: "location-add",
  description: "Add a new location to a Shopify store",
  schema: LocationAddInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: LocationAddInput) => {
    const query = gql`
      mutation locationAdd($input: LocationAddInput!) {
        locationAdd(input: $input) {
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
      return response.locationAdd;
    } catch (error) {
      console.error("Error adding location:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { locationAdd };