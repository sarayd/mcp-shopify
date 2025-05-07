import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const StoreCreditAccountDebitInputSchema = z.object({
  amount: MoneyInputSchema,
  customerId: z.string().min(1, "Customer ID is required"),
  note: z.string().optional(),
  test: z.boolean().optional()
});

type StoreCreditAccountDebitInput = z.infer<typeof StoreCreditAccountDebitInputSchema>;

let shopifyClient: GraphQLClient;

const storeCreditAccountDebit = {
  name: "store-credit-account-debit",
  description: "Debit a customer's store credit account",
  schema: StoreCreditAccountDebitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: StoreCreditAccountDebitInput) => {
    const query = gql`
      mutation storeCreditAccountDebit($input: StoreCreditAccountDebitInput!) {
        storeCreditAccountDebit(input: $input) {
          storeCreditAccountTransaction {
            id
            amount {
              amount
              currencyCode
            }
            test
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
      return response.storeCreditAccountDebit;
    } catch (error) {
      console.error("Error executing storeCreditAccountDebit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { storeCreditAccountDebit };