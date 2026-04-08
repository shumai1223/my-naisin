import fs from 'fs';
import path from 'path';

const postsDir = 'src/lib/blog/posts';
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Fix the double brace issue: {{ ... }} -> { ... }
    // and also check for other common split errors if any
    content = content.replace('export const post: BlogPost = {{', 'export const post: BlogPost = {');
    content = content.replace('}};', '};');
    
    fs.writeFileSync(filePath, content);
});
console.log('Fixed all post files');
