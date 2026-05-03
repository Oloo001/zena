"use client";

import { useState, useTransition } from "react";
import { sendContactEmail } from "@/actions/contact.actions";
import toast from "react-hot-toast";

const subjects = [
  { value: "general", label: "General enquiry" },
  { value: "booking", label: "Booking question" },
  { value: "payment", label: "Payment issue" },
  { value: "corporate", label: "Corporate hire" },
  { value: "complaint", label: "Complaint" },
  { value: "other", label: "Other" },
];

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  subject: "general",
  message: "",
};

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState(defaultForm);
  const [sent, setSent] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await sendContactEmail(form as any);
      if (result.error) {
        toast.error(result.error);
        return;
      }
      setSent(true);
      setForm(defaultForm);
    });
  };

  if (sent) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto text-2xl">
          ✓
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Message sent</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          We'll get back to you within 24 hours. Check your inbox for a
          confirmation email.
        </p>
        <button
          onClick={() => setSent(false)}
          className="text-sm text-indigo-600 hover:underline mt-2"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Full name
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Oloo Dev"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Email address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="oloo@example.com"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Phone */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Phone <span className="text-gray-400 normal-case font-normal">(optional)</span>
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="0712345678"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            Subject
          </label>
          <select
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            {subjects.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="How can we help you?"
          value={form.message}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {form.message.length} / 1000
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors text-sm"
      >
        {isPending ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}