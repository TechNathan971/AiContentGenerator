import { ThemeToggle } from "@/components/theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">AI Content Generator</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Google Gemini</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium">
                  Tools
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem asChild>
                  <Link href="/" className={`flex items-center ${location === '/' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}>
                    <i className="fas fa-blog w-4 h-4 mr-2"></i>
                    Blog Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/social-media" className={`flex items-center ${location === '/social-media' ? 'bg-slate-100 dark:bg-slate-700' : ''}`}>
                    <i className="fas fa-share-alt w-4 h-4 mr-2"></i>
                    Social Media Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#" className="flex items-center">
                    <i className="fas fa-envelope w-4 h-4 mr-2"></i>
                    Email Templates
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#" className="flex items-center">
                    <i className="fas fa-ad w-4 h-4 mr-2"></i>
                    Ad Copy Generator
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium">Templates</a>
            <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-sm font-medium">History</a>
            <ThemeToggle />
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
              <i className="fas fa-user mr-2"></i>Account
            </button>
          </nav>
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <i className="fas fa-bars"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center">
                    <i className="fas fa-blog w-4 h-4 mr-2"></i>
                    Blog Generator
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/social-media" className="flex items-center">
                    <i className="fas fa-share-alt w-4 h-4 mr-2"></i>
                    Social Media Posts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#" className="flex items-center">
                    <i className="fas fa-envelope w-4 h-4 mr-2"></i>
                    Email Templates
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#" className="flex items-center">
                    <i className="fas fa-ad w-4 h-4 mr-2"></i>
                    Ad Copy Generator
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
