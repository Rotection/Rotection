import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-12 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-extrabold text-primary">Rotection</span>
          </Link>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors">
              Browse Games
            </Link>
            <Link to="/submit" className="text-muted-foreground hover:text-primary transition-colors">
              Submit Game
            </Link>
            <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
              Login
            </Link>
          </nav>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground text-center md:text-right">
            © {new Date().getFullYear()} Rotection. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
