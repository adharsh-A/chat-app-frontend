import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, KeyRound } from 'lucide-react';

// Configure axios base URL
axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND}chat` || "http://localhost:3000/api/chat";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/reset-password/${token}`, { newPassword });
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      setMessage('Error: Unable to reset password.');
      toast.error('Password reset failed');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-blue-500" />
            Reset Password
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
            >
              Reset Password
            </Button>
          </form>
          {message && (
            <p className={`mt-4 text-center ${
              message.includes('Error') 
                ? 'text-red-500' 
                : 'text-green-500'
            }`}>
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;