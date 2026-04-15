import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const server = new Server({ name: "search", version: "1.2.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [{
    name: "web_search",
    description: "Google/DuckDuckGo検索を行い、検索結果の要約を直接取得します。",
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
    try {
      // DuckDuckGoのHTML版をフェッチ
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      
      // 検索結果のタイトルとスニペットを抽出する簡易的な正規表現
      // DuckDuckGo HTML版の構造: <a class="result__a" ...>Title</a> ... <a class="result__snippet" ...>Snippet</a>
      const results = [];
      const resultBlocks = html.split('class="result__body"').slice(1, 6); // 上位5件

      for (const block of resultBlocks) {
        const titleMatch = block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
        const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
        const linkMatch = block.match(/class="result__url"[^>]*>([\s\S]*?)<\/a>/);

        if (titleMatch && snippetMatch) {
          results.push({
            title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
            snippet: snippetMatch[1].replace(/<[^>]*>/g, '').trim(),
            link: linkMatch ? linkMatch[1].replace(/<[^>]*>/g, '').trim() : ''
          });
        }
      }

      if (results.length > 0) {
        const text = results.map((r, i) => `[${i+1}] ${r.title}\n   ${r.snippet}\n   (Source: ${r.link})`).join('\n\n');
        return {
          content: [{ type: "text", text: `「${q}」の検索結果:\n\n${text}` }]
        };
      } else {
        return {
          content: [{ type: "text", text: "検索結果が見つかりませんでした。HTMLの構造が変わった可能性があります。" }]
        };
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `検索中にエラーが発生しました: ${error.message}` }]
      };
    }
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
