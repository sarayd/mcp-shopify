import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const ValidationDeleteInputSchema = z.object({
  id: z.string().min(1, "ID is required"),
  shopId: z.string().optional()
});
type ValidationDeleteInput = z.infer<typeof ValidationDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const validationDelete = {
  name: "validation-delete",
  description: "Delete a validation",
  schema: ValidationDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ValidationDeleteInput) => {
    const query = gql`
      mutation validationDelete($input: ValidationDeleteInput!) {
        validationDelete(input: $input) {
          deletedId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id,
        shopId: input.shopId
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.validationDelete;
    } catch (error) {
      console.error("Error deleting validation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { validationDelete };