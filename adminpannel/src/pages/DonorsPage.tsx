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
import { Donor } from "@/types/models";
import { Edit, Trash, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DonorsPage = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [exportFormat, setExportFormat] = useState<"pdf" | "excel">("pdf");

  const [form, setForm] = useState({
    Name: "",
    village: "",
    district: "",
    email: "",
    phone_number: "",
    donated: "",
    donated_at: "",
  });

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/donors");
      const data = await res.json();
      setDonors(data);
    } catch {
      toast.error("Failed to load donors.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { Name, village, district, email, phone_number, donated, donated_at } = form;
    if (!Name || !village || !district || !email || !phone_number || !donated || !donated_at) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (dialogMode === "add") {
        await fetch("http://localhost:5000/api/donors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Donor added.");
      } else if (dialogMode === "edit" && editingDonor) {
        await fetch(`http://localhost:5000/api/donors/${editingDonor.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Donor updated.");
      }
      resetForm();
      loadDonors();
    } catch {
      toast.error("Save failed.");
    }
  };

  const handleDelete = async () => {
    if (!editingDonor) return;
    try {
      await fetch(`http://localhost:5000/api/donors/${editingDonor.id}`, {
        method: "DELETE",
      });
      toast.success("Donor deleted.");
      setEditingDonor(null);
      loadDonors();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const openEdit = (donor: Donor) => {
    setEditingDonor(donor);
    setForm(donor);
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
      const res = await fetch("http://localhost:5000/api/donors/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error();

      toast.success("CSV uploaded successfully.");
      setUploadDialogOpen(false);
      setCsvFile(null);
      loadDonors();
    } catch {
      toast.error("Failed to upload CSV.");
    }
  };

  const handleDownload = () => {
    if (exportFormat === "excel") {
      const worksheet = XLSX.utils.json_to_sheet(donors);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Donors");
      XLSX.writeFile(workbook, "donors.xlsx");
    } else {
      const doc = new jsPDF({ orientation: "landscape" });;
      autoTable(doc, {
        head: [["Name", "Village", "District", "Email", "Phone", "Donated", "Donated At"]],
        body: donors.map((d) => [
          d.Name,
          d.village,
          d.district,
          d.email,
          d.phone_number,
          d.donated,
          d.donated_at,
        ]),
      });
      doc.save("donors.pdf");
    }
  };

  const columns = [
    { accessorKey: "Name", header: "Name" },
    { accessorKey: "village", header: "Village" },
    { accessorKey: "district", header: "District" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone_number", header: "Phone Number" },
    { accessorKey: "donated", header: "Donated" },
    { accessorKey: "donated_at", header: "Donated At" },
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
              setEditingDonor(row.original);
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
      Name: "",
      village: "",
      district: "",
      email: "",
      phone_number: "",
      donated: "",
      donated_at: "",
    });
    setDialogMode(null);
    setEditingDonor(null);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Donors"
        description="Manage donor information"
        action={
          <div className="flex gap-2 flex-wrap">
            <Dialog open={dialogMode === "add"} onOpenChange={(v) => (v ? setDialogMode("add") : resetForm())}>
              <DialogTrigger asChild>
                <Button>Add Donor</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Donor</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {["Name", "village", "district", "email", "phone_number", "donated", "donated_at"].map((field) => (
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
                <DialogHeader><DialogTitle>Upload Donors CSV</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <Input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCsvUpload}>Upload</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

          <div className="flex items-center gap-2">
              <select
                className="border rounded px-2 py-1 text-sm text-black font-bold"
                  value={exportFormat}
                   onChange={(e) => setExportFormat(e.target.value as "pdf" | "excel")}
              >
              <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  </select>
                  <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" /> Download
                   </Button>
            </div>

          </div>
        }
      />
      <div className="space-y-6">
        <DataTable columns={columns} data={donors} searchPlaceholder="Search..." />
      </div>

      <Dialog open={dialogMode === "edit"} onOpenChange={(v) => (v ? setDialogMode("edit") : resetForm())}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Donor</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {["Name", "village", "district", "email", "phone_number", "donated", "donated_at"].map((field) => (
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

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirm Deletion</DialogTitle></DialogHeader>
          <p>Are you sure you want to delete <strong>{editingDonor?.Name}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default DonorsPage;
