"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function ContactPage() {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais."
    })
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="py-8 px-4 md:py-16 md:px-0 space-y-6 md:space-y-8">
      <div className="text-center space-y-3 md:space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold">Contact</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Une question ? N'hésitez pas à nous contacter
        </p>
      </div>

      <div className="max-w-md mx-auto">
        <div className="rounded-lg border bg-card p-4 md:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5 md:mb-2">
                Nom
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 md:mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-1.5 md:mb-2">
                Message
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="min-h-[120px] md:min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full">
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}