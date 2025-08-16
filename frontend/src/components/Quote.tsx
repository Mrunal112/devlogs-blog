export const Quote = ({ type }: { type: "signin" | "signup" }) => {
    const getQuoteData = () => {
        if (type === "signin") {
            return {
                quote: "Every great developer you know got there by solving problems they were unqualified to solve until they actually did it.",
                author: "Patrick McKenzie",
                title: "Software Engineer & Entrepreneur"
            };
        } else {
            return {
                quote: "The art of writing is the art of discovering what you believe. Through sharing our stories, we illuminate the path for others to follow.",
                author: "Maya Chen",
                title: "Author & Blogger"
            };
        }
    };

    const { quote, author, title } = getQuoteData();

    return (
        <div className="bg-gray-200 dark:bg-gray-700 h-full flex justify-center items-center px-8">
            <div className="max-w-lg text-left">
                <div className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
                    "{quote}"
                </div>
                <div className="text-xl font-semibold mt-4 text-gray-800 dark:text-gray-200">
                    {author}
                </div>
                <div className="text-sm font-light text-slate-400 dark:text-gray-400">
                    {title}
                </div>
            </div>
        </div>
    )
}