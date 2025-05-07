import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountInputSchema = z.object({
  value: z.number(),
  valueType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']),
  description: z.string().optional(),
  title: z.string().optional()
});

const OrderEditAddLineItemDiscountInputSchema = z.object({
  orderEditId: z.string().min(1, "Order edit ID is required"),
  lineItemId: z.string().min(1, "Line item ID is required"),
  discount: DiscountInputSchema
});

type OrderEditAddLineItemDiscountInput = z.infer<typeof OrderEditAddLineItemDiscountInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditAddLineItemDiscount = {
  name: "order-edit-add-line-item-discount",
  description: "Add a discount to a line item in an order edit",
  schema: OrderEditAddLineItemDiscountInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditAddLineItemDiscountInput) => {
    const query = gql`
      mutation orderEditAddLineItemDiscount($input: OrderEditAddLineItemDiscountInput!) {
        orderEditAddLineItemDiscount(input: $input) {
          calculatedLineItem {
            id
            discountedUnitPrice {
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
      input: {
        orderEditId: input.orderEditId,
        lineItemId: input.lineItemId,
        discount: input.discount
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditAddLineItemDiscount;
    } catch (error) {
      console.error("Error adding line item discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditAddLineItemDiscount };