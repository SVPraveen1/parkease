
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";
import { Link } from "react-router-dom";

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header = ({ isAuthenticated, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-parkblue-700" />
          <span className="text-xl font-bold text-parkblue-700">ParkEase</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-600 hover:text-parkblue-500 transition-colors">Home</Link>
          {isAuthenticated && (
            <>
              <Link to="/bookings" className="text-gray-600 hover:text-parkblue-500 transition-colors">My Bookings</Link>
              <Link to="/parking" className="text-gray-600 hover:text-parkblue-500 transition-colors">Find Parking</Link>
            </>
          )}
          <Link to="/about" className="text-gray-600 hover:text-parkblue-500 transition-colors">About Us</Link>
        </nav>
        
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button onClick={onLogout} variant="outline">Log out</Button>
          ) : (
            <Button onClick={onLogin}>Log in</Button>
          )}
        </div>
      </div>
    </header>
  );
};
