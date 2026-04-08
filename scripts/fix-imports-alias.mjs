import fs from 'fs';
import path from 'path';

const postsDir = 'src/lib/blog/posts';
const files = fs.readdirSync(postsDir);

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Replace relative import with alias
    content = content.replace("import { BlogPost } from '../types';", "import { BlogPost } from '@/lib/blog/types';");
    content = content.replace('import { BlogPost } from "../types";', "import { BlogPost } from '@/lib/blog/types';");
    
    fs.writeFileSync(filePath, content);
});
console.log('Updated all posts to use alias for types');
