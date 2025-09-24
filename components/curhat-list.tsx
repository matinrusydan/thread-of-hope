"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Heart, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Comment {
  id: string
  content: string
  authorName: string | null
  createdAt: string
}

interface CurhatStory {
  id: string
  title: string
  content: string
  author_name: string
  created_at: string
  likes: number
  comments: Comment[]
}

interface CurhatListProps {
  initialStories?: CurhatStory[]
  initialLimit?: number
}

const CONTENT_TRUNCATE_LENGTH = 200
const DEFAULT_INITIAL_LIMIT = 3

export default function CurhatList({
  initialStories = [],
  initialLimit = DEFAULT_INITIAL_LIMIT
}: CurhatListProps) {
  const [stories, setStories] = useState<CurhatStory[]>(initialStories)
  const [expandedStories, setExpandedStories] = useState<Set<string>>(new Set())
  const [showAll, setShowAll] = useState(false)
  const [commentForms, setCommentForms] = useState<Record<string, { content: string; authorName: string }>>({})
  const [isSubmitting, setIsSubmitting] = useState<Record<string, boolean>>({})
  const [likedStories, setLikedStories] = useState<Set<string>>(new Set())
  const [clientId] = useState(() => {
    // Generate or retrieve unique client ID for anonymous users
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('curhat_client_id')
      if (!id) {
        id = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('curhat_client_id', id)
      }
      return id
    }
    return 'server_client'
  })

  // Load liked stories from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const liked = localStorage.getItem('curhat_liked_stories')
      if (liked) {
        try {
          setLikedStories(new Set(JSON.parse(liked)))
        } catch (e) {
          console.error('Error parsing liked stories:', e)
        }
      }
    }
  }, [])

  const toggleExpanded = useCallback((storyId: string) => {
    setExpandedStories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(storyId)) {
        newSet.delete(storyId)
      } else {
        newSet.add(storyId)
      }
      return newSet
    })
  }, [])

  const truncateContent = useCallback((content: string) => {
    if (!content || content.length <= CONTENT_TRUNCATE_LENGTH) return content
    return content.substring(0, CONTENT_TRUNCATE_LENGTH) + "..."
  }, [])

  const displayedStories = useMemo(() => {
    return showAll ? stories : stories.slice(0, initialLimit)
  }, [stories, showAll, initialLimit])

  const formatDate = useCallback((dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: id,
      })
    } catch (error) {
      console.warn("Invalid date format:", dateString, error)
      return "Tanggal tidak valid"
    }
  }, [])

  const handleLike = useCallback(async (storyId: string) => {
    try {
      const response = await fetch(`/api/curhat/${storyId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ clientId }),
      })

      if (response.ok) {
        const data = await response.json()
        setStories(prev =>
          prev.map(story =>
            story.id === storyId ? { ...story, likes: data.likes } : story
          )
        )

        // Update local liked state
        setLikedStories(prev => {
          const newSet = new Set(prev)
          if (data.isLiked) {
            newSet.add(storyId)
          } else {
            newSet.delete(storyId)
          }

          // Save to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('curhat_liked_stories', JSON.stringify(Array.from(newSet)))
          }

          return newSet
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }, [clientId])

  const handleCommentSubmit = useCallback(async (storyId: string, e: React.FormEvent) => {
    e.preventDefault()
    const form = commentForms[storyId]
    if (!form?.content.trim()) return

    setIsSubmitting(prev => ({ ...prev, [storyId]: true }))

    try {
      const response = await fetch(`/api/curhat/${storyId}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: form.content,
          authorName: form.authorName || null,
        }),
      })

      if (response.ok) {
        setCommentForms(prev => ({ ...prev, [storyId]: { content: "", authorName: "" } }))
        alert("Komentar Anda telah dikirim dan menunggu persetujuan admin.")
      } else {
        alert("Gagal mengirim komentar.")
      }
    } catch (error) {
      console.error("Error posting comment:", error)
      alert("Gagal mengirim komentar.")
    } finally {
      setIsSubmitting(prev => ({ ...prev, [storyId]: false }))
    }
  }, [commentForms])

  const updateCommentForm = useCallback((storyId: string, field: string, value: string) => {
    setCommentForms(prev => ({
      ...prev,
      [storyId]: { ...prev[storyId], [field]: value }
    }))
  }, [])

  return (
    <section className="bg-card py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-card-foreground mb-4">
            Cerita dari Komunitas
          </h2>
          <p className="text-muted-foreground">
            Baca cerita inspiratif dari teman-teman yang telah berbagi pengalaman mereka
          </p>
        </div>

        {stories.length > 0 ? (
          <>
            <div className="space-y-8">
              {displayedStories.map((story) => {
                const isExpanded = expandedStories.has(story.id)
                const shouldTruncate = story.content && story.content.length > CONTENT_TRUNCATE_LENGTH

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
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-user.jpg"
                          }}
                        />
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {story.author_name || "Anonim"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(story.created_at)}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <h4 className="text-xl font-bold text-card-foreground">
                        {story.title || "Tanpa Judul"}
                      </h4>

                      <div className="prose prose-gray max-w-none">
                        <p className="text-card-foreground leading-relaxed whitespace-pre-wrap">
                          {isExpanded || !shouldTruncate
                            ? (story.content || "")
                            : truncateContent(story.content)}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`hover:text-primary ${likedStories.has(story.id) ? 'text-red-500' : 'text-muted-foreground'}`}
                          onClick={() => handleLike(story.id)}
                          aria-label={likedStories.has(story.id) ? "Batalkan dukungan" : "Dukung cerita ini"}
                        >
                          <Heart className={`w-4 h-4 mr-2 ${likedStories.has(story.id) ? 'fill-current' : ''}`} />
                          {likedStories.has(story.id) ? 'Sudah Dukung' : 'Dukung'} ({story.likes})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => {
                            const form = commentForms[story.id] || { content: "", authorName: "" }
                            setCommentForms(prev => ({ ...prev, [story.id]: form }))
                          }}
                          aria-label="Tambahkan komentar"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Komentar ({story.comments.length})
                        </Button>
                      </div>

                      {/* Comments Display */}
                      {story.comments.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h5 className="font-semibold text-card-foreground">Komentar:</h5>
                          {story.comments.map((comment) => (
                            <div key={comment.id} className="bg-muted p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">
                                  {comment.authorName || "Anonim"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-card-foreground">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Comment Form */}
                      {commentForms[story.id] && (
                        <form onSubmit={(e) => handleCommentSubmit(story.id, e)} className="mt-4 space-y-3">
                          <div>
                            <input
                              type="text"
                              placeholder="Nama Anda (opsional, kosongkan untuk anonim)"
                              value={commentForms[story.id]?.authorName || ""}
                              onChange={(e) => updateCommentForm(story.id, "authorName", e.target.value)}
                              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                            />
                          </div>
                          <div>
                            <textarea
                              placeholder="Tulis komentar Anda..."
                              value={commentForms[story.id]?.content || ""}
                              onChange={(e) => updateCommentForm(story.id, "content", e.target.value)}
                              required
                              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground min-h-[80px]"
                            />
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCommentForms(prev => {
                                const newForms = { ...prev }
                                delete newForms[story.id]
                                return newForms
                              })}
                            >
                              Batal
                            </Button>
                            <Button
                              type="submit"
                              disabled={isSubmitting[story.id]}
                              className="bg-primary text-primary-foreground hover:bg-secondary"
                            >
                              {isSubmitting[story.id] ? "Mengirim..." : "Kirim Komentar"}
                              <Send className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {!showAll && stories.length > initialLimit && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => setShowAll(true)}
                  variant="outline"
                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Lihat cerita lainnya
                </Button>
              </div>
            )}
          </>
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
