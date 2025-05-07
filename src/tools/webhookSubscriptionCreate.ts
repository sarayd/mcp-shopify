import { gql, GraphQLClient } from "graphql-request";
import { z } from "zod";

const WebhookSubscriptionInputSchema = z.object({
  callbackUrl: z.string().url(),
  format: z.enum(['JSON', 'XML']).optional(),
  includeFields: z.array(z.string()).optional(),
  metafieldNamespaces: z.array(z.string()).optional()
});

const WebhookSubscriptionCreateInputSchema = z.object({
  topic: z.enum([
    'APP_PURCHASES_ONE_TIME', 'APP_SUBSCRIPTIONS', 'APP_UNINSTALLED',
    'BULK_OPERATIONS_FINISH', 'CUSTOMERS_DATA_REQUEST',
    'CUSTOMERS_MARKETING_CONSENT_UPDATE', 'CUSTOMERS_UPDATE',
    'DISPUTES_CREATE', 'DISPUTES_UPDATE', 'DOMAINS_CREATE',
    'DOMAINS_DESTROY', 'DOMAINS_UPDATE', 'DRAFT_ORDERS_CREATE',
    'DRAFT_ORDERS_DELETE', 'DRAFT_ORDERS_UPDATE', 'FULFILLMENTS_CREATE',
    'FULFILLMENTS_UPDATE', 'INVENTORY_ITEMS_CREATE', 'INVENTORY_ITEMS_DELETE',
    'INVENTORY_ITEMS_UPDATE', 'INVENTORY_LEVELS_CONNECT',
    'INVENTORY_LEVELS_DISCONNECT', 'INVENTORY_LEVELS_UPDATE',
    'LOCALES_CREATE', 'LOCALES_UPDATE', 'LOCATIONS_CREATE',
    'LOCATIONS_DELETE', 'LOCATIONS_UPDATE', 'MARKETS_CREATE',
    'MARKETS_DELETE', 'MARKETS_UPDATE', 'ORDER_TRANSACTIONS_CREATE',
    'ORDERS_CANCELLED', 'ORDERS_CREATE', 'ORDERS_DELETE',
    'ORDERS_EDITED', 'ORDERS_FULFILLED', 'ORDERS_PAID',
    'ORDERS_PARTIALLY_FULFILLED', 'ORDERS_UPDATED', 'PRODUCTS_CREATE',
    'PRODUCTS_DELETE', 'PRODUCTS_UPDATE', 'PROFILES_CREATE',
    'PROFILES_DELETE', 'PROFILES_UPDATE', 'REFUNDS_CREATE',
    'SCHEDULED_PRODUCT_LISTINGS_ADD', 'SCHEDULED_PRODUCT_LISTINGS_REMOVE',
    'SCHEDULED_PRODUCT_LISTINGS_UPDATE', 'SELLING_PLAN_GROUPS_CREATE',
    'SELLING_PLAN_GROUPS_DELETE', 'SELLING_PLAN_GROUPS_UPDATE',
    'SHOP_UPDATE', 'SUBSCRIPTION_BILLING_ATTEMPTS_FAILURE',
    'SUBSCRIPTION_BILLING_ATTEMPTS_SUCCESS', 'SUBSCRIPTION_CONTRACTS_CREATE',
    'SUBSCRIPTION_CONTRACTS_UPDATE', 'TENDER_TRANSACTIONS_CREATE',
    'THEMES_CREATE', 'THEMES_DELETE', 'THEMES_PUBLISH', 'THEMES_UPDATE'
  ]),
  webhookSubscription: WebhookSubscriptionInputSchema
});

type WebhookSubscriptionCreateInput = z.infer<typeof WebhookSubscriptionCreateInputSchema>;

let shopifyClient: GraphQLClient;

const webhookSubscriptionCreate = {
  name: "webhook-subscription-create",
  description: "Create a webhook subscription",
  schema: WebhookSubscriptionCreateInputSchema,

  initialize(client: GraphQLClient) {
    shopifyClient = client;
  },

  execute: async (input: WebhookSubscriptionCreateInput) => {
    const query = gql`
      mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
        webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
          webhookSubscription {
            id
            endpoint {
              __typename
              ... on WebhookHttpEndpoint {
                callbackUrl
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
      topic: input.topic,
      webhookSubscription: input.webhookSubscription
    };

    try {
      const response: any = await shopifyClient.request(query, variables);
      return response.webhookSubscriptionCreate;
    } catch (error) {
      console.error("Error creating webhook subscription:", error);
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
};

export { webhookSubscriptionCreate };