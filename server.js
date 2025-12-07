// Simple MCP-style sample server in Node.js (Express)
// Serves a JSON manifest at /.well-known/mcp.json
// with CORS enabled so it can be used from the browser.

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// Very simple CORS for demo purposes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Sample MCP-like manifest
const manifest = {
  name: "sample-mcp-server",
  version: "1.0.0",
  description:
    "Sample MCP-style manifest to test MCP Explorer. Not a full MCP implementation, just discovery JSON.",
  tools: [
    {
      name: "echo",
      description: "Echo back a message. Useful for connectivity checks.",
      input_schema: {
        type: "object",
        properties: {
          message: {
            type: "string",
            description: "Message to echo back."
          }
        },
        required: ["message"]
      }
    },
    {
      name: "sum",
      description: "Return the sum of an array of numbers.",
      input_schema: {
        type: "object",
        properties: {
          numbers: {
            type: "array",
            items: { type: "number" },
            description: "List of numbers to add."
          }
        },
        required: ["numbers"]
      }
    },
    {
      name: "get_time",
      description: "Get current server time in ISO format.",
      input_schema: {
        type: "object",
        properties: {},
        additionalProperties: false
      }
    }
  ],
  resources: [
    {
      name: "sample-dataset",
      description: "A fake dataset used only to demonstrate MCP resources.",
      type: "table",
      schema: {
        fields: [
          { name: "id", type: "string" },
          { name: "value", type: "string" }
        ]
      }
    }
  ],
  models: [
    {
      name: "example-llm",
      description: "Placeholder model to illustrate MCP model metadata.",
      capabilities: ["chat-completions", "embeddings"]
    }
  ],
  actions: [
    {
      name: "send_notification",
      description: "Fake action to illustrate how actions might be exposed.",
      input_schema: {
        type: "object",
        properties: {
          recipient: {
            type: "string",
            description: "Recipient identifier"
          },
          message: {
            type: "string",
            description: "Notification message text"
          }
        },
        required: ["recipient", "message"]
      }
    }
  ]
};

// Root route – just a health check
app.get("/", (req, res) => {
  res.send("MCP Sample Server JS is running. Try /.well-known/mcp.json");
});

// MCP manifest endpoint
app.get("/.well-known/mcp.json", (req, res) => {
  res.json(manifest);
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP sample server listening on http://localhost:${PORT}`);
});
