import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating validation rules
const ValidationUpdateInputSchema = z.object({
  id: z.string().min(1, "Validation ID is required"),
  rules: z
    .object({
      ruleType: z.string().optional(),
      value: z.string().optional()
    })
    .optional()
});

type ValidationUpdateInput = z.infer<typeof ValidationUpdateInputSchema>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const validationUpdate = {
  name: "validation-update",
  description: "Update validation rules in Shopify",
  schema: ValidationUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: ValidationUpdateInput) => {
    try {
      const { id, rules } = input;

      // Convert ID to GID format if not already
      const formattedId = id.startsWith("gid://") ? id : `gid://shopify/Validation/${id}`;

      const query = gql`
        mutation validationUpdate($input: ValidationInput!) {
          validationUpdate(input: $input) {
            validation {
              id
              ruleType
              value
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
          id: formattedId,
          ...rules
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        validationUpdate: {
          validation: {
            id: string;
            ruleType: string | null;
            value: string | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.validationUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update validation: ${data.validationUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { validation } = data.validationUpdate;
      return {
        validation: validation
          ? {
              id: validation.id,
              ruleType: validation.ruleType,
              value: validation.value
            }
          : null
      };
    } catch (error) {
      console.error("Error updating validation:", error);
      throw new Error(
        `Failed to update validation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { validationUpdate };