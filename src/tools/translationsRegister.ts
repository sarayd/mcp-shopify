import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for registering translations
const TranslationInputSchema = z.object({
  resourceId: z.string().min(1, "Resource ID is required"),
  translations: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        locale: z.string().min(1, "Locale is required"),
        value: z.string().min(1, "Value is required"),
        translatableContentDigest: z
          .string()
          .min(1, "translatableContentDigest is required"),
        marketId: z.string().optional()
      })
    )
    .min(1, "At least one translation is required"),
});

type TranslationsRegisterInput = z.infer<typeof TranslationInputSchema>;

let shopifyClient: GraphQLClient;

const translationsRegister = {
  name: "translations-register",
  description: "Create or update translations for a resource in Shopify",
  schema: TranslationInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: TranslationsRegisterInput) => {
    try {
      const { resourceId, translations } = input;

      const query = gql`
        mutation translationsRegister($resourceId: ID!, $translations: [TranslationInput!]!) {
          translationsRegister(resourceId: $resourceId, translations: $translations) {
            userErrors {
              field
              message
            }
            translations {
              key
              value
              market {
                id
                name
              }
            }
          }
        }
      `;

      const variables = { resourceId, translations };
      const data = (await shopifyClient.request(query, variables)) as {
        translationsRegister: {
          userErrors: Array<{ field: string; message: string }>;
          translations: Array<{
            key: string;
            value: string;
            market: { id: string; name: string } | null;
          }>;
        };
      };

      if (data.translationsRegister.userErrors.length > 0) {
        throw new Error(
          `Failed to register translations: ${data.translationsRegister.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      return {
        translations: data.translationsRegister.translations.map((t) => ({
          key: t.key,
          value: t.value,
          market: t.market ? { id: t.market.id, name: t.market.name } : null
        }))
      };
    } catch (error) {
      console.error("Error registering translations:", error);
      throw new Error(
        `Failed to register translations: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { translationsRegister };
