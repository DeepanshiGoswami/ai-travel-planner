'use client'
import Link from 'next/link';

const featuredDestinations = [
  {
    name: 'Delhi, India',
    emoji: '🏛️',
    description: 'Red Fort, Chandni Chowk, Qutub Minar, Lotus Temple',
    tags: ['Heritage', 'Food', 'Shopping'],
    color: 'from-orange-400 to-red-500'
  },
  {
    name: 'Jaipur, India',
    emoji: '🏰',
    description: 'Amer Fort, Hawa Mahal, City Palace, Stepwells',
    tags: ['Royal', 'Culture', 'Architecture'],
    color: 'from-pink-400 to-rose-500'
  },
  {
    name: 'Mumbai, India',
    emoji: '🌊',
    description: 'Gateway of India, Marine Drive, Elephanta Caves',
    tags: ['Coastal', 'Food', 'Nightlife'],
    color: 'from-blue-400 to-cyan-500'
  },
  {
    name: 'Goa, India',
    emoji: '🏖️',
    description: 'Beaches, Portuguese heritage, Water sports, Nightlife',
    tags: ['Beach', 'Party', 'Adventure'],
    color: 'from-teal-400 to-green-500'
  },
  {
    name: 'Kerala, India',
    emoji: '🚤',
    description: 'Backwaters, Houseboats, Ayurveda, Tea plantations',
    tags: ['Nature', 'Wellness', 'Romantic'],
    color: 'from-emerald-400 to-green-600'
  },
  {
    name: 'Rajasthan, India',
    emoji: '🐪',
    description: 'Desert safari, Forts, Palaces, Folk culture',
    tags: ['Desert', 'Heritage', 'Royal'],
    color: 'from-yellow-400 to-orange-500'
  },
  {
    name: 'Meghalaya, India',
    emoji: '🏔️',
    description: 'Living Root Bridges, Cherrapunji, Crystal Rivers',
    tags: ['Nature', 'Adventure', 'Tribal'],
    color: 'from-green-400 to-emerald-500'
  },
  {
    name: 'Uttarakhand, India',
    emoji: '🛕',
    description: 'Rishikesh Yoga, Ganga Aarti, Valley of Flowers',
    tags: ['Spiritual', 'Adventure', 'Nature'],
    color: 'from-indigo-400 to-blue-500'
  },
  {
    name: 'Thailand',
    emoji: '🛕',
    description: 'Grand Palace, Floating Markets, Tropical Beaches',
    tags: ['Temple', 'Beach', 'Food'],
    color: 'from-purple-400 to-pink-500'
  },
  {
    name: 'London, UK',
    emoji: '💂',
    description: 'Tower of London, Buckingham Palace, West End',
    tags: ['History', 'Culture', 'Shopping'],
    color: 'from-red-400 to-orange-500'
  },
  {
    name: 'Paris, France',
    emoji: '🗼',
    description: 'Eiffel Tower, Louvre, Montmartre, Versailles',
    tags: ['Romantic', 'Art', 'Food'],
    color: 'from-pink-400 to-purple-500'
  },
  {
    name: 'Dubai, UAE',
    emoji: '🏙️',
    description: 'Burj Khalifa, Desert Safari, Gold Souk, Beaches',
    tags: ['Luxury', 'Shopping', 'Adventure'],
    color: 'from-yellow-400 to-amber-500'
  },
  {
    name: 'Singapore',
    emoji: '🦁',
    description: 'Gardens by the Bay, Sentosa, Chinatown, Hawker Food',
    tags: ['Modern', 'Food', 'Family'],
    color: 'from-red-400 to-pink-500'
  },
  {
    name: 'Bali, Indonesia',
    emoji: '🌴',
    description: 'Rice terraces, Temples, Surfing, Spiritual retreats',
    tags: ['Island', 'Culture', 'Wellness'],
    color: 'from-green-400 to-teal-500'
  },
  {
    name: 'Sydney, Australia',
    emoji: '🦘',
    description: 'Opera House, Bondi Beach, Harbour Bridge, Wildlife',
    tags: ['Coastal', 'Urban', 'Nature'],
    color: 'from-blue-400 to-indigo-500'
  },
  {
    name: 'New York, USA',
    emoji: '🗽',
    description: 'Statue of Liberty, Central Park, Broadway Shows',
    tags: ['Iconic', 'Culture', 'Shopping'],
    color: 'from-blue-500 to-purple-600'
  }
];

export default function FeaturedDestinations() {
  return (
    <div className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-3">🌟 Featured Destinations</h2>
        <p className="text-gray-600 text-lg">
          These destinations have detailed, hand-crafted itineraries with real activities, hotels & local insights
        </p>
        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          ✨ Premium Data Available
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featuredDestinations.map((dest, index) => (
          <Link
            key={index}
            href={'/trips/create?destination=' + encodeURIComponent(dest.name)}
            className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className={'bg-gradient-to-br ' + dest.color + ' p-6 h-full min-h-[180px] flex flex-col justify-between text-white'}>
              <div>
                <div className="text-4xl mb-3">{dest.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{dest.name}</h3>
                <p className="text-sm text-white/90 leading-relaxed">{dest.description}</p>
              </div>
              <div className="flex flex-wrap gap-1 mt-3">
                {dest.tags.map((tag, i) => (
                  <span key={i} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-white/90 text-green-700 text-xs px-2 py-1 rounded-full font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              ✨ Premium
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <p className="text-gray-700">
          <span className="font-semibold">💡 Tip:</span> Can't find your destination? No worries! 
          Our AI generates unique itineraries for <span className="font-semibold">any place</span> based on 
          the type of destination (beach, mountain, city, heritage, etc.)
        </p>
      </div>
    </div>
  );
}
