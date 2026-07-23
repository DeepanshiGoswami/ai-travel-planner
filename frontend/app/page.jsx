import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative isolate">
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI Travel Planner
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Generate personalized travel itineraries with the power of AI.
            Plan your perfect trip in minutes, not hours.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/register" className="btn-primary">
              Get started
            </Link>
            <Link href="/login" className="btn-secondary">
              Sign in
            </Link>
          </div>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="card text-center">
            <div className="text-3xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold">Personalized Plans</h3>
            <p className="mt-2 text-gray-600">
              AI generates custom itineraries based on your interests and budget
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-lg font-semibold">Budget Estimation</h3>
            <p className="mt-2 text-gray-600">
              Get detailed cost breakdowns for your entire trip
            </p>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl mb-4">🏨</div>
            <h3 className="text-lg font-semibold">Hotel Suggestions</h3>
            <p className="mt-2 text-gray-600">
              AI-recommended accommodations matching your preferences
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}