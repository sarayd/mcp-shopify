import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const AppRecurringPricingDetailsSchema = z.object({
  price: z.object({
    amount: z.number(),
    currencyCode: z.string()
  }),
  interval: z.enum(['ANNUAL', 'EVERY_30_DAYS'])
});

const LineItemSchema = z.object({
  plan: z.object({
    appRecurringPricingDetails: AppRecurringPricingDetailsSchema
  })
});

const AppSubscriptionCreateInputSchema = z.object({
  name: z.string().min(1, "Name is required"),
  lineItems: z.array(LineItemSchema).nonempty("At least one line item is required"),
  test: z.boolean().optional(),
  trialDays: z.number().int().nonnegative().optional(),
  returnUrl: z.string().min(1, "Return URL is required")
});

type AppSubscriptionCreateInput = z.infer<typeof AppSubscriptionCreateInputSchema>;

let shopifyClient: GraphQLClient;

const appSubscriptionCreate = {
  name: "app-subscription-create",
  description: "Create an app subscription",
  schema: AppSubscriptionCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: AppSubscriptionCreateInput) => {
    const query = gql`
      mutation appSubscriptionCreate($input: AppSubscriptionCreateInput!) {
        appSubscriptionCreate(input: $input) {
          appSubscription {
            id
            name
            status
            test
            trialDays
          }
          confirmationUrl
          userErrors {
            field
            message
          }
        }
      }
    `;
    const variables = { input };
    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.appSubscriptionCreate;
    } catch (error) {
      console.error("Error creating app subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { appSubscriptionCreate };