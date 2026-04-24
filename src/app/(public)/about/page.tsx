import Link from 'next/link';

export default function About() {
  return (
      <main>
      <div className="max-w-3xl mx-auto py-20 px-4">
        <h1 className="text-4xl font-bold mb-4">About City Hire Ltd</h1>
        <p className="mt-4 text-gray-600">
          City Hire Ltd is a premier car rental service dedicated to providing top-notch vehicles and exceptional customer service. With a diverse fleet of cars, we cater to all your transportation needs, whether it's for business, leisure, or special occasions. Our mission is to make your travel experience seamless and enjoyable, offering reliable and affordable car rental solutions across Kenya.
        </p>
      </div>
      <div className="max-w-3xl mx-auto py-4 px-4">
        <Link href="/" className="mt-6 text-blue-400 hover:underline">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            ← Back to Fleet
          </button>
        </Link>
      </div>
      </main>  
  );
}

