
import { Car, Clock, MapPin, ShieldCheck } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">About ParkEase</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-lg mb-4">
            ParkEase is a modern parking management solution dedicated to making parking simple and stress-free for drivers everywhere.
          </p>
          <p className="mb-4">
            Our mission is to transform the traditional parking experience by providing a seamless digital platform that allows users to find, book, and pay for parking spots in advance.
          </p>
          <p>
            Founded in 2023, ParkEase has quickly grown to become a trusted parking solution in major cities across the country, helping thousands of drivers save time and avoid the frustration of searching for parking.
          </p>
        </div>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-parkblue-500">
            <div className="flex items-start">
              <div className="bg-parkblue-50 p-3 rounded-full mr-4">
                <MapPin className="h-6 w-6 text-parkblue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Location Services</h3>
                <p className="text-gray-600">
                  Easily find parking spaces near your destination with our interactive map interface.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-parkblue-500">
            <div className="flex items-start">
              <div className="bg-parkblue-50 p-3 rounded-full mr-4">
                <Clock className="h-6 w-6 text-parkblue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Advanced Booking</h3>
                <p className="text-gray-600">
                  Reserve your parking spot in advance to ensure availability when you arrive.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-parkblue-500">
            <div className="flex items-start">
              <div className="bg-parkblue-50 p-3 rounded-full mr-4">
                <Car className="h-6 w-6 text-parkblue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Parking Management</h3>
                <p className="text-gray-600">
                  Track your active and upcoming bookings, and manage your parking schedule.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-parkblue-500">
            <div className="flex items-start">
              <div className="bg-parkblue-50 p-3 rounded-full mr-4">
                <ShieldCheck className="h-6 w-6 text-parkblue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                <p className="text-gray-600">
                  Pay for your parking securely online with our encrypted payment system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold mb-6">Contact Us</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="mb-4">
            If you have any questions or feedback, we'd love to hear from you:
          </p>
          <div className="space-y-2 mb-4">
            <p><strong>Email:</strong> support@parkease.com</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Address:</strong> 123 Parking Street, City Center, 10001</p>
          </div>
          <p>
            Our customer support team is available Monday through Friday, 9:00 AM to 5:00 PM.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
