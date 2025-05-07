import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const StoreCreditAccountCreditInputSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  amount: MoneyInputSchema,
  note: z.string().optional(),
  test: z.boolean().optional()
});
type StoreCreditAccountCreditInput = z.infer<typeof StoreCreditAccountCreditInputSchema>;

let shopifyClient: GraphQLClient;

const storeCreditAccountCredit = {
  name: "store-credit-account-credit",
  description: "Add credit to a store credit account",
  schema: StoreCreditAccountCreditInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StoreCreditAccountCreditInput) => {
    const query = gql`
      mutation storeCreditAccountCredit($input: StoreCreditAccountCreditInput!) {
        storeCreditAccountCredit(input: $input) {
          storeCreditAccountTransaction {
            id
            amount {
              amount
              currencyCode
            }
            note
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
      return response.storeCreditAccountCredit;
    } catch (error) {
      console.error("Error executing storeCreditAccountCredit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { storeCreditAccountCredit };