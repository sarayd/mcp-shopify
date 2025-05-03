import type { GraphQLClient } from "graphql-request";
import { gql } from "graphql-request";
import { z } from "zod";

// Input schema for updating a free shipping discount code
const DiscountCodeFreeShippingUpdateInputSchema = z.object({
  id: z.string().min(1, "Discount code ID is required"),
  title: z.string().optional(),
  code: z.string().optional(),
  minimumRequirement: z
    .object({
      amount: z.string().optional(),
      currencyCode: z.string().optional()
    })
    .optional()
});

type DiscountCodeFreeShippingUpdateInput = z.infer<
  typeof DiscountCodeFreeShippingUpdateInputSchema
>;

// Will be initialized in index.ts
let shopifyClient: GraphQLClient;

const discountCodeFreeShippingUpdate = {
  name: "discount-code-free-shipping-update",
  description: "Update a free shipping discount code in Shopify",
  schema: DiscountCodeFreeShippingUpdateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountCodeFreeShippingUpdateInput) => {
    try {
      const { id, title, code, minimumRequirement } = input;

      // Convert discount code ID to GID format if not already
      const formattedDiscountId = id.startsWith("gid://")
        ? id
        : `gid://shopify/DiscountCode/${id}`;

      const query = gql`
        mutation discountCodeFreeShippingUpdate($id: ID!, $input: DiscountCodeFreeShippingInput!) {
          discountCodeFreeShippingUpdate(id: $id, input: $input) {
            discountCode {
              id
              title
              code
              minimumRequirement {
                greaterThanOrEqualTo {
                  amount
                  currencyCode
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

      const variables = {
        id: formattedDiscountId,
        input: {
          title,
          code,
          minimumRequirement: minimumRequirement
            ? {
                greaterThanOrEqualTo: {
                  amount: minimumRequirement.amount,
                  currencyCode: minimumRequirement.currencyCode
                }
              }
            : null
        }
      };

      const data = (await shopifyClient.request(query, variables)) as {
        discountCodeFreeShippingUpdate: {
          discountCode: {
            id: string;
            title: string | null;
            code: string;
            minimumRequirement: {
              greaterThanOrEqualTo: { amount: string; currencyCode: string } | null;
            } | null;
          } | null;
          userErrors: Array<{ field: string; message: string }>;
        };
      };

      if (data.discountCodeFreeShippingUpdate.userErrors.length > 0) {
        throw new Error(
          `Failed to update discount code: ${data.discountCodeFreeShippingUpdate.userErrors
            .map((e) => `${e.field}: ${e.message}`)
            .join(", ")}`
        );
      }

      const { discountCode } = data.discountCodeFreeShippingUpdate;
      return {
        discountCode: discountCode
          ? {
              id: discountCode.id,
              title: discountCode.title,
              code: discountCode.code,
              minimumRequirement: discountCode.minimumRequirement?.greaterThanOrEqualTo
                ? {
                    amount: discountCode.minimumRequirement.greaterThanOrEqualTo.amount,
                    currencyCode: discountCode.minimumRequirement.greaterThanOrEqualTo.currencyCode
                  }
                : null
            }
          : null
      };
    } catch (error) {
      console.error("Error updating discount code:", error);
      throw new Error(
        `Failed to update discount code: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
};

export { discountCodeFreeShippingUpdate };