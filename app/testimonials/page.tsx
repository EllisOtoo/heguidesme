export default function TestimonialsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="font-serif text-4xl font-bold text-text-dark mb-6">Community Stories</h1>
        <p className="text-text-light text-lg mb-12">
          Read how others are finding peace and growth using our journals.
        </p>
        
        {/* Placeholder for Testimonials List */}
        <div className="p-8 bg-background-mist rounded-2xl border border-gray-100 mb-8">
          <p className="text-xl font-serif italic text-text-dark mb-4">
            "This journal has completely changed my morning routine. I finally feel focused."
          </p>
          <p className="text-sm font-medium text-text-light">— Sarah J.</p>
        </div>
      </div>
    </div>
  );
}
