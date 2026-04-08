import fs from 'fs';
import path from 'path';

const postsDir = 'src/lib/blog/posts';
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Add PREFECTURES import if it contains template literals using it
    if (content.includes('${PREFECTURES')) {
        if (!content.includes("import { PREFECTURES } from '@/lib/prefectures'")) {
            content = "import { PREFECTURES } from '@/lib/prefectures';\n" + content;
        }
    }
    
    fs.writeFileSync(filePath, content);
});
console.log('Added PREFECTURES imports where needed');
