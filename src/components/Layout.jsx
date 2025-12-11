import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthAPI } from '@/entities/all'; // Ensure this is the correct AuthAPI
import { createPageUrl } from '@/lib/utils';

import {
  Bell,
  Home,
  Package2,
  Users,
  Search,
  Activity,
  LogOut, // Changed ArrowRightFromLine to LogOut for semantic icon
  UserCircle,
  Megaphone, // For leads
  Menu // For mobile nav toggle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator'; // Make sure Separator is correctly defined/imported
import { toast } from 'react-hot-toast'; // Import toast

const SidebarLink = ({ to, icon: Icon, label, currentPath }) => (
  <Link
    to={createPageUrl(to)}
    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
      currentPath === createPageUrl(to) ? 'bg-primary/10 text-primary' : '' // Updated styling for active link
    }`}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthAPI.getCurrentUser(); // Get current user from storage

  const handleLogout = () => {
    AuthAPI.logout();
    toast.success('Logged out successfully.');
    navigate(createPageUrl('login'), { replace: true }); // Use replace to prevent back navigation to protected routes
  };

  const getUserInitials = (user) => {
    if (!user || !user.name) return 'U'; // Use user.name consistent with backend model
    const parts = user.name.split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gradient-to-br from-indigo-950 via-purple-950 to-blue-950"> {/* Added gradient background to layout */}
      {/* Sidebar */}
      <div className="hidden border-r border-white/10 bg-white/5 md:block backdrop-blur-sm"> {/* Glassmorphism styling */}
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-white/10 px-4 lg:h-[60px] lg:px-6">
            <Link to={createPageUrl('dashboard')} className="flex items-center gap-2 font-semibold text-white">
              <Package2 className="h-6 w-6 text-blue-400" />
              <span className="">SalesAI</span>
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-white hover:bg-white/20">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 text-gray-300">
              <SidebarLink to="dashboard" icon={Home} label="Dashboard" currentPath={location.pathname} />
              <SidebarLink to="leads" icon={Megaphone} label="Leads" currentPath={location.pathname} />
              <SidebarLink to="activities" icon={Activity} label="Activities" currentPath={location.pathname} />
              {/* Add more navigation links here if needed */}
            </nav>
          </div>
          {/* User Profile / Logout */}
          <div className="mt-auto p-4">
            <Card className="bg-white/10 border-white/20 shadow-md"> {/* Glassmorphism card for user */}
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                    {getUserInitials(user)}
                  </div>
                  <div>
                    <CardTitle className="text-sm text-white">
                      {user ? user.name : 'Guest'}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-300">
                      {user ? user.email : 'guest@example.com'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* Top Header for Mobile & Desktop Search/Profile */}
        <header className="flex h-14 items-center gap-4 border-b border-white/10 bg-white/5 px-4 lg:h-[60px] lg:px-6 backdrop-blur-sm"> {/* Glassmorphism styling */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 md:hidden text-white hover:bg-white/20">
                <Menu className="h-5 w-5" /> {/* Using Menu icon for mobile nav toggle */}
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-gray-900 text-white border-gray-700"> {/* Mobile sidebar styling */}
              <nav className="grid gap-2 text-lg font-medium">
                <Link to={createPageUrl('dashboard')} className="flex items-center gap-2 text-lg font-semibold text-white mb-4">
                  <Package2 className="h-6 w-6 text-blue-400" />
                  SalesAI
                </Link>
                <SidebarLink to="dashboard" icon={Home} label="Dashboard" currentPath={location.pathname} />
                <SidebarLink to="leads" icon={Megaphone} label="Leads" currentPath={location.pathname} />
                <SidebarLink to="activities" icon={Activity} label="Activities" currentPath={location.pathname} />
              </nav>
              {/* User Profile / Logout for Mobile */}
              <div className="mt-auto p-4">
                <Card className="bg-white/10 border-white/20 shadow-md"> {/* Glassmorphism card for user */}
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-semibold">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <CardTitle className="text-sm text-white">
                          {user ? user.name : 'Guest'}
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-300">
                          {user ? user.email : 'guest@example.com'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/20" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-300" />
                <Input
                  type="search"
                  placeholder="Search leads, company..."
                  className="w-full appearance-none bg-white/10 border-white/20 text-white placeholder:text-gray-300 pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-blue-600 hover:bg-blue-700 text-white">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 text-white border-gray-700"> {/* Dropdown styling */}
              <DropdownMenuItem onClick={() => toast.info('Settings not implemented yet.')}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children} {/* This is where your page content will be rendered */}
        </main>
      </div>
    </div>
  );
};

export default Layout;
