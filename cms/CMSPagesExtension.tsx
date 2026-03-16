// ═══════════════════════════════════════════════════════
//  API Documentation Page - Comprehensive Endpoint Reference
// ═══════════════════════════════════════════════════════

import { Code2, Book, Shield, Zap } from "lucide-react";
import { Badge, Button } from "../components/ui/index";

interface EndpointDoc {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  params?: string[];
  request?: string;
  response?: string;
  useCases?: string[];
}

const PRODUCTS_ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/products",
    description: "Fetch all products with filtering, sorting, and pagination",
    params: [
      "page (1-based pagination)",
      "limit (items per page, default 20)",
      "search (product title or handle)",
      "status (active|draft|archived)",
      "collection (collection ID filter)",
      "sort (price|date|popularity)",
      "order (asc|desc)",
    ],
    request: '{ "page": 1, "limit": 12, "status": "active" }',
    response: `{
  "data": [
    {
      "id": "p1",
      "title": "Premium Wireless Headphones",
      "handle": "premium-wireless-headphones",
      "price": 199.99,
      "compareAtPrice": 249.99,
      "status": "active",
      "variants": [
        { "id": "v1", "title": "Black", "sku": "WH-1000BK", "inventory": 45 }
      ]
    }
  ],
  "total": 324,
  "page": 1,
  "totalPages": 27
}`,
    useCases: [
      "Display product listings on storefront",
      "Product search functionality",
      "Inventory management in admin panel",
      "Filter products by collection or status",
    ],
  },
  {
    method: "POST",
    path: "/products",
    description: "Create a new product",
    request: `{
  "title": "New Product",
  "handle": "new-product",
  "description": "<p>Product details</p>",
  "price": 99.99,
  "variants": [{ "title": "Default", "sku": "NP-001", "price": 99.99 }]
}`,
    response: '{ "data": { "id": "p123", "title": "New Product", ... } }',
    useCases: [
      "Add new product to catalog",
      "Set initial pricing and variants",
      "Enable product for customers",
    ],
  },
  {
    method: "PUT",
    path: "/products/:id",
    description: "Update product information",
    request: '{ "title": "Updated Title", "price": 109.99 }',
    response: '{ "data": { ...updatedProduct } }',
    useCases: [
      "Update product details",
      "Change pricing",
      "Modify product description",
    ],
  },
  {
    method: "DELETE",
    path: "/products/:id",
    description: "Delete or archive a product",
    response: '{ "success": true }',
    useCases: ["Remove discontinued products", "Archive inactive items"],
  },
];

const ORDERS_ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/orders",
    description: "Fetch all orders with filtering and pagination",
    params: [
      "page (pagination)",
      "limit (items per page)",
      "status (open|closed|cancelled)",
      "paymentStatus (paid|pending|failed|refunded)",
      "fulfillmentStatus (unfulfilled|fulfilled|partially-fulfilled)",
      "dateFrom (ISO date)",
      "dateTo (ISO date)",
    ],
    response: `{
  "data": [
    {
      "id": "o1",
      "orderNumber": 1001,
      "status": "open",
      "paymentStatus": "paid",
      "fulfillmentStatus": "unfulfilled",
      "totalPrice": 249.99,
      "currency": "USD",
      "createdAt": "2024-06-15T10:30:00Z"
    }
  ]
}`,
    useCases: [
      "Order management dashboard",
      "Real-time order tracking",
      "Revenue reporting",
      "Filter orders by payment/fulfillment status",
    ],
  },
  {
    method: "GET",
    path: "/orders/:id",
    description: "Get detailed order information",
    response: `{
  "data": {
    "id": "o1",
    "orderNumber": 1001,
    "lineItems": [
      { "title": "Product", "quantity": 2, "price": 99.99, "variantTitle": "Black" }
    ],
    "customerEmail": "customer@example.com",
    "shippingAddress": { ... },
    "fulfillments": [],
    "refunds": []
  }
}`,
    useCases: [
      "View detailed order information",
      "Track customer purchases",
      "Process returns and refunds",
    ],
  },
  {
    method: "POST",
    path: "/orders/:id/fulfill",
    description: "Mark order as fulfilled (create fulfillment)",
    request:
      '{ "lineItems": ["li1", "li2"], "trackingInfo": { "number": "123ABC" } }',
    response: '{ "data": { "id": "f1", "status": "success", ... } }',
    useCases: [
      "Confirm order shipment",
      "Add tracking information",
      "Notify customers of fulfillment",
    ],
  },
  {
    method: "POST",
    path: "/orders/:id/refund",
    description: "Process order refund",
    request: '{ "amount": 99.99, "reason": "Customer request" }',
    response:
      '{ "data": { "id": "r1", "amount": 99.99, "status": "success" } }',
    useCases: [
      "Process customer refunds",
      "Handle returns",
      "Issue partial refunds",
    ],
  },
];

const CUSTOMERS_ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/customers",
    description: "Fetch all customers with search and filtering",
    params: [
      "page",
      "limit",
      "search (email or name)",
      "verified (true|false)",
      "marketingOptIn (true|false|all)",
    ],
    response: `{
  "data": [
    {
      "id": "c1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "ordersCount": 5,
      "totalSpent": 599.99,
      "acceptsMarketing": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}`,
    useCases: [
      "Customer list management",
      "Email campaign targeting",
      "Customer analytics",
      "VIP customer identification",
    ],
  },
  {
    method: "GET",
    path: "/customers/:id",
    description: "Get detailed customer information",
    response: `{
  "data": {
    "id": "c1",
    "firstName": "John",
    "email": "john@example.com",
    "addresses": [ { "address1": "123 Main St", "city": "NYC", ... } ],
    "tags": ["vip", "frequent-buyer"],
    "orders": [ "o1", "o2", "o3", "o4", "o5" ]
  }
}`,
    useCases: [
      "Customer profile view",
      "Order history lookup",
      "Customer segmentation",
    ],
  },
  {
    method: "POST",
    path: "/customers",
    description: "Create new customer account",
    request: `{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "acceptsMarketing": true,
  "addresses": [ { "address1": "456 Oak Ave", ... } ]
}`,
    response: '{ "data": { "id": "c2", ... } }',
    useCases: [
      "Create customer accounts",
      "Import bulk customer data",
      "Admin customer creation",
    ],
  },
];

const DISCOUNTS_ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/discounts/codes",
    description: "Fetch all discount codes",
    params: ["page", "limit", "active (true|false)"],
    response: `{
  "data": [
    {
      "id": "d1",
      "code": "SAVE20",
      "type": "percentage",
      "value": 20,
      "active": true,
      "usageCount": 145,
      "usageLimit": 500,
      "oncePerCustomer": false
    }
  ]
}`,
    useCases: [
      "Manage promotional codes",
      "Track discount usage",
      "Set per-customer limits",
    ],
  },
  {
    method: "POST",
    path: "/discounts/codes",
    description: "Create new discount code",
    request: `{
  "code": "SUMMER25",
  "type": "percentage",
  "value": 25,
  "usageLimit": 1000,
  "oncePerCustomer": true,
  "active": true
}`,
    response: '{ "data": { "id": "d2", "code": "SUMMER25", ... } }',
    useCases: [
      "Create seasonal promotions",
      "Launch new discount campaigns",
      "Implement referral discount codes",
    ],
  },
];

const MEDIA_ENDPOINTS: EndpointDoc[] = [
  {
    method: "GET",
    path: "/media",
    description: "Fetch media library files",
    params: ["page", "limit", "folder", "mimeType (image|video|all)"],
    response: `{
  "data": [
    {
      "id": "m1",
      "filename": "product-image.jpg",
      "url": "https://cdn.example.com/product-image.jpg",
      "mimeType": "image/jpeg",
      "size": 245000,
      "width": 1200,
      "height": 800,
      "alt": "Product showcase"
    }
  ]
}`,
    useCases: [
      "Product image management",
      "Bulk media organization",
      "CDN asset tracking",
    ],
  },
  {
    method: "POST",
    path: "/media",
    description: "Upload new media file",
    request: "FormData: file, folder, alt",
    response: "{ data: { id, filename, url, ... } }",
    useCases: [
      "Upload product images",
      "Add video content",
      "Organize media by folder",
    ],
  },
];

export function APIDocumentationPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const toggleExpanded = (section: string) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <div style={{ padding: "24px", maxWidth: "92%", margin: "0 auto" }}>
      <div
        style={{
          marginBottom: 32,
          paddingBottom: 24,
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <Book size={28} color="var(--primary)" />
          <h1
            style={{
              color: "var(--text-primary)",
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            API Documentation
          </h1>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: 14, margin: 0 }}>
          Complete reference for all CMS API endpoints with request/response
          examples
        </p>
      </div>

      {/* Overview */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            marginTop: 0,
            marginBottom: 12,
          }}
        >
          API Overview
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          <div>
            <p
              style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 0 }}
            >
              <strong>Base URL:</strong>
            </p>
            <code
              style={{
                background: "var(--bg-tertiary)",
                padding: "8px 12px",
                borderRadius: 8,
                display: "block",
                fontSize: 12,
                fontFamily: "monospace",
                color: "var(--text-secondary)",
                marginBottom: 12,
              }}
            >
              {(import.meta as any).env?.VITE_API_URL ||
                "http://localhost:4000/api/v1"}
            </code>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              <strong>Authentication:</strong> Bearer token in Authorization
              header
            </p>
          </div>
          <div>
            <p
              style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 0 }}
            >
              <strong>Content-Type:</strong> application/json
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              <strong>Response Format:</strong> All responses follow {"{"}data,
              error{"}"} pattern
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: 13 }}>
              <strong>Rate Limit:</strong> 1000 requests per hour
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints Sections */}
      {[
        { title: "Products", endpoints: PRODUCTS_ENDPOINTS },
        { title: "Orders", endpoints: ORDERS_ENDPOINTS },
        { title: "Customers", endpoints: CUSTOMERS_ENDPOINTS },
        { title: "Discounts", endpoints: DISCOUNTS_ENDPOINTS },
        { title: "Media", endpoints: MEDIA_ENDPOINTS },
      ].map((section) => (
        <EndpointSection
          key={section.title}
          title={section.title}
          endpoints={section.endpoints}
          isExpanded={expanded === section.title}
          onToggle={() => toggleExpanded(section.title)}
        />
      ))}

      {/* Error Codes */}
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 20,
          marginTop: 24,
        }}
      >
        <h3
          style={{
            color: "var(--text-primary)",
            marginTop: 0,
            marginBottom: 16,
          }}
        >
          HTTP Status Codes
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 12,
          }}
        >
          {[
            { code: 200, desc: "OK - Request successful" },
            { code: 201, desc: "Created - Resource created successfully" },
            { code: 400, desc: "Bad Request - Invalid parameters" },
            { code: 401, desc: "Unauthorized - Invalid or missing auth token" },
            { code: 403, desc: "Forbidden - Insufficient permissions" },
            { code: 404, desc: "Not Found - Resource doesn't exist" },
            { code: 429, desc: "Too Many Requests - Rate limit exceeded" },
            { code: 500, desc: "Server Error - Internal server error" },
          ].map((item) => (
            <div
              key={item.code}
              style={{
                padding: 12,
                background: "var(--bg-tertiary)",
                borderRadius: 8,
              }}
            >
              <Badge variant="ghost">{item.code}</Badge>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  margin: "8px 0 0",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EndpointSection({
  title,
  endpoints,
  isExpanded,
  onToggle,
}: {
  title: string;
  endpoints: EndpointDoc[];
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <div
        onClick={onToggle}
        style={{
          padding: 16,
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: isExpanded ? "var(--bg-tertiary)" : "transparent",
        }}
      >
        <h3 style={{ color: "var(--text-primary)", margin: 0, fontSize: 16 }}>
          {title}
        </h3>
        <span style={{ color: "var(--text-muted)" }}>
          {isExpanded ? "−" : "+"}
        </span>
      </div>

      {isExpanded && (
        <div style={{ borderTop: "1px solid var(--border)", padding: 16 }}>
          {endpoints.map((endpoint) => (
            <div
              key={endpoint.path}
              style={{
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <Badge
                  variant={
                    endpoint.method === "GET"
                      ? "success"
                      : endpoint.method === "POST"
                        ? "primary"
                        : endpoint.method === "PUT"
                          ? "warning"
                          : "danger"
                  }
                >
                  {endpoint.method}
                </Badge>
                <code
                  style={{
                    fontSize: 13,
                    background: "var(--bg-tertiary)",
                    padding: "4px 8px",
                    borderRadius: 4,
                    color: "var(--text-secondary)",
                    fontFamily: "monospace",
                  }}
                >
                  {endpoint.path}
                </code>
              </div>
              <p style={{ color: "var(--text-secondary)", margin: "8px 0" }}>
                {endpoint.description}
              </p>

              {endpoint.params && (
                <div style={{ marginTop: 12 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      margin: "0 0 6px",
                    }}
                  >
                    Parameters:
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      color: "var(--text-secondary)",
                      fontSize: 12,
                    }}
                  >
                    {endpoint.params.map((param) => (
                      <li key={param} style={{ marginBottom: 4 }}>
                        {param}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {endpoint.request && (
                <CodeBlock label="Request Example" code={endpoint.request} />
              )}

              {endpoint.response && (
                <CodeBlock label="Response Example" code={endpoint.response} />
              )}

              {endpoint.useCases && (
                <div style={{ marginTop: 12 }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      margin: "0 0 6px",
                    }}
                  >
                    Use Cases:
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 20,
                      color: "var(--text-secondary)",
                      fontSize: 12,
                    }}
                  >
                    {endpoint.useCases.map((useCase) => (
                      <li key={useCase} style={{ marginBottom: 4 }}>
                        {useCase}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 6,
        }}
      >
        <p
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          {label}
        </p>
        <button
          onClick={() => {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          style={{
            fontSize: 11,
            background: copied ? "var(--primary)" : "var(--border)",
            color: copied ? "white" : "var(--text-muted)",
            border: "none",
            borderRadius: 4,
            padding: "4px 8px",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          padding: 12,
          overflow: "auto",
          fontSize: 11,
          color: "var(--text-secondary)",
          fontFamily: "monospace",
          margin: 0,
          maxHeight: 200,
        }}
      >
        {code}
      </pre>
    </div>
  );
}

import { useState } from "react";
