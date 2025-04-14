
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Car } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6 flex justify-center">
          <div className="bg-parkblue-100 p-4 rounded-full">
            <Car className="h-12 w-12 text-parkblue-700" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-parkblue-800 mb-4">Oops! Wrong Turn</h1>
        <p className="text-xl text-gray-600 mb-8">
          The parking spot you're looking for doesn't exist or has moved.
        </p>
        <Button asChild size="lg">
          <Link to="/">Go Back Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
