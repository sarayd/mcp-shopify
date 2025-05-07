import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditAddVariantInputSchema = z.object({
  id: z.string().min(1, "Order edit ID is required"),
  variantId: z.string().min(1, "Variant ID is required"),
  quantity: z.number().int().positive("Quantity must be a positive integer"),
  allowDuplicates: z.boolean().optional()
});
type OrderEditAddVariantInput = z.infer<typeof OrderEditAddVariantInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditAddVariant = {
  name: "order-edit-add-variant",
  description: "Add a variant to an order edit",
  schema: OrderEditAddVariantInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditAddVariantInput) => {
    const query = gql`
      mutation orderEditAddVariant($id: ID!, $variantId: ID!, $quantity: Int!, $allowDuplicates: Boolean) {
        orderEditAddVariant(
          id: $id
          variantId: $variantId
          quantity: $quantity
          allowDuplicates: $allowDuplicates
        ) {
          calculatedOrder {
            id
            totalPrice {
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
    const variables = {
      id: input.id,
      variantId: input.variantId,
      quantity: input.quantity,
      allowDuplicates: input.allowDuplicates
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditAddVariant;
    } catch (error) {
      console.error("Error adding variant to order edit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditAddVariant };