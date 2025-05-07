import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const PriceInputSchema = z.object({
  amount: z.number().positive(),
  currencyCode: z.string().min(1)
});

const AppPurchaseOneTimeCreateInputSchema = z.object({
  input: z.object({
    name: z.string().min(1),
    price: PriceInputSchema,
    returnUrl: z.string().url(),
    test: z.boolean().optional()
  })
});

type AppPurchaseOneTimeCreateInput = z.infer<typeof AppPurchaseOneTimeCreateInputSchema>;

let shopifyClient: GraphQLClient;

const appPurchaseOneTimeCreate = {
  name: "app-purchase-one-time-create",
  description: "Creates a one-time app purchase",
  schema: AppPurchaseOneTimeCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AppPurchaseOneTimeCreateInput) => {
    const query = gql`
      mutation appPurchaseOneTimeCreate($input: AppPurchaseOneTimeCreateInput!) {
        appPurchaseOneTimeCreate(input: $input) {
          appPurchaseOneTime {
            id
            name
            price {
              amount
              currencyCode
            }
            test
            createdAt
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.appPurchaseOneTimeCreate;
    } catch (error) {
      console.error("Error creating one-time app purchase:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { appPurchaseOneTimeCreate };