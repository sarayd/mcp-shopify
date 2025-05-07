import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const OrderEditAddCustomItemInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().positive("Quantity must be positive"),
  title: z.string().min(1, "Title is required"),
  requiresShipping: z.boolean().optional(),
  taxable: z.boolean().optional(),
  weight: z.number().optional(),
  weightUnit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']).optional()
});
type OrderEditAddCustomItemInput = z.infer<typeof OrderEditAddCustomItemInputSchema>;

let shopifyClient: GraphQLClient;

const orderEditAddCustomItem = {
  name: "order-edit-add-custom-item",
  description: "Add a custom item to an order edit",
  schema: OrderEditAddCustomItemInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: OrderEditAddCustomItemInput) => {
    const query = gql`
      mutation orderEditAddCustomItem($input: OrderEditAddCustomItemInput!) {
        orderEditAddCustomItem(input: $input) {
          calculatedOrder {
            id
          }
          calculatedLineItem {
            id
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
        orderId: input.orderId,
        price: input.price,
        quantity: input.quantity,
        title: input.title,
        requiresShipping: input.requiresShipping,
        taxable: input.taxable,
        weight: input.weight,
        weightUnit: input.weightUnit
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.orderEditAddCustomItem;
    } catch (error) {
      console.error("Error adding custom item to order edit:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { orderEditAddCustomItem };