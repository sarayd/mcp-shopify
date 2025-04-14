# Shopify MCP Server
[![smithery badge](https://smithery.ai/badge/@sarayd/shopify)](https://smithery.ai/server/@sarayd/shopify)


MCP Server for Shopify API, enabling interaction with store data through GraphQL API. This server provides tools for managing products, customers, orders, and more.

## Features

- **Product Management**: Search and retrieve product information
- **Customer Management**: Load customer data and manage customer tags
- **Order Management**: Advanced order querying and filtering
- **Collection Management**: Create and manage collections

## Setup

### Shopify Access Token

To use this MCP server, you'll need to create a custom app in your Shopify store:

1. From your Shopify admin, go to **Settings** > **Apps and sales channels**
2. Click **Develop apps** (you may need to enable developer preview first)
3. Click **Create an app**
4. Set a name for your app (e.g., "Shopify MCP Server")
5. Click **Configure Admin API scopes**
6. Select the following scopes:
   - `read_products`, `write_products`
   - `read_customers`, `write_customers`
   - `read_orders`, `write_orders`
   - `read_collections`, `write_collections`
7. Click **Save**
8. Click **Install app**
9. Click **Install** to give the app access to your store data
10. After installation, you'll see your **Admin API access token**
11. Copy this token - you'll need it for configuration

### Usage with Claude Desktop

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "shopify": {
      "command": "npx",
      "args": [
        "shopify-mcp",
        "--accessToken",
        "<YOUR_ACCESS_TOKEN>",
        "--domain",
        "<YOUR_SHOP>.myshopify.com"
      ]
    }
  }
}
```

Locations for the Claude Desktop config file:

- MacOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%/Claude/claude_desktop_config.json`

### Alternative: Run Locally with Environment Variables

If you prefer to use environment variables instead of command-line arguments:

1. Create a `.env` file with your Shopify credentials:

   ```
   SHOPIFY_ACCESS_TOKEN=your_access_token
   MYSHOPIFY_DOMAIN=your-store.myshopify.com
   ```

2. Run the server with npx:
   ```
   npx shopify-mcp
   ```

### Direct Installation (Optional)

If you want to install the package globally:

```
npm install -g shopify-mcp
```

Then run it:

```
shopify-mcp --accessToken=<YOUR_ACCESS_TOKEN> --domain=<YOUR_SHOP>.myshopify.com
```

## Available Tools

### Product Management

1. `get-products`

   - Get all products or search by title
   - Inputs:
     - `searchTitle` (optional string): Filter products by title
     - `limit` (number): Maximum number of products to return

2. `get-product-by-id`
   - Get a specific product by ID
   - Inputs:
     - `productId` (string): ID of the product to retrieve

### Customer Management

1. `get-customers`

   - Get customers or search by name/email
   - Inputs:
     - `searchQuery` (optional string): Filter customers by name or email
     - `limit` (optional number, default: 10): Maximum number of customers to return

2. `update-customer`

   - Update a customer's information
   - Inputs:
     - `id` (string, required): Shopify customer ID (numeric ID only, like "6276879810626")
     - `firstName` (string, optional): Customer's first name
     - `lastName` (string, optional): Customer's last name
     - `email` (string, optional): Customer's email address
     - `phone` (string, optional): Customer's phone number
     - `tags` (array of strings, optional): Tags to apply to the customer
     - `note` (string, optional): Note about the customer
     - `taxExempt` (boolean, optional): Whether the customer is exempt from taxes
     - `metafields` (array of objects, optional): Customer metafields for storing additional data

3. `get-customer-orders`

   - Get orders for a specific customer
   - Inputs:
     - `customerId` (string, required): Shopify customer ID (numeric ID only, like "6276879810626")
     - `limit` (optional number, default: 10): Maximum number of orders to return

4. `create-customer`
   - Create a new customer in Shopify
   - Inputs:
     - `email` (string, required): Customer's email address
     - `firstName` (string, optional): Customer's first name
     - `lastName` (string, optional): Customer's last name
     - `phone` (string, optional): Customer's phone number
     - `tags` (array of strings, optional): Tags to apply to the customer
     - `note` (string, optional): Note about the customer
     - `taxExempt` (boolean, optional): Whether the customer is exempt from taxes
     - `password` (string, optional): Password for the customer account
     - `passwordConfirmation` (string, optional): Confirmation of the password
     - `addresses` (array of objects, optional): Customer's addresses
     - `metafields` (array of objects, optional): Customer metafields for storing additional data

### Order Management

1. `get-orders`

   - Get orders with optional filtering
   - Inputs:
     - `status` (optional string): Filter by order status
     - `limit` (optional number, default: 10): Maximum number of orders to return

2. `get-order-by-id`

   - Get a specific order by ID
   - Inputs:
     - `orderId` (string, required): Full Shopify order ID (e.g., "gid://shopify/Order/6090960994370")

3. `update-order`

   - Update an existing order with new information
   - Inputs:
     - `id` (string, required): Shopify order ID
     - `tags` (array of strings, optional): New tags for the order
     - `email` (string, optional): Update customer email
     - `note` (string, optional): Order notes
     - `customAttributes` (array of objects, optional): Custom attributes for the order
     - `metafields` (array of objects, optional): Order metafields
     - `shippingAddress` (object, optional): Shipping address information

4. `create-order`

   - Create a new draft order in Shopify
   - Inputs:
     - `lineItems` (array of objects, required): Products to include in the order
       - `variantId` (string, required): ID of the product variant
       - `quantity` (number, required): Quantity of the product
       - `customAttributes` (array of objects, optional): Custom attributes for the line item
     - `email` (string, optional): Customer email
     - `phone` (string, optional): Customer phone number
     - `note` (string, optional): Order notes
     - `tags` (array of strings, optional): Tags for the order
     - `customAttributes` (array of objects, optional): Custom attributes for the order
     - `metafields` (array of objects, optional): Order metafields
     - `billingAddress` (object, optional): Billing address information
     - `shippingAddress` (object, optional): Shipping address information
     - `customerId` (string, optional): ID of an existing customer
     - `shippingLine` (object, optional): Shipping method and price
     - `taxExempt` (boolean, optional): Whether the order is exempt from taxes
     - `presentmentCurrencyCode` (string, optional): Currency code for the order

5. `create-fulfillment`
   - Create a new fulfillment for an order in Shopify
   - Inputs:
     - `orderId` (string, required): ID of the order to fulfill
     - `notifyCustomer` (boolean, default: true): Whether to notify the customer about the fulfillment
     - `trackingInfo` (object, optional): Tracking information
       - `number` (string, optional): Tracking number
       - `url` (string, optional): Tracking URL
       - `company` (string, optional): Shipping company
     - `lineItems` (array of objects, optional): Specific line items to fulfill
       - `id` (string, required): ID of the line item
       - `quantity` (number, required): Quantity to fulfill
     - `locationId` (string, optional): ID of the location fulfilling the order
     - `trackingNumbers` (array of strings, optional): Multiple tracking numbers
     - `trackingUrls` (array of strings, optional): Multiple tracking URLs
     - `metadata` (object, optional): Additional metadata for the fulfillment

### Collection Management

1. `create-collection`
   - Create a new manual or automated collection in Shopify
   - Inputs:
     - `title` (string, required): Collection title
     - `description` (string, optional): Collection description
     - `descriptionHtml` (string, optional): HTML version of the description
     - `handle` (string, optional): URL handle for the collection
     - `isPublished` (boolean, optional): Whether the collection is published
     - `seo` (object, optional): SEO settings
       - `title` (string, optional): SEO title
       - `description` (string, optional): SEO description
     - `image` (object, optional): Collection image
       - `src` (string, required): Image URL
       - `altText` (string, optional): Alt text for the image
     - `productsToAdd` (array of strings, optional): Product IDs to add to the collection
     - `sortOrder` (string, optional): How products are sorted in the collection
       - Options: "MANUAL", "BEST_SELLING", "ALPHA_ASC", "ALPHA_DESC", "PRICE_DESC", "PRICE_ASC", "CREATED", "CREATED_DESC", "ID_DESC", "RELEVANCE"
     - `templateSuffix` (string, optional): Template suffix for custom templates
     - `privateMetafields` (array of objects, optional): Private metafields for the collection
       - `owner` (string, required): Metafield owner
       - `namespace` (string, required): Metafield namespace
       - `key` (string, required): Metafield key
       - `value` (string, required): Metafield value
       - `valueType` (string, required): Type of the value (e.g., "STRING", "INTEGER", etc.)
     - `ruleSet` (object, optional): Rules for automated collections
       - `rules` (array of objects, required): Collection rules
         - `column` (string, required): Rule column (e.g., "TAG", "TITLE", etc.)
         - `relation` (string, required): Rule relation (e.g., "EQUALS", "CONTAINS", etc.)
         - `condition` (string, required): Rule condition value
       - `appliedDisjunctively` (boolean, optional, default: true): Whether rules are combined with OR (true) or AND (false)
     - `metafields` (array of objects, optional): Public metafields for the collection
       - `namespace` (string, required): Metafield namespace
       - `key` (string, required): Metafield key
       - `value` (string, required): Metafield value
       - `type` (string, required): Metafield type
     - `publications` (array of objects, optional): Publication settings
       - `publicationId` (string, required): ID of the publication
       - `publishDate` (string, optional): Date to publish the collection

## License

MIT
