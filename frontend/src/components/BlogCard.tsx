import { Link } from 'react-router-dom';

interface BlogCardProps {
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
  onBookmark?: () => void;
}

export const BlogCard = ({
  id,
  title,
  content,
  author,
  publishedDate,
  readTime = "3 min read",
  tags = [],
  isBookmarked = false,
  onBookmark
}: BlogCardProps) => {
  // Extract first few words as preview
  const getContentPreview = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <article className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-6 px-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200">
      <div className="flex items-start justify-between">
        {/* Main Content */}
        <div className="flex-1 pr-4">
          {/* Author Info */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {author.avatar ? (
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600 flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-medium">
                    {author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{author.name}</span>
            </div>
            <span className="mx-2 text-gray-400 dark:text-gray-500">·</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(publishedDate)}</span>
            {tags.length > 0 && (
              <>
                <span className="mx-2 text-gray-400 dark:text-gray-500">·</span>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {tags[0]}
                </span>
              </>
            )}
          </div>

          {/* Title and Content */}
          <Link to={`/blog/${id}`} className="block group">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
              {title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed mb-4 line-clamp-3">
              {getContentPreview(content)}
            </p>
          </Link>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">{readTime}</span>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Bookmark Button */}
                <button
                  onClick={onBookmark}
                  className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    isBookmarked ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
                  }`}
                  aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <svg
                    className="w-4 h-4"
                    fill={isBookmarked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>

                {/* Share Button */}
                <button
                  className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
                  aria-label="Share"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                    />
                  </svg>
                </button>

                {/* More Options */}
                <button
                  className="p-1 rounded hover:bg-gray-100 transition-colors text-gray-400"
                  aria-label="More options"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 12h.01M12 12h.01M19 12h.01"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail/Preview Image (Optional) */}
        <div className="flex-shrink-0 ml-4">
          <Link to={`/blog/${id}`}>
            <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
              {/* Placeholder for blog image or icon */}
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </article>
  );
};
