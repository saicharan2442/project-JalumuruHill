// Place this inside your pages directory as TemplesPage.tsx
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
import { Edit, Trash, Phone } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarUpload } from "@/components/ui/avatar-upload";

const TemplesPage = () => {
  const [temples, setTemples] = useState([]);
  const [editingTemple, setEditingTemple] = useState(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    tname: "",
    donar: "",
    village: "",
    district: "",
    ph_no: "",
    image_url: "",
  });

  useEffect(() => {
    loadTemples();
  }, []);

  const loadTemples = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/temples");
      const data = await res.json();
      setTemples(data);
    } catch {
      toast.error("Failed to load temples.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tname || !form.donar || !form.village || !form.district || !form.ph_no) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (dialogMode === "add") {
        await fetch("http://localhost:5000/api/temples", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Temple added.");
      } else if (dialogMode === "edit" && editingTemple) {
        await fetch(`http://localhost:5000/api/temples/${editingTemple.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Temple updated.");
      }
      resetForm();
      loadTemples();
    } catch {
      toast.error("Save failed.");
    }
  };

  const handleDelete = async () => {
    if (!editingTemple) return;
    try {
      await fetch(`http://localhost:5000/api/temples/${editingTemple.id}`, {
        method: "DELETE",
      });
      toast.success("Temple deleted.");
      setEditingTemple(null);
      loadTemples();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const openEdit = (temple) => {
    setEditingTemple(temple);
    setForm({
      tname: temple.tname,
      donar: temple.donar,
      village: temple.village,
      district: temple.district,
      ph_no: temple.ph_no,
      image_url: temple.image_url,
    });
    setDialogMode("edit");
  };

  const resetForm = () => {
    setForm({ tname: "", donar: "", village: "", district: "", ph_no: "", image_url: "" });
    setDialogMode(null);
    setEditingTemple(null);
  };

  const columns = [
    {
      accessorKey: "image_url",
      header: "Image",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.image_url} />
          <AvatarFallback>{row.original.tname?.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
    },
    { accessorKey: "tname", header: "Temple Name" },
    { accessorKey: "donar", header: "Donor" },
    { accessorKey: "village", header: "Village" },
    { accessorKey: "district", header: "District" },
    {
      accessorKey: "ph_no",
      header: "Phone",
      cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {row.original.ph_no}
        </div>
      ),
    },
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
              setEditingTemple(row.original);
              setDeleteConfirmOpen(true);
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="Temples"
        description="Manage temples information"
        action={
          <Dialog open={dialogMode === "add"} onOpenChange={(v) => v ? setDialogMode("add") : resetForm()}>
            <DialogTrigger asChild>
              <Button>Add Temple</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Temple</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Temple Name</Label><Input value={form.tname} onChange={(e) => setForm({ ...form, tname: e.target.value })} /></div>
                  <div><Label>Donor</Label><Input value={form.donar} onChange={(e) => setForm({ ...form, donar: e.target.value })} /></div>
                  <div><Label>Village</Label><Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} /></div>
                  <div><Label>District</Label><Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
                  <div><Label>Phone Number</Label><Input value={form.ph_no} onChange={(e) => setForm({ ...form, ph_no: e.target.value })} /></div>
                </div>
                <AvatarUpload initialImageUrl={form.image_url} onImageChange={(url) => setForm({ ...form, image_url: url })} />
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="space-y-6">
        <DataTable columns={columns} data={temples} searchPlaceholder="Search..." />
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={(v) => v ? setDialogMode("edit") : resetForm()}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Temple</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Temple Name</Label><Input value={form.tname} onChange={(e) => setForm({ ...form, tname: e.target.value })} /></div>
              <div><Label>Donor</Label><Input value={form.donar} onChange={(e) => setForm({ ...form, donar: e.target.value })} /></div>
              <div><Label>Village</Label><Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} /></div>
              <div><Label>District</Label><Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} /></div>
              <div><Label>Phone Number</Label><Input value={form.ph_no} onChange={(e) => setForm({ ...form, ph_no: e.target.value })} /></div>
            </div>
            <AvatarUpload initialImageUrl={form.image_url} onImageChange={(url) => setForm({ ...form, image_url: url })} />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{editingTemple?.tname}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default TemplesPage;
