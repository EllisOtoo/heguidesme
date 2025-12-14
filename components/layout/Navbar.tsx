import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 bg-background-paper/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand Name */}
        <Link href="/" className="font-serif text-2xl font-bold text-text-dark tracking-tight">
          Quiet Time
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors">
            Shop
          </Link>
          <Link href="/testimonials" className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors">
            Testimonials
          </Link>
          <Link href="/contact" className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors">
            Contact Us
          </Link>
          <Link href="/outlets" className="text-sm font-medium text-text-light hover:text-primary-blue transition-colors">
            Outlets
          </Link>
        </nav>

        {/* Actions (Cart / Mobile Menu Placeholder) */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-text-dark hover:text-primary-blue transition-colors" aria-label="Cart">
            {/* Simple Cart Icon SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
