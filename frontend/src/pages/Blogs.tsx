import { useState, useEffect, useCallback } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Layout } from '../components/Layout';
import { backendUrl } from '../config';

// Mock blog data
const mockBlogs = [
  {
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
  },
  {
    id: "2", 
    title: "Advanced Docker Networking: Connecting Containers Like a Pro",
    content: "Understanding Docker networking is crucial for building scalable microservices architectures. This deep dive covers Docker's networking models, from bridge networks to overlay networks for multi-host communication. Learn how to create custom networks, configure port mapping, and implement service discovery. We'll also explore Docker Swarm networking, load balancing strategies, and security considerations when connecting containers across different environments.",
    author: {
      name: "Mrunal Munjamkar", 
      avatar: undefined
    },
    publishedDate: "2025-01-12",
    readTime: "12 min read",
    tags: ["Docker", "Networking", "Microservices"],
    isBookmarked: true
  },
  {
    id: "3",
    title: "Docker in Production: Best Practices and Security Guidelines",
    content: "Running Docker containers in production requires careful planning and adherence to security best practices. This article covers essential production considerations including image scanning, secrets management, and resource constraints. Learn how to implement proper logging, monitoring, and health checks for containerized applications. We'll discuss multi-stage builds, distroless images, and container runtime security to ensure your Docker deployments are robust and secure.",
    author: {
      name: "Mrunal Munjamkar",
      avatar: undefined
    },
    publishedDate: "2025-01-10", 
    readTime: "15 min read",
    tags: ["Docker", "Production", "Security"],
    isBookmarked: false
  },
  {
    id: "4",
    title: "Docker Compose vs Kubernetes: When to Use What",
    content: "Choosing between Docker Compose and Kubernetes can be challenging for developers and DevOps teams. This comparison guide helps you understand the strengths and limitations of each orchestration tool. We'll explore use cases where Docker Compose excels for local development and small-scale deployments, versus when Kubernetes becomes necessary for enterprise-grade container orchestration. Learn about migration strategies and hybrid approaches.",
    author: {
      name: "Mrunal Munjamkar",
      avatar: undefined  
    },
    publishedDate: "2025-01-08",
    readTime: "10 min read", 
    tags: ["Docker", "Kubernetes", "Orchestration"],
    isBookmarked: false
  },
  {
    id: "5",
    title: "Optimizing Docker Images: From 1GB to 50MB",
    content: "Large Docker images slow down deployments and waste resources. This practical guide shows you how to dramatically reduce image sizes through various optimization techniques. Learn about multi-stage builds, choosing the right base images, and leveraging .dockerignore files effectively. We'll cover layer caching strategies, removing unnecessary packages, and using specialized minimal base images like Alpine Linux and distroless containers to achieve lightning-fast deployments.",
    author: {
      name: "Mrunal Munjamkar",
      avatar: undefined
    },
    publishedDate: "2025-01-05",
    readTime: "6 min read",
    tags: ["Docker", "Optimization", "Performance"], 
    isBookmarked: true
  }
];

// Interface for API blog response (based on actual API response)
interface ApiBlog {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  // These fields might not be present, so keeping them optional
  author?: {
    name?: string;
    username?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  publishedDate?: string;
}

// Interface for combined blog data
interface BlogData {
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

export const Blogs = () => {
  const [blogs, setBlogs] = useState<BlogData[]>(mockBlogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to calculate read time based on content length
  const calculateReadTime = useCallback((content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }, []);

  // Function to transform API blog to BlogData format
  const transformApiBlog = useCallback((apiBlog: ApiBlog): BlogData => {
    // Generate intelligent tags based on title and content
    const generateTags = (title: string, content: string): string[] => {
      const techKeywords = [
        'docker', 'javascript', 'typescript', 'react', 'node', 'python', 
        'devops', 'aws', 'kubernetes', 'git', 'database', 'api', 'frontend', 
        'backend', 'fullstack', 'web', 'mobile', 'tutorial', 'guide'
      ];
      
      const text = (title + ' ' + content).toLowerCase();
      const foundTags = techKeywords.filter(keyword => text.includes(keyword));
      
      return foundTags.length > 0 ? foundTags.slice(0, 3) : ['Blog'];
    };
    
    // Generate read time based on content length
    const readTime = calculateReadTime(apiBlog.content);
    
    // Use current date if no creation date provided
    const publishedDate = apiBlog.createdAt || apiBlog.publishedDate || new Date().toISOString();
    
    // Generate author name from authorId if no author info available
    const getAuthorName = () => {
      if (apiBlog.author?.name) return apiBlog.author.name;
      if (apiBlog.author?.username) return apiBlog.author.username;
      return `User ${apiBlog.authorId.substring(0, 8)}`;
    };
    
    // Generate avatar placeholder based on authorId
    const getAvatarPlaceholder = () => {
      return undefined; // For now, using component's default avatar generation
    };
    
    return {
      id: apiBlog.id,
      title: apiBlog.title,
      content: apiBlog.content,
      author: {
        name: getAuthorName(),
        avatar: getAvatarPlaceholder()
      },
      publishedDate: publishedDate,
      readTime: readTime,
      tags: generateTags(apiBlog.title, apiBlog.content),
      isBookmarked: false // Default to not bookmarked
    };
  }, [calculateReadTime]);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${backendUrl}/blog/bulk`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log to see the actual structure
        
        if (data.blogs && Array.isArray(data.blogs)) {
          console.log('Sample blog from API:', data.blogs[0]); // Debug log to see individual blog structure
          
          // Transform API blogs to match our component interface
          const apiBlogs = data.blogs.map(transformApiBlog);
          
          // Combine API blogs with mock blogs
          const combinedBlogs = [...mockBlogs, ...apiBlogs];
          
          // Remove duplicates based on ID (in case API returns blogs that match mock IDs)
          const uniqueBlogs = combinedBlogs.filter((blog, index, self) => 
            index === self.findIndex((b) => b.id === blog.id)
          );
          
          setBlogs(uniqueBlogs);
        } else {
          console.log('No blogs array found in response, using mock blogs only');
          // If no API blogs, just use mock blogs
          setBlogs(mockBlogs);
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch blogs');
        // On error, use mock blogs as fallback
        setBlogs(mockBlogs);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [calculateReadTime, transformApiBlog]);

  const handleBookmark = (blogId: string) => {
    setBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.id === blogId 
          ? { ...blog, isBookmarked: !blog.isBookmarked }
          : blog
      )
    );
  };

  return (
    <Layout>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen transition-colors">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Latest Docker & DevOps Articles
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover the latest insights, tutorials, and best practices for containerization and modern development workflows.
          </p>
        </div>

        {/* Filter/Search Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-sm">
              All Posts
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
              Docker
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
              DevOps
            </button>
            <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
              Tutorials
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{blogs.length} articles</span>
            {loading && (
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-300 text-sm">
                Failed to load blogs from server: {error}. Showing cached content.
              </p>
            </div>
          </div>
        )}

        {/* Blog Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
          {loading && blogs.length === 0 ? (
            // Loading skeleton
            <div className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-gray-300 rounded-full mr-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ) : (
            blogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                content={blog.content}
                author={blog.author}
                publishedDate={blog.publishedDate}
                readTime={blog.readTime}
                tags={blog.tags}
                isBookmarked={blog.isBookmarked}
                onBookmark={() => handleBookmark(blog.id)}
              />
            ))
          )}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
            Load More Articles
          </button>
        </div>
      </div>
    </Layout>
  );
};