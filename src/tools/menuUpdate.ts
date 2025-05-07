import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MenuItemInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  url: z.string().optional(),
  type: z.enum(['URL', 'PAGE', 'CATALOG', 'COLLECTION', 'PRODUCT', 'SEARCH']).optional()
});
type MenuItemInput = z.infer<typeof MenuItemInputSchema>;

const MenuUpdateInputSchema = z.object({
  id: z.string().min(1, "Menu ID is required"),
  input: z.object({
    handle: z.string().optional(),
    items: z.array(MenuItemInputSchema).optional(),
    title: z.string().optional()
  })
});
type MenuUpdateInput = z.infer<typeof MenuUpdateInputSchema>;

let shopifyClient: GraphQLClient;

const menuUpdate = {
  name: "menu-update",
  description: "Update a navigation menu",
  schema: MenuUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MenuUpdateInput) => {
    const query = gql`
      mutation menuUpdate($id: ID!, $input: MenuInput!) {
        menuUpdate(id: $id, input: $input) {
          menu {
            id
            handle
            title
            items {
              id
              title
              url
              type
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
      input: input.input
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.menuUpdate;
    } catch (error) {
      console.error("Error updating menu:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { menuUpdate };