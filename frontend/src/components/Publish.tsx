import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backendUrl } from '../config';
import { Layout } from './Layout';

export const Publish = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const navigate = useNavigate();

  // Load draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('blog-draft');
    if (savedDraft) {
      try {
        const { title: savedTitle, content: savedContent } = JSON.parse(savedDraft);
        setTitle(savedTitle || '');
        setContent(savedContent || '');
        setDraftLoaded(true);
        console.log('Draft loaded from localStorage:', { title: savedTitle, contentLength: savedContent?.length });
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  // Save draft to localStorage
  const saveDraft = () => {
    const draft = {
      title: title.trim(),
      content: content.trim(),
      savedAt: new Date().toISOString()
    };
    
    localStorage.setItem('blog-draft', JSON.stringify(draft));
    setDraftSaved(true);
    console.log('Draft saved to localStorage:', draft);
    
    // Hide the "Draft Saved" message after 2 seconds
    setTimeout(() => {
      setDraftSaved(false);
    }, 2000);
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    try {
      localStorage.removeItem('blog-draft');
      console.log('Draft cleared from localStorage');
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        return;
      }

      const response = await fetch(`${backendUrl}/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Blog published successfully:', data);
      
      // Clear the draft since it's now published
      clearDraft();
      
      // Reset form state
      setTitle('');
      setContent('');
      setSuccess(true);
      
      // Redirect to blogs page after 1.5 seconds
      setTimeout(() => {
        navigate('/blogs');
      }, 1500);
    } catch (err) {
      console.error('Failed to publish blog:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish blog');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/blogs');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Publish a New Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your thoughts and ideas with the community
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Blog published successfully! Redirecting to blogs page...
              </p>
            </div>
          </div>
        )}

        {/* Draft Loaded Message */}
        {draftLoaded && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Draft loaded from previous session.
              </p>
            </div>
          </div>
        )}

        {/* Draft Saved Message */}
        {draftSaved && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-blue-700 dark:text-blue-300 text-sm">Draft saved successfully!</p>
            </div>
          </div>
        )}

        {/* Publish Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            {/* Title Input */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging title for your blog post..."
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                disabled={loading}
                required
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Blog Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog content here... You can include code snippets, technical insights, tutorials, or any other valuable content you'd like to share."
                rows={16}
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-vertical"
                disabled={loading}
                required
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Tip: Use clear paragraphs and include examples to make your content more engaging.
              </div>
            </div>

            {/* Character Count */}
            <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
              Title: {title.length} characters | Content: {content.length} characters
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-600 rounded-b-lg">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Cancel
              </button>
              
              <div className="flex items-center space-x-3">
                {/* Clear Draft Button - only show if draft exists */}
                {(title.trim() || content.trim()) && (
                  <button
                    type="button"
                    onClick={() => {
                      clearDraft();
                      setTitle('');
                      setContent('');
                      setDraftLoaded(false);
                    }}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear
                  </button>
                )}
                
                {/* Save Draft Button */}
                <button
                  type="button"
                  onClick={saveDraft}
                  disabled={loading || (!title.trim() && !content.trim())}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Save Draft
                </button>
                
                {/* Publish Button */}
                <button
                  type="submit"
                  disabled={loading || !title.trim() || !content.trim()}
                  className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Publish Blog
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Publishing Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">
            📝 Writing Tips
          </h3>
          <ul className="text-blue-800 dark:text-blue-300 space-y-2 text-sm">
            <li>• Use a clear, descriptive title that captures the main topic</li>
            <li>• Structure your content with proper paragraphs and sections</li>
            <li>• Include practical examples and code snippets when relevant</li>
            <li>• Proofread your content before publishing</li>
            <li>• Consider your target audience and their technical level</li>
            <li>• Save drafts frequently to avoid losing your work</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};
