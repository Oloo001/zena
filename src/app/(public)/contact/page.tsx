import ContactForm from "@/components/contact/ContactForm";

const contactDetails = [
  {
    icon: "📍",
    label: "Head office",
    value: "Westlands, Nairobi, Kenya",
  },
  {
    icon: "📞",
    label: "Phone",
    value: "+254755112760",
  },
  {
    icon: "✉️",
    label: "Email",
    value: "support@cityhire.com",
  },
  {
    icon: "🕐",
    label: "Support hours",
    value: "Mon – Sun, 6am – 10pm",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100 py-14 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-widest mb-3">
            Get in touch
          </p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            We're here to help
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Have a question about a booking, payment, or our fleet? Send us a
            message and we'll get back to you within 24 hours.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — contact details */}
          <div className="lg:col-span-2 space-y-4">

            {/* Contact detail cards */}
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4 px-5 py-4">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Our locations
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Nairobi CBD",
                  "JKIA",
                  "Mombasa",
                  "Kisumu",
                  "Nakuru",
                  "Eldoret",
                ].map((loc) => (
                  <span
                    key={loc}
                    className="text-xs border border-gray-200 text-gray-500 px-3 py-1 rounded-full"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            </div>

            {/* Urgent help */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5">
              <p className="text-sm font-semibold text-indigo-800 mb-1">
                Need urgent help?
              </p>
              <p className="text-xs text-indigo-600 leading-relaxed mb-3">
                For roadside emergencies or urgent booking issues, text us
                directly — we're available 24/7.
              </p>
              
              <a href="whatsapp://send?phone=254755112760&text=Hi%20City%20Hire%20Ltd%2C%20I%20need%20urgent%20assistance."
                className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                WhatsApp now
              </a>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                We reply to every message within 24 hours.
              </p>
              <ContactForm />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}