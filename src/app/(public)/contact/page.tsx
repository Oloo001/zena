export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-4">
      <h1 className="text-3xl font-bold">Contact Zena</h1>
      <p className="mt-4 text-gray-600">Have questions about our fleet? Get in touch. Response within 24 hours.</p>
      <div className="mt-8 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Customer Support</h2>
          <p className="text-gray-500">Email: 
          <a 
          href="mailto:oloochino001@gmail.com?subject=Inquiry regarding Zena Motor Hires&body=Hello Zena Team, I would like to ask about..." 
          className="text-indigo-600 hover:underline"
        >
        support@zenamotorhires.com
        </a>
        </p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">WhatsApp Support</h2>
          <p className="text-gray-500">Chat with us on WhatsApp:</p>
          <a 
            href="https://wa.me/254714686267?text=Hello%20Zena%20Motor%20Hires!" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-green-600 px-4 py-1 rounded-lg text-white"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}