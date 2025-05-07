import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ProductOptionUpdateInputSchema = z.object({
  id: z.string().min(1, "Option ID is required"),
  name: z.string().optional(),
  position: z.number().int().positive().optional(),
  values: z.array(z.string()).optional()
});
type ProductOptionUpdateInput = z.infer<typeof ProductOptionUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const productOptionUpdate = {
  name: "product-option-update",
  description: "Update a product option",
  schema: ProductOptionUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ProductOptionUpdateInput) => {
    const query = gql`
      mutation productOptionUpdate($id: ID!, $name: String, $position: Int, $values: [String!]) {
        productOptionUpdate(input: {
          id: $id,
          name: $name,
          position: $position,
          values: $values
        }) {
          productOption {
            id
            name
            position
            values
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
      name: input.name,
      position: input.position,
      values: input.values
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.productOptionUpdate;
    } catch (error) {
      console.error("Error updating product option:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { productOptionUpdate };