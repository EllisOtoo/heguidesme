export default function FeedbackPage() {
  return (
    <div className="container mx-auto px-4 py-16">
       <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6 text-center">Share Your Thoughts</h1>
        <p className="text-text-light text-center mb-12">
          Your feedback helps us improve our journals and serve you better.
        </p>

        <form className="space-y-6">
           <div>
            <label htmlFor="topic" className="block text-sm font-medium text-text-dark mb-2">Topic</label>
            <select 
              id="topic"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
            >
              <option>Product Feedback</option>
              <option>Website Issue</option>
              <option>Suggestion</option>
              <option>Other</option>
            </select>
          </div>
          
           <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-2">Message</label>
            <textarea 
              id="message" 
              rows={5}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="Tell us what you think..."
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-2">Email (Optional)</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary-blue focus:ring-1 focus:ring-primary-blue outline-none transition-all bg-background-mist"
              placeholder="If you'd like a reply"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-primary-blue text-white font-medium py-3 rounded-full hover:opacity-90 transition-opacity"
          >
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}
