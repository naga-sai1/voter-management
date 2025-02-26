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
import { useNavigate } from 'react-router-dom'

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
import { getAllStates, getAllParties, conductPoll } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Party {
  id: number
  name: string
  abbreviation: string
  logo: string | null
  state_id: number
  state_name: string
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Poll name must be at least 2 characters.',
  }),
  description: z.string().optional(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format',
  }),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  }),
  state_parties: z
    .array(
      z.object({
        state_id: z.string().transform(Number),
        party_list: z.array(z.string().transform(Number)).min(1, {
          message: 'Select at least 1 party per state',
        }),
      })
    )
    .min(1, {
      message: 'Add at least one state-party combination',
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
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      state_parties: [],
    },
  })

  const navigate = useNavigate()

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

      await conductPoll({
        name: values.name,
        description: values.description,
        start_date: values.start_date,
        end_date: values.end_date,
        state_parties: values.state_parties.map((sp) => ({
          state_id: sp.state_id,
          party_list: sp.party_list,
        })),
      })

      setProgress(100)
      clearInterval(interval)
      setShowSuccessModal(true)
      form.reset()
      navigate('/admin-dashboard')
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
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Poll Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter poll name'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Optional poll description'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='state_parties'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>
                      State-Party Combinations
                    </FormLabel>
                    {field.value.map((_, index) => (
                      <div
                        key={index}
                        className='mb-6 rounded-lg border border-white/10 p-4'
                      >
                        <div className='mb-4 flex justify-between'>
                          <FormLabel className='text-gray-300'>
                            Group #{index + 1}
                          </FormLabel>
                          <Button
                            type='button'
                            variant='ghost'
                            className='text-red-400 hover:bg-white/5'
                            onClick={() => {
                              const updated = [...field.value]
                              updated.splice(index, 1)
                              field.onChange(updated)
                            }}
                          >
                            Remove
                          </Button>
                        </div>

                        <FormField
                          control={form.control}
                          name={`state_parties.${index}.state_id`}
                          render={({ field }) => (
                            <FormItem className='mb-4'>
                              <FormLabel className='text-gray-300'>
                                State
                              </FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className='border-white/20 bg-white/10 text-white'>
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

                        <FormField
                          control={form.control}
                          name={`state_parties.${index}.party_list`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className='text-gray-300'>
                                Parties
                              </FormLabel>
                              <div className='space-y-2'>
                                {parties
                                  .filter(
                                    (p) =>
                                      p.state_id.toString() ===
                                      form.getValues().state_parties[index]
                                        ?.state_id
                                  )
                                  .map((party) => (
                                    <div
                                      key={party.id}
                                      className='flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 p-3'
                                    >
                                      <Checkbox
                                        checked={field.value?.includes(
                                          party.id.toString()
                                        )}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || []
                                          const newValue = checked
                                            ? [...current, party.id.toString()]
                                            : current.filter(
                                                (v) => v !== party.id.toString()
                                              )
                                          field.onChange(newValue)
                                        }}
                                      />
                                      <div className='flex items-center space-x-3'>
                                        {party.logo && (
                                          <img
                                            src={party.logo}
                                            alt={party.name}
                                            className='h-8 w-8 rounded-full object-cover'
                                          />
                                        )}
                                        <span className='text-sm text-white'>
                                          {party.name} ({party.abbreviation})
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}

                    <Button
                      type='button'
                      variant='outline'
                      className='w-full border-white/20 text-white hover:bg-white/10'
                      onClick={() =>
                        field.onChange([
                          ...field.value,
                          { state_id: '', party_list: [] },
                        ])
                      }
                    >
                      Add State-Party Combination
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          <Dialog
            open={showSuccessModal}
            onOpenChange={(open) => {
              if (!open) {
                form.reset()
                navigate('/admin-dashboard')
              }
              setShowSuccessModal(open)
            }}
          >
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
                    The poll has been started for the selected state and
                    parties.
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4 flex justify-end'>
                  <Button className='bg-violet-600 hover:bg-violet-700'>
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
