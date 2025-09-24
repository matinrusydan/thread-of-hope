"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Check, X, Eye, Trash2, Calendar, User } from "lucide-react"

interface CurhatStory {
  id: string
  title: string
  content: string
  authorName: string
  isApproved: boolean
  createdAt: string
  updatedAt?: string
}

interface Comment {
  id: string
  content: string
  authorName: string | null
  isApproved: boolean
  createdAt: string
  curhat: {
    id: string
    title: string
    authorName: string
  }
}

interface CurhatManagementProps {
  initialStories: CurhatStory[]
}

export default function CurhatManagement({ initialStories }: CurhatManagementProps) {
  const [stories, setStories] = useState<CurhatStory[]>(initialStories)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<CurhatStory | null>(null)
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comments")
        if (response.ok) {
          const data = await response.json()
          setComments(data.data)
        }
      } catch (error) {
        console.error("Error fetching comments:", error)
      }
    }
    fetchComments()
  }, [])

  const handleApprove = async (storyId: string) => {
    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: true }),
      })

      if (response.ok) {
        setStories(stories.map((story) => (story.id === storyId ? { ...story, isApproved: true, updatedAt: new Date().toISOString() } : story)))
      }
    } catch (error) {
      console.error("Error approving story:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (storyId: string) => {
    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_approved: false }),
      })

      if (response.ok) {
        setStories(stories.map((story) => (story.id === storyId ? { ...story, isApproved: false, updatedAt: new Date().toISOString() } : story)))
      }
    } catch (error) {
      console.error("Error rejecting story:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (storyId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus cerita ini?")) return

    setLoading(storyId)
    try {
      const response = await fetch(`/api/curhat/${storyId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setStories(stories.filter((story) => story.id !== storyId))
      }
    } catch (error) {
      console.error("Error deleting story:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleApproveComment = async (commentId: string) => {
    setLoading(commentId)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      })

      if (response.ok) {
        setComments(comments.map((comment) =>
          comment.id === commentId ? { ...comment, isApproved: true } : comment
        ))
      }
    } catch (error) {
      console.error("Error approving comment:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleRejectComment = async (commentId: string) => {
    setLoading(commentId)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      })

      if (response.ok) {
        setComments(comments.map((comment) =>
          comment.id === commentId ? { ...comment, isApproved: false } : comment
        ))
      }
    } catch (error) {
      console.error("Error rejecting comment:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus komentar ini?")) return

    setLoading(commentId)
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId))
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment)
    setIsCommentModalOpen(true)
  }

  const handleViewStory = (story: CurhatStory) => {
    setSelectedStory(story)
    setIsModalOpen(true)
  }

  const pendingStories = stories.filter((story) => !story.isApproved)
  const approvedStories = stories.filter((story) => story.isApproved)
  const pendingComments = comments.filter((comment) => !comment.isApproved)
  const approvedComments = comments.filter((comment) => comment.isApproved)

  const StoryCard = ({ story }: { story: CurhatStory }) => (
    <Card key={story.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{story.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              By {story.authorName} •{" "}
              {formatDistanceToNow(new Date(story.createdAt), { addSuffix: true, locale: id })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={story.isApproved ? "default" : "secondary"}>
              {story.isApproved ? "Disetujui" : "Menunggu"}
            </Badge>
            {story.isApproved && story.updatedAt && (
              <span className="text-xs text-muted-foreground">
                ✓ {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true, locale: id })}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground mb-4 line-clamp-3">{story.content}</p>

        <div className="flex items-center space-x-2">
          {!story.isApproved && (
            <Button
              size="sm"
              onClick={() => handleApprove(story.id)}
              disabled={loading === story.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Setujui
            </Button>
          )}

          {story.isApproved && (
            <Button size="sm" variant="outline" onClick={() => handleReject(story.id)} disabled={loading === story.id}>
              <X className="w-4 h-4 mr-1" />
              Tolak
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={() => handleViewStory(story)}>
            <Eye className="w-4 h-4 mr-1" />
            Lihat
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(story.id)}
            disabled={loading === story.id}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const CommentCard = ({ comment }: { comment: Comment }) => (
    <Card key={comment.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Komentar pada "{comment.curhat.title}"</CardTitle>
            <p className="text-sm text-muted-foreground">
              By {comment.authorName || "Anonim"} •{" "}
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: id })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={comment.isApproved ? "default" : "secondary"}>
              {comment.isApproved ? "Disetujui" : "Menunggu"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-card-foreground mb-4">{comment.content}</p>

        <div className="flex items-center space-x-2">
          {!comment.isApproved && (
            <Button
              size="sm"
              onClick={() => handleApproveComment(comment.id)}
              disabled={loading === comment.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Setujui
            </Button>
          )}

          {comment.isApproved && (
            <Button size="sm" variant="outline" onClick={() => handleRejectComment(comment.id)} disabled={loading === comment.id}>
              <X className="w-4 h-4 mr-1" />
              Tolak
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={() => handleViewComment(comment)}>
            <Eye className="w-4 h-4 mr-1" />
            Lihat
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteComment(comment.id)}
            disabled={loading === comment.id}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Hapus
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manajemen Curhat</h1>
        <p className="text-muted-foreground mt-2">Tinjau dan kelola pengajuan cerita dari komunitas</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Cerita Menunggu ({pendingStories.length})</TabsTrigger>
          <TabsTrigger value="approved">Cerita Disetujui ({approvedStories.length})</TabsTrigger>
          <TabsTrigger value="all-stories">Semua Cerita ({stories.length})</TabsTrigger>
          <TabsTrigger value="pending-comments">Komentar Menunggu ({pendingComments.length})</TabsTrigger>
          <TabsTrigger value="approved-comments">Komentar Disetujui ({approvedComments.length})</TabsTrigger>
          <TabsTrigger value="all-comments">Semua Komentar ({comments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingStories.length > 0 ? (
            pendingStories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada cerita yang menunggu tinjauan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedStories.length > 0 ? (
            approvedStories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada cerita yang disetujui</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all-stories">
          {stories.length > 0 ? (
            stories.map((story) => <StoryCard key={story.id} story={story} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada cerita yang diajukan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="pending-comments">
          {pendingComments.length > 0 ? (
            pendingComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada komentar yang menunggu tinjauan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved-comments">
          {approvedComments.length > 0 ? (
            approvedComments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada komentar yang disetujui</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all-comments">
          {comments.length > 0 ? (
            comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada komentar yang diajukan</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Story Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Detail Cerita Curhat
            </DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="space-y-6">
              {/* Story Header */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {selectedStory.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Oleh: {selectedStory.authorName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {format(new Date(selectedStory.createdAt), "dd MMMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={selectedStory.isApproved ? "default" : "secondary"}>
                    {selectedStory.isApproved ? "Disetujui" : "Menunggu"}
                  </Badge>
                  {selectedStory.isApproved && selectedStory.updatedAt && (
                    <span className="text-xs text-muted-foreground">
                      Disetujui pada {format(new Date(selectedStory.updatedAt), "dd/MM/yyyy HH:mm", { locale: id })}
                    </span>
                  )}
                </div>
              </div>

              {/* Story Content */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Isi Cerita:</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedStory.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                {!selectedStory.isApproved && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleApprove(selectedStory.id)
                      setIsModalOpen(false)
                    }}
                    disabled={loading === selectedStory.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Setujui Cerita
                  </Button>
                )}

                {selectedStory.isApproved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedStory.id)
                      setIsModalOpen(false)
                    }}
                    disabled={loading === selectedStory.id}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Tolak Cerita
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    handleDelete(selectedStory.id)
                    setIsModalOpen(false)
                  }}
                  disabled={loading === selectedStory.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus Cerita
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Comment Detail Modal */}
      <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <User className="w-5 h-5 mr-2" />
              Detail Komentar
            </DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-6">
              {/* Comment Header */}
              <div className="border-b pb-4">
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Komentar pada "{selectedComment.curhat.title}"
                </h3>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>Oleh: {selectedComment.authorName || "Anonim"}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>
                      {format(new Date(selectedComment.createdAt), "dd MMMM yyyy, HH:mm", { locale: id })}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant={selectedComment.isApproved ? "default" : "secondary"}>
                    {selectedComment.isApproved ? "Disetujui" : "Menunggu"}
                  </Badge>
                </div>
              </div>

              {/* Comment Content */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Isi Komentar:</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {selectedComment.content}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                {!selectedComment.isApproved && (
                  <Button
                    size="sm"
                    onClick={() => {
                      handleApproveComment(selectedComment.id)
                      setIsCommentModalOpen(false)
                    }}
                    disabled={loading === selectedComment.id}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Setujui Komentar
                  </Button>
                )}

                {selectedComment.isApproved && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      handleRejectComment(selectedComment.id)
                      setIsCommentModalOpen(false)
                    }}
                    disabled={loading === selectedComment.id}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Tolak Komentar
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    handleDeleteComment(selectedComment.id)
                    setIsCommentModalOpen(false)
                  }}
                  disabled={loading === selectedComment.id}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Hapus Komentar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
