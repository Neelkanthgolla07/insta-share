import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import User from '@/models/User'
import connectionDatabase from '@/lib/mongoose'



export async function GET(
  request: NextRequest,
  context: { params: Promise<{ username: string }> }
){
  try {
    await connectionDatabase()

    const {username} =await  context.params
    const user = await User.findOne({ name: username })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      name: user.name,
      followers: user.followers,
      following: user.following,
      
    })

  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
