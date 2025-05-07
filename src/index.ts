import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { GraphQLClient } from "graphql-request";
import minimist from "minimist";
import { z } from "zod";

// Import existing tools
import { adjustInventory } from "./tools/adjustInventory.js";
import { connectInventoryToLocation } from "./tools/connectInventoryToLocation.js";
import { createCollection } from "./tools/createCollection.js";
import { createCustomer } from "./tools/createCustomer.js";
import { createFulfillment } from "./tools/createFulfillment.js";
import { createMetafield } from "./tools/createMetafield.js";
import { createOrder } from "./tools/createOrder.js";
import { createProduct } from "./tools/createProduct.js";
import { deleteProductMedia } from "./tools/deleteProductMedia.js";
import { disconnectInventoryFromLocation } from "./tools/disconnectInventoryFromLocation.js";
import { getCustomerOrders } from "./tools/getCustomerOrders.js";
import { getCustomers } from "./tools/getCustomers.js";
import { getInventoryItems } from "./tools/getInventoryItems.js";
import { getInventoryLevels } from "./tools/getInventoryLevels.js";
import { getLocations } from "./tools/getLocations.js";
import { getOrderById } from "./tools/getOrderById.js";
import { getOrders } from "./tools/getOrders.js";
import { getProductById } from "./tools/getProductById.js";
import { getProducts } from "./tools/getProducts.js";
import { productCreateMedia } from "./tools/productCreateMedia.js";
import { productReorderMedia } from "./tools/productReorderMedia.js";
import { productUpdateMedia } from "./tools/productUpdateMedia.js";
import { setInventoryTracking } from "./tools/setInventoryTracking.js";
import { updateCustomer } from "./tools/updateCustomer.js";
import { updateOrder } from "./tools/updateOrder.js";
import { orderCancel } from "./tools/orderCancel.js";
import { orderCapture } from "./tools/orderCapture.js";
import { orderClose } from "./tools/orderClose.js";

// Import new tools
import { productVariantDetachMedia } from "./tools/productVariantDetachMedia.js";
import { subscriptionBillingCycleBulkSearch } from "./tools/subscriptionBillingCycleBulkSearch.js";
import { pubSubServerPixelUpdate } from "./tools/pubSubServerPixelUpdate.js";
import { customerAddressDelete } from "./tools/customerAddressDelete.js";
import { productUpdate } from "./tools/productUpdate.js";
import { pageDelete } from "./tools/pageDelete.js";
import { discountCodeFreeShippingUpdate } from "./tools/discountCodeFreeShippingUpdate.js";
import { articleCreate } from "./tools/articleCreate.js";
import { metafieldDefinitionUnpin } from "./tools/metafieldDefinitionUnpin.js";
import { publishableUnpublishToCurrentChannel } from "./tools/publishableUnpublishToCurrentChannel.js";
import { validationUpdate } from "./tools/validationUpdate.js";
import { companyAssignCustomerAsContact } from "./tools/companyAssignCustomerAsContact.js";
import { customerPaymentMethodCreditCardCreate } from "./tools/customerPaymentMethodCreditCardCreate.js";
import { combinedListingUpdate } from "./tools/combinedListingUpdate.js";
import { deliveryProfileRemove } from "./tools/deliveryProfileRemove.js";
import { transactionVoid } from "./tools/transactionVoid.js";
import { paymentCustomizationUpdate } from "./tools/paymentCustomizationUpdate.js";
import { urlRedirectBulkDeleteByIds } from "./tools/urlRedirectBulkDeleteByIds.js";
import { companyLocationTaxSettingsUpdate } from "./tools/companyLocationTaxSettingsUpdate.js";
import { priceListCreate } from "./tools/priceListCreate.js";
import { subscriptionBillingCycleEditsDelete } from "./tools/subscriptionBillingCycleEditsDelete.js";
import { companyContactRevokeRole } from "./tools/companyContactRevokeRole.js";
// Import new tools (first batch, 15 provided)
import { abandonmentEmailStateUpdate } from "./tools/abandonmentEmailStateUpdate.js";
import { abandonmentUpdateActivitiesDeliveryStatuses } from "./tools/abandonmentUpdateActivitiesDeliveryStatuses.js";
import { appSubscriptionCancel } from "./tools/appSubscriptionCancel.js";
import { appSubscriptionCreate } from "./tools/appSubscriptionCreate.js";
import { articleUpdate } from "./tools/articleUpdate.js";
import { blogDelete } from "./tools/blogDelete.js";
import { bulkOperationCancel } from "./tools/bulkOperationCancel.js";
import { bulkOperationRunQuery } from "./tools/bulkOperationRunQuery.js";
import { carrierServiceDelete } from "./tools/carrierServiceDelete.js";
import { cartTransformCreate } from "./tools/cartTransformCreate.js";
import { catalogContextUpdate } from "./tools/catalogContextUpdate.js";
import { catalogDelete } from "./tools/catalogDelete.js";
import { checkoutBrandingUpsert } from "./tools/checkoutBrandingUpsert.js";
import { collectionAddProducts } from "./tools/collectionAddProducts.js";
import { collectionPublish } from "./tools/collectionPublish.js";
// Import new tools (first batch, remaining 5)
import { collectionReorderProducts } from "./tools/collectionReorderProducts.js";
import { collectionUpdate } from "./tools/collectionUpdate.js";
import { commentApprove } from "./tools/commentApprove.js";
import { commentDelete } from "./tools/commentDelete.js";
import { companiesDelete } from "./tools/companiesDelete.js";

// Import new tools (second batch, 15 provided)
import { companyAddressDelete } from "./tools/companyAddressDelete.js";
import { companyAssignMainContact } from "./tools/companyAssignMainContact.js";
import { companyContactAssignRole } from "./tools/companyContactAssignRole.js";
import { companyContactAssignRoles } from "./tools/companyContactAssignRoles.js";
import { companyContactCreate } from "./tools/companyContactCreate.js";
import { companyContactRemoveFromCompany } from "./tools/companyContactRemoveFromCompany.js";
import { companyDelete } from "./tools/companyDelete.js";
import { companyLocationAssignAddress } from "./tools/companyLocationAssignAddress.js";
import { companyLocationAssignRoles } from "./tools/companyLocationAssignRoles.js";
import { companyLocationAssignTaxExemptions } from "./tools/companyLocationAssignTaxExemptions.js";
import { companyLocationCreateTaxRegistration } from "./tools/companyLocationCreateTaxRegistration.js";
import { companyLocationDelete } from "./tools/companyLocationDelete.js";
import { companyLocationRemoveStaffMembers } from "./tools/companyLocationRemoveStaffMembers.js";
import { companyLocationRevokeTaxExemptions } from "./tools/companyLocationRevokeTaxExemptions.js";
import { companyLocationsDelete } from "./tools/companyLocationsDelete.js";
import { consentPolicyUpdate } from "./tools/consentPolicyUpdate.js";
import { customerDelete } from "./tools/customerDelete.js";
import { customerEmailMarketingConsentUpdate } from "./tools/customerEmailMarketingConsentUpdate.js";
import { customerPaymentMethodCreditCardUpdate } from "./tools/customerPaymentMethodCreditCardUpdate.js";
import { customerPaymentMethodGetUpdateUrl } from "./tools/customerPaymentMethodGetUpdateUrl.js";
import { customerPaymentMethodRemoteCreate } from "./tools/customerPaymentMethodRemoteCreate.js";
import { customerPaymentMethodRevoke } from "./tools/customerPaymentMethodRevoke.js";
import { customerPaymentMethodSendUpdateEmail } from "./tools/customerPaymentMethodSendUpdateEmail.js";
import { customerReplaceTaxExemptions } from "./tools/customerReplaceTaxExemptions.js";
import { customerRequestDataErasure } from "./tools/customerRequestDataErasure.js";
import { customerSendAccountInviteEmail } from "./tools/customerSendAccountInviteEmail.js";
import { customerSet } from "./tools/customerSet.js";
import { delegateAccessTokenDestroy } from "./tools/delegateAccessTokenDestroy.js";
import { deliveryCustomizationActivation } from "./tools/deliveryCustomizationActivation.js";
import { deliveryCustomizationCreate } from "./tools/deliveryCustomizationCreate.js";
import { deliveryCustomizationUpdate } from "./tools/deliveryCustomizationUpdate.js";
import { deliveryPromiseParticipantsUpdate } from "./tools/deliveryPromiseParticipantsUpdate.js";
import { deliveryPromiseProviderUpsert } from "./tools/deliveryPromiseProviderUpsert.js";
import { deliverySettingUpdate } from "./tools/deliverySettingUpdate.js";
import { deliveryShippingOriginAssign } from "./tools/deliveryShippingOriginAssign.js";
import { discountAutomaticActivate } from "./tools/discountAutomaticActivate.js";
import { discountAutomaticBasicCreate } from "./tools/discountAutomaticBasicCreate.js";
import { discountAutomaticBasicUpdate } from "./tools/discountAutomaticBasicUpdate.js";
import { discountAutomaticBxgyUpdate } from "./tools/discountAutomaticBxgyUpdate.js";
import { discountAutomaticDeactivate } from "./tools/discountAutomaticDeactivate.js";
import { discountAutomaticDelete } from "./tools/discountAutomaticDelete.js";
import { discountCodeBasicCreate } from "./tools/discountCodeBasicCreate.js";
import { discountCodeBasicUpdate } from "./tools/discountCodeBasicUpdate.js";
import { discountCodeBulkDeactivate } from "./tools/discountCodeBulkDeactivate.js";
import { discountCodeBxgyCreate } from "./tools/discountCodeBxgyCreate.js";
import { discountCodeBxgyUpdate } from "./tools/discountCodeBxgyUpdate.js";
import { discountCodeDeactivate } from "./tools/discountCodeDeactivate.js";
import { discountCodeFreeShippingCreate } from "./tools/discountCodeFreeShippingCreate.js";
import { discountCodeRedeemCodeBulkDelete } from "./tools/discountCodeRedeemCodeBulkDelete.js";
import { discountRedeemCodeBulkAdd } from "./tools/discountRedeemCodeBulkAdd.js";
import { disputeEvidenceUpdate } from "./tools/disputeEvidenceUpdate.js";
import { draftOrderCreateMerchantCheckout } from "./tools/draftOrderCreateMerchantCheckout.js";
import { draftOrderDelete } from "./tools/draftOrderDelete.js";
import { draftOrderInvoicePreview } from "./tools/draftOrderInvoicePreview.js";
import { fileAcknowledgeUpdateFailed } from "./tools/fileAcknowledgeUpdateFailed.js";


// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Load environment variables from .env file (if it exists)
dotenv.config();

// Define environment variables - from command line or .env file
const SHOPIFY_ACCESS_TOKEN =
  argv.accessToken || process.env.SHOPIFY_ACCESS_TOKEN;
const MYSHOPIFY_DOMAIN = argv.domain || process.env.MYSHOPIFY_DOMAIN;

// Store in process.env for backwards compatibility
process.env.SHOPIFY_ACCESS_TOKEN = SHOPIFY_ACCESS_TOKEN;
process.env.MYSHOPIFY_DOMAIN = MYSHOPIFY_DOMAIN;

// Validate required environment variables
if (!SHOPIFY_ACCESS_TOKEN) {
  console.error("Error: SHOPIFY_ACCESS_TOKEN is required.");
  console.error("Please provide it via command line argument or .env file.");
  console.error("  Command line: --accessToken=your_token");
  process.exit(1);
}

if (!MYSHOPIFY_DOMAIN) {
  console.error("Error: MYSHOPIFY_DOMAIN is required.");
  console.error("Please provide it via command line argument or .env file.");
  console.error("  Command line: --domain=your-store.myshopify.com");
  process.exit(1);
}

// Create Shopify GraphQL client
const shopifyClient = new GraphQLClient(
  `https://${MYSHOPIFY_DOMAIN}/admin/api/2025-04/graphql.json`,
  {
    headers: {
      "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
      "Content-Type": "application/json"
    }
  }
);

// Initialize existing tools with shopifyClient
getProducts.initialize(shopifyClient);
getProductById.initialize(shopifyClient);
getCustomers.initialize(shopifyClient);
getOrders.initialize(shopifyClient);
getOrderById.initialize(shopifyClient);
updateOrder.initialize(shopifyClient);
getCustomerOrders.initialize(shopifyClient);
updateCustomer.initialize(shopifyClient);
createCustomer.initialize(shopifyClient);
createOrder.initialize(shopifyClient);
createFulfillment.initialize(shopifyClient);
createProduct.initialize(shopifyClient);
createCollection.initialize(shopifyClient);
createMetafield.initialize(shopifyClient);
deleteProductMedia.initialize(shopifyClient);
productCreateMedia.initialize(shopifyClient);
productReorderMedia.initialize(shopifyClient);
productUpdateMedia.initialize(shopifyClient);
getInventoryLevels.initialize(shopifyClient);
getInventoryItems.initialize(shopifyClient);
getLocations.initialize(shopifyClient);
adjustInventory.initialize(shopifyClient);
setInventoryTracking.initialize(shopifyClient);
connectInventoryToLocation.initialize(shopifyClient);
disconnectInventoryFromLocation.initialize(shopifyClient);
orderCancel.initialize(shopifyClient);
orderCapture.initialize(shopifyClient);
orderClose.initialize(shopifyClient);

// Initialize new tools with shopifyClient
productVariantDetachMedia.initialize(shopifyClient);
subscriptionBillingCycleBulkSearch.initialize(shopifyClient);
pubSubServerPixelUpdate.initialize(shopifyClient);
customerAddressDelete.initialize(shopifyClient);
productUpdate.initialize(shopifyClient);
pageDelete.initialize(shopifyClient);
discountCodeFreeShippingUpdate.initialize(shopifyClient);
articleCreate.initialize(shopifyClient);
metafieldDefinitionUnpin.initialize(shopifyClient);
publishableUnpublishToCurrentChannel.initialize(shopifyClient);
validationUpdate.initialize(shopifyClient);
companyAssignCustomerAsContact.initialize(shopifyClient);
customerPaymentMethodCreditCardCreate.initialize(shopifyClient);
combinedListingUpdate.initialize(shopifyClient);
deliveryProfileRemove.initialize(shopifyClient);
transactionVoid.initialize(shopifyClient);
paymentCustomizationUpdate.initialize(shopifyClient);
urlRedirectBulkDeleteByIds.initialize(shopifyClient);
companyLocationTaxSettingsUpdate.initialize(shopifyClient);
priceListCreate.initialize(shopifyClient);
subscriptionBillingCycleEditsDelete.initialize(shopifyClient);
companyContactRevokeRole.initialize(shopifyClient);
customerEmailMarketingConsentUpdate.initialize(shopifyClient);
customerPaymentMethodCreditCardUpdate.initialize(shopifyClient);
customerPaymentMethodGetUpdateUrl.initialize(shopifyClient);
customerPaymentMethodRemoteCreate.initialize(shopifyClient);
customerPaymentMethodRevoke.initialize(shopifyClient);
customerPaymentMethodSendUpdateEmail.initialize(shopifyClient);
customerReplaceTaxExemptions.initialize(shopifyClient);
customerRequestDataErasure.initialize(shopifyClient);
customerSendAccountInviteEmail.initialize(shopifyClient);
customerSet.initialize(shopifyClient);
delegateAccessTokenDestroy.initialize(shopifyClient);
deliveryCustomizationActivation.initialize(shopifyClient);
deliveryCustomizationCreate.initialize(shopifyClient);
deliveryCustomizationUpdate.initialize(shopifyClient);
deliveryPromiseParticipantsUpdate.initialize(shopifyClient);
deliveryPromiseProviderUpsert.initialize(shopifyClient);
deliverySettingUpdate.initialize(shopifyClient);
deliveryShippingOriginAssign.initialize(shopifyClient);
discountAutomaticActivate.initialize(shopifyClient);
discountAutomaticBasicCreate.initialize(shopifyClient);
discountAutomaticBasicUpdate.initialize(shopifyClient);
discountAutomaticBxgyUpdate.initialize(shopifyClient);
discountAutomaticDeactivate.initialize(shopifyClient);
discountAutomaticDelete.initialize(shopifyClient);
discountCodeBasicCreate.initialize(shopifyClient);
discountCodeBasicUpdate.initialize(shopifyClient);
discountCodeBulkDeactivate.initialize(shopifyClient);
discountCodeBxgyCreate.initialize(shopifyClient);
discountCodeBxgyUpdate.initialize(shopifyClient);
discountCodeDeactivate.initialize(shopifyClient);
discountCodeFreeShippingCreate.initialize(shopifyClient);
discountCodeRedeemCodeBulkDelete.initialize(shopifyClient);
discountRedeemCodeBulkAdd.initialize(shopifyClient);
disputeEvidenceUpdate.initialize(shopifyClient);
draftOrderCreateMerchantCheckout.initialize(shopifyClient);
draftOrderDelete.initialize(shopifyClient);
draftOrderInvoicePreview.initialize(shopifyClient);
fileAcknowledgeUpdateFailed.initialize(shopifyClient);

// Set up MCP server
const server = new McpServer({
  name: "shopify",
  version: "1.0.0",
  description:
    "MCP Server for Shopify API, enabling interaction with store data through GraphQL API"
});

// Register existing tools
console.error("Registered get-products");
server.tool(
  "get-products",
  {
    searchTitle: z.string().optional(),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getProducts.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

console.error("Registered get-product-by-id");
server.tool(
  "get-product-by-id",
  {
    productId: z.string().min(1)
  },
  async (args) => {
    const result = await getProductById.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

console.error("Registered get-customers");
server.tool(
  "get-customers",
  {
    searchQuery: z.string().optional(),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getCustomers.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get-orders",
  {
    status: z.enum(["any", "open", "closed", "cancelled"]).default("any"),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getOrders.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get-order-by-id",
  {
    orderId: z.string().min(1)
  },
  async (args) => {
    const result = await getOrderById.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "update-order",
  {
    id: z.string().min(1),
    tags: z.array(z.string()).optional(),
    email: z.string().email().optional(),
    note: z.string().optional(),
    customAttributes: z
      .array(
        z.object({
          key: z.string(),
          value: z.string()
        })
      )
      .optional(),
    metafields: z
      .array(
        z.object({
          id: z.string().optional(),
          namespace: z.string().optional(),
          key: z.string().optional(),
          value: z.string(),
          type: z.string().optional()
        })
      )
      .optional(),
    shippingAddress: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        zip: z.string().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await updateOrder.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get-customer-orders",
  {
    customerId: z
      .string()
      .regex(/^\d+$/, "Customer ID must be numeric")
      .describe("Shopify customer ID, numeric excluding gid prefix"),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getCustomerOrders.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "update-customer",
  {
    id: z
      .string()
      .regex(/^\d+$/, "Customer ID must be numeric")
      .describe("Shopify customer ID, numeric excluding gid prefix"),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    tags: z.array(z.string()).optional(),
    note: z.string().optional(),
    taxExempt: z.boolean().optional(),
    metafields: z
      .array(
        z.object({
          id: z.string().optional(),
          namespace: z.string().optional(),
          key: z.string().optional(),
          value: z.string(),
          type: z.string().optional()
        })
      )
      .optional()
  },
  async (args) => {
    const result = await updateCustomer.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "create-customer",
  {
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    taxExempt: z.boolean().optional(),
    smsMarketingConsent: z
      .object({
        marketingState: z.enum(["SUBSCRIBED", "NOT_SUBSCRIBED", "PENDING", "UNSUBSCRIBED"]),
        marketingOptInLevel: z.enum(["SINGLE_OPT_IN", "CONFIRMED_OPT_IN", "UNKNOWN"]).optional()
      })
      .optional()
  },
  async (args) => {
    const result = await createCustomer.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "create-order",
  {
    email: z.string().email().optional(),
    phone: z.string().optional(),
    note: z.string().optional(),
    tags: z.array(z.string()).optional(),
    customAttributes: z
      .array(
        z.object({
          key: z.string(),
          value: z.string()
        })
      )
      .optional(),
    metafields: z
      .array(
        z.object({
          namespace: z.string(),
          key: z.string(),
          value: z.string(),
          type: z.string()
        })
      )
      .optional(),
    lineItems: z
      .array(
        z.object({
          variantId: z.string(),
          quantity: z.number().int().positive(),
          customAttributes: z
            .array(
              z.object({
                key: z.string(),
                value: z.string()
              })
            )
            .optional()
        })
      )
      .nonempty("At least one line item is required"),
    billingAddress: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        zip: z.string().optional()
      })
      .optional(),
    shippingAddress: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        zip: z.string().optional()
      })
      .optional(),
    customerId: z.string().optional(),
    shippingLine: z
      .object({
        title: z.string(),
        price: z.string()
      })
      .optional(),
    taxExempt: z.boolean().optional(),
    presentmentCurrencyCode: z.string().optional()
  },
  async (args) => {
    try {
      let processedArgs = { ...args };
      if (typeof processedArgs.lineItems === "string") {
        try {
          processedArgs.lineItems = JSON.parse(processedArgs.lineItems);
          if (!Array.isArray(processedArgs.lineItems)) {
            processedArgs.lineItems = [processedArgs.lineItems];
          }
        } catch (error) {
          throw new Error("Invalid lineItems format. Expected a valid JSON array.");
        }
      }
      if (!Array.isArray(processedArgs.lineItems)) {
        throw new Error("lineItems must be an array of product variants with quantities");
      }
      processedArgs.lineItems.forEach((item, index) => {
        if (!item.variantId) {
          throw new Error(`Line item at index ${index} is missing variantId`);
        }
        if (!item.quantity || typeof item.quantity !== "number" || item.quantity <= 0) {
          throw new Error(`Line item at index ${index} has invalid quantity. Must be a positive number.`);
        }
      });
      const result = await createOrder.execute(processedArgs);
      return {
        content: [{ type: "text", text: JSON.stringify(result) }]
      };
    } catch (error) {
      throw new Error(`Failed to create order: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);

server.tool(
  "create-fulfillment",
  {
    orderId: z.string().min(1),
    trackingInfo: z
      .object({
        number: z.string().optional(),
        url: z.string().optional(),
        company: z.string().optional()
      })
      .optional(),
    notifyCustomer: z.boolean().default(true),
    lineItems: z
      .array(
        z.object({
          id: z.string().min(1),
          quantity: z.number().int().positive()
        })
      )
      .optional(),
    locationId: z.string().optional(),
    trackingNumbers: z.array(z.string()).optional(),
    trackingUrls: z.array(z.string()).optional(),
    metadata: z
      .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
      .optional()
  },
  async (args) => {
    const result = await createFulfillment.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "create-product",
  {
    title: z.string().min(1, "Title is required"),
    descriptionHtml: z.string().optional(),
    vendor: z.string().optional(),
    productType: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
    options: z
      .array(
        z.object({
          name: z.string().min(1, "Option name is required"),
          values: z.array(z.string()).min(1, "At least one option value is required")
        })
      )
      .optional(),
    variants: z
      .array(
        z.object({
          options: z.array(z.string()),
          price: z.string(),
          sku: z.string().optional(),
          weight: z.number().optional(),
          weightUnit: z.enum(["KILOGRAMS", "GRAMS", "POUNDS", "OUNCES"]).optional(),
          inventoryQuantity: z.number().int().optional(),
          inventoryPolicy: z.enum(["DENY", "CONTINUE"]).optional(),
          inventoryManagement: z.enum(["SHOPIFY", "NOT_MANAGED"]).optional(),
          requiresShipping: z.boolean().optional(),
          taxable: z.boolean().optional(),
          barcode: z.string().optional()
        })
      )
      .optional(),
    images: z
      .array(
        z.object({
          src: z.string().url("Image source must be a valid URL"),
          altText: z.string().optional()
        })
      )
      .optional(),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional()
      })
      .optional(),
    metafields: z
      .array(
        z.object({
          namespace: z.string(),
          key: z.string(),
          value: z.string(),
          type: z.string()
        })
      )
      .optional(),
    collectionsToJoin: z.array(z.string()).optional(),
    giftCard: z.boolean().optional(),
    taxCode: z.string().optional()
  },
  async (args) => {
    const result = await createProduct.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "create-collection",
  {
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    descriptionHtml: z.string().optional(),
    handle: z.string().optional(),
    isPublished: z.boolean().optional(),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional()
      })
      .optional(),
    image: z
      .object({
        src: z.string().url("Image source must be a valid URL"),
        altText: z.string().optional()
      })
      .optional(),
    productsToAdd: z.array(z.string()).optional(),
    sortOrder: z
      .enum([
        "MANUAL",
        "BEST_SELLING",
        "ALPHA_ASC",
        "ALPHA_DESC",
        "PRICE_DESC",
        "PRICE_ASC",
        "CREATED",
        "CREATED_DESC",
        "ID_DESC",
        "RELEVANCE"
      ])
      .optional(),
    templateSuffix: z.string().optional(),
    privateMetafields: z
      .array(
        z.object({
          owner: z.string(),
          namespace: z.string(),
          key: z.string(),
          value: z.string(),
          valueType: z.enum([
            "STRING",
            "INTEGER",
            "JSON_STRING",
            "BOOLEAN",
            "FLOAT",
            "COLOR",
            "DIMENSION",
            "RATING",
            "SINGLE_LINE_TEXT_FIELD",
            "MULTI_LINE_TEXT_FIELD",
            "DATE",
            "DATE_TIME",
            "URL",
            "JSON",
            "VOLUME",
            "WEIGHT"
          ])
        })
      )
      .optional(),
    ruleSet: z
      .object({
        rules: z.array(
          z.object({
            column: z.enum([
              "TAG",
              "TITLE",
              "TYPE",
              "VENDOR",
              "VARIANT_PRICE",
              "VARIANT_COMPARE_AT_PRICE",
              "VARIANT_WEIGHT",
              "VARIANT_INVENTORY",
              "VARIANT_TITLE",
              "IS_PRICE_REDUCED",
              "VARIANT_BARCODE"
            ]),
            relation: z.enum([
              "EQUALS",
              "NOT_EQUALS",
              "GREATER_THAN",
              "LESS_THAN",
              "STARTS_WITH",
              "ENDS_WITH",
              "CONTAINS",
              "NOT_CONTAINS",
              "IS_SET",
              "IS_NOT_SET"
            ]),
            condition: z.string()
          })
        ),
        appliedDisjunctively: z.boolean().default(true)
      })
      .optional(),
    metafields: z
      .array(
        z.object({
          namespace: z.string(),
          key: z.string(),
          value: z.string(),
          type: z.string()
        })
      )
      .optional(),
    publications: z
      .array(
        z.object({
          publicationId: z.string(),
          publishDate: z.string().optional()
        })
      )
      .optional()
  },
  async (args) => {
    const result = await createCollection.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "create-metafield",
  {
    ownerId: z.string().min(1, "Owner ID is required"),
    namespace: z.string().min(1, "Namespace is required"),
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
    type: z.string().min(1, "Type is required"),
    description: z.string().optional(),
    ownerType: z.enum([
      "ARTICLE",
      "BLOG",
      "COLLECTION",
      "CUSTOMER",
      "DRAFTORDER",
      "ORDER",
      "PAGE",
      "PRODUCT",
      "PRODUCTIMAGE",
      "PRODUCTVARIANT",
      "SHOP"
    ]).default("PRODUCT")
  },
  async (args) => {
    const result = await createMetafield.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "delete-product-media",
  {
    mediaIds: z.array(z.string()).nonempty("At least one media ID is required"),
    productId: z.string().min(1, "Product ID is required")
  },
  async (args) => {
    const result = await deleteProductMedia.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "product-create-media",
  {
    media: z
      .array(
        z.object({
          alt: z.string().optional(),
          mediaContentType: z.enum(['VIDEO', 'EXTERNAL_VIDEO', 'MODEL_3D', 'IMAGE']).describe('Type of media: VIDEO, EXTERNAL_VIDEO, MODEL_3D, or IMAGE'),
          originalSource: z.string().describe('URL or path to the media file')
        })
      )
      .nonempty("At least one media object is required"),
    productId: z.string().min(1, "Product ID is required")
  },
  async (args) => {
    const media = args.media.map(m => ({
      alt: m.alt,
      mediaContentType: m.mediaContentType,
      originalSource: m.originalSource
    }));
    
    const result = await productCreateMedia.execute({
      media: media as [
        { mediaContentType: 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D' | 'IMAGE'; originalSource: string; alt?: string },
        ...{ mediaContentType: 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D' | 'IMAGE'; originalSource: string; alt?: string }[]
      ],
      productId: args.productId
    });
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "reorder-product-media",
  {
    id: z.string().min(1, "Product ID is required"),
    moves: z
      .array(
        z.object({
          id: z.string(),
          newPosition: z.number().int().nonnegative()
        })
      )
      .nonempty("At least one move is required")
  },
  async (args) => {
    const result = await productReorderMedia.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "update-product-media",
  {
    id: z.string().min(1, "Product ID is required"),
    media: z
      .array(
        z.object({
          id: z.string(),
          alt: z.string().optional(),
          mediaContentType: z.enum(['VIDEO', 'EXTERNAL_VIDEO', 'MODEL_3D', 'IMAGE']).optional(),
          originalSource: z.string().optional()
        })
      )
      .nonempty("At least one media update is required")
  },
  async (args) => {
    const media = args.media.map(m => ({
      id: m.id,
      alt: m.alt,
      mediaContentType: m.mediaContentType,
      originalSource: m.originalSource || '' // Provide a default empty string if undefined
    }));
    
    const result = await productUpdateMedia.execute({
      id: args.id,
      media: media as [
        { id: string; mediaContentType: 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D' | 'IMAGE'; originalSource: string; alt?: string },
        ...{ id: string; mediaContentType: 'VIDEO' | 'EXTERNAL_VIDEO' | 'MODEL_3D' | 'IMAGE'; originalSource: string; alt?: string }[]
      ]
    });
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "get-inventory-levels",
  {
    locationId: z.string().optional(),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getInventoryLevels.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get-inventory-items",
  {
    query: z.string().optional(),
    productId: z.string().optional(),
    variantId: z.string().optional(),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getInventoryItems.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "get-locations",
  {
    active: z.boolean().optional(),
    limit: z.number().default(10)
  },
  async (args) => {
    const result = await getLocations.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "adjust-inventory",
  {
    inventoryItemId: z.string().min(1, "Inventory item ID is required"),
    availableDelta: z.number().int("Delta must be an integer"),
    locationId: z.string().min(1, "Location ID is required"),
    reason: z.string().optional()
  },
  async (args) => {
    const result = await adjustInventory.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "set-inventory-tracking",
  {
    inventoryItemId: z.string().min(1, "Inventory item ID is required"),
    tracked: z.boolean()
  },
  async (args) => {
    const result = await setInventoryTracking.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "connect-inventory-to-location",
  {
    inventoryItemId: z.string().min(1, "Inventory item ID is required"),
    locationId: z.string().min(1, "Location ID is required"),
    available: z.number().int("Available quantity must be an integer"),
    reason: z.string().optional()
  },
  async (args) => {
    const result = await connectInventoryToLocation.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "disconnect-inventory-from-location",
  {
    inventoryItemId: z.string().min(1, "Inventory item ID is required"),
    locationId: z.string().min(1, "Location ID is required"),
    reason: z.string().optional()
  },
  async (args) => {
    const result = await disconnectInventoryFromLocation.execute(args);
    return {
      content: [{ type: "text", text: JSON.stringify(result) }]
    };
  }
);

server.tool(
  "cancel-order",
  {
    orderId: z.string().min(1),
    reason: z.enum(["CUSTOMER", "DECLINED", "FRAUD", "INVENTORY", "OTHER", "STAFF"]),
    refund: z.boolean(),
    restock: z.boolean(),
    notifyCustomer: z.boolean(),
    staffNote: z.string().optional()
  },
  async (args) => {
    const result = await orderCancel.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "capture-order",
  {
    id: z.string().min(1),
    parentTransactionId: z.string().min(1),
    amount: z.string().min(1),
    currency: z.string().optional(),
    finalCapture: z.boolean().optional()
  },
  async (args) => {
    const result = await orderCapture.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

server.tool(
  "close-order",
  {
    id: z.string().min(1)
  },
  async (args) => {
    const result = await orderClose.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// Register new tools
console.error("Registered product-variant-detach-media");
server.tool(
  "product-variant-detach-media",
  {
    productId: z.string().min(1, "Product ID is required"),
    variantId: z.string().min(1, "Variant ID is required"),
    mediaIds: z.array(z.string()).nonempty("At least one media ID is required")
  },
  async (args) => {
    const result = await productVariantDetachMedia.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered subscription-billing-cycle-bulk-search");
server.tool(
  "subscription-billing-cycle-bulk-search",
  {
    subscriptionContractIds: z
      .array(z.string())
      .nonempty("At least one subscription contract ID is required"),
    searchCriteria: z.string().optional()
  },
  async (args) => {
    const result = await subscriptionBillingCycleBulkSearch.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered pub-sub-server-pixel-update");
server.tool(
  "pub-sub-server-pixel-update",
  {
    pixelId: z.string().min(1, "Pixel ID is required"),
    settings: z
      .object({
        accountId: z.string().optional(),
        enabled: z.boolean().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await pubSubServerPixelUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-address-delete");
server.tool(
  "customer-address-delete",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    addressId: z.string().min(1, "Address ID is required")
  },
  async (args) => {
    const result = await customerAddressDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered product-update");
server.tool(
  "product-update",
  {
    id: z.string().min(1, "Product ID is required"),
    title: z.string().optional(),
    descriptionHtml: z.string().optional(),
    variants: z
      .array(
        z.object({
          id: z.string().min(1, "Variant ID is required"),
          price: z.string().optional(),
          sku: z.string().optional()
        })
      )
      .optional(),
    metafields: z
      .array(
        z.object({
          namespace: z.string().min(1, "Metafield namespace is required"),
          key: z.string().min(1, "Metafield key is required"),
          value: z.string().min(1, "Metafield value is required"),
          type: z.string().min(1, "Metafield type is required")
        })
      )
      .optional()
  },
  async (args) => {
    const result = await productUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered page-delete");
server.tool(
  "page-delete",
  {
    id: z.string().min(1, "Page ID is required")
  },
  async (args) => {
    const result = await pageDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-free-shipping-update");
server.tool(
  "discount-code-free-shipping-update",
  {
    id: z.string().min(1, "Discount code ID is required"),
    title: z.string().optional(),
    code: z.string().optional(),
    minimumRequirement: z
      .object({
        amount: z.string().optional(),
        currencyCode: z.string().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await discountCodeFreeShippingUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered article-create");
server.tool(
  "article-create",
  {
    blogId: z.string().min(1, "Blog ID is required"),
    title: z.string().min(1, "Title is required"),
    content: z.string().optional(),
    author: z.string().optional(),
    published: z.boolean().optional()
  },
  async (args) => {
    const result = await articleCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered metafield-definition-unpin");
server.tool(
  "metafield-definition-unpin",
  {
    id: z.string().min(1, "Metafield definition ID is required")
  },
  async (args) => {
    const result = await metafieldDefinitionUnpin.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered publishable-unpublish-to-current-channel");
server.tool(
  "publishable-unpublish-to-current-channel",
  {
    id: z.string().min(1, "Resource ID is required")
  },
  async (args) => {
    const result = await publishableUnpublishToCurrentChannel.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered validation-update");
server.tool(
  "validation-update",
  {
    id: z.string().min(1, "Validation ID is required"),
    rules: z
      .object({
        ruleType: z.string().optional(),
        value: z.string().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await validationUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-assign-customer-as-contact");
server.tool(
  "company-assign-customer-as-contact",
  {
    companyId: z.string().min(1, "Company ID is required"),
    customerId: z.string().min(1, "Customer ID is required")
  },
  async (args) => {
    const result = await companyAssignCustomerAsContact.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-credit-card-create");
server.tool(
  "customer-payment-method-credit-card-create",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    vaultId: z.string().min(1, "Vault ID is required"),
    billingAddress: z
      .object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        address1: z.string().optional(),
        city: z.string().optional(),
        province: z.string().optional(),
        country: z.string().optional(),
        zip: z.string().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await customerPaymentMethodCreditCardCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered combined-listing-update");
server.tool(
  "combined-listing-update",
  {
    listingId: z.string().min(1, "Listing ID is required"),
    updates: z
      .object({
        title: z.string().optional(),
        price: z.string().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await combinedListingUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-profile-remove");
server.tool(
  "delivery-profile-remove",
  {
    id: z.string().min(1, "Delivery profile ID is required")
  },
  async (args) => {
    const result = await deliveryProfileRemove.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered transaction-void");
server.tool(
  "transaction-void",
  {
    transactionId: z.string().min(1, "Transaction ID is required")
  },
  async (args) => {
    const result = await transactionVoid.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered payment-customization-update");
server.tool(
  "payment-customization-update",
  {
    id: z.string().min(1, "Customization ID is required"),
    rules: z
      .object({
        paymentMethodId: z.string().optional(),
        enabled: z.boolean().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await paymentCustomizationUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered url-redirect-bulk-delete-by-ids");
server.tool(
  "url-redirect-bulk-delete-by-ids",
  {
    ids: z.array(z.string()).nonempty("At least one redirect ID is required")
  },
  async (args) => {
    const result = await urlRedirectBulkDeleteByIds.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-tax-settings-update");
server.tool(
  "company-location-tax-settings-update",
  {
    companyLocationId: z.string().min(1, "Company location ID is required"),
    taxSettings: z
      .object({
        taxExempt: z.boolean().optional()
      })
      .optional()
  },
  async (args) => {
    const result = await companyLocationTaxSettingsUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered price-list-create");
server.tool(
  "price-list-create",
  {
    name: z.string().min(1, "Price list name is required"),
    currency: z.string().min(1, "Currency is required"),
    prices: z
      .array(
        z.object({
          variantId: z.string().min(1, "Variant ID is required"),
          price: z.string().min(1, "Price is required")
        })
      )
      .optional()
  },
  async (args) => {
    const result = await priceListCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered subscription-billing-cycle-edits-delete");
server.tool(
  "subscription-billing-cycle-edits-delete",
  {
    editIds: z.array(z.string()).nonempty("At least one edit ID is required")
  },
  async (args) => {
    const result = await subscriptionBillingCycleEditsDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-contact-revoke-role");
server.tool(
  "company-contact-revoke-role",
  {
    companyContactId: z.string().min(1, "Company contact ID is required"),
    role: z.string().min(1, "Role is required")
  },
  async (args) => {
    const result = await companyContactRevokeRole.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// Register new tools (first batch, 15 provided)
console.error("Registered abandonment-email-state-update");
server.tool(
  "abandonment-email-state-update",
  {
    id: z.string().min(1, "ID is required"),
    emailState: z.enum(['SENT', 'SCHEDULED', 'UNSUBSCRIBED']),
    emailType: z.enum(['ABANDONED_CHECKOUT', 'ABANDONED_CART'])
  },
  async (args) => {
    const result = await abandonmentEmailStateUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered abandonment-update-activities-delivery-statuses");
server.tool(
  "abandonment-update-activities-delivery-statuses",
  {
    id: z.string().min(1, "Abandonment ID is required"),
    activities: z.array(
      z.object({
        activityId: z.string().min(1, "Activity ID is required"),
        deliveryStatus: z.enum(["SENT", "FAILED", "PENDING"])
      })
    ).nonempty("At least one activity is required")
  },
  async (args) => {
    const result = await abandonmentUpdateActivitiesDeliveryStatuses.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered app-subscription-cancel");
server.tool(
  "app-subscription-cancel",
  {
    id: z.string().min(1, "Subscription ID is required"),
    prorate: z.boolean().optional()
  },
  async (args) => {
    const result = await appSubscriptionCancel.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered app-subscription-create");
server.tool(
  "app-subscription-create",
  {
    name: z.string().min(1, "Name is required"),
    lineItems: z.array(
      z.object({
        plan: z.object({
          appRecurringPricingDetails: z.object({
            price: z.object({
              amount: z.number(),
              currencyCode: z.string()
            }),
            interval: z.enum(['ANNUAL', 'EVERY_30_DAYS'])
          })
        })
      })
    ).nonempty("At least one line item is required"),
    test: z.boolean().optional(),
    trialDays: z.number().int().nonnegative().optional(),
    returnUrl: z.string().min(1, "Return URL is required")
  },
  async (args) => {
    const result = await appSubscriptionCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered article-update");
server.tool(
  "article-update",
  {
    id: z.string().min(1, "Article ID is required"),
    input: z.object({
      author: z.object({
        email: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional()
      }).optional(),
      content: z.string().optional(),
      contentHtml: z.string().optional(),
      excerpt: z.string().optional(),
      handle: z.string().optional(),
      id: z.string(),
      metafields: z.array(
        z.object({
          description: z.string().optional(),
          id: z.string().optional(),
          key: z.string(),
          namespace: z.string(),
          type: z.string(),
          value: z.string()
        })
      ).optional(),
      publishedAt: z.string().optional(),
      seo: z.object({
        description: z.string().optional(),
        title: z.string().optional()
      }).optional(),
      tags: z.array(z.string()).optional(),
      title: z.string().optional()
    })
  },
  async (args) => {
    const result = await articleUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered blog-delete");
server.tool(
  "blog-delete",
  {
    id: z.string().min(1, "Blog ID is required")
  },
  async (args) => {
    const result = await blogDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered bulk-operation-cancel");
server.tool(
  "bulk-operation-cancel",
  {
    id: z.string().min(1, "Bulk operation ID is required").describe("The ID of the bulk operation to cancel")
  },
  async (args) => {
    const result = await bulkOperationCancel.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered bulk-operation-run-query");
server.tool(
  "bulk-operation-run-query",
  {
    query: z.string().min(1, "Query is required")
  },
  async (args) => {
    const result = await bulkOperationRunQuery.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered carrier-service-delete");
server.tool(
  "carrier-service-delete",
  {
    id: z.string().min(1, "Carrier service ID is required")
  },
  async (args) => {
    const result = await carrierServiceDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered cart-transform-create");
server.tool(
  "cart-transform-create",
  {
    input: z.object({
      cartTransform: z.object({
        title: z.string(),
        description: z.string().optional(),
        enabled: z.boolean().optional(),
        automaticApply: z.boolean().optional(),
        orderSubtotalMinimum: z.object({
          amount: z.number(),
          currencyCode: z.string()
        }).optional(),
        orderSubtotalMaximum: z.object({
          amount: z.number(),
          currencyCode: z.string()
        }).optional(),
        targetItems: z.object({
          includeAll: z.boolean().optional(),
          productVariants: z.array(z.object({ id: z.string() })).optional(),
          collections: z.array(z.object({ id: z.string() })).optional()
        }).optional(),
        transformItems: z.object({
          add: z.array(
            z.object({
              merchandiseId: z.string(),
              quantity: z.number(),
              price: z.object({
                fixedPrice: z.object({
                  amount: z.number(),
                  currencyCode: z.string()
                }).optional(),
                percentageDecrease: z.number().optional()
              }).optional()
            })
          ).optional(),
          remove: z.array(
            z.object({
              merchandiseId: z.string(),
              quantity: z.number().optional()
            })
          ).optional()
        }).optional()
      })
    })
  },
  async (args) => {
    const result = await cartTransformCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered catalog-context-update");
server.tool(
  "catalog-context-update",
  {
    id: z.string().min(1, "ID is required"),
    context: z.object({
      country: z.string().optional(),
      language: z.string().optional(),
      preview: z.boolean().optional()
    })
  },
  async (args) => {
    const result = await catalogContextUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered catalog-delete");
server.tool(
  "catalog-delete",
  {
    id: z.string().min(1, "ID is required")
  },
  async (args) => {
    const result = await catalogDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered checkout-branding-upsert");
server.tool(
  "checkout-branding-upsert",
  {
    input: z.object({
      customizations: z.object({
        checkbox: z.object({
          cornerRadius: z.string().optional(),
          background: z.string().optional()
        }).optional(),
        control: z.object({
          border: z.string().optional(),
          color: z.string().optional(),
          cornerRadius: z.string().optional(),
          labelPosition: z.enum(['INSIDE', 'OUTSIDE']).optional()
        }).optional(),
        select: z.object({
          border: z.string().optional(),
          background: z.string().optional(),
          cornerRadius: z.string().optional()
        }).optional(),
        textField: z.object({
          border: z.string().optional(),
          background: z.string().optional(),
          cornerRadius: z.string().optional()
        }).optional(),
        selectIcon: z.object({
          foreground: z.string().optional()
        }).optional(),
        typography: z.object({
          size: z.string().optional(),
          primary: z.object({
            name: z.string().optional(),
            base64Data: z.string().optional(),
            weight: z.string().optional()
          }).optional(),
          secondary: z.object({
            name: z.string().optional(),
            base64Data: z.string().optional(),
            weight: z.string().optional()
          }).optional()
        }).optional(),
        header: z.object({
          alignment: z.enum(['LEFT', 'CENTER']).optional(),
          position: z.enum(['START', 'END']).optional()
        }).optional(),
        headingLevel1: z.object({
          typography: z.object({
            size: z.string().optional(),
            base64Data: z.string().optional(),
            weight: z.string().optional()
          }).optional()
        }).optional(),
        headingLevel2: z.object({
          typography: z.object({
            size: z.string().optional(),
            base64Data: z.string().optional(),
            weight: z.string().optional()
          }).optional()
        }).optional(),
        headingLevel3: z.object({
          typography: z.object({
            size: z.string().optional(),
            base64Data: z.string().optional(),
            weight: z.string().optional()
          }).optional()
        }).optional(),
        global: z.object({
          cornerRadius: z.string().optional(),
          typography: z.object({
            letterCase: z.enum(['NONE', 'UPPER', 'LOWER', 'TITLE']).optional(),
            kerning: z.string().optional(),
            tracking: z.string().optional()
          }).optional()
        }).optional(),
        primaryButton: z.object({
          background: z.string().optional(),
          border: z.string().optional(),
          cornerRadius: z.string().optional(),
          blockPadding: z.string().optional(),
          inlinePadding: z.string().optional()
        }).optional(),
        secondaryButton: z.object({
          background: z.string().optional(),
          border: z.string().optional(),
          cornerRadius: z.string().optional(),
          blockPadding: z.string().optional(),
          inlinePadding: z.string().optional()
        }).optional(),
        color: z.object({
          primary: z.string().optional(),
          background: z.string().optional(),
          error: z.string().optional()
        }).optional()
      }).optional()
    })
  },
  async (args) => {
    const result = await checkoutBrandingUpsert.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered collection-add-products");
server.tool(
  "collection-add-products",
  {
    collectionId: z.string().min(1, "Collection ID is required"),
    productIds: z.array(z.string()).nonempty("At least one product ID is required")
  },
  async (args) => {
    const result = await collectionAddProducts.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered collection-publish");
server.tool(
  "collection-publish",
  {
    id: z.string().min(1, "Collection ID is required"),
    input: z.object({
      publications: z.array(
        z.object({
          channelId: z.string().min(1, "Channel ID is required"),
          publishDate: z.string().optional()
        })
      ).nonempty("At least one publication is required")
    })
  },
  async (args) => {
    const result = await collectionPublish.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// Register new tools (first batch, remaining 5)
console.error("Registered collection-reorder-products");
server.tool(
  "collection-reorder-products",
  {
    id: z.string().min(1, "Collection ID is required"),
    moves: z.array(
      z.object({
        id: z.string().min(1, "Product ID is required"),
        newPosition: z.number().int().nonnegative()
      })
    ).nonempty("At least one move is required")
  },
  async (args) => {
    const result = await collectionReorderProducts.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered collection-update");
server.tool(
  "collection-update",
  {
    id: z.string().min(1, "Collection ID is required"),
    input: z.object({
      descriptionHtml: z.string().optional(),
      handle: z.string().optional(),
      image: z.object({
        altText: z.string().optional(),
        id: z.string().optional(),
        src: z.string().optional()
      }).optional(),
      metafields: z.array(
        z.object({
          description: z.string().optional(),
          id: z.string().optional(),
          key: z.string(),
          namespace: z.string(),
          type: z.string(),
          value: z.string()
        })
      ).optional(),
      privateMetafields: z.array(
        z.object({
          key: z.string(),
          namespace: z.string(),
          owner: z.string(),
          valueInput: z.object({
            value: z.string(),
            valueType: z.string()
          })
        })
      ).optional(),
      products: z.object({
        add: z.array(z.string()).optional(),
        remove: z.array(z.string()).optional()
      }).optional(),
      ruleSet: z.object({
        appliedDisjunctively: z.boolean().optional(),
        rules: z.array(
          z.object({
            column: z.string(),
            condition: z.string(),
            relation: z.string()
          })
        )
      }).optional(),
      seo: z.object({
        description: z.string().optional(),
        title: z.string().optional()
      }).optional(),
      sortOrder: z.string().optional(),
      title: z.string().optional()
    })
  },
  async (args) => {
    const result = await collectionUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered comment-approve");
server.tool(
  "comment-approve",
  {
    id: z.string().min(1, "Comment ID is required")
  },
  async (args) => {
    const result = await commentApprove.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered comment-delete");
server.tool(
  "comment-delete",
  {
    id: z.string().min(1, "Comment ID is required")
  },
  async (args) => {
    const result = await commentDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered companies-delete");
server.tool(
  "companies-delete",
  {
    companyId: z.string().min(1, "Company ID is required")
  },
  async (args) => {
    const result = await companiesDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// Register new tools (second batch, 15 provided)
console.error("Registered company-address-delete");
server.tool(
  "company-address-delete",
  {
    id: z.string().min(1, "Company address ID is required")
  },
  async (args) => {
    const result = await companyAddressDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-assign-main-contact");
server.tool(
  "company-assign-main-contact",
  {
    companyId: z.string().min(1, "Company ID is required"),
    companyContactId: z.string().min(1, "Company Contact ID is required")
  },
  async (args) => {
    const result = await companyAssignMainContact.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-contact-assign-role");
server.tool(
  "company-contact-assign-role",
  {
    companyContactId: z.string().min(1, "Company Contact ID is required"),
    roleId: z.string().min(1, "Role ID is required"),
    companyLocationId: z.string().optional()
  },
  async (args) => {
    const result = await companyContactAssignRole.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-contact-assign-roles");
server.tool(
  "company-contact-assign-roles",
  {
    companyContactId: z.string().min(1, "Company contact ID is required"),
    roleIds: z.array(z.string()).nonempty("At least one role ID is required"),
    companyLocationId: z.string().optional()
  },
  async (args) => {
    const result = await companyContactAssignRoles.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-contact-create");
server.tool(
  "company-contact-create",
  {
    companyId: z.string().min(1, "Company ID is required"),
    input: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      email: z.string().email().optional(),
      title: z.string().optional(),
      locale: z.string().optional(),
      phone: z.string().optional(),
      isMain: z.boolean().optional(),
      marketingAcceptsEmailMarketing: z.boolean().optional()
    })
  },
  async (args) => {
    const result = await companyContactCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-contact-remove-from-company");
server.tool(
  "company-contact-remove-from-company",
  {
    companyContactId: z.string().min(1, "Company Contact ID is required"),
    companyId: z.string().min(1, "Company ID is required")
  },
  async (args) => {
    const result = await companyContactRemoveFromCompany.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-delete");
server.tool(
  "company-delete",
  {
    id: z.string().min(1, "Company ID is required")
  },
  async (args) => {
    const result = await companyDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-assign-address");
server.tool(
  "company-location-assign-address",
  {
    companyLocationId: z.string().min(1, "Company location ID is required"),
    address: z.object({
      address1: z.string().optional(),
      address2: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      phone: z.string().optional(),
      province: z.string().optional(),
      provinceCode: z.string().optional(),
      zip: z.string().optional()
    })
  },
  async (args) => {
    const result = await companyLocationAssignAddress.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-assign-roles");
server.tool(
  "company-location-assign-roles",
  {
    companyLocationId: z.string().min(1, "Company location ID is required"),
    roleAssignments: z.array(
      z.object({
        roleId: z.string().min(1, "Role ID is required"),
        userIds: z.array(z.string()).nonempty("At least one user ID is required")
      })
    ).nonempty("At least one role assignment is required")
  },
  async (args) => {
    const result = await companyLocationAssignRoles.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-assign-tax-exemptions");
server.tool(
  "company-location-assign-tax-exemptions",
  {
    companyLocationId: z.string().min(1, "Company Location ID is required"),
    taxExemptions: z.array(
      z.enum([
        'EXEMPT_ALL',
        'CA_STATUS_CARD_EXEMPTION',
        'CA_DIPLOMAT_EXEMPTION',
        'CA_BC_RESELLER_EXEMPTION',
        'CA_MB_RESELLER_EXEMPTION',
        'CA_SK_RESELLER_EXEMPTION',
        'CA_BC_COMMERCIAL_FISHERY_EXEMPTION',
        'CA_MB_COMMERCIAL_FISHERY_EXEMPTION',
        'CA_NS_COMMERCIAL_FISHERY_EXEMPTION',
        'CA_PE_COMMERCIAL_FISHERY_EXEMPTION',
        'CA_SK_COMMERCIAL_FISHERY_EXEMPTION',
        'CA_BC_PRODUCTION_AND_MACHINERY_EXEMPTION',
        'CA_SK_PRODUCTION_AND_MACHINERY_EXEMPTION',
        'CA_BC_SUB_CONTRACTOR_EXEMPTION',
        'CA_SK_SUB_CONTRACTOR_EXEMPTION',
        'CA_BC_CONTRACTOR_EXEMPTION',
        'CA_SK_CONTRACTOR_EXEMPTION',
        'CA_ON_PURCHASE_EXEMPTION',
        'CA_MB_FARMER_EXEMPTION',
        'CA_NS_FARMER_EXEMPTION',
        'CA_SK_FARMER_EXEMPTION'
      ])
    ).nonempty("At least one tax exemption is required")
  },
  async (args) => {
    const result = await companyLocationAssignTaxExemptions.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-create-tax-registration");
server.tool(
  "company-location-create-tax-registration",
  {
    companyLocationId: z.string().min(1, "Company location ID is required"),
    taxRegistration: z.object({
      taxNumber: z.string(),
      taxNumberNormalized: z.string().optional(),
      expiresOn: z.string().optional(),
      registrationDate: z.string().optional(),
      type: z.enum(['VAT', 'GST', 'OTHER']),
      subType: z.string().optional()
    })
  },
  async (args) => {
    const result = await companyLocationCreateTaxRegistration.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-delete");
server.tool(
  "company-location-delete",
  {
    id: z.string().min(1, "Company Location ID is required")
  },
  async (args) => {
    const result = await companyLocationDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-remove-staff-members");
server.tool(
  "company-location-remove-staff-members",
  {
    companyLocationId: z.string().min(1, "Company location ID is required"),
    staffMemberIds: z.array(z.string()).nonempty("At least one staff member ID is required")
  },
  async (args) => {
    const result = await companyLocationRemoveStaffMembers.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-location-revoke-tax-exemptions");
server.tool(
  "company-location-revoke-tax-exemptions",
  {
    id: z.string().min(1, "Company location ID is required").describe("The ID of the company location.")
  },
  async (args) => {
    const result = await companyLocationRevokeTaxExemptions.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered company-locations-delete");
server.tool(
  "company-locations-delete",
  {
    id: z.string().min(1, "Location ID is required")
  },
  async (args) => {
    const result = await companyLocationsDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered consent-policy-update");
server.tool(
  "consent-policy-update",
  {
    customText: z.string().optional(),
    purposes: z.array(
      z.object({
        purpose: z.enum(['ESSENTIAL', 'ANALYTICS', 'PERSONALIZATION', 'MARKETING', 'UNCLASSIFIED']),
        isRequired: z.boolean().optional(),
        isEnabled: z.boolean().optional()
      })
    ).optional()
  },
  async (args) => {
    const result = await consentPolicyUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-delete");
server.tool(
  "customer-delete",
  {
    id: z.string().min(1, "Customer ID is required")
  },
  async (args) => {
    const result = await customerDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-email-marketing-consent-update");
server.tool(
  "customer-email-marketing-consent-update",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    emailMarketingConsent: z.object({
      state: z.enum(['SUBSCRIBED', 'UNSUBSCRIBED', 'PENDING']),
      marketingOptInLevel: z.enum(['SINGLE_OPT_IN', 'CONFIRMED_OPT_IN', 'UNKNOWN']).optional(),
      marketingState: z.enum(['NOT_SUBSCRIBED', 'PENDING', 'SUBSCRIBED', 'UNSUBSCRIBED']).optional(),
      consentUpdatedAt: z.string().datetime().optional()
    })
  },
  async (args) => {
    const result = await customerEmailMarketingConsentUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-credit-card-update");
server.tool(
  "customer-payment-method-credit-card-update",
  {
    id: z.string().min(1, "Payment method ID is required"),
    billingAddress: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional(),
        zip: z.string().optional()
      })
      .optional(),
    lastDigits: z.string().optional(),
    month: z.number().int().min(1).max(12).optional(),
    name: z.string().optional(),
    year: z.number().int().min(2000).optional()
  },
  async (args) => {
    const result = await customerPaymentMethodCreditCardUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-get-update-url");
server.tool(
  "customer-payment-method-get-update-url",
  {
    id: z.string().min(1, "Payment method ID is required")
  },
  async (args) => {
    const result = await customerPaymentMethodGetUpdateUrl.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-remote-create");
server.tool(
  "customer-payment-method-remote-create",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    billingAddress: z
      .object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional(),
        zip: z.string().optional()
      })
      .optional(),
    paymentMethod: z.object({
      remoteReference: z.string().min(1, "Remote reference is required"),
      type: z.enum(['PAYMENT_CARD', 'BANK_ACCOUNT']),
      remoteUrl: z.string().optional(),
      instrument: z
        .object({
          type: z.enum(['PAYMENT_CARD', 'BANK_ACCOUNT']),
          brand: z.string().optional(),
          expireMonth: z.number().optional(),
          expireYear: z.number().optional(),
          sourceType: z.string().optional(),
          lastDigits: z.string().optional(),
          name: z.string().optional(),
          issuingCountry: z.string().optional(),
          bankName: z.string().optional(),
          accountNumber: z.string().optional(),
          transitNumber: z.string().optional(),
          institutionNumber: z.string().optional()
        })
        .optional()
    })
  },
  async (args) => {
    const result = await customerPaymentMethodRemoteCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-revoke");
server.tool(
  "customer-payment-method-revoke",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    paymentMethodId: z.string().min(1, "Payment method ID is required")
  },
  async (args) => {
    const result = await customerPaymentMethodRevoke.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-payment-method-send-update-email");
server.tool(
  "customer-payment-method-send-update-email",
  {
    customerPaymentMethodId: z.string().min(1, "Customer payment method ID is required")
  },
  async (args) => {
    const result = await customerPaymentMethodSendUpdateEmail.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-replace-tax-exemptions");
server.tool(
  "customer-replace-tax-exemptions",
  {
    customerId: z.string().min(1, "Customer ID is required"),
    taxExemptions: z
      .array(
        z.enum([
          'EXEMPT_ALL',
          'CA_STATUS_CARD_EXEMPTION',
          'CA_DIPLOMAT_EXEMPTION',
          'CA_BC_RESELLER_EXEMPTION',
          'CA_MB_RESELLER_EXEMPTION',
          'CA_SK_RESELLER_EXEMPTION',
          'CA_BC_COMMERCIAL_FISHERY_EXEMPTION',
          'CA_MB_COMMERCIAL_FISHERY_EXEMPTION',
          'CA_NS_COMMERCIAL_FISHERY_EXEMPTION',
          'CA_PE_COMMERCIAL_FISHERY_EXEMPTION',
          'CA_SK_COMMERCIAL_FISHERY_EXEMPTION',
          'CA_BC_PRODUCTION_AND_MACHINERY_EXEMPTION',
          'CA_SK_PRODUCTION_AND_MACHINERY_EXEMPTION',
          'CA_BC_SUB_CONTRACTOR_EXEMPTION',
          'CA_SK_SUB_CONTRACTOR_EXEMPTION',
          'CA_BC_CONTRACTOR_EXEMPTION',
          'CA_SK_CONTRACTOR_EXEMPTION',
          'CA_ON_PURCHASE_EXEMPTION',
          'CA_MB_FARMER_EXEMPTION',
          'CA_NS_FARMER_EXEMPTION',
          'CA_SK_FARMER_EXEMPTION'
        ])
      )
      .min(0)
  },
  async (args) => {
    const result = await customerReplaceTaxExemptions.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-request-data-erasure");
server.tool(
  "customer-request-data-erasure",
  {
    customerId: z.string().min(1, "Customer ID is required")
  },
  async (args) => {
    const result = await customerRequestDataErasure.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-send-account-invite-email");
server.tool(
  "customer-send-account-invite-email",
  {
    customerId: z.string().min(1, "Customer ID is required")
  },
  async (args) => {
    const result = await customerSendAccountInviteEmail.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered customer-set");
server.tool(
  "customer-set",
  {
    input: z.object({
      id: z.string().min(1, "Customer ID is required"),
      addresses: z
        .array(
          z.object({
            address1: z.string().optional(),
            address2: z.string().optional(),
            city: z.string().optional(),
            company: z.string().optional(),
            country: z.string().optional(),
            countryCode: z.string().optional(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            phone: z.string().optional(),
            province: z.string().optional(),
            provinceCode: z.string().optional(),
            zip: z.string().optional()
          })
        )
        .optional(),
      email: z.string().email().optional(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      locale: z.string().optional(),
      note: z.string().optional(),
      phone: z.string().optional(),
      tags: z.array(z.string()).optional(),
      taxExempt: z.boolean().optional(),
      taxExemptions: z
        .array(
          z.enum([
            'FEDERAL_GOVERNMENT',
            'STATE_GOVERNMENT',
            'OTHER',
            'DIPLOMATIC',
            'INDUSTRIAL_EQUIPMENT',
            'MANUFACTURING',
            'RESALE',
            'REDUCED_RATED',
            'POINT_OF_SALE_EXEMPT'
          ])
        )
        .optional()
    })
  },
  async (args) => {
    const result = await customerSet.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delegate-access-token-destroy");
server.tool(
  "delegate-access-token-destroy",
  {
    delegateAccessToken: z.string().min(1, "Delegate access token is required"),
    shopId: z.string().min(1, "Shop ID is required")
  },
  async (args) => {
    const result = await delegateAccessTokenDestroy.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-customization-activation");
server.tool(
  "delivery-customization-activation",
  {
    id: z.string().min(1, "Delivery customization ID is required"),
    activate: z.boolean(),
    automaticallyActivateNewLocations: z.boolean().optional()
  },
  async (args) => {
    const result = await deliveryCustomizationActivation.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-customization-create");
server.tool(
  "delivery-customization-create",
  {
    input: z.object({
      automaticDeliveryOptionEligibility: z
        .object({
          enabled: z.boolean(),
          methodTypes: z
            .array(z.enum(['LOCAL', 'SHIPPING', 'PICKUP_POINT', 'RETAIL', 'NONE']))
            .optional()
        })
        .optional(),
      functionId: z.string().min(1, "Function ID is required"),
      metafields: z
        .array(
          z.object({
            key: z.string().min(1),
            namespace: z.string().min(1),
            type: z.string().min(1),
            value: z.string().min(1)
          })
        )
        .optional(),
      title: z.string().min(1, "Title is required")
    })
  },
  async (args) => {
    const result = await deliveryCustomizationCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-customization-update");
server.tool(
  "delivery-customization-update",
  {
    id: z.string().min(1, "Delivery customization ID is required"),
    deliveryCustomization: z.object({
      active: z.boolean().optional(),
      functionId: z.string().optional(),
      metafields: z
        .array(
          z.object({
            key: z.string().min(1),
            namespace: z.string().min(1),
            type: z.string().min(1),
            value: z.string().min(1)
          })
        )
        .optional(),
      title: z.string().optional()
    })
  },
  async (args) => {
    const result = await deliveryCustomizationUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-promise-participants-update");
server.tool(
  "delivery-promise-participants-update",
  {
    deliveryPromiseParticipantIds: z
      .array(z.string())
      .nonempty("At least one participant ID is required"),
    deliveryPromiseServiceLevel: z.object({
      name: z.string().min(1, "Service level name is required"),
      deliveryMethodDefinition: z.object({
        methodType: z.enum(["LOCAL", "NONE", "PICKUP", "RETAIL", "SHIPPING"]),
        maxPromiseDate: z.string().optional(),
        minPromiseDate: z.string().optional(),
        promiseApplicableTo: z.enum(["DELIVERY", "READY_FOR_PICKUP"]).optional()
      })
    })
  },
  async (args) => {
    const result = await deliveryPromiseParticipantsUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-promise-provider-upsert");
server.tool(
  "delivery-promise-provider-upsert",
  {
    input: z.object({
      id: z.string().optional(),
      name: z.string().min(1, "Name is required"),
      type: z.enum(['MERCHANT_DEFINED', 'THIRD_PARTY']),
      active: z.boolean(),
      fulfillmentType: z.enum(['PICKUP', 'SHIPPING']),
      methodType: z.enum(['DELIVERY', 'PICKUP']),
      minDeliveryDateTime: z.string().datetime().optional(),
      maxDeliveryDateTime: z.string().datetime().optional(),
      minTransitTime: z
        .object({
          interval: z.number(),
          unit: z.enum(['HOURS', 'DAYS', 'WEEKS', 'MONTHS'])
        })
        .optional(),
      maxTransitTime: z
        .object({
          interval: z.number(),
          unit: z.enum(['HOURS', 'DAYS', 'WEEKS', 'MONTHS'])
        })
        .optional()
    })
  },
  async (args) => {
    const result = await deliveryPromiseProviderUpsert.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-setting-update");
server.tool(
  "delivery-setting-update",
  {
    id: z.string().min(1, "Delivery setting ID is required"),
    automaticFulfillmentForDigitalProducts: z.boolean().optional(),
    deliveryMethodDefinitionOverrides: z
      .array(
        z.object({
          id: z.string().min(1),
          label: z.string().optional(),
          methodType: z.string().optional(),
          zoneId: z.string().optional()
        })
      )
      .optional(),
    legacyModeBlocked: z.boolean().optional(),
    requirePhoneNumber: z.boolean().optional()
  },
  async (args) => {
    const result = await deliverySettingUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered delivery-shipping-origin-assign");
server.tool(
  "delivery-shipping-origin-assign",
  {
    locationId: z.string().min(1, "Location ID is required"),
    deliveryProfileId: z.string().min(1, "Delivery profile ID is required")
  },
  async (args) => {
    const result = await deliveryShippingOriginAssign.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);


// Register new discount, draft order, and file tools
console.error("Registered discount-automatic-activate");
server.tool(
  "discount-automatic-activate",
  {
    id: z.string().min(1, "Discount ID is required")
  },
  async (args) => {
    const result = await discountAutomaticActivate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-automatic-basic-create");
server.tool(
  "discount-automatic-basic-create",
  {
    automaticBasicDiscount: z.object({
      title: z.string().min(1, "Title is required"),
      startsAt: z.string().optional(),
      endsAt: z.string().optional(),
      minimumRequirement: z.object({
        quantity: z.object({
          greaterThanOrEqualToQuantity: z.number()
        }).optional(),
        subtotal: z.object({
          greaterThanOrEqualToSubtotal: z.number()
        }).optional()
      }).optional(),
      customerSelection: z.object({
        customers: z.object({
          customersToAdd: z.array(z.string())
        }).optional(),
        segments: z.object({
          segmentsToAdd: z.array(z.string())
        }).optional()
      }).optional(),
      customerGets: z.object({
        value: z.object({
          percentage: z.number().optional(),
          amount: z.object({
            amount: z.number(),
            currencyCode: z.string()
          }).optional()
        }).refine(data => data.percentage !== undefined || data.amount !== undefined, {
          message: "Either percentage or amount must be provided"
        }),
        items: z.object({
          products: z.object({
            productsToAdd: z.array(z.string())
          }).optional(),
          collections: z.object({
            collectionsToAdd: z.array(z.string())
          }).optional(),
          variants: z.object({
            variantsToAdd: z.array(z.string())
          }).optional()
        }).optional()
      }),
      combinesWith: z.object({
        orderDiscounts: z.boolean().optional(),
        productDiscounts: z.boolean().optional(),
        shippingDiscounts: z.boolean().optional()
      }).optional(),
      usageLimit: z.number().int().positive().optional()
    })
  },
  async (args) => {
    const result = await discountAutomaticBasicCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-automatic-basic-update");
server.tool(
  "discount-automatic-basic-update",
  {
    id: z.string().min(1, "Discount ID is required"),
    automaticBasicDiscount: z.object({
      combinesWith: z.object({
        orderDiscounts: z.boolean().optional(),
        productDiscounts: z.boolean().optional(),
        shippingDiscounts: z.boolean().optional()
      }).optional(),
      customerGets: z.object({
        items: z.object({
          products: z.object({
            productsToAdd: z.array(z.string()).optional(),
            productsToRemove: z.array(z.string()).optional()
          }).optional(),
          collections: z.object({
            collectionsToAdd: z.array(z.string()).optional(),
            collectionsToRemove: z.array(z.string()).optional()
          }).optional()
        }).optional(),
        value: z.object({
          percentage: z.number().optional(),
          amount: z.number().optional()
        })
      }).optional(),
      customerSelection: z.object({
        customers: z.object({
          customersToAdd: z.array(z.string()).optional(),
          customersToRemove: z.array(z.string()).optional()
        }).optional(),
        segments: z.object({
          segmentsToAdd: z.array(z.string()).optional(),
          segmentsToRemove: z.array(z.string()).optional()
        }).optional()
      }).optional(),
      endsAt: z.string().datetime().optional(),
      minimumRequirement: z.object({
        quantity: z.number().int().optional(),
        subtotal: z.number().optional()
      }).optional(),
      startsAt: z.string().datetime().optional(),
      title: z.string().optional(),
      usageLimit: z.number().int().optional()
    })
  },
  async (args) => {
    const result = await discountAutomaticBasicUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-automatic-bxgy-update");
server.tool(
  "discount-automatic-bxgy-update",
  {
    id: z.string(),
    automaticBxgyDiscount: z.object({
      customerBuys: z.object({
        items: z.object({
          products: z.object({
            productVariants: z.array(z.object({ id: z.string() })).optional(),
            productIds: z.array(z.string()).optional(),
            collectionIds: z.array(z.string()).optional()
          }).optional()
        }).optional(),
        value: z.object({
          quantity: z.number().int().min(1)
        })
      }),
      customerGets: z.object({
        items: z.object({
          products: z.object({
            productVariants: z.array(z.object({ id: z.string() })).optional(),
            productIds: z.array(z.string()).optional(),
            collectionIds: z.array(z.string()).optional()
          }).optional()
        }).optional(),
        value: z.object({
          percentage: z.number().min(0).max(100).optional(),
          amount: z.number().min(0).optional(),
          discountOnQuantity: z.enum(['ALL', 'EQUAL']).optional()
        })
      }),
      title: z.string(),
      startsAt: z.string().datetime(),
      endsAt: z.string().datetime().optional(),
      usageLimit: z.number().int().min(1).optional(),
      customerSelection: z.object({
        customers: z.object({
          customerIds: z.array(z.string()).optional(),
          segmentIds: z.array(z.string()).optional()
        }).optional()
      }).optional(),
      minimumRequirement: z.object({
        subtotal: z.number().min(0).optional(),
        quantity: z.number().int().min(1).optional()
      }).optional()
    })
  },
  async (args) => {
    const result = await discountAutomaticBxgyUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-automatic-deactivate");
server.tool(
  "discount-automatic-deactivate",
  {
    id: z.string().min(1, "Discount ID is required")
  },
  async (args) => {
    const result = await discountAutomaticDeactivate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-automatic-delete");
server.tool(
  "discount-automatic-delete",
  {
    id: z.string().min(1, "Discount ID is required")
  },
  async (args) => {
    const result = await discountAutomaticDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-basic-create");
server.tool(
  "discount-code-basic-create",
  {
    basicCodeDiscount: z.object({
      title: z.string().min(1, "Title is required"),
      code: z.string().min(1, "Code is required"),
      startsAt: z.string().datetime().optional(),
      endsAt: z.string().datetime().optional(),
      usageLimit: z.number().int().positive().optional(),
      appliesOncePerCustomer: z.boolean().optional(),
      customerSelection: z.object({
        all: z.boolean().optional(),
        customers: z.object({
          add: z.array(z.string()).optional()
        }).optional(),
        segments: z.array(z.string()).optional()
      }).optional(),
      customerGets: z.object({
        value: z.object({
          percentage: z.number().min(0).max(100),
          amount: z.object({
            amount: z.number(),
            currencyCode: z.string()
          })
        }).partial().refine(data => data.percentage !== undefined || data.amount !== undefined, {
          message: "Either percentage or amount must be provided"
        }),
        items: z.object({
          all: z.boolean().optional(),
          products: z.object({
            add: z.array(z.string())
          }).optional(),
          collections: z.object({
            add: z.array(z.string())
          }).optional(),
          variants: z.object({
            add: z.array(z.string())
          }).optional()
        }).optional()
      }),
      minimumRequirement: z.object({
        subtotal: z.object({
          greaterThanOrEqualToAmount: z.number()
        }).optional(),
        quantity: z.object({
          greaterThanOrEqualToQuantity: z.number()
        }).optional()
      }).optional(),
      combinesWith: z.object({
        orderDiscounts: z.boolean().optional(),
        productDiscounts: z.boolean().optional(),
        shippingDiscounts: z.boolean().optional()
      }).optional()
    })
  },
  async (args) => {
    const result = await discountCodeBasicCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-basic-update");
server.tool(
  "discount-code-basic-update",
  {
    id: z.string().min(1, "Discount ID is required"),
    basicCodeDiscount: z.object({
      appliesOncePerCustomer: z.boolean().optional(),
      code: z.string().optional(),
      customerSelection: z.object({
        segments: z.array(z.object({ id: z.string() })).optional(),
        customers: z.array(z.object({ id: z.string() })).optional()
      }).optional(),
      endsAt: z.string().optional(),
      minimumRequirement: z.object({
        quantity: z.object({
          greaterThanOrEqualToQuantity: z.number()
        }).optional(),
        subtotal: z.object({
          greaterThanOrEqualToAmount: z.number()
        }).optional()
      }).optional(),
      recurringCycleLimit: z.number().int().optional(),
      startsAt: z.string().optional(),
      title: z.string().optional(),
      usageLimit: z.number().int().optional(),
      customerGets: z.object({
        items: z.object({
          products: z.array(z.object({ id: z.string() })).optional(),
          collections: z.array(z.object({ id: z.string() })).optional(),
          variants: z.array(z.object({ id: z.string() })).optional()
        }).optional(),
        value: z.object({
          percentage: z.number().optional(),
          amount: z.object({
            amount: z.number()
          }).optional()
        })
      }).optional()
    })
  },
  async (args) => {
    const result = await discountCodeBasicUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-bxgy-create");
server.tool(
  "discount-code-bxgy-create",
  {
    title: z.string(),
    code: z.string().optional(),
    startsAt: z.string().datetime().optional(),
    endsAt: z.string().datetime().optional(),
    usageLimit: z.number().int().optional(),
    appliesOncePerCustomer: z.boolean().optional(),
    minimumRequirement: z.object({
      quantity: z.number().int()
    }).optional(),
    customerBuys: z.object({
      items: z.object({
        products: z.object({
          productVariants: z.array(z.string()).optional()
        }).optional(),
        collections: z.object({
          collections: z.array(z.string()).optional()
        }).optional(),
        variants: z.object({
          variants: z.array(z.string()).optional()
        }).optional()
      }),
      quantity: z.number().int()
    }),
    customerGets: z.object({
      items: z.object({
        products: z.object({
          productVariants: z.array(z.string()).optional()
        }).optional(),
        collections: z.object({
          collections: z.array(z.string()).optional()
        }).optional(),
        variants: z.object({
          variants: z.array(z.string()).optional()
        }).optional()
      }),
      value: z.object({
        discountAmount: z.object({
          amount: z.number()
        }).optional(),
        discountOnQuantity: z.object({
          quantity: z.number(),
          effect: z.object({
            percentage: z.number()
          })
        }).optional(),
        percentage: z.number().optional()
      })
    }),
    customerSelection: z.object({
      customers: z.object({
        customers: z.array(z.string())
      }).optional(),
      segments: z.object({
        segments: z.array(z.string())
      }).optional()
    }).optional()
  },
  async (args) => {
    const result = await discountCodeBxgyCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-bxgy-update");
server.tool(
  "discount-code-bxgy-update",
  {
    id: z.string().min(1, "Discount ID is required"),
    discount: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      startsAt: z.string().datetime().optional(),
      endsAt: z.string().datetime().optional(),
      combinesWith: z.object({
        orderDiscounts: z.boolean().optional(),
        productDiscounts: z.boolean().optional(),
        shippingDiscounts: z.boolean().optional()
      }).optional(),
      customerBuys: z.object({
        items: z.object({
          products: z.object({
            productsToAdd: z.array(z.string()).optional(),
            productsToRemove: z.array(z.string()).optional()
          }).optional(),
          collections: z.object({
            collectionsToAdd: z.array(z.string()).optional(),
            collectionsToRemove: z.array(z.string()).optional()
          }).optional(),
          variants: z.object({
            variantsToAdd: z.array(z.string()).optional(),
            variantsToRemove: z.array(z.string()).optional()
          }).optional()
        }).optional(),
        value: z.object({
          quantity: z.number()
        }).optional()
      }).optional(),
      customerGets: z.object({
        items: z.object({
          products: z.object({
            productsToAdd: z.array(z.string()).optional(),
            productsToRemove: z.array(z.string()).optional()
          }).optional(),
          collections: z.object({
            collectionsToAdd: z.array(z.string()).optional(),
            collectionsToRemove: z.array(z.string()).optional()
          }).optional(),
          variants: z.object({
            variantsToAdd: z.array(z.string()).optional(),
            variantsToRemove: z.array(z.string()).optional()
          }).optional()
        }).optional(),
        value: z.object({
          percentage: z.number()
        }).optional()
      }).optional(),
      usageLimit: z.number().optional(),
      appliesOncePerCustomer: z.boolean().optional(),
      asyncUsageCount: z.boolean().optional()
    })
  },
  async (args) => {
    const result = await discountCodeBxgyUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-deactivate");
server.tool(
  "discount-code-deactivate",
  {
    id: z.string().min(1, "Discount code ID is required")
  },
  async (args) => {
    const result = await discountCodeDeactivate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-free-shipping-create");
server.tool(
  "discount-code-free-shipping-create",
  {
    title: z.string(),
    code: z.string(),
    startsAt: z.string().optional(),
    endsAt: z.string().optional(),
    usageLimit: z.number().int().optional(),
    appliesOncePerCustomer: z.boolean().optional(),
    customerSelection: z.object({
      all: z.boolean().optional(),
      segments: z.array(z.string()).optional(),
      customers: z.object({
        add: z.array(z.string()).optional(),
        remove: z.array(z.string()).optional()
      }).optional()
    }).optional(),
    destinationSelection: z.object({
      all: z.boolean().optional(),
      countries: z.array(z.object({
        countryCode: z.string(),
        include: z.boolean(),
        provinces: z.array(z.object({
          code: z.string(),
          include: z.boolean()
        })).optional()
      })).optional()
    }).optional(),
    minimumRequirement: z.object({
      subtotal: z.object({
        amount: z.number()
      }).optional(),
      quantity: z.object({
        quantity: z.number()
      }).optional()
    }).optional(),
    maximumShippingPrice: z.object({
      amount: z.number()
    }).optional()
  },
  async (args) => {
    const result = await discountCodeFreeShippingCreate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-code-redeem-code-bulk-delete");
server.tool(
  "discount-code-redeem-code-bulk-delete",
  {
    discountId: z.string().min(1, "Discount ID is required"),
    search: z.string().optional(),
    ids: z.array(z.string()).optional()
  },
  async (args) => {
    const result = await discountCodeRedeemCodeBulkDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered discount-redeem-code-bulk-add");
server.tool(
  "discount-redeem-code-bulk-add",
  {
    discountId: z.string().min(1, "Discount ID is required"),
    codes: z.array(z.object({
      code: z.string(),
      recurringCycle: z.enum(['ONCE', 'MULTIPLE']).optional()
    })).nonempty("At least one code is required")
  },
  async (args) => {
    const result = await discountRedeemCodeBulkAdd.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered dispute-evidence-update");
server.tool(
  "dispute-evidence-update",
  {
    id: z.string().min(1, "Dispute ID is required"),
    evidence: z.object({
      accessActivityLog: z.string().optional(),
      cancellationPolicyDisclosure: z.string().optional(),
      cancellationPolicyFile: z.object({ id: z.string() }).optional(),
      cancellationRebuttal: z.string().optional(),
      customerCommunicationFile: z.object({ id: z.string() }).optional(),
      customerEmailAddress: z.string().optional(),
      customerFirstName: z.string().optional(),
      customerLastName: z.string().optional(),
      refundPolicyDisclosure: z.string().optional(),
      refundPolicyFile: z.object({ id: z.string() }).optional(),
      refundRefusalExplanation: z.string().optional(),
      shippingAddress: z.object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional(),
        zip: z.string().optional()
      }).optional(),
      shippingCarrier: z.string().optional(),
      shippingDate: z.string().optional(),
      shippingDocumentationFile: z.object({ id: z.string() }).optional(),
      shippingTrackingNumber: z.string().optional(),
      shippingTrackingUrl: z.string().optional(),
      uncategorizedFile: z.object({ id: z.string() }).optional(),
      uncategorizedText: z.string().optional()
    })
  },
  async (args) => {
    const result = await disputeEvidenceUpdate.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered draft-order-create-merchant-checkout");
server.tool(
  "draft-order-create-merchant-checkout",
  {
    input: z.object({
      allowPartialAddresses: z.boolean().optional(),
      appliedDiscount: z.object({
        amount: z.string().optional(),
        description: z.string().optional(),
        title: z.string().optional(),
        value: z.number().optional(),
        valueType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']).optional()
      }).optional(),
      billingAddress: z.object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional(),
        zip: z.string().optional()
      }).optional(),
      customAttributes: z.array(z.object({
        key: z.string(),
        value: z.string()
      })).optional(),
      email: z.string().optional(),
      lineItems: z.array(z.object({
        appliedDiscount: z.object({
          amount: z.string().optional(),
          description: z.string().optional(),
          title: z.string().optional(),
          value: z.number().optional(),
          valueType: z.enum(['FIXED_AMOUNT', 'PERCENTAGE']).optional()
        }).optional(),
        customAttributes: z.array(z.object({
          key: z.string(),
          value: z.string()
        })).optional(),
        originalUnitPrice: z.string().optional(),
        quantity: z.number(),
        requiresShipping: z.boolean().optional(),
        taxable: z.boolean().optional(),
        title: z.string().optional(),
        variantId: z.string(),
        weight: z.object({
          unit: z.enum(['KILOGRAMS', 'GRAMS', 'POUNDS', 'OUNCES']),
          value: z.number()
        }).optional()
      })).optional(),
      localizationExtensions: z.array(z.object({
        key: z.string(),
        value: z.string()
      })).optional(),
      note: z.string().optional(),
      presentmentCurrencyCode: z.string().optional(),
      shippingAddress: z.object({
        address1: z.string().optional(),
        address2: z.string().optional(),
        city: z.string().optional(),
        company: z.string().optional(),
        country: z.string().optional(),
        countryCode: z.string().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        phone: z.string().optional(),
        province: z.string().optional(),
        provinceCode: z.string().optional(),
        zip: z.string().optional()
      }).optional(),
      shippingLine: z.object({
        handle: z.string().optional(),
        price: z.string().optional(),
        title: z.string().optional()
      }).optional(),
      sourceName: z.string().optional(),
      tags: z.array(z.string()).optional(),
      taxExempt: z.boolean().optional(),
      useCustomerDefaultAddress: z.boolean().optional()
    })
  },
  async (args) => {
    const result = await draftOrderCreateMerchantCheckout.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered draft-order-delete");
server.tool(
  "draft-order-delete",
  {
    id: z.string().min(1, "Draft order ID is required")
  },
  async (args) => {
    const result = await draftOrderDelete.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered draft-order-invoice-preview");
server.tool(
  "draft-order-invoice-preview",
  {
    id: z.string().min(1, "Draft order ID is required"),
    email: z.string().email().optional()
  },
  async (args) => {
    const result = await draftOrderInvoicePreview.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

console.error("Registered file-acknowledge-update-failed");
server.tool(
  "file-acknowledge-update-failed",
  {
    fileId: z.string().min(1, "File ID is required"),
    failureReason: z.string().min(1, "Failure reason is required")
  },
  async (args) => {
    const result = await fileAcknowledgeUpdateFailed.execute(args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  }
);

// Start the server
const transport = new StdioServerTransport();
console.error("Initializing Shopify MCP server...");
server
  .connect(transport)
  .then(() => {
    console.error("Shopify MCP server connected successfully");
  })
  .catch((error: unknown) => {
    console.error("Failed to start Shopify MCP Server:", error);
  });