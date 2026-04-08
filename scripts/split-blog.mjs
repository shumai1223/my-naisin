import fs from 'fs';
import path from 'path';

const filePath = 'src/lib/blog-data.ts';
const content = fs.readFileSync(filePath, 'utf-8');

// Find the content inside the BLOG_POSTS array
const startMarker = 'export const BLOG_POSTS: BlogPost[] = [';
const endMarker = '];';

const startIndex = content.indexOf(startMarker);
const endIndex = content.lastIndexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found');
    process.exit(1);
}

const arrayContent = content.substring(startIndex + startMarker.length, endIndex);

// We'll split the content into individual post objects.
// Since each post object starts with '{' at the beginning of a line (roughly)
const posts = [];
let currentPost = '';
let braceLevel = 0;
let inString = false;
let stringChar = '';

for (let i = 0; i < arrayContent.length; i++) {
    const char = arrayContent[i];
    const prevChar = i > 0 ? arrayContent[i-1] : '';

    if (!inString) {
        if (char === "'" || char === '"' || char === '`') {
            inString = true;
            stringChar = char;
        } else if (char === '{') {
            braceLevel++;
        } else if (char === '}') {
            braceLevel--;
            if (braceLevel === 0) {
                currentPost += char;
                posts.push(currentPost);
                currentPost = '';
                continue;
            }
        }
    } else {
        if (char === stringChar && prevChar !== '\\') {
            inString = false;
        }
    }

    if (braceLevel > 0 || inString) {
        currentPost += char;
    }
}

console.log(`Found ${posts.length} posts`);

if (!fs.existsSync('src/lib/blog/posts')) {
    fs.mkdirSync('src/lib/blog/posts', { recursive: true });
}

posts.forEach(postStr => {
    const slugMatch = postStr.match(/slug:\s*['"`](.*?)['"`]/);
    if (slugMatch) {
        const slug = slugMatch[1];
        const fileName = `src/lib/blog/posts/${slug}.ts`;
        const fileContent = `import { BlogPost } from '../types';

export const post: BlogPost = {${postStr.trim()}};
`;
        fs.writeFileSync(fileName, fileContent);
        console.log(`Wrote ${fileName}`);
    }
});
