import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for voiding a transaction
const TransactionVoidInputSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required")
});

type TransactionVoidInput = z.infer<typeof TransactionVoidInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const transactionVoid = {
  name: "transaction-void",
  description: "Void a transaction in Shopify",
  schema: TransactionVoidInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: TransactionVoidInput) => {
    try {
      const { transactionId } = input;

      // Convert ID to GID format if not already
      const formattedId = transactionId.startsWith("gid://")
        ? transactionId
        : `gid://shopify/PaymentTransaction/${transactionId}`;

      const query = gql`
        mutation transactionVoid($transactionId: ID!) {
          transactionVoid(transactionId: $transactionId) {
            voidedTransaction {
              id
              status
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

      const variables = { transactionId: formattedId };

      const data = (await shopifyClient.request(query, variables)) as {
        transactionVoid: {
          voidedTransaction: {
            id: string;
            status: string;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.transactionVoid.userErrors.length > 0) {
        throw new Error(
          `Failed to void transaction: ${data.transactionVoid.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { voidedTransaction } = data.transactionVoid;
      return {
        voidedTransaction: voidedTransaction
          ? {
              id: voidedTransaction.id,
              status: voidedTransaction.status
            }
          : null
      };
    } catch (error) {
      console.error("Error voiding transaction:", error);
      throw new Error(
        `Failed to void transaction: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { transactionVoid };