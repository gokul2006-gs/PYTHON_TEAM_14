import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { AuthLayout } from '../../layouts/AuthLayout';
import { Loader2 } from 'lucide-react';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        // Simulate backend call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Always show success message for security (don't reveal if email exists)
        setIsSubmitted(true);
        setIsLoading(false);
        console.log('Reset requested for:', data.email);
    };

    return (
        <AuthLayout
            title="Reset your password"
            subtitle="Enter your email to receive instructions"
        >
            {!isSubmitted ? (
                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-900">
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Instructions'
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <div className="rounded-md bg-green-50 p-4">
                        <h3 className="text-sm font-medium text-green-800">Check your email</h3>
                        <div className="mt-2 text-sm text-green-700">
                            <p>If an account exists for that email, we have sent password reset instructions.</p>
                        </div>
                    </div>
                </div>
            )}

            <p className="mt-10 text-center text-sm text-slate-500">
                Remember your password?{' '}
                <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
};
