import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-background-mist pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <Image
                src="/images/logo_hgm_withtext.png"
                alt="He Guides Me"
                width={150}
                height={93}
              />
            </Link>
            <p className="text-text-light text-sm leading-relaxed">
              Spiritual growth tools designed to help you focus, reflect, and
              grow in your faith journey.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-text-dark mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-serif font-semibold text-text-dark mb-4">
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/feedback"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link
                  href="/outlets"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Find a Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-serif font-semibold text-text-dark mb-4">
              Connect
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-text-light hover:text-primary-blue transition-colors"
                >
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-text-light">
            &copy; {new Date().getFullYear()} He Guides Me. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-xs text-text-light hover:text-text-dark"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-text-light hover:text-text-dark"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
