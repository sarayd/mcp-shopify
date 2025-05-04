import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const RecipientAttributesSchema = z.object({
  email: z.string().email().optional(),
  message: z.string().optional(),
  name: z.string().optional()
});

const GiftCardCreateInputSchema = z.object({
  initialValue: z.number().positive(),
  code: z.string().min(8).max(20).regex(/^[a-zA-Z0-9]+$/).optional(),
  customerId: z.string().optional(),
  expiresOn: z.string().datetime().optional(),
  note: z.string().optional(),
  recipientAttributes: RecipientAttributesSchema.optional(),
  templateSuffix: z.string().optional()
});

const InputSchema = z.object({
  input: GiftCardCreateInputSchema
});

type InputType = z.infer<typeof InputSchema>;

let shopifyClient: GraphQLClient;

const giftCardCreate = {
  name: "gift-card-create",
  description: "Create a new gift card",
  schema: InputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: InputType) => {
    const query = gql`
      mutation giftCardCreate($input: GiftCardCreateInput!) {
        giftCardCreate(input: $input) {
          giftCard {
            id
            balance {
              amount
              currencyCode
            }
            code
            expiresOn
            initialValue {
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

    try {
      const response: any = await shopifyClient.request(query, { input: input.input });
      return response.giftCardCreate;
    } catch (error) {
      console.error("Error creating gift card:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { giftCardCreate };