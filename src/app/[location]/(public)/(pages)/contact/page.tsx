"use client"
import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, Clock, HelpCircle, Send, CheckCircle } from 'lucide-react';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputBase = `
    w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none text-sm
    bg-white dark:bg-gray-800
    border-gray-200 dark:border-gray-700
    text-gray-900 dark:text-gray-100
    placeholder-gray-400 dark:placeholder-gray-500
    focus:border-blue-500 dark:focus:border-blue-400
    focus:ring-2 focus:ring-blue-500/10 dark:focus:ring-blue-400/10
  `;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">

      <div className="relative overflow-hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-10 -right-32 w-80 h-80 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-5">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Support Team Online</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">
              Contact <span className=" bg-clip-text text-blue-600">Taskoria</span> Support
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              We're here to help. Reach out and we'll get back to you as quickly as possible.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-10">

          <div className="md:col-span-1 space-y-4">

            <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Email Support</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2.5">Get help via email</p>
                  <a
                    href="mailto:contactus@taskoria.com"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm inline-flex items-center gap-1.5 group/link truncate"
                  >
                    <span className="truncate">contactus@taskoria.com</span>
                    <Send className="w-3.5 h-3.5 shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
                  </a>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    Response within 24 hours
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-50 dark:bg-emerald-500/10 rounded-xl p-3 group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Phone Support</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2.5">Speak with our team</p>
                  <a
                    href="tel:+61474655902"
                    className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold text-base"
                  >
                    +61 474 655 902
                  </a>
                  <div className="mt-2.5 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-600">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      Mon–Fri: 9:00 AM – 6:00 PM
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-600 ml-5">
                      Sat: 10:00 AM – 4:00 PM
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 p-5 border border-gray-100 dark:border-gray-800 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 dark:bg-purple-500/10 rounded-xl p-3 group-hover:scale-105 transition-transform duration-200">
                  <MessageCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">Live Chat</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Chat with us instantly</p>
                  <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 w-full active:scale-95">
                    Start Chat
                  </button>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                    <span className="text-xs text-gray-400 dark:text-gray-600">Available Soon</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-5 border border-blue-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Quick Answers</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">Check our FAQ for instant solutions</p>
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 group/link">
                    Visit Help Center
                    <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm dark:shadow-gray-900/30 p-7 sm:p-8 border border-gray-100 dark:border-gray-800">

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-5">
                    <CheckCircle className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    Thank you for reaching out. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-7">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1.5">Send us a message</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fill out the form below and we'll respond as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {/* Name */}
                      <div>
                        <label htmlFor="name" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused(null)}
                          className={inputBase}
                          placeholder="Full Name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused(null)}
                          className={inputBase}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocused('subject')}
                        onBlur={() => setFocused(null)}
                        className={`${inputBase} cursor-pointer appearance-none`}
                      >
                        <option value="" disabled>Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="billing">Billing & Payments</option>
                        <option value="account">Account Issues</option>
                        <option value="services">Service Questions</option>
                        <option value="feedback">Feedback & Suggestions</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="message" className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <span className="text-xs text-gray-400 dark:text-gray-600">
                          {formData.message.length} chars
                        </span>
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocused('message')}
                        onBlur={() => setFocused(null)}
                        rows={5}
                        className={`${inputBase} resize-none`}
                        placeholder="Please describe your issue or question in detail..."
                      />
                    </div>

                    {/* Privacy Checkbox */}
                    <div className="flex items-start gap-3 pt-1">
                      <input
                        type="checkbox"
                        id="privacy"
                        required
                        className="mt-0.5 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500/20 dark:bg-gray-800 cursor-pointer"
                      />
                      <label htmlFor="privacy" className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">privacy policy</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">terms of service</a>
                      </label>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-blue-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-md shadow-blue-500/20 dark:shadow-blue-500/10 inline-flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                  </form>
                </>
              )}
            </div>

            {/* Tips Box */}
            <div className="mt-5 bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <span>💡</span> Before contacting support
              </h3>
              <div className="space-y-2">
                {[
                  'Check if your question is answered in our Help Center',
                  'Have your account information ready for faster assistance',
                  'Include relevant screenshots or error messages if applicable',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-blue-400 dark:text-blue-500 mt-0.5 text-xs">●</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-2xl p-8 text-center">
          {/* Decorative */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Need immediate assistance?</h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto text-sm">
              For urgent matters, our phone support team is ready to help during business hours.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="tel:+61474655902"
                className="bg-white text-gray-900 hover:bg-gray-100 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href="mailto:contactus@taskoria.com"
                className="bg-transparent border border-gray-600 hover:border-gray-400 text-white hover:bg-white/5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 inline-flex items-center gap-2 active:scale-95"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}