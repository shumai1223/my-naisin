export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  content: string;
  lastUpdated?: string;
  author?: string;
  supervisor?: string;
  sources?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
}
