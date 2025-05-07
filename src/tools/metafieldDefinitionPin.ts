import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldDefinitionPinInputSchema = z.object({
  definitionId: z.string().min(1, "Definition ID is required"),
  pinnedPosition: z.number().int().nonnegative().optional()
});
type MetafieldDefinitionPinInput = z.infer<typeof MetafieldDefinitionPinInputSchema>;

let shopifyClient: GraphQLClient;

const metafieldDefinitionPin = {
  name: "metafield-definition-pin",
  description: "Pin a metafield definition to a specific position",
  schema: MetafieldDefinitionPinInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: MetafieldDefinitionPinInput) => {
    const query = gql`
      mutation metafieldDefinitionPin($input: MetafieldDefinitionPinInput!) {
        metafieldDefinitionPin(input: $input) {
          pinnedDefinition {
            id
            name
            key
            namespace
            pinnedPosition
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
        definitionId: input.definitionId,
        pinnedPosition: input.pinnedPosition
      }
    };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.metafieldDefinitionPin;
    } catch (error) {
      console.error("Error pinning metafield definition:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { metafieldDefinitionPin };