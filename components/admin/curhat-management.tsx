"use client"

import { useState } from "react"
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

interface CurhatManagementProps {
  initialStories: CurhatStory[]
}

export default function CurhatManagement({ initialStories }: CurhatManagementProps) {
  const [stories, setStories] = useState<CurhatStory[]>(initialStories)
  const [loading, setLoading] = useState<string | null>(null)
  const [selectedStory, setSelectedStory] = useState<CurhatStory | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  const handleViewStory = (story: CurhatStory) => {
    setSelectedStory(story)
    setIsModalOpen(true)
  }

  const pendingStories = stories.filter((story) => !story.isApproved)
  const approvedStories = stories.filter((story) => story.isApproved)

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manajemen Curhat</h1>
        <p className="text-muted-foreground mt-2">Tinjau dan kelola pengajuan cerita dari komunitas</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Menunggu Tinjauan ({pendingStories.length})</TabsTrigger>
          <TabsTrigger value="approved">Disetujui ({approvedStories.length})</TabsTrigger>
          <TabsTrigger value="all">Semua Cerita ({stories.length})</TabsTrigger>
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

        <TabsContent value="all">
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
    </div>
  )
}
