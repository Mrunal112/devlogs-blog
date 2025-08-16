import { useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const Blog = () => {
    const { id } = useParams();

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <article className="prose lg:prose-xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Blog Post #{id}
                    </h1>
                    <div className="flex items-center space-x-4 mb-8 text-sm text-gray-600">
                        <span>By John Doe</span>
                        <span>•</span>
                        <span>Published on Jan 15, 2025</span>
                        <span>•</span>
                        <span>5 min read</span>
                    </div>
                    
                    <div className="prose max-w-none">
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
                </article>
            </div>
        </Layout>
    );
};