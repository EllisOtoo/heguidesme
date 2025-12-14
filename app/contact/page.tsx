export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Contact Us</h1>
        <p className="text-text-light text-center mb-12">
          Have a question about your order or our products? We would love to hear from you.
        </p>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-dark mb-2">Name</label>
            <input 
              type="text" 
              id="name" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">Email</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="How can we help?"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-primary-blue text-white font-medium py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
