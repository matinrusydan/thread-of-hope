"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { Toast } from "@/components/ui/toast";
import Link from "next/link";

const categories = [
  "Kesehatan Mental",
  "Pengembangan Diri",
  "Hubungan Sosial",
  "Keluarga",
  "Karir",
  "Pendidikan",
  "Lainnya"
];

function EbookCreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    category: "",
    coverImagePath: "",
    externalUrl: ""
  });
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCoverImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Limit 2MB
    if (file.size > 2 * 1024 * 1024) {
      setShowToast(true);
      return;
    }
    setUploadingCover(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);
      const response = await fetch("/api/upload/image", {
        method: "POST",
        body: formDataUpload,
      });
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, coverImagePath: data.fileUrl }));
      } else {
        alert("Upload gambar gagal");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload gambar gagal");
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement submit logic (API call to create ebook)
    setLoading(false);
    router.push("/admin/ebooks");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Toast message="Ukuran gambar terlalu besar (maksimal 2MB)" show={showToast} onClose={() => setShowToast(false)} />
      <div className="mb-8">
        <Link href="/admin/ebooks">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Manajemen E-Book
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Buat E-Book Baru</h1>
        <p className="text-muted-foreground mt-2">Tambahkan e-book baru ke perpustakaan</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Informasi E-Book</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => handleInputChange("title", e.target.value)}
                  placeholder="Masukkan judul e-book"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">Penulis *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={e => handleInputChange("author", e.target.value)}
                  placeholder="Masukkan nama penulis"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={value => handleInputChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Masukkan deskripsi e-book"
                rows={4}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Gambar Sampul</Label>
                <Input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  disabled={uploadingCover}
                />
                {uploadingCover && <p className="text-sm text-muted-foreground">Mengupload gambar...</p>}
                {formData.coverImagePath && <p className="text-sm text-green-600">✓ Gambar berhasil diupload</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="externalUrl">URL E-Book *</Label>
                <Input
                  id="externalUrl"
                  type="url"
                  value={formData.externalUrl}
                  onChange={e => handleInputChange("externalUrl", e.target.value)}
                  placeholder="https://example.com/ebook-link"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Masukkan URL lengkap ke e-book (contoh: Google Drive, Dropbox, dll.)
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4 pt-6">
              <Link href="/admin/ebooks">
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  "Menyimpan..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan E-Book
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default EbookCreateForm;