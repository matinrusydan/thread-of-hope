import { Users, Heart, BookOpen, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CommunityStatsProps {
  stats: {
    totalMembers: number
  }
}

export default function CommunityStats({ stats }: CommunityStatsProps) {
  const statItems = [
    {
      icon: Users,
      label: "Anggota Komunitas",
      value: stats.totalMembers.toLocaleString(),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Heart,
      label: "Cerita Dibagikan",
      value: "500+",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: BookOpen,
      label: "E-Book Tersedia",
      value: "25+",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Calendar,
      label: "Event Bulanan",
      value: "12+",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <section className="bg-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Komunitas dalam Angka</h2>
          <p className="text-muted-foreground">Bergabunglah dengan ribuan orang yang telah merasakan manfaatnya</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div
                    className={`w-16 h-16 ${item.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{item.value}</div>
                  <div className="text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
