

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShieldCheck, CheckCircle, XCircle, Upload, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { Button } from "@/components/custom/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"


const formSchema = z.object({
  partyName: z.string().min(2, {
    message: "Party name must be at least 2 characters.",
  }),
  state: z.string({
    required_error: "Please select a state.",
  }),
  partyLogo: z.instanceof(File).optional(),
})

function CreatePoll() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partyName: "",
      state: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // Simulating an API call with progress
      await new Promise((resolve, reject) => {
        let progressValue = 0
        const interval = setInterval(() => {
          progressValue += 10
          setProgress(progressValue)
          if (progressValue >= 100) {
            clearInterval(interval)
            // Randomly succeed or fail for demonstration
            Math.random() > 0.5 ? resolve(true) : reject(new Error("Failed to create poll"))
          }
        }, 200)
      })

      console.log(values)
      setShowSuccessModal(true)
    } catch (error) {
      console.error(error)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
      setProgress(0)
    }
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue("partyLogo", file)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F2C] p-8">
      <Card className="mx-auto max-w-2xl bg-white/5 backdrop-blur-sm">
        <CardContent className="p-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-2"
          >
            <ShieldCheck className="h-8 w-8 text-violet-400" />
            <span className="text-2xl font-semibold text-white">Create Voting Poll</span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="partyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Party Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter party name"
                        {...field}
                        className="border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus:border-violet-400 focus:ring-violet-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400">
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="partyLogo"
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200">Party Logo</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                            id="logo-upload"
                          />
                          <label
                            htmlFor="logo-upload"
                            className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-violet-400 transition-colors"
                          >
                            {logoPreview ? (
                              <img
                                src={logoPreview || "/placeholder.svg"}
                                alt="Party Logo Preview"
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Upload className="w-8 h-8 text-gray-400" />
                            )}
                          </label>
                        </div>
                        <div className="flex-1">
                          <FormDescription className="text-gray-400 mb-2">
                            Upload a logo for the party (optional)
                          </FormDescription>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById("logo-upload")?.click()}
                            className="w-full border-white/20 text-white hover:bg-white/10"
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-violet-600 text-white hover:bg-violet-700 transition-colors"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Poll...
                  </>
                ) : (
                  "Create Poll"
                )}
              </Button>
            </form>
          </Form>

          {isSubmitting && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4">
              <Progress value={progress} className="w-full" />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
            <DialogContent className="sm:max-w-[425px] bg-[#0A0F1C] text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    Poll Created Successfully
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Your voting poll has been created and is now live.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowSuccessModal(false)} className="bg-violet-600 hover:bg-violet-700">
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
            <DialogContent className="sm:max-w-[425px] bg-[#0A0F1C] text-white">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <XCircle className="h-6 w-6 text-red-500" />
                    Failed to Create Poll
                  </DialogTitle>
                  <DialogDescription className="text-gray-300">
                    There was an error creating your voting poll. Please try again.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end mt-4">
                  <Button onClick={() => setShowErrorModal(false)} className="bg-violet-600 hover:bg-violet-700">
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

export default CreatePoll
