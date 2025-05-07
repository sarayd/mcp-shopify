import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MenuDeleteInputSchema = z.object({
  id: z.string().min(1, "Menu ID is required")
});
type MenuDeleteInput = z.infer<typeof MenuDeleteInputSchema>;

let shopifyClient: GraphQLClient;

const menuDelete = {
  name: "menu-delete",
  description: "Delete a navigation menu",
  schema: MenuDeleteInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MenuDeleteInput) => {
    const query = gql`
      mutation menuDelete($input: MenuDeleteInput!) {
        menuDelete(input: $input) {
          deletedMenuId
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = {
      input: {
        id: input.id
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.menuDelete;
    } catch (error) {
      console.error("Error deleting menu:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { menuDelete };