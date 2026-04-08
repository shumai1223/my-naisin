import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "search", version: "1.0.0" }, { capabilities: { tools: {} } });
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{ 
    name: "web_search", 
    description: "Google検索を行います", 
    inputSchema: { 
      type: "object", 
      properties: { query: { type: "string" } },
      required: ["query"]
    } 
  }]
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "web_search") {
    const q = request.params.arguments.query;
    return { 
      content: [{ 
        type: "text", 
        text: `ブラウザで以下のURLを開いて最新情報を確認してください：\nhttps://www.google.com/search?q=${encodeURIComponent(q)}\n\n(※現在の環境制限により、直接の検索結果の取得はここまでに留めます。URLをクリックして情報を教えてください)` 
      }] 
    };
  }
});
const transport = new StdioServerTransport();
await server.connect(transport);
