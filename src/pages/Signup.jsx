import React from 'react';
import { Link, Navigate } from 'react-router-dom';
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
// import { PhoneInput } from '@/components/ui/phone-input';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '@/redux/authSlice';
import { useDispatch } from 'react-redux';
import { useSignupMutation } from '@/redux/authenticationApi';
import Loader from '@/components/ui/Loader';

export default function Register() {
  const [signup,{isLoading:isLoading,isError,isSuccess}] = useSignupMutation();
  const dispatch = useDispatch();
  const navigate= useNavigate();
  const form = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values) {
    try {
      // Basic validation
      if (values.password !== values.confirmPassword) {
        form.setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        });
        return;
      }
  
      if (values.password.length < 6) {
        form.setError('password', {
          type: 'manual',
          message: 'Password must be at least 6 characters long',
        });
        return;
      }
  
      if (!values.username || values.username.length < 2) {
        form.setError('name', {
          type: 'manual',
          message: 'Name must be at least 2 characters long',
        });
        return;
      }
  
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        form.setError('email', {
          type: 'manual',
          message: 'Invalid email address',
        });
        return;
      }
  
      // const response = await axios.post('http://localhost:3000/api/auth/signup', values);
      const response = await signup(values).unwrap();
      toast.success('Signup successful');
      //enter setcredentials
      dispatch(setCredentials(response));
      navigate('/');
      toast.success("Welcome " + response.user.username);

    } catch (error) {
      console.log("signup error",error);
      if (error.response) {
        // The server responded with a status code outside the range 2xx
        toast.error(error.response.data.message || "Failed to Signup");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received from server");
      } else {
        // Something went wrong while setting up the request
        toast.error("An error occurred during Signup");
      }
    }
  }
  if (isLoading) {
    return <Loader />
  }
  

  return (
    <div className="flex min-h-[60vh] h-[110vh] w-full items-center justify-center px-4 bg-slate-950">
      <Card className="z-50 mx-auto md:mt-16 w-full md:max-w-lg max-w-sm border-slate-800 bg-slate-900/50">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-50">Register</CardTitle>
          <CardDescription className="text-slate-400">
            Create a new account by filling out the form below.
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
                      <FormLabel htmlFor="name" className="text-slate-200">
                        User Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          id="username" 
                          placeholder="John Doe" 
                          className=" z-50 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="email" className="text-slate-200">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          placeholder="johndoe@mail.com"
                          type="email"
                          autoComplete="email"
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
{/* 
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="phone" className="text-slate-200">
                        Phone Number
                      </FormLabel>
                      <FormControl>
                        <PhoneInput 
                          {...field} 
                          defaultCountry="US" 
                          className="bg-slate-800 border-slate-700 text-slate-100"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="grid gap-2 ">
                      <FormLabel htmlFor="password" className="text-slate-200">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="password"
                          placeholder="******"
                          autoComplete="new-password"
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="grid gap-2">
                      <FormLabel htmlFor="confirmPassword" className="text-slate-200">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          id="confirmPassword"
                          placeholder="******"
                          autoComplete="new-password"
                          className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-slate-50 text-slate-900 hover:bg-slate-400 hover:text-slate-800"
                >
                  Register
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-slate-200 hover:text-slate-50 underline"
            >
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}