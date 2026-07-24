import Link from 'next/link';
import FeaturedDestinations from '@/components/FeaturedDestinations';

export default function Home() {
  return (
    <div>
      <div className="py-20 text-center">
        <h1 className="text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Travel Planner
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
          Generate personalized travel itineraries with AI. Plan your perfect trip in minutes.
        </p>
        <div className="flex justify-center gap-4 mb-2">
          <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg font-semibold">
            Get Started Free
          </Link>
          <Link href="/login" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 text-lg font-semibold">
            Sign In
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-4xl mb-3">AI</div>
          <h3 className="text-lg font-bold mb-2">AI-Powered Itineraries</h3>
          <p className="text-gray-600 text-sm">Unique day-by-day plans tailored to your interests and budget</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-4xl mb-3">$</div>
          <h3 className="text-lg font-bold mb-2">Smart Budget Planning</h3>
          <p className="text-gray-600 text-sm">Detailed cost breakdown with currency converter</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <div className="text-4xl mb-3">H</div>
          <h3 className="text-lg font-bold mb-2">Hotel & Local Tips</h3>
          <p className="text-gray-600 text-sm">Curated hotel suggestions, hidden gems, and insights</p>
        </div>
      </div>

      <FeaturedDestinations />
    </div>
  );
}
