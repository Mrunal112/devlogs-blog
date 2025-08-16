import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { backendUrl } from '../config';

// Mock blog data for fallback
const mockBlogData = {
  "1": {
    id: "1",
    title: "Docker Fundamentals: Complete Guide for Beginners",
    content: "Docker has revolutionized the way we develop, ship, and run applications. In this comprehensive guide, we'll explore everything you need to know about Docker containers, from basic concepts to advanced deployment strategies. Learn how to containerize your applications, manage Docker images, and orchestrate multi-container applications with Docker Compose. We'll cover best practices for writing Dockerfiles, optimizing container performance, and troubleshooting common Docker issues that developers face in production environments.",
    author: {
      name: "Mrunal Munjamkar",
      avatar: undefined
    },
    publishedDate: "2025-01-15",
    readTime: "8 min read",
    tags: ["Docker", "DevOps", "Containers"],
    isBookmarked: false
  }
};

// Interface for blog post data
interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedDate: string;
  readTime?: string;
  tags?: string[];
  isBookmarked?: boolean;
}

// Interface for API blog response
interface ApiBlogPost {
  id: string;
  title?: string;
  content?: string;
  authorId?: string;
  author?: {
    name?: string;
    username?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export const Blog = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Function to extract tags from title and content
    const extractTags = (title: string, content: string): string[] => {
        const text = `${title} ${content}`.toLowerCase();
        const commonTechTerms = [
            'docker', 'kubernetes', 'devops', 'containers', 'microservices', 'api', 'rest',
            'javascript', 'typescript', 'react', 'node', 'python', 'java', 'spring',
            'aws', 'azure', 'cloud', 'serverless', 'lambda', 'database', 'sql', 'nosql',
            'mongodb', 'postgresql', 'redis', 'git', 'ci/cd', 'testing', 'security',
            'performance', 'optimization', 'architecture', 'design patterns', 'algorithms',
            'frontend', 'backend', 'fullstack', 'web development', 'mobile', 'ios', 'android'
        ];

        const foundTags = commonTechTerms.filter(term => 
            text.includes(term.toLowerCase())
        );

        // Return maximum of 3 tags, prioritize longer/more specific terms
        return foundTags
            .sort((a, b) => b.length - a.length)
            .slice(0, 3)
            .map(tag => {
                // Handle multi-word tags (e.g., "web development" -> "Web Development")
                return tag.split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            });
    };

    // Function to calculate read time
    const calculateReadTime = (content: string): string => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    };

    // Function to format date
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    };

    // Fetch blog post data
    useEffect(() => {
        // Transform API blog to BlogPost format
        const transformApiBlog = (apiBlog: ApiBlogPost): BlogPost => {
            const title = apiBlog.title || 'Untitled';
            const content = apiBlog.content || 'No content available';
            const publishedDate = apiBlog.createdAt || new Date().toISOString();
            
            return {
                id: apiBlog.id,
                title,
                content,
                author: {
                    name: apiBlog.author?.name || apiBlog.author?.username || 'Anonymous'
                },
                publishedDate,
                readTime: calculateReadTime(content),
                tags: extractTags(title, content),
                isBookmarked: false
            };
        };

        const fetchBlog = async () => {
            if (!id) {
                setError('Blog ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                // First check if we have mock data for this ID
                if (mockBlogData[id as keyof typeof mockBlogData]) {
                    setBlog(mockBlogData[id as keyof typeof mockBlogData]);
                    setLoading(false);
                    return;
                }

                // Try to fetch from API
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json',
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(`${backendUrl}/blog/${id}`, {
                    method: 'GET',
                    headers
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Blog post not found');
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Blog API Response:', data);

                if (data.blog) {
                    const transformedBlog = transformApiBlog(data.blog);
                    setBlog(transformedBlog);
                } else {
                    throw new Error('Blog data not found in response');
                }
            } catch (err) {
                console.error('Failed to fetch blog:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog');
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="mb-6">
                            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Blog Not Found</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                            <button
                                onClick={() => navigate('/blogs')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Back to Blogs
                            </button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!blog) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog not found</h2>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/blogs')}
                        className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Blogs
                    </button>

                    {/* Blog Header */}
                    <header className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                            {blog.title}
                        </h1>
                        
                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center mr-3">
                                    <span className="text-white text-sm font-medium">
                                        {blog.author.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span>By {blog.author.name}</span>
                            </div>
                            <span>•</span>
                            <span>Published on {formatDate(blog.publishedDate)}</span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                        </div>

                        {/* Tags */}
                        {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {blog.tags.slice(0, 3).map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm rounded-full border border-blue-200 dark:border-blue-800"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>
                    
                    {/* Blog Content */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {blog.content.split('\n\n').map((paragraph, index) => (
                            <p key={index} className="mb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {paragraph.trim()}
                            </p>
                        ))}
                    </div>

                    {/* Article Footer */}
                    <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {/* Like Button */}
                                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span>Like</span>
                                </button>

                                {/* Share Button */}
                                <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    <span>Share</span>
                                </button>
                            </div>

                            {/* Bookmark Button */}
                            <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span>Bookmark</span>
                            </button>
                        </div>
                    </footer>
                </article>
            </div>
        </Layout>
    );
};