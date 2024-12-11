import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import axios from 'axios';
import { toast } from 'sonner';
// import { useLoginMutation } from '@/redux/authenticationApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '@/redux/authSlice';
import Loader from '@/components/ui/Loader';
import { useState } from 'react';
import { useLoginMutation } from '@/redux/authenticationApi';

export default function Login() {
  const [
    login,
    { isLoading: isLoggingIn, isError: isLoginError, error: loginError },
  ] = useLoginMutation();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values) {
    try {
      setIsLoading(true);
      let response = await login(values).unwrap();
      // const response = await axios.post('http://localhost:3000/api/auth/login', values);
      dispatch(setCredentials(response));
      navigate('/');
    
    } catch (error) {
      console.log("login error:", error);
      if (error.response) {
        // The server responded with a status code outside the range 2xx
        toast.error(error.response.data.message || "Failed to login");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received from server");
      } else {
        // Something went wrong while setting up the request
        toast.error("An error occurred during login");
      }
    }finally{
      setIsLoading(false);
    }
  }

  if(isLoading){
    return <Loader />;
  }

  return (
    <div className="flex flex-col min-h-[50vh] h-screen w-full items-center justify-center px-4 bg-transparent">
      <Card className="mx-auto max-w-sm border-slate-800 bg-slate-900/50 z-50">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-50">Login</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email and password to login to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="username" className="text-slate-200">Username</FormLabel>
                      <FormControl>
                        <Input
                          id="username"
                          placeholder="Username"
                          type="text"
                          autoComplete="username"
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <FormLabel htmlFor="password" className="text-slate-200">Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="ml-auto inline-block text-sm text-slate-400 hover:text-slate-300 underline"
                        >
                          Forgot your password?
                        </Link>
                      </div>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="current-password"
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-slate-50 text-slate-900 hover:bg-slate-400 hover:text-slate-800">
                  Login
                </Button>
                <Button variant="outline" className="w-full border-slate-700 text-slate-100 hover:bg-slate-800 hover:text-slate-50">
                <svg 
    className="w-5 h-5 mr-2" 
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>Login with Google
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="cursor-pointer text-slate-200 hover:text-slate-50 underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}