import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Edit, Trash, Upload } from "lucide-react";
import { toast } from "sonner";

const EbooksPage = () => {
  const [ebooks, setEbooks] = useState([]);
  const [editingEbook, setEditingEbook] = useState(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    format: "",
    size: "",
    download_link: "",
    image_url: "",
  });

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/ebooks");
      const data = await res.json();
      setEbooks(data);
    } catch {
      toast.error("Failed to load ebooks.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, format, download_link } = form;
    if (!name || !format || !download_link) {
      toast.error("Name, Format, and Download Link are required.");
      return;
    }

    try {
      const url = dialogMode === "add"
        ? "http://localhost:5000/api/ebooks"
        : `http://localhost:5000/api/ebooks/${editingEbook.id}`;
      const method = dialogMode === "add" ? "POST" : "PUT";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      toast.success(dialogMode === "add" ? "Ebook added." : "Ebook updated.");
      resetForm();
      loadEbooks();
    } catch {
      toast.error("Save failed.");
    }
  };

  const handleDelete = async () => {
    if (!editingEbook) return;
    try {
      await fetch(`http://localhost:5000/api/ebooks/${editingEbook.id}`, {
        method: "DELETE",
      });
      toast.success("Ebook deleted.");
      setEditingEbook(null);
      loadEbooks();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const openEdit = (ebook) => {
    setEditingEbook(ebook);
    setForm(ebook);
    setDialogMode("edit");
  };

  const handleCsvUpload = async () => {
    if (!csvFile) {
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", csvFile);

    try {
      const res = await fetch("http://localhost:5000/api/ebooks/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("CSV uploaded successfully.");
      setUploadDialogOpen(false);
      setCsvFile(null);
      loadEbooks();
    } catch {
      toast.error("Failed to upload CSV.");
    }
  };

  const columns = [
    {
      id: "image",
      header: "Cover",
      cell: ({ row }) => (
        <img
          src={row.original.image_url}
          alt={row.original.name}
          className="w-16 h-20 object-cover rounded"
        />
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "format", header: "Format" },
    { accessorKey: "size", header: "Size" },
    { accessorKey: "download_link", header: "Download Link" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive"
            onClick={() => {
              setEditingEbook(row.original);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const resetForm = () => {
    setForm({
      name: "",
      format: "",
      size: "",
      download_link: "",
      image_url: "",
    });
    setDialogMode(null);
    setEditingEbook(null);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Ebooks"
        description="Manage ebook collection"
        action={
          <div className="flex gap-2">
            <Dialog open={dialogMode === "add"} onOpenChange={(v) => (v ? setDialogMode("add") : resetForm())}>
              <DialogTrigger asChild>
                <Button>Add Ebook</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Ebook</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {["name", "format", "size", "download_link", "image_url"].map((field) => (
                      <div key={field}>
                        <Label>{field.replace("_", " ")}</Label>
                        <Input value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                    <Button type="submit">Save</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" /> Upload CSV
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Upload Ebooks CSV</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCsvUpload}>Upload</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <div className="space-y-6">
        <DataTable columns={columns} data={ebooks} searchPlaceholder="Search..." />
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={(v) => (v ? setDialogMode("edit") : resetForm())}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Ebook</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {["name", "format", "size", "download_link", "image_url"].map((field) => (
                <div key={field}>
                  <Label>{field.replace("_", " ")}</Label>
                  <Input value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{editingEbook?.name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EbooksPage;
