import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const DiscountAutomaticActivateInputSchema = z.object({
  id: z.string().min(1, "Discount ID is required")
});

type DiscountAutomaticActivateInput = z.infer<typeof DiscountAutomaticActivateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticActivate = {
  name: "discount-automatic-activate",
  description: "Activate an automatic discount",
  schema: DiscountAutomaticActivateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticActivateInput) => {
    const query = gql`
      mutation discountAutomaticActivate($id: ID!) {
        discountAutomaticActivate(id: $id) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticNode {
                status
                title
                startsAt
                endsAt
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

    const variables = { id: input.id };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.discountAutomaticActivate;
    } catch (error) {
      console.error("Error activating automatic discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticActivate };