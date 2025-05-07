import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DataSaleOptOutInputSchema = z.object({
  anonymizeCustomerData: z.boolean().optional(),
  anonymizeSubscriberData: z.boolean().optional(),
  deleteCustomerData: z.boolean().optional(),
  deleteSubscriberData: z.boolean().optional(),
  shopDomain: z.string().min(1, "Shop domain is required")
});
type DataSaleOptOutInput = z.infer<typeof DataSaleOptOutInputSchema>;

let shopifyClient: GraphQLClient;

const dataSaleOptOut = {
  name: "data-sale-opt-out",
  description: "Submit a data sale opt-out request for a shop",
  schema: DataSaleOptOutInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DataSaleOptOutInput) => {
    const query = gql`
      mutation dataSaleOptOut($input: DataSaleOptOutInput!) {
        dataSaleOptOut(input: $input) {
          dataSaleOptOutUserErrors {
            field
            message
          }
          job {
            id
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.dataSaleOptOut;
    } catch (error) {
      console.error("Error executing dataSaleOptOut:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { dataSaleOptOut };