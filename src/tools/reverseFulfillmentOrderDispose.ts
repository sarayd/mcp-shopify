import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ReverseFulfillmentOrderDisposeLineInputSchema = z.object({
  dispositionType: z.enum(['RESTOCKED', 'DISPOSED', 'RETURNED_TO_CUSTOMER']),
  locationId: z.string().optional(),
  quantity: z.number().int().positive(),
  reverseFulfillmentOrderLineItemId: z.string()
});

const ReverseFulfillmentOrderDisposeInputSchema = z.object({
  input: z.object({
    dispositionLines: z.array(ReverseFulfillmentOrderDisposeLineInputSchema).nonempty("At least one disposition line is required")
  })
});

type ReverseFulfillmentOrderDisposeInput = z.infer<typeof ReverseFulfillmentOrderDisposeInputSchema>;

let shopifyClient: GraphQLClient;

const reverseFulfillmentOrderDispose = {
  name: "reverse-fulfillment-order-dispose",
  description: "Dispose of items in a reverse fulfillment order",
  schema: ReverseFulfillmentOrderDisposeInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ReverseFulfillmentOrderDisposeInput) => {
    const query = gql`
      mutation reverseFulfillmentOrderDispose($input: ReverseFulfillmentOrderDisposeInput!) {
        reverseFulfillmentOrderDispose(input: $input) {
          reverseFulfillmentOrder {
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

    try {
      const response: any = await shopifyClient.request(query, input);
      return response.reverseFulfillmentOrderDispose;
    } catch (error) {
      console.error("Error executing reverseFulfillmentOrderDispose:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { reverseFulfillmentOrderDispose };