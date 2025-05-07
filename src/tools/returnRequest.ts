import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnLineItemInputSchema = z.object({
  lineItemId: z.string(),
  quantity: z.number().int().positive(),
  returnReason: z.string().optional(),
  returnReasonNote: z.string().optional()
});

const MoneyInputSchema = z.object({
  amount: z.number(),
  currencyCode: z.string()
});

const ReturnRequestInputSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  returnLineItems: z.array(ReturnLineItemInputSchema).nonempty("At least one return line item is required"),
  returnShippingFee: MoneyInputSchema.optional(),
  notifyCustomer: z.boolean().optional()
});

type ReturnRequestInput = z.infer<typeof ReturnRequestInputSchema>;

let shopifyClient: GraphQLClient;

const returnRequest = {
  name: "return-request",
  description: "Create a return request for an order",
  schema: ReturnRequestInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnRequestInput) => {
    const query = gql`
      mutation returnRequest($input: ReturnRequestInput!) {
        returnRequest(input: $input) {
          return {
            id
            status
            returnLineItems(first: 10) {
              edges {
                node {
                  id
                  quantity
                  returnReason
                  returnReasonNote
                }
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
      input: {
        orderId: input.orderId,
        returnLineItems: input.returnLineItems,
        returnShippingFee: input.returnShippingFee,
        notifyCustomer: input.notifyCustomer
      }
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.returnRequest;
    } catch (error) {
      console.error("Error creating return request:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnRequest };