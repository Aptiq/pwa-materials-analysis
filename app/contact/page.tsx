"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { PageContainer } from "@/components/layout/page-container"

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
    <PageContainer
      heading="Contact"
      subheading="Une question ? N'hésitez pas à nous contacter"
    >
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
    </PageContainer>
  )
}