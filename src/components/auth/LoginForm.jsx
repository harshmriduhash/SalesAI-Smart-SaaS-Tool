// export default LoginForm;
import { Link } from 'react-router-dom';
 import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react'; // Import Loader2
import { createPageUrl } from '@/lib/utils';
import { toast } from 'react-hot-toast'; // Import toast

const LoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await AuthAPI.login({ email, password });
      toast.success('Logged in successfully!');
      onLoginSuccess(); // Notify App.jsx that login was successful
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-white">Login to SalesAI</CardTitle>
          <CardDescription className="text-gray-300">
            Enter your email below to access your CRM account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
            </Button>
            <div className="mt-4 text-center text-sm text-gray-300">
              Don't have an account?{' '}
              <Link to={createPageUrl('register')} className="underline text-blue-300 hover:text-blue-200">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;