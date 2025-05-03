import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating company location tax settings
const CompanyLocationTaxSettingsUpdateInputSchema = z.object({
  companyLocationId: z.string().min(1, "Company location ID is required"),
  taxSettings: z
    .object({
      taxExempt: z.boolean().optional()
    })
    .optional()
});

type CompanyLocationTaxSettingsUpdateInput = z.infer<
  typeof CompanyLocationTaxSettingsUpdateInputSchema
>;

// Will be initialized in index.tsx
let shopifyClient: GraphQLClient;

const companyLocationTaxSettingsUpdate = {
  name: "company-location-tax-settings-update",
  description: "Update tax settings for a company location in Shopify",
  schema: CompanyLocationTaxSettingsUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: CompanyLocationTaxSettingsUpdateInput) => {
    try {
      const { companyLocationId, taxSettings } = input;

      // Convert ID to GID format if not already
      const formattedId = companyLocationId.startsWith("gid://")
        ? companyLocationId
        : `gid://shopify/CompanyLocation/${companyLocationId}`;

      const query = gql`
        mutation companyLocationTaxSettingsUpdate($input: CompanyLocationTaxSettingsInput!) {
          companyLocationTaxSettingsUpdate(input: $input) {
            taxSettings {
              taxExempt
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
          companyLocationId: formattedId,
          ...taxSettings
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        companyLocationTaxSettingsUpdate: {
          taxSettings: {
            taxExempt: boolean;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.companyLocationTaxSettingsUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update tax settings: ${data.companyLocationTaxSettingsUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { taxSettings: updatedTaxSettings } = data.companyLocationTaxSettingsUpdate;
      return {
        taxSettings: updatedTaxSettings
          ? {
              taxExempt: updatedTaxSettings.taxExempt
            }
          : null,
        companyLocationId: formattedId
      };
    } catch (error) {
      console.error("Error updating tax settings:", error);
      throw new Error(
        `Failed to update tax settings: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { companyLocationTaxSettingsUpdate };