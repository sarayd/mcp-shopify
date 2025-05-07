import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PriceInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const AppUsageRecordCreateInputSchema = z.object({
  description: z.string(),
  price: PriceInputSchema,
  shopDomain: z.string(),
  subscriptionLineItemId: z.string().optional()
});

type AppUsageRecordCreateInput = z.infer<typeof AppUsageRecordCreateInputSchema>;

let shopifyClient: GraphQLClient;

const appUsageRecordCreate = {
  name: "app-usage-record-create",
  description: "Create an app usage record",
  schema: AppUsageRecordCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AppUsageRecordCreateInput) => {
    const query = gql`
      mutation AppUsageRecordCreate($input: AppUsageRecordCreateInput!) {
        appUsageRecordCreate(input: $input) {
          appUsageRecord {
            id
            description
            createdAt
            price {
              amount
              currencyCode
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.appUsageRecordCreate;
    } catch (error) {
      console.error("Error creating app usage record:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { appUsageRecordCreate };