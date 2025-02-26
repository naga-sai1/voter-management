'use client'

import { useEffect, useState } from 'react'
import { Users, Check, Star, Shield, Leaf, Feather, LogOut } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SuccessModal } from './components/success-modal'
import { ErrorModal } from './components/error-modal'
import { useNavigate } from 'react-router-dom'
import { getAllPolls, castVote } from '@/api'

interface State {
  id: string
  name: string
  abbreviation: string
}

interface Party {
  party_id: number
  name: string
  abbreviation: string
  logo: string | null
}

interface Poll {
  poll_id: number
  name: string
  start_date: string
  end_date: string
  state: State
  parties: Party[]
}

export default function VoterPolling() {
  const [selectedParty, setSelectedParty] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
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
    const fetchPolls = async () => {
      try {
        const response = await getAllPolls(voter.state_id)
        setPolls(response.polls)
      } catch (error) {
        console.error('Error fetching polls:', error)
        setErrorMessage('Failed to fetch polls. Please try again.')
        setShowErrorModal(true)
      } finally {
        setLoading(false)
      }
    }

    if (voter) {
      fetchPolls()
    }
  }, [voter])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedParty && voter && polls.length > 0) {
      try {
        const response = await castVote({
          voter_id: voter.id,
          party_id: parseInt(selectedParty),
          poll_id: polls[0].poll_id
        })

        if (response.success) {
          setShowSuccessModal(true)
        } else {
          setErrorMessage(response.message || 'Failed to cast vote')
          setShowErrorModal(true)
        }
      } catch (error: any) {
        setErrorMessage(error.response?.data?.message || 'Failed to cast vote')
        setShowErrorModal(true)
      }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('voter')
    navigate('/voter-login')
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (!voter) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {voter.name}</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {polls.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {polls.map((poll) => (
              <Card key={poll.poll_id} className="w-full">
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h2 className="text-2xl font-semibold">{poll.name}</h2>
                    <p className="text-gray-600">
                      State: {poll.state.name} ({poll.state.abbreviation})
                    </p>
                    <p className="text-gray-600">
                      Duration: {new Date(poll.start_date).toLocaleDateString()} - {new Date(poll.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <RadioGroup
                    value={selectedParty}
                    onValueChange={setSelectedParty}
                    className="space-y-4"
                  >
                    {poll.parties.map((party) => (
                      <div
                        key={party.party_id}
                        className="flex items-center space-x-4 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <RadioGroupItem
                          value={party.party_id.toString()}
                          id={party.party_id.toString()}
                        />
                        <div className="flex items-center space-x-4 flex-1">
                          {party.logo ? (
                            <img
                              src={party.logo}
                              alt={party.name}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <Shield className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{party.name}</h3>
                            <p className="text-sm text-gray-500">{party.abbreviation}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>

                  <Button
                    type="submit"
                    className="mt-6 w-full"
                    disabled={!selectedParty}
                  >
                    Cast Vote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">No active polls available for your state.</p>
          </CardContent>
        </Card>
      )}

      <SuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/voter-login')
        }}
      />
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  )
}
