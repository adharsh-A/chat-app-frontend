import { Input } from '@/components/ui/input';
import React from 'react';
import axios from 'axios';
import { toast } from 'sonner';
// Configure axios base URL
axios.defaults.baseURL =
  `${import.meta.env.VITE_BACKEND}chat` || "http://localhost:3000/api/chat";


function ForgotPassword({ mode }) {
  const [email, setEmail] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post('/forget-password', { email });
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      setMessage('Error: Unable to send reset link.');
    }finally{
      setIsLoading(false);
    }
  };
  return (
    <div className="flex justify-center items-center py-24 ">
      <div className={`${mode === 'dark' ? 'bg-black border border-zinc-600' : 'bg-zinc-950'} relative h-fit w-[600px] border border-gray-300/50 rounded-md p-8 z-50`}>
        <div className="flex justify-center items-center">
          <div className="rounded-full p-4">
            {/* Replace Next.js Image with a regular img tag */}
            <img src="https://i.imgur.com/TM94NQl.png" alt="EmailSentIcon" width={60} height={60} />
          </div>
        </div>
        <div className="mt-8">
          <p className={`${mode === 'dark' ? 'text-slate-100' : 'text-white'} text-2xl font-semibold text-center mb-3`}>Forgot Password?</p>
          <p className={`${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center text-sm mb-6`}>
            Don&apos;t worry, it happens to the best of us.<br />
            Type your email to reset your password.
          </p>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="Email address"
                required
                // className={`${mode === 'dark' ? 'text-gray-200 bg-[#16171C] border border-gray-600' : 'bg-gray-900 border border-gray-300'} w-full px-4 py-2 rounded-md focus:outline-none focus:ring-3 focus:ring-red-100`}
              />
            </div>
            <button
              type="submit"
              className={`${mode === 'dark' ? 'bg-gradient-to-b from-gray-100 to-gray-300 text-black' : 'bg-gray-800 text-white'} w-full py-2 rounded-md hover:bg-gradient-to-r hover:bg-gray-900 focus:outline-none`}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
              disabled={isLoading}
            >
              <span className="font-medium">Send Code</span>
            </button>
          </form>
          {message && <p>{message}</p>}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
