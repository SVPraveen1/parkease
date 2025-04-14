
import { Button } from "@/components/ui/button";
import { Car, Timer, Calendar, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

export const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-parkblue-700 to-parkblue-800 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight animate-fade-in">
              Find and Book Parking Spots with Ease
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-parkblue-100">
              Say goodbye to parking hassles. Book your spot in advance and park stress-free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-parkteal-500 hover:bg-parkteal-600">
                <Link to="/parking">Find Parking</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-parkblue-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-3 bg-parkblue-100 rounded-full mb-4">
                <Car className="h-6 w-6 text-parkblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Find a Location</h3>
              <p className="text-gray-600">
                Browse available parking spots in your desired area and choose the best option for you.
              </p>
            </div>
            <div className="bg-parkblue-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-3 bg-parkblue-100 rounded-full mb-4">
                <Calendar className="h-6 w-6 text-parkblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Book in Advance</h3>
              <p className="text-gray-600">
                Reserve your parking spot ahead of time to guarantee availability when you need it.
              </p>
            </div>
            <div className="bg-parkblue-50 p-6 rounded-lg text-center">
              <div className="inline-flex items-center justify-center p-3 bg-parkblue-100 rounded-full mb-4">
                <CreditCard className="h-6 w-6 text-parkblue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Pay & Park</h3>
              <p className="text-gray-600">
                Complete your payment securely online and simply drive to your reserved spot.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-parkblue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Park Smarter?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of drivers who save time and money by booking parking spots in advance.
          </p>
          <Button asChild size="lg" className="bg-parkteal-500 hover:bg-parkteal-600">
            <Link to="/parking">Book Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
