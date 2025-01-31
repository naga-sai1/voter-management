
import { useState } from 'react'

import { Users, Github, Facebook, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'

export default function VoterLogin() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className='grid min-h-screen bg-[#0A0F1C] lg:grid-cols-2'>
      {/* Left side */}
      <div className='relative hidden flex-col items-center justify-center bg-black lg:flex'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent' />
        </div>

        <div className='relative z-10 flex flex-col items-center space-y-8'>
          <div className='h-64 w-64 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 p-[2px]'>
            <div className='flex h-full w-full items-center justify-center rounded-xl bg-black'>
              <Users className='h-32 w-32 text-white' />
            </div>
          </div>
          <blockquote className='max-w-md text-center text-lg text-white/80'>
            "Exercise your democratic right with our secure and efficient voting
            platform."
          </blockquote>
        </div>

        <div className='absolute left-12 top-12 flex items-center gap-2'>
          <Users className='h-8 w-8 text-cyan-400' />
          <span className='text-xl font-semibold text-white'>Voter Portal</span>
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8'>
        <div className='w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm'>
          <div className='flex items-center gap-2 lg:hidden'>
            <Users className='h-8 w-8 text-cyan-400' />
            <span className='text-xl font-semibold text-white'>
              Voter Portal
            </span>
          </div>

          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-white'>Voter Login</h1>
            <p className='text-gray-400'>
              Enter your voter ID and password to access your account
            </p>
          </div>

          <form className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='voter-id' className='text-gray-200'>
                Voter ID
              </Label>
              <Input
                id='voter-id'
                type='text'
                placeholder='Enter your voter ID'
                className='border-white/20 bg-white/10 text-white placeholder:text-gray-500'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-gray-200'>
                  Password
                </Label>
                <Button
                  variant='link'
                  className='px-0 text-cyan-400 hover:text-cyan-300'
                >
                  Forgot password?
                </Button>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='border-white/20 bg-white/10 pr-10 text-white'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:bg-transparent hover:text-white'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-cyan-600 text-white hover:bg-cyan-700'
            >
              Login
            </Button>
          </form>

          <div className='space-y-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-white/10' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-transparent px-2 text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <Button
                variant='outline'
                className='border-white/10 bg-white/5 text-white hover:bg-white/10'
              >
                <Github className='mr-2 h-4 w-4' />
                GitHub
              </Button>
              <Button
                variant='outline'
                className='border-white/10 bg-white/5 text-white hover:bg-white/10'
              >
                <Facebook className='mr-2 h-4 w-4' />
                Facebook
              </Button>
            </div>
          </div>

          <p className='text-center text-sm text-gray-400'>
            By clicking login, you agree to our{' '}
            <Link
              to='#'
              className='text-cyan-400 underline hover:text-cyan-300'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to='#'
              className='text-cyan-400 underline hover:text-cyan-300'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
