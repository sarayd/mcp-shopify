import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const MetafieldInputSchema = z.object({
  key: z.string(),
  namespace: z.string(),
  value: z.string(),
  type: z.string()
}).optional();

const ValidationCreateInputSchema = z.object({
  input: z.object({
    blockOnFailure: z.boolean().optional(),
    enable: z.boolean().optional(),
    functionId: z.string(),
    metafields: z.array(MetafieldInputSchema).optional(),
    title: z.string().optional()
  })
});

type ValidationCreateInput = z.infer<typeof ValidationCreateInputSchema>;

let shopifyClient: GraphQLClient;

const validationCreate = {
  name: "validation-create",
  description: "Create a validation for a function",
  schema: ValidationCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ValidationCreateInput) => {
    const query = gql`
      mutation validationCreate($input: ValidationCreateInput!) {
        validationCreate(input: $input) {
          validation {
            id
            title
            functionId
            blockOnFailure
            enabled
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
      return response.validationCreate;
    } catch (error) {
      console.error("Error creating validation:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { validationCreate };