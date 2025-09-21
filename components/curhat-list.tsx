"use client"

import { useState } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Heart, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CurhatStory {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
}

interface CurhatListProps {
  initialStories: CurhatStory[]
}

export default function CurhatList({ initialStories }: CurhatListProps) {
  const [stories, setStories] = useState<CurhatStory[]>(initialStories)
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())

  const toggleExpanded = (storyId: string) => {
    const newExpanded = new Set(expandedStories)
    if (newExpanded.has(storyId)) {
      newExpanded.delete(storyId)
    } else {
      newExpanded.add(storyId)
    }
    setExpandedStories(newExpanded)
  }

  const truncateContent = (content: string, maxLength = 200) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + "..."
  }

  return (
    <section className="bg-card py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">Cerita dari Komunitas</h2>
          <p className="text-muted-foreground">
            Baca cerita inspiratif dari teman-teman yang telah berbagi pengalaman mereka
          </p>
        </div>

        {stories.length > 0 ? (
          <div className="space-y-8">
            {stories.map((story) => {
              const isExpanded = expandedStories.has(story.id)
              const shouldTruncate = story.content.length > 200

              return (
                <Card key={story.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3">
                      <Image
                        src="/images/icon-profile.png"
                        alt="Profile"
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-card-foreground">{story.author_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(story.created_at), {
                            addSuffix: true,
                            locale: id,
                          })}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <h4 className="text-xl font-bold text-card-foreground">{story.title}</h4>

                    <div className="prose prose-gray max-w-none">
                      <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                        {isExpanded || !shouldTruncate ? story.content : truncateContent(story.content)}
                      </p>
                    </div>

                    {shouldTruncate && (
                      <Button
                        variant="ghost"
                        onClick={() => toggleExpanded(story.id)}
                        className="text-primary hover:text-secondary p-0 h-auto font-medium"
                      >
                        {isExpanded ? "Tampilkan lebih sedikit" : "Baca selengkapnya"}
                      </Button>
                    )}

                    <div className="flex items-center space-x-6 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Heart className="w-4 h-4 mr-2" />
                        Dukung
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Komentar
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share2 className="w-4 h-4 mr-2" />
                        Bagikan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Belum ada cerita yang dibagikan. Jadilah yang pertama untuk berbagi!
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
