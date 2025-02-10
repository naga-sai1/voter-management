import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getAllStates, getAllParties } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'

interface Party {
  id: number
  name: string
  abbreviation: string
  logo: string | null
  state_id: number
  state_name: string
}

const formSchema = z.object({
  state: z.string({
    required_error: 'Please select a state.',
  }),
  parties: z.array(z.string()).min(2, {
    message: 'Please select at least 2 parties.',
  }),
})

export default function ConductPoll() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [states, setStates] = useState<Array<{ id: number; name: string }>>([])
  const [parties, setParties] = useState<Party[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [filteredParties, setFilteredParties] = useState<Party[]>([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      state: '',
      parties: [],
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statesResponse, partiesResponse] = await Promise.all([
          getAllStates(),
          getAllParties(),
        ])
        setStates(statesResponse.states)
        setParties(partiesResponse.parties)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  // Filter parties when state is selected
  useEffect(() => {
    if (selectedState) {
      const filtered = parties.filter(
        (party) => party.state_id.toString() === selectedState
      )
      setFilteredParties(filtered)
    }
  }, [selectedState, parties])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      let progressValue = 0
      const interval = setInterval(() => {
        progressValue += 10
        setProgress(Math.min(progressValue, 90))
      }, 200)

      // TODO: Implement API call to start the poll
      // await startPoll({
      //   state_id: values.state,
      //   party_ids: values.parties,
      // })

      setProgress(100)
      clearInterval(interval)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to start poll:', error)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
      setProgress(0)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F2C] p-8'>
      <Button
        onClick={() => window.history.back()}
        variant='ghost'
        className='mb-4 text-white hover:bg-white/10'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back
      </Button>

      <Card className='mx-auto max-w-2xl bg-white/5 backdrop-blur-sm'>
        <CardContent className='p-8'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-8 flex items-center gap-2'
          >
            <ShieldCheck className='h-8 w-8 text-violet-400' />
            <span className='text-2xl font-semibold text-white'>
              Conduct State Poll
            </span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Select State</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedState(value)
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'>
                          <SelectValue placeholder='Select a state' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem
                            key={state.id}
                            value={state.id.toString()}
                          >
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedState && (
                <FormField
                  control={form.control}
                  name='parties'
                  render={() => (
                    <FormItem>
                      <FormLabel className='text-gray-200'>
                        Select Parties (minimum 2)
                      </FormLabel>
                      <div className='space-y-4'>
                        {filteredParties.map((party) => (
                          <div
                            key={party.id}
                            className='flex items-center space-x-4 rounded-lg border border-white/10 bg-white/5 p-4'
                          >
                            <Checkbox
                              id={party.id.toString()}
                              onCheckedChange={(checked) => {
                                const currentValues =
                                  form.getValues().parties || []
                                const newValues = checked
                                  ? [...currentValues, party.id.toString()]
                                  : currentValues.filter(
                                      (value) => value !== party.id.toString()
                                    )
                                form.setValue('parties', newValues)
                              }}
                            />
                            <div className='flex flex-1 items-center space-x-4'>
                              {party.logo && (
                                <img
                                  src={party.logo}
                                  alt={party.name}
                                  className='h-10 w-10 rounded-full object-cover'
                                />
                              )}
                              <div>
                                <p className='text-sm font-medium text-white'>
                                  {party.name}
                                </p>
                                <p className='text-xs text-gray-400'>
                                  {party.abbreviation}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button
                type='submit'
                className='w-full bg-violet-600 text-white transition-colors hover:bg-violet-700'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Starting Poll...
                  </>
                ) : (
                  'Start Poll'
                )}
              </Button>
            </form>
          </Form>

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-4'
            >
              <Progress value={progress} className='w-full' />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className='bg-[#0A0F1C] text-white sm:max-w-[425px]'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <CheckCircle className='h-6 w-6 text-green-500' />
                    Poll Started Successfully
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    The poll has been started for the selected state and parties.
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={() => setShowSuccessModal(false)}
                    className='bg-violet-600 hover:bg-violet-700'
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
            <DialogContent className='bg-[#0A0F1C] text-white sm:max-w-[425px]'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <XCircle className='h-6 w-6 text-red-500' />
                    Failed to Start Poll
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    There was an error starting the poll. Please try again.
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={() => setShowErrorModal(false)}
                    className='bg-violet-600 hover:bg-violet-700'
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
} 