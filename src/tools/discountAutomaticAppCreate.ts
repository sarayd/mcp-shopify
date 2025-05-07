import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AutomaticAppDiscountInputSchema = z.object({
  title: z.string().min(1, "Title is required"),
  functionId: z.string().min(1, "Function ID is required"),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  metafields: z.array(z.object({
    key: z.string(),
    namespace: z.string(),
    type: z.string(),
    value: z.string()
  })).optional(),
  combinesWith: z.object({
    orderDiscounts: z.boolean().optional(),
    productDiscounts: z.boolean().optional(),
    shippingDiscounts: z.boolean().optional()
  }).optional()
});

const DiscountAutomaticAppCreateInputSchema = z.object({
  automaticAppDiscount: AutomaticAppDiscountInputSchema
});

type DiscountAutomaticAppCreateInput = z.infer<typeof DiscountAutomaticAppCreateInputSchema>;

let shopifyClient: GraphQLClient;

const discountAutomaticAppCreate = {
  name: "discount-automatic-app-create",
  description: "Create an automatic app discount",
  schema: DiscountAutomaticAppCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: DiscountAutomaticAppCreateInput) => {
    const query = gql`
      mutation discountAutomaticAppCreate($automaticAppDiscount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $automaticAppDiscount) {
          automaticAppDiscount {
            discountId
            title
            startsAt
            endsAt
            status
            appDiscountType {
              appKey
              functionId
            }
            combinesWith {
              orderDiscounts
              productDiscounts
              shippingDiscounts
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
      const response: any = await shopifyClient.request(query, input);
      return response.discountAutomaticAppCreate;
    } catch (error) {
      console.error("Error creating automatic app discount:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { discountAutomaticAppCreate };