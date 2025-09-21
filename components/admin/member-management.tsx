"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X, Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { apiUrl } from "@/lib/api"

interface CommunityMember {
  id: string
  fullName: string
  email: string
  phone: string | null
  age: number
  city: string
  occupation: string | null
  motivation: string
  howDidYouHear: string
  isApproved: boolean
  joinedAt: string
}

interface MemberManagementProps {
  initialMembers: CommunityMember[]
}

export default function MemberManagement({ initialMembers }: MemberManagementProps) {
  const [members, setMembers] = useState<CommunityMember[]>(initialMembers)
  const [loading, setLoading] = useState<string | null>(null)

  const handleApprove = async (memberId: string) => {
    setLoading(memberId)
    try {
      const response = await fetch(apiUrl(`/api/community/members/${memberId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      })

      if (response.ok) {
        setMembers(members.map((member) => (member.id === memberId ? { ...member, isApproved: true } : member)))
      }
    } catch (error) {
      console.error("Error approving member:", error)
    } finally {
      setLoading(null)
    }
  }

  const handleReject = async (memberId: string) => {
    setLoading(memberId)
    try {
      const response = await fetch(apiUrl(`/api/community/members/${memberId}`), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: false }),
      })

      if (response.ok) {
        setMembers(members.map((member) => (member.id === memberId ? { ...member, isApproved: false } : member)))
      }
    } catch (error) {
      console.error("Error rejecting member:", error)
    } finally {
      setLoading(null)
    }
  }

  const pendingMembers = members.filter((member) => !member.isApproved)
  const approvedMembers = members.filter((member) => member.isApproved)

  const MemberCard = ({ member }: { member: CommunityMember }) => (
    <Card key={member.id} className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{member.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Bergabung {formatDistanceToNow(new Date(member.joinedAt), { addSuffix: true, locale: id })}
            </p>
          </div>
          <Badge variant={member.isApproved ? "default" : "secondary"}>
            {member.isApproved ? "Disetujui" : "Menunggu"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
          )}
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>
              {member.city}, {member.age} tahun
            </span>
          </div>
          {member.occupation && (
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{member.occupation}</span>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-medium text-card-foreground mb-2">Motivasi:</h4>
          <p className="text-muted-foreground text-sm">{member.motivation}</p>
        </div>

        <div>
          <span className="text-sm text-muted-foreground">
            Mengetahui dari: <span className="font-medium">{member.howDidYouHear}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          {!member.isApproved && (
            <Button
              size="sm"
              onClick={() => handleApprove(member.id)}
              disabled={loading === member.id}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-1" />
              Setujui
            </Button>
          )}

          {member.isApproved && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleReject(member.id)}
              disabled={loading === member.id}
            >
              <X className="w-4 h-4 mr-1" />
              Cabut
            </Button>
          )}

          <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${member.email}`, "_blank")}>
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manajemen Anggota</h1>
        <p className="text-muted-foreground mt-2">Tinjau dan kelola aplikasi anggota komunitas</p>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Menunggu Tinjauan ({pendingMembers.length})</TabsTrigger>
          <TabsTrigger value="approved">Disetujui ({approvedMembers.length})</TabsTrigger>
          <TabsTrigger value="all">Semua Anggota ({members.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingMembers.length > 0 ? (
            pendingMembers.map((member) => <MemberCard key={member.id} member={member} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Tidak ada aplikasi anggota yang menunggu</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedMembers.length > 0 ? (
            approvedMembers.map((member) => <MemberCard key={member.id} member={member} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada anggota yang disetujui</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all">
          {members.length > 0 ? (
            members.map((member) => <MemberCard key={member.id} member={member} />)
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Belum ada aplikasi anggota</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
