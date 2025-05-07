import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReturnLineItemInputSchema = z.object({
  lineItemId: z.string(),
  quantity: z.number().int().positive(),
  locationId: z.string().optional(),
  restockType: z.enum(['RETURN_TO_STOCK', 'NO_RESTOCK']).optional(),
  note: z.string().optional()
});

const ShippingMethodInputSchema = z.object({
  code: z.string().optional(),
  label: z.string().optional(),
  trackingNumbers: z.array(z.string()).optional()
});

const ReturnCreateInputSchema = z.object({
  orderId: z.string(),
  allowPartial: z.boolean().optional(),
  notifyCustomer: z.boolean().optional(),
  returnLineItems: z.array(ReturnLineItemInputSchema),
  shippingMethod: ShippingMethodInputSchema.optional()
});

type ReturnCreateInput = z.infer<typeof ReturnCreateInputSchema>;

let shopifyClient: GraphQLClient;

const returnCreate = {
  name: "return-create",
  description: "Create a return for an order",
  schema: ReturnCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReturnCreateInput) => {
    const query = gql`
      mutation returnCreate($input: ReturnCreateInput!) {
        returnCreate(input: $input) {
          return {
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
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.returnCreate;
    } catch (error) {
      console.error("Error creating return:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { returnCreate };