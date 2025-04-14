
import { Car } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-parkblue-700 text-white py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Car className="h-6 w-6" />
              <span className="text-xl font-bold">ParkEase</span>
            </div>
            <p className="text-parkblue-100">
              The easiest way to find and book parking spaces in your city.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-parkblue-100 hover:text-white transition-colors">Home</a></li>
              <li><a href="/parking" className="text-parkblue-100 hover:text-white transition-colors">Find Parking</a></li>
              <li><a href="/bookings" className="text-parkblue-100 hover:text-white transition-colors">My Bookings</a></li>
              <li><a href="/about" className="text-parkblue-100 hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-parkblue-100">123 Parking Street</li>
              <li className="text-parkblue-100">City Center, 10001</li>
              <li className="text-parkblue-100">support@parkease.com</li>
              <li className="text-parkblue-100">(123) 456-7890</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-parkblue-600 text-center text-parkblue-200">
          <p>&copy; {new Date().getFullYear()} ParkEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
