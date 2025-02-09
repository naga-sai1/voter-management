"use client"

import { useState } from "react"
import { Users, Check, Star, Shield, Leaf, Feather } from "lucide-react"
import { Button } from "@/components/custom/button"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SuccessModal } from "./components/success-modal"
import { ErrorModal } from "./components/error-modal"


const parties = [
  { id: "party1", name: "Democratic Party", color: "#0000FF", icon: Star },
  { id: "party2", name: "Republican Party", color: "#FF0000", icon: Shield },
  { id: "party3", name: "Green Party", color: "#00FF00", icon: Leaf },
  { id: "party4", name: "Libertarian Party", color: "#FFD700", icon: Feather },
]

export default function VoterPolling() {
  const [selectedParty, setSelectedParty] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedParty) {
      // Simulating API call
      setTimeout(() => {
        // 80% chance of success
        if (Math.random() < 0.8) {
          setShowSuccessModal(true)
        } else {
          setShowErrorModal(true)
        }
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A2035] p-8">
      <div className="mx-auto max-w-4xl space-y-8 rounded-2xl bg-white/10 p-8 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Users className="h-8 w-8 text-cyan-400" />
          <span className="text-2xl font-bold text-white">Voter Portal</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white">Cast Your Vote</h1>
          <p className="text-xl text-gray-300">Select your preferred party and submit your vote</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <RadioGroup
            value={selectedParty}
            onValueChange={setSelectedParty}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {parties.map((party) => {
              const PartyIcon = party.icon
              return (
                <Card
                  key={party.id}
                  className={`cursor-pointer transition-all duration-300 overflow-hidden ${
                    selectedParty === party.id ? "ring-2 ring-cyan-400 bg-cyan-400/20" : "bg-white/5 hover:bg-white/10"
                  }`}
                  onClick={() => setSelectedParty(party.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full p-3" style={{ backgroundColor: `${party.color}30` }}>
                        <PartyIcon className="h-8 w-8" style={{ color: party.color }} />
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold text-white">{party.name}</h3>
                        <div className="mt-2 h-1 w-full rounded-full" style={{ backgroundColor: party.color }}></div>
                      </div>
                      <RadioGroupItem id={party.id} value={party.id} className="border-cyan-400 text-cyan-400" />
                    </div>
                    {selectedParty === party.id && (
                      <div className="absolute bottom-2 right-2">
                        <Check className="h-6 w-6 text-cyan-400" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </RadioGroup>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-lg py-6 rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-lg"
            disabled={!selectedParty}
          >
            Submit Your Vote
          </Button>
        </form>
      </div>

      <SuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} />
    </div>
  )
}

