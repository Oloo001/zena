import Link from "next/link";

const fleet = [
  { label: "Economy cars", href: "/cars?category=ECONOMY" },
  { label: "SUVs & 4×4", href: "/cars?category=SUV" },
  { label: "Luxury vehicles", href: "/cars?category=LUXURY" },
  { label: "Electric cars", href: "/cars?category=ELECTRIC" },
  { label: "Vans & pickups", href: "/cars?category=VAN" },
  { label: "Long-term hire", href: "/cars" },
];

const company = [
  { label: "About City", href: "/about" },
  { label: "How it works", href: "/how-it-works" },
  { label: "Corporate hire", href: "/corporate" },
  { label: "Partnerships", href: "/partnerships" },
  { label: "Careers", href: "/careers" },
  { label: "Contact us", href: "/contact" },
];

const support = [
  { label: "FAQs", href: "/faqs" },
  { label: "Roadside assistance", href: "/support/roadside" },
  { label: "Booking guide", href: "/support/booking" },
  { label: "Insurance info", href: "/policies" },
  { label: "Cancellation policy", href: "/policies#cancellation" },
  { label: "Contact support", href: "/contact" },
];

const locations = [
  "Nairobi — CBD",
  "Nairobi — JKIA",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
];

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Locations bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-6 border-b border-gray-100">
          <span className="text-xs text-gray-400 mr-1">Locations</span>
          {locations.map((loc) => (
            <span
              key={loc}
              className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full"
            >
              {loc}
            </span>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="text-xl font-bold text-indigo-600 block mb-3"
            >
              City Hire Ltd
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Premium car hire across Kenya. Instant booking, transparent
              pricing, and M-Pesa payments.
            </p>

            {/* Social links */}
            <div className="flex gap-2">
              {[
                {
                  label: "X",
                  href: "https://twitter.com",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  ),
                },
                {
                  label: "Facebook",
                  href: "https://facebook.com",
                  icon: (
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Fleet */}
          <FooterCol heading="Fleet" links={fleet} />

          {/* Company */}
          <FooterCol heading="Company" links={company} />

          {/* Support */}
          <FooterCol heading="Support" links={support} />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="text-indigo-600">City Hire Ltd.</span>
            All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: "Privacy policy", href: "/privacy" },
              { label: "Terms of service", href: "/terms" },
              { label: "Cookie policy", href: "/cookies" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-widest text-gray-900 mb-4">
        {heading}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}