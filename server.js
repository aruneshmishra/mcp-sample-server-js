// Simple MCP-style sample server in Node.js (Express)
// - Serves a JSON manifest at /.well-known/mcp.json
// - Implements tiny demo tools at POST /mcp/tools/:toolName
//
// This is intentionally minimal and designed to work with the MCP Explorer SPA.

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

// JSON body parsing for tool calls
app.use(express.json());

// Very simple CORS for demo purposes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Sample MCP-like manifest
const manifest = {
  name: "sample-mcp-server",
  version: "1.0.0",
  description:
    "Sample MCP-style manifest to test MCP Explorer. Not a full MCP implementation, just discovery + simple HTTP tools.",
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
  res.send(
    "MCP Sample Server JS is running. Try /.well-known/mcp.json or POST /mcp/tools/sum"
  );
});

// MCP manifest endpoint
app.get("/.well-known/mcp.json", (req, res) => {
  res.json(manifest);
});

// Simple tool execution endpoint
// Contract:
//   POST /mcp/tools/:toolName
//   Body: { "args": { ... } }
//   Response: { "result": ... } on success, { "error": "..." } on error.
app.post("/mcp/tools/:toolName", (req, res) => {
  const toolName = req.params.toolName;
  const args = (req.body && req.body.args) || {};

  try {
    switch (toolName) {
      case "echo": {
        const message = args.message;
        if (typeof message !== "string") {
          return res
            .status(400)
            .json({ error: 'echo: "args.message" must be a string.' });
        }
        return res.json({ result: message });
      }

      case "sum": {
        const numbers = args.numbers;
        if (!Array.isArray(numbers)) {
          return res
            .status(400)
            .json({ error: 'sum: "args.numbers" must be an array of numbers.' });
        }
        const parsed = numbers.map((n) => Number(n));
        if (parsed.some((n) => Number.isNaN(n))) {
          return res
            .status(400)
            .json({ error: "sum: all items in args.numbers must be numeric." });
        }
        const total = parsed.reduce((acc, n) => acc + n, 0);
        return res.json({ result: total });
      }

      case "get_time": {
        const now = new Date().toISOString();
        return res.json({ result: now });
      }

      default: {
        return res
          .status(404)
          .json({ error: `Unknown tool "${toolName}". Available: echo, sum, get_time.` });
      }
    }
  } catch (e) {
    console.error("Tool execution error:", e);
    return res.status(500).json({ error: "Internal error executing tool." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`MCP sample server listening on http://localhost:${PORT}`);
});
