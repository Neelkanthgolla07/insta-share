'use client'
import React from 'react'
import { useState, ChangeEvent,FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
interface Details {
  username: string;
  password: string;
}

const SignIn = () => {
    const router = useRouter()
    const [details, setDetails] = useState<Details>({
        username: "",
        password: ""
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails((prev) => ({
            ...prev, [name]: value
        }))
    }
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            setError('')
            
            const result = await signIn('credentials', {
                username: details.username,
                password: details.password,
                redirect: false
            })

            if (result?.error) {
                setError(result.error)
            } else {
                router.push('/home')
                router.refresh()
            }
        } catch (err) {
            setError('An error occurred during sign in')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <div className='min-h-screen flex justify-center items-center'>
                <div className='hidden md:block mr-5'>
                    <Image 
                        src="/Illustration.png" 
                        alt="Illustration" 
                        width={400} 
                        height={400}
                    />
                </div>
                <div className='p-4'>
                    <div className="bg-white p-8 flex flex-col items-center rounded-lg shadow-md w-full max-w-sm">
                        <div className='mb-5 item'>
                            <Image 
                                src="/logo.png" 
                                alt="Logo" 
                                width={44} 
                                height={24}
                            />
                            <p>Insta Share</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <h1 className='text-xl m-2 text-center'>You are signing in</h1>
                            {error && (
                                <div className="mb-4 p-2 text-sm text-red-600 bg-red-100 rounded">
                                    {error}
                                </div>
                            )}
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">USERNAME</label>
                                <input 
                                    id="username" 
                                    name="username" 
                                    type="text" 
                                    placeholder="username" 
                                    onChange={handleChange}
                                    value={details.username} 
                                    className="w-full px-4 py-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">PASSWORD</label>
                                <input id="password" onChange={handleChange}  name="password" type="password" placeholder='password' 
                                    value={details.password} 
                                    className="w-full px-4 py-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold disabled:bg-blue-300"
                                disabled={loading}
                            >
                                {loading ? 'Signing in...' : 'Login'}
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-gray-600">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-blue-500 hover:text-blue-600 font-semibold">
                                Sign up here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignIn
