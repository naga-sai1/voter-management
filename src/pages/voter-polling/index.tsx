'use client'

import { useEffect, useState } from 'react'
import { Users, Check, Star, Shield, Leaf, Feather, LogOut } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SuccessModal } from './components/success-modal'
import { ErrorModal } from './components/error-modal'
import { useNavigate } from 'react-router-dom'
import { getAllParties, castVote } from '@/api'

interface Party {
  id: number
  name: string
  abbreviation: string
  logo: string | null
  state_id: number
  state_name: string
  created_at: string
  updated_at: string
}

export default function VoterPolling() {
  const [selectedParty, setSelectedParty] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [parties, setParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const voter = localStorage.getItem('voter')
    ? JSON.parse(localStorage.getItem('voter')!)
    : null

  const navigate = useNavigate()

  useEffect(() => {
    if (!voter) {
      navigate('/voter-login')
    }
  }, [voter, navigate])

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const response = await getAllParties()
        setParties(response.parties)
      } catch (error) {
        console.error('Error fetching parties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchParties()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedParty && voter) {
      try {
        await castVote({
          aadhar: voter.aadhar,
          name: voter.name,
          phone_no: voter.phone_no,
          party_id: selectedParty,
        })
        setShowSuccessModal(true)
      } catch (error: any) {
        console.error('Error casting vote:', error)
        setErrorMessage(
          error.response?.data?.message ||
            'Failed to cast vote. Please try again.'
        )
        setShowErrorModal(true)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('voter')
    localStorage.removeItem('isVoterLoggedIn')
    navigate('/')
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0A0F1C] to-[#1A2035]'>
        <div className='text-xl text-white'>Loading...</div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A2035] p-8'>
      <div className='mx-auto max-w-4xl space-y-8 rounded-2xl bg-white/10 p-8 shadow-xl backdrop-blur-md'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Users className='h-8 w-8 text-cyan-400' />
            <span className='text-2xl font-bold text-white'>Voter Portal</span>
          </div>
          <Button
            onClick={handleLogout}
            variant='outline'
            className='border-red-500/20 text-red-500 hover:bg-red-500/10'
          >
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>

        <div className='space-y-2'>
          <h1 className='text-4xl font-extrabold text-white'>Cast Your Vote</h1>
          <p className='text-xl text-gray-300'>
            Select your preferred party and submit your vote
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-8'>
          <RadioGroup
            value={selectedParty}
            onValueChange={setSelectedParty}
            className='grid grid-cols-1 gap-6 sm:grid-cols-2'
          >
            {parties.map((party) => (
              <Card
                key={party.id}
                onClick={() => setSelectedParty(party.id.toString())}
                className={`relative cursor-pointer overflow-hidden transition-all duration-300 ${
                  selectedParty === party.id.toString()
                    ? 'bg-cyan-400/20 ring-2 ring-cyan-400'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <CardContent className='p-6'>
                  <div className='flex items-center space-x-4'>
                    <div className='rounded-full bg-white/10 p-3'>
                      {party.logo ? (
                        <img
                          src={party.logo}
                          alt={party.name}
                          className='h-8 w-8 object-contain'
                        />
                      ) : (
                        <Shield className='h-8 w-8 text-cyan-400' />
                      )}
                    </div>
                    <div className='flex-grow'>
                      <h3 className='text-xl font-semibold text-white'>
                        {party.name}
                      </h3>
                      <p className='text-sm text-gray-400'>
                        {party.state_name}
                      </p>
                    </div>
                    <RadioGroupItem
                      id={party.id.toString()}
                      value={party.id.toString()}
                      className='border-cyan-400 text-cyan-400'
                    />
                  </div>
                  {selectedParty === party.id.toString() && (
                    <div className='absolute bottom-2 right-2'>
                      <Check className='h-6 w-6 text-cyan-400' />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </RadioGroup>

          <Button
            type='submit'
            className='w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 py-6 text-lg font-bold text-white shadow-lg transition-all duration-300 hover:from-cyan-600 hover:to-blue-600'
            disabled={!selectedParty}
          >
            Submit Your Vote
          </Button>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => {
          setShowErrorModal(false)
          setErrorMessage('')
        }}
        message={errorMessage}
      />
    </div>
  )
}
