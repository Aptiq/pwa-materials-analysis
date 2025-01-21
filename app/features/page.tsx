import { PageContainer } from "@/components/layout/page-container"
import { Smartphone, Wifi, Zap, Bell, Lock } from "lucide-react"

export default function FeaturesPage() {
  const features = [
    {
      icon: Wifi,
      title: "Mode Hors-ligne",
      description: "Accédez à l'application même sans connexion internet"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Chargement rapide et expérience fluide"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Restez informé avec les notifications push"
    },
    {
      icon: Lock,
      title: "Sécurité",
      description: "Vos données sont protégées et sécurisées"
    }
  ]

  return (
    <PageContainer
      heading="Fonctionnalités"
      subheading="Découvrez tout ce que notre application peut faire pour vous"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-lg border bg-card p-4 md:p-6 hover:shadow-lg transition-all"
            >
              <Icon className="h-10 w-10 md:h-12 md:w-12 mb-3 md:mb-4 text-primary" />
              <h2 className="text-lg md:text-xl font-semibold mb-2">{feature.title}</h2>
              <p className="text-sm md:text-base text-muted-foreground">{feature.description}</p>
            </div>
          )
        })}
      </div>
    </PageContainer>
  )
}