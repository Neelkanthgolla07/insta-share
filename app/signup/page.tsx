'use client'
import React from 'react'
import { useState, ChangeEvent, FormEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import bcrypt from 'bcryptjs'

interface Details {
  username: string;
  password: string;
}

const SignUp = () => {
    const router = useRouter()
    const [error, setError] = useState('')
    const [details, setDetails] = useState<Details>({
        username: "",
        password: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails((prev) => ({
            ...prev, [name]: value
        }))
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const hashedPassword = await bcrypt.hash(details.password, 3)
              const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: details.username,
                    password: hashedPassword
                })
            })

            if (res.ok) {
                router.push('/signin')
            } else {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
            }
        } catch (error) {
            console.log(error)
            setError('An error occurred during registration')
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
                            <h1 className='text-xl m-2 text-center'>You are signing up</h1>
                            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">USERNAME</label>
                                <input 
                                    id="username" 
                                    name="username" 
                                    type="text" 
                                    placeholder="username" 
                                    onChange={handleChange}
                                    value={details.username} 
                                    className="w-full px-4 py-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">PASSWORD</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    placeholder="password" 
                                    onChange={handleChange}
                                    value={details.password} 
                                    className="w-full px-4 py-2 bg-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                />
                            </div>
                            <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">
                                Sign Up
                            </button>
                        </form>
                        <p className="mt-4 text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-blue-500 hover:text-blue-600 font-semibold">
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignUp
