# MCP Sample Server (JavaScript)
A minimal, browser-friendly sample MCP-style server written in pure Node.js + Express.  
This server exposes a single JSON manifest that follows the general shape of an MCP
(Model Context Protocol) discovery document and is intended for **testing MCP client tools**, such as:

- MCP Explorer (https://aruneshmishra.github.io/mcp-explorer/)
- Custom MCP visualizers
- Developer experiments
- LLM-driven tool discovery demos

This server is intentionally simple — it does **not** implement a full MCP runtime.  
It only serves the *manifest* (`/.well-known/mcp.json`) and a basic health endpoint.

---

## 🚀 Features
- Pure JavaScript (Node.js + Express)
- Simple MCP-style JSON manifest
- Includes sample:
  - **tools**
  - **resources**
  - **models**
  - **actions**
- Fully CORS-enabled (`Access-Control-Allow-Origin: *`)
- Ideal for browser-based testing (e.g., fetch requests from an SPA)
- Zero dependencies beyond Express

---

## 📔 Example Manifest Content
The server returns JSON like:

- Tools: `echo`, `sum`, `get_time`
- Resources: simple demo dataset
- Models: placeholder LLM metadata
- Actions: a sample notification action

This gives developers something realistic to test MCP clients against.

---

## 📦 Installation

### Clone the re
