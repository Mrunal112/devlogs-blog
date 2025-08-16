import { useState } from 'react';
import { BlogCard } from '../components/BlogCard';
import { Layout } from '../components/Layout';

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

export const Blogs = () => {
  const [blogs, setBlogs] = useState(mockBlogs);

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
          </div>
        </div>

        {/* Blog Cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
          {blogs.map((blog) => (
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
          ))}
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