import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const GiftCardUpdateInputSchema = z.object({
  customerId: z.string().optional(),
  expiresOn: z.string().optional(),
  note: z.string().optional(),
  disabled: z.boolean().optional(),
  templateSuffix: z.string().optional()
});
type GiftCardUpdateInput = z.infer<typeof GiftCardUpdateInputSchema>;

const GiftCardUpdateToolInputSchema = z.object({
  id: z.string().min(1, "Gift card ID is required"),
  input: GiftCardUpdateInputSchema
});
type GiftCardUpdateToolInput = z.infer<typeof GiftCardUpdateToolInputSchema>;

let shopifyClient: GraphQLClient;

const giftCardUpdate = {
  name: "gift-card-update",
  description: "Update a gift card's properties",
  schema: GiftCardUpdateToolInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: GiftCardUpdateToolInput) => {
    const query = gql`
      mutation giftCardUpdate($id: ID!, $input: GiftCardUpdateInput!) {
        giftCardUpdate(id: $id, input: $input) {
          giftCard {
            id
            balance {
              amount
              currencyCode
            }
            customer {
              id
            }
            disabled
            expiresOn
            initialValue {
              amount
              currencyCode
            }
            note
            templateSuffix
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
      return response.giftCardUpdate;
    } catch (error) {
      console.error("Error updating gift card:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { giftCardUpdate };