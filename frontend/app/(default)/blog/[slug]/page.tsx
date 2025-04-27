import { notFound } from 'next/navigation';
import Link from 'next/link';

// Sample blog posts data
const posts = [
  {
    slug: "ai-tools-for-travel-planning",
    title: "Top 10 AI Tools for Travel Planning",
    date: "April 23, 2025",
    content: [
      "Hey fellow explorers! AI tools now suggest personalized routes and hidden gems tailored to your travel style.",
      "These platforms analyze millions of data points—from weather patterns to local events—to recommend the perfect itinerary.",
      "With real-time flight and hotel trackers built-in, you'll never miss out on the best deals or last-minute discounts.",
      "Mobile integrations keep your plans at your fingertips, even offline, so you can navigate new cities with confidence.",
      "Many AI assistants adapt on the fly: if your train is delayed or rain rolls in, they reroute you to cover must-see spots.",
      "Embrace these AI companions to make every trip smoother, smarter, and infinitely more fun—travel like a pro without lifting a finger!"
    ]
  },
  {
    slug: "how-to-use-aitripplanner",
    title: "How to Use AiTripPlanner: A Complete Guide",
    date: "April 15, 2025",
    content: [
      "Welcome aboard AiTripPlanner! First, enter your destination, travel dates, and a few personal preferences—like adventure level and budget.",
      "Our intuitive dashboard presents a visual itinerary you can drag, drop, and tweak until it fits your dream trip.",
      "Feeling spontaneous? Flip on AI Suggestions to discover off-the-beaten-path experiences and local insider tips.",
      "Keep track of your packing with our built-in checklist; check off items as you load your bags to stay organized.",
      "Collaboration is easy: share a private link with friends or family, and update your plans together in real time.",
      "Pro tip: bookmark your favorite spots as you explore, then use the export feature to create a shareable travel diary."
    ]
  },
  {
    slug: "behind-the-scenes-building-aitripplanner",
    title: "Behind the Scenes: Building AiTripPlanner",
    date: "April 1, 2025",
    content: [
      "Ever wondered how AiTripPlanner came to life? It began as a late-night conversation about how tedious travel planning can be.",
      "We sketched prototypes on napkins, then dove into user interviews to uncover pain points and must-have features.",
      "Our tech stack blends natural language processing with geospatial analytics to turn your requests into curated itineraries.",
      "Design sprints ensured the UI remains clean and intuitive: no clutter, just your trip laid out step by step.",
      "Countless rounds of beta testing—with solo travelers and families—helped us fine-tune every recommendation.",
      "Join us on this journey: our roadmap includes social travel features, local partnerships, and even augmented reality guides!"
    ]
  },
  {
    slug: "best-destinations-digital-nomads",
    title: "Best Destinations for Digital Nomads",
    date: "March 20, 2025",
    content: [
      "Digital nomads, rejoice! These top spots perfectly blend work-friendly infrastructure with vibrant local culture.",
      "Lisbon's sunny weather, affordable living costs, and thriving co-working cafes make it a favorite among remote professionals.",
      "Chiang Mai offers a laid-back lifestyle, strong expat communities, and excellent value for your rent and daily expenses.",
      "Medellín surprises with its eternal spring climate and rapidly growing startup scene—your next networking event awaits.",
      "Bali's surf culture and wellness retreats attract creatives seeking inspiration while maintaining a steady Wi‑Fi connection.",
      "Whether you crave city buzz or island serenity, the world is your office—pack up, tune in, and work from anywhere!"
    ]
  },
  {
    slug: "eco-friendly-travel-tips",
    title: "Eco-Friendly Travel Tips",
    date: "March 5, 2025",
    content: [
      "Ready to reduce your carbon footprint? Start by choosing accommodations certified by eco-labels like Green Key.",
      "Pack light and smart: reusable water bottles, shopping totes, and travel utensils eliminate single-use plastics.",
      "Opt for public transport or bike rentals to see cities from a local's perspective while cutting emissions.",
      "Offset flights through reputable carbon credit programs, or choose nonstop routes to minimize wasted fuel.",
      "Support local eco-businesses: eat at farm-to-table restaurants and book tours run by community cooperatives.",
      "Eco-friendly travel isn't just responsible—it enriches your experience and forges deeper connections with your destination."
    ]
  },
  {
    slug: "future-of-travel-with-ai",
    title: "Future of Travel with AI",
    date: "February 25, 2025",
    content: [
      "Imagine AI chatbots advising you in real time—no more fumbling with phrasebooks or translation apps.",
      "Predictive analytics will help you snag the best flight and hotel deals before prices start to climb.",
      "Augmented reality guides could overlay historical facts, reviews, and hidden gem tips as you explore.",
      "Personalized health and safety alerts will keep you informed about local conditions and travel advisories.",
      "Voice-controlled assistants will manage your entire trip—from booking to check-out—hands-free.",
      "The future of travel is seamless: AI will anticipate your needs and deliver unforgettable experiences."
    ]
  },
  {
    slug: "travel-photography-tips-for-beginners",
    title: "Travel Photography Tips for Beginners",
    date: "February 10, 2025",
    content: [
      "Capture memories like a pro! Start with the rule of thirds to frame your subject off-center for dynamic shots.",
      "Golden hour—just after sunrise or before sunset—bathes your scenes in soft, warm light that elevates any photo.",
      "Carry a lightweight camera or smartphone with manual mode to adjust exposure, focus, and ISO on the fly.",
      "Experiment with different perspectives: climb high for sweeping vistas or crouch low for dramatic foregrounds.",
      "Keep a backup: store images in the cloud or on portable drives to protect your memories against loss.",
      "Finally, tell a story: sequence your shots in a travel journal to capture the emotion behind each moment."
    ]
  },
  {
    slug: "maximizing-travel-rewards-airline-miles-points",
    title: "Maximizing Travel Rewards: Airline Miles & Points",
    date: "January 30, 2025",
    content: [
      "Turn everyday spending into free flights—start by signing up for loyalty programs with top airlines.",
      "Pair your favorite airline with a travel rewards credit card to earn bonus points on dining and groceries.",
      "Monitor limited-time promotions: double miles on new routes or partner flights can skyrocket your balance.",
      "Learn transfer partner networks to combine points across platforms—unlock upgrades and premium experiences.",
      "Track your redemption opportunities: a few thousand points could mean a free weekend getaway or cabin upgrade.",
      "Stay flexible: booking off-peak or choosing open-jaw itineraries often yields the best value for your points."
    ]
  },
  {
    slug: "cultural-etiquette-around-the-world",
    title: "Cultural Etiquette Around the World",
    date: "January 15, 2025",
    content: [
      "Etiquette is your golden ticket to local hearts—learn a few customs before you arrive.",
      "In Japan, always remove your shoes before stepping inside a home or traditional inn to show respect.",
      "Tipping isn't customary in many Asian countries—research ahead to avoid awkward misunderstandings.",
      "A simple greeting in the local language—like 'hola', 'bonjour', or 'salaam'—opens doors everywhere.",
      "Dress mindfully: observe local norms for modesty, especially in religious or conservative regions.",
      "Embrace curiosity and humility—asking questions and listening shows genuine respect and fosters connections."
    ]
  }
];

// Generate static pages for each slug
export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = posts.find((p) => p.slug === params.slug);

  if (!post) {
    notFound();
  }
  return (
    <section className="relative bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 pt-32 md:pb-20 md:pt-40">
          {/* Post header */}
          <div className="mx-auto mb-8 max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">{post.title}</h1>
            <div className="text-sm text-gray-500">{post.date}</div>
          </div>

          {/* Post content */}
          <div className="mx-auto max-w-3xl space-y-6 text-lg text-gray-700">
            {post.content.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
