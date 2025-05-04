import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const GiftCardDebitInputSchema = z.object({
  id: z.string().min(1, "Gift card ID is required"),
  debitAmount: MoneyInputSchema,
  note: z.string().optional(),
  processedAt: z.string().datetime().optional()
});

type GiftCardDebitInput = z.infer<typeof GiftCardDebitInputSchema>;

let shopifyClient: GraphQLClient;

const giftCardDebit = {
  name: "gift-card-debit",
  description: "Debit an amount from a gift card",
  schema: GiftCardDebitInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: GiftCardDebitInput) => {
    const query = gql`
      mutation giftCardDebit($id: ID!, $debitAmount: MoneyInput!, $note: String, $processedAt: DateTime) {
        giftCardDebit(
          id: $id
          debitAmount: $debitAmount
          note: $note
          processedAt: $processedAt
        ) {
          giftCardDebitTransaction {
            id
            amount {
              amount
              currencyCode
            }
            processedAt
            note
            giftCard {
              id
              balance {
                amount
                currencyCode
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
      debitAmount: input.debitAmount,
      note: input.note,
      processedAt: input.processedAt
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.giftCardDebit;
    } catch (error) {
      console.error("Error debiting gift card:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { giftCardDebit };