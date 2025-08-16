import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { backendUrl } from '../config';

// Example blog data (fallback/template)
const exampleBlog = {
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
};

// Interface for API blog response
interface ApiBlogResponse {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
  author?: {
    name?: string;
    username?: string;
  };
}

// Interface for transformed blog data
interface BlogData {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedDate: string;
  readTime: string;
  tags: string[];
  isBookmarked: boolean;
}

export const Blog = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState<BlogData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Function to calculate read time based on content length
    const calculateReadTime = (content: string): string => {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    };

    // Function to generate tags from content
    const generateTags = (title: string, content: string): string[] => {
        // Define keywords with proper capitalization
        const techKeywords = {
            'docker': 'Docker',
            'javascript': 'JavaScript', 
            'typescript': 'TypeScript',
            'react': 'React',
            'node': 'Node.js',
            'python': 'Python',
            'devops': 'DevOps',
            'aws': 'AWS',
            'kubernetes': 'Kubernetes',
            'git': 'Git',
            'database': 'Database',
            'api': 'API',
            'frontend': 'Frontend',
            'backend': 'Backend',
            'fullstack': 'Full Stack',
            'web': 'Web',
            'mobile': 'Mobile',
            'tutorial': 'Tutorial',
            'guide': 'Guide'
        };
        
        const text = (title + ' ' + content).toLowerCase();
        const foundTags = Object.keys(techKeywords).filter(keyword => text.includes(keyword));
        
        // Map to properly capitalized versions
        const capitalizedTags = foundTags.map(tag => techKeywords[tag as keyof typeof techKeywords]);
        
        return capitalizedTags.length > 0 ? capitalizedTags.slice(0, 3) : ['Blog'];
    };

    // Function to transform API blog to BlogData format
    const transformApiBlog = useCallback((apiBlog: ApiBlogResponse): BlogData => {
        return {
            id: apiBlog.id,
            title: apiBlog.title,
            content: apiBlog.content,
            author: {
                name: apiBlog.author?.name || apiBlog.author?.username || `User ${apiBlog.authorId.substring(0, 8)}`,
                avatar: undefined
            },
            publishedDate: apiBlog.createdAt || new Date().toISOString(),
            readTime: calculateReadTime(apiBlog.content),
            tags: generateTags(apiBlog.title, apiBlog.content),
            isBookmarked: false
        };
    }, []);

    // Fetch blog data from API
    useEffect(() => {
        const fetchBlog = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${backendUrl}/blog/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        // Blog not found, use example blog if ID is "1", otherwise show error
                        if (id === "1") {
                            setBlog(exampleBlog);
                        } else {
                            throw new Error('Blog not found');
                        }
                    } else {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    console.log('API Response:', data); // Debug log
                    
                    if (data.blog || data) {
                        // Transform API blog to match our component interface
                        const blogData = data.blog || data;
                        const transformedBlog = transformApiBlog(blogData);
                        setBlog(transformedBlog);
                    } else {
                        throw new Error('Invalid blog data received');
                    }
                }
            } catch (err) {
                console.error('Failed to fetch blog:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch blog');
                
                // Fallback to example blog if ID is "1"
                if (id === "1") {
                    setBlog(exampleBlog);
                    setError(null); // Clear error since we have fallback
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, transformApiBlog]);
    
    // Use example blog as fallback for template
    const blogData = blog;

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                            <span className="text-gray-600 dark:text-gray-400">Loading blog...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-6">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-red-700 dark:text-red-300">
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                {/* Blog Content */}
                {!loading && (
                    <article className="prose lg:prose-xl mx-auto">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {blogData ? blogData.title : `Blog Post #${id}`}
                        </h1>
                        <div className="flex items-center space-x-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
                            <span>By {blogData ? blogData.author.name : "John Doe"}</span>
                            <span>•</span>
                            <span>Published on {blogData ? new Date(blogData.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Jan 15, 2025"}</span>
                            <span>•</span>
                            <span>{blogData ? blogData.readTime : "5 min read"}</span>
                            {blogData && blogData.tags && (
                                <>
                                    <span>•</span>
                                    <div className="flex items-center space-x-2">
                                        {blogData.tags.map((tag, index) => (
                                            <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        
                        <div className="prose max-w-none dark:prose-invert">
                            {blogData ? (
                                <div>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {blogData.content}
                                    </p>
                                    
                                    {blogData.id === "1" && (
                                        <>
                                            <h2>About Docker Containers</h2>
                                            <p>
                                                Docker containers provide a lightweight, portable way to package applications 
                                                and their dependencies. This technology has become essential for modern 
                                                development workflows and deployment strategies.
                                            </p>
                                            
                                            <h2>Key Benefits</h2>
                                            <ul>
                                                <li>Consistent environments across development, testing, and production</li>
                                                <li>Improved resource utilization compared to traditional VMs</li>
                                                <li>Simplified application deployment and scaling</li>
                                                <li>Enhanced developer productivity through standardized workflows</li>
                                            </ul>
                                        </>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p>
                                        This is a placeholder for the individual blog post content. 
                                        In a real application, you would fetch the blog post data 
                                        based on the ID parameter and display the full content here.
                                    </p>
                                    
                                    <p>
                                        The content would include the full blog post text, images, 
                                        code snippets, and other rich media elements.
                                    </p>
                                    
                                    <h2>Example Section</h2>
                                    
                                    <p>
                                        This would be where the actual blog content lives, formatted 
                                        with proper typography and styling.
                                    </p>
                                </div>
                            )}
                        </div>
                    </article>
                )}
            </div>
        </Layout>
    );
};