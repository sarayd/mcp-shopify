import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const CustomerBuysItemsSchema = z.object({
  products: z.object({
    productVariants: z.array(z.object({ id: z.string() })).optional(),
    productIds: z.array(z.string()).optional()
  }).optional(),
  collections: z.object({
    collectionIds: z.array(z.string())
  }).optional()
});

const CustomerGetsValueSchema = z.object({
  percentage: z.number().min(0).max(100).optional(),
  amount: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  quantity: z.number().int().min(1)
});

const DiscountAutomaticBxgyInputSchema = z.object({
  title: z.string(),
  startsAt: z.string(),
  endsAt: z.string().optional(),
  usageLimit: z.number().int().min(1).optional(),
  minimumRequirementSubtotal: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }).optional(),
  customerBuys: z.object({
    items: CustomerBuysItemsSchema,
    value: z.object({
      quantity: z.number().int().min(1)
    })
  }),
  customerGets: z.object({
    items: CustomerBuysItemsSchema,
    value: CustomerGetsValueSchema
  }),
  customerSelection: z.object({
    customers: z.object({
      customerIds: z.array(z.string())
    }).optional(),
    segments: z.object({
      segmentIds: z.array(z.string())
    }).optional()
  }).optional()
});

type DiscountAutomaticBxgyInput = z.infer<typeof DiscountAutomaticBxgyInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticBxgyCreate = {
  name: "discount-automatic-bxgy-create",
  description: "Create an automatic buy X get Y discount",
  schema: DiscountAutomaticBxgyInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticBxgyInput) => {
    const query = gql`
      mutation discountAutomaticBxgyCreate($input: DiscountAutomaticBxgyInput!) {
        discountAutomaticBxgyCreate(automaticBxgy: $input) {
          automaticDiscountNode {
            id
            automaticDiscount {
              ... on DiscountAutomaticBxgy {
                title
                startsAt
                endsAt
                status
                summary
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

    try {
      const response: any = await shopifyClient.request(query, { input });
      return response.discountAutomaticBxgyCreate;
    } catch (error) {
      console.error("Error creating BXGY discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticBxgyCreate };