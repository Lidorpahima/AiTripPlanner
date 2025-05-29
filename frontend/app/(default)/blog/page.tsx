/**
 * Blog Page Component
 * 
 * Displays the blog section of the application, featuring:
 * - Blog header and introduction
 * - Grid of recent blog posts
 * - Post previews with titles, dates, and excerpts
 * - Links to full blog posts
 * 
 * Features:
 * - Responsive grid layout
 * - Hover effects on post cards
 * - Clean typography
 * - Interactive elements
 */

import Link from 'next/link';

export const metadata = {
  title: "Blog - AiTripPlanner",
  description: "Stay updated with the latest blog posts and news from AiTripPlanner.",
};

/**
 * BlogPage Component
 * 
 * Renders the blog page with:
 * 1. Page header with title
 * 2. Introduction text
 * 3. Grid of recent blog posts including:
 *    - Post title with link
 *    - Publication date
 *    - Post excerpt
 *    - Read more link
 * 
 * The component displays a collection of blog posts about:
 * - AI tools for travel
 * - Platform usage guides
 * - Development insights
 * - Travel tips and guides
 * - Industry trends
 */
export default function BlogPage() {
  return (
    <section className="relative bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="">
          {/* Page header */}
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">AiTripPlanner Blog</h1>
          </div>

          {/* Page content */}
          <div className="mx-auto max-w-3xl">
            <div className="space-y-6 text-lg text-gray-700">
              <p>Welcome to the AiTripPlanner Blog! Here you'll find travel tips, project updates, AI insights, and more.</p>
              <p>Stay tuned as we share guides, stories, and behind-the-scenes looks at how AiTripPlanner helps you explore the world more intelligently.</p>

              <hr className="my-8 border-t border-gray-200" />

              <h2 className="text-2xl font-semibold">Recent Posts</h2>
              <div className="grid gap-8 pt-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Top 10 AI Tools for Travel Planning", date: "May 10, 2024", excerpt: "Discover the best AI-powered tools to optimize your next trip, from itinerary builders to accommodation finders.", slug: "ai-tools-for-travel-planning" },
                  { title: "How to Use AiTripPlanner: A Complete Guide", date: "April 25, 2024", excerpt: "Learn how to get the most out of AiTripPlanner with tips, tricks, and advanced features to streamline your travel plans.", slug: "how-to-use-aitripplanner" },
                  { title: "Behind the Scenes: Building AiTripPlanner", date: "April 5, 2024", excerpt: "A look into the development process of AiTripPlanner, from idea to launch and the technologies that power it.", slug: "behind-the-scenes-building-aitripplanner" },
                  { title: "Best Destinations for Digital Nomads", date: "March 20, 2024", excerpt: "Explore top cities and regions around the globe that are perfect for remote work and long-term stays.", slug: "best-destinations-digital-nomads" },
                  { title: "Eco-Friendly Travel Tips", date: "March 5, 2024", excerpt: "Reduce your carbon footprint and travel responsibly with these eco-friendly tips and practices.", slug: "eco-friendly-travel-tips" },
                  { title: "Future of Travel with AI", date: "Feb 15, 2024", excerpt: "Explore emerging trends and how AI is set to revolutionize the travel industry in the coming years.", slug: "future-of-travel-with-ai" },
                  { title: "Travel Photography Tips for Beginners", date: "June 5, 2024", excerpt: "Capture your journey perfectly with these beginner-friendly photography tips and gear recommendations.", slug: "travel-photography-tips-for-beginners" },
                  { title: "Maximizing Travel Rewards: Airline Miles & Points", date: "June 1, 2024", excerpt: "Learn how to earn, track, and redeem miles and points to save on your next trip.", slug: "maximizing-travel-rewards-airline-miles-points" },
                  { title: "Cultural Etiquette Around the World", date: "January 25, 2024", excerpt: "Avoid common faux pas and respect local customs with this comprehensive etiquette guide.", slug: "cultural-etiquette-around-the-world" }
                ].map((post) => (
                  <article key={post.slug} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition">
                    <h3 className="text-xl font-semibold mb-2">
                      <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">{post.title}</Link>
                    </h3>
                    <div className="text-sm text-gray-500 mb-4">{post.date}</div>
                    <p className="text-gray-700 mb-4">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-blue-600 font-medium hover:underline">Read More &rarr;</Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 