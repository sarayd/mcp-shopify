import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const CartTransformItemAddInputSchema = z.object({
  merchandiseId: z.string(),
  quantity: z.number(),
  price: z.object({
    fixedPrice: MoneyInputSchema.optional(),
    percentageDecrease: z.number().optional()
  }).optional()
});

const CartTransformItemRemoveInputSchema = z.object({
  merchandiseId: z.string(),
  quantity: z.number().optional()
});

const CartTransformInputSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  automaticApply: z.boolean().optional(),
  orderSubtotalMinimum: MoneyInputSchema.optional(),
  orderSubtotalMaximum: MoneyInputSchema.optional(),
  targetItems: z.object({
    includeAll: z.boolean().optional(),
    productVariants: z.array(z.object({ id: z.string() })).optional(),
    collections: z.array(z.object({ id: z.string() })).optional()
  }).optional(),
  transformItems: z.object({
    add: z.array(CartTransformItemAddInputSchema).optional(),
    remove: z.array(CartTransformItemRemoveInputSchema).optional()
  }).optional()
});

const CartTransformCreateInputSchema = z.object({
  input: z.object({
    cartTransform: CartTransformInputSchema
  })
});

type CartTransformCreateInput = z.infer<typeof CartTransformCreateInputSchema>;

let shopifyClient: GraphQLClient;

const cartTransformCreate = {
  name: "cart-transform-create",
  description: "Create a cart transform",
  schema: CartTransformCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CartTransformCreateInput) => {
    const query = gql`
      mutation cartTransformCreate($input: CartTransformCreateInput!) {
        cartTransformCreate(input: $input) {
          cartTransform {
            id
            title
            description
            enabled
            automaticApply
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
      return response.cartTransformCreate;
    } catch (error) {
      console.error("Error creating cart transform:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { cartTransformCreate };