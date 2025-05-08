// Place this inside your pages directory as ContactsPage.tsx
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
import { Contact } from "@/types/models";
import { Edit, Trash, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    role: "",
    name: "",
    email: "",
    mobile: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch {
      toast.error("Failed to load contacts.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.role || !form.name || !form.email || !form.mobile) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (dialogMode === "add") {
        await fetch("http://localhost:5000/api/contacts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Contact added.");
      } else if (dialogMode === "edit" && editingContact) {
        await fetch(`http://localhost:5000/api/contacts/${editingContact.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Contact updated.");
      }
      resetForm();
      loadContacts();
    } catch {
      toast.error("Save failed.");
    }
  };

  const handleDelete = async () => {
    if (!editingContact) return;
    try {
      await fetch(`http://localhost:5000/api/contacts/${editingContact.id}`, {
        method: "DELETE",
      });
      toast.success("Contact deleted.");
      setEditingContact(null);
      loadContacts();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const openEdit = (contact: Contact) => {
    setEditingContact(contact);
    setForm({
      role: contact.role,
      name: contact.name,
      email: contact.email,
      mobile: contact.mobile,
      imageUrl: contact.imageUrl,
    });
    setDialogMode("edit");
  };

  const columns = [
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <Avatar className="h-10 w-10">
          <AvatarImage src={row.original.imageUrl} />
          <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "role", header: "Role" },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <Mail className="h-4 w-4 text-muted-foreground" />
          {row.original.email}
        </div>
      ),
    },
    {
      accessorKey: "mobile",
      header: "Mobile",
      cell: ({ row }) => (
        <div className="flex gap-1 items-center">
          <Phone className="h-4 w-4 text-muted-foreground" />
          {row.original.mobile}
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
              setEditingContact(row.original);
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
    setForm({ role: "", name: "", email: "", mobile: "", imageUrl: "" });
    setDialogMode(null);
    setEditingContact(null);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Contacts"
        description="Manage temple contacts"
        action={
          <Dialog open={dialogMode === "add"} onOpenChange={(v) => v ? setDialogMode("add") : resetForm()}>
            <DialogTrigger asChild>
              <Button>Add Contact</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Contact</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Mobile</Label>
                    <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
                  </div>
                </div>
                <AvatarUpload initialImageUrl={form.imageUrl} onImageChange={(url) => setForm({ ...form, imageUrl: url })} />
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
        <DataTable columns={columns} data={contacts} searchPlaceholder="Search..." />
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={(v) => v ? setDialogMode("edit") : resetForm()}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
              </div>
            </div>
            <AvatarUpload initialImageUrl={form.imageUrl} onImageChange={(url) => setForm({ ...form, imageUrl: url })} />
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
          <p>Are you sure you want to delete <strong>{editingContact?.name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ContactsPage;
