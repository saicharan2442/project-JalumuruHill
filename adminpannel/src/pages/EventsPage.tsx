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
import { Event } from "@/types/models";
import { Edit, Trash } from "lucide-react";
import { toast } from "sonner";

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [form, setForm] = useState({
    eventname: "",
    event_date: "",
    event_temple: "",
    discription: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data);
    } catch {
      toast.error("Failed to load events.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.eventname || !form.event_date || !form.event_temple || !form.discription) {
      toast.error("All fields are required.");
      return;
    }

    try {
      if (dialogMode === "add") {
        await fetch("http://localhost:5000/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Event added.");
      } else if (dialogMode === "edit" && editingEvent) {
        await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        toast.success("Event updated.");
      }
      resetForm();
      loadEvents();
    } catch {
      toast.error("Save failed.");
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;
    try {
      await fetch(`http://localhost:5000/api/events/${editingEvent.id}`, {
        method: "DELETE",
      });
      toast.success("Event deleted.");
      setEditingEvent(null);
      loadEvents();
    } catch {
      toast.error("Failed to delete.");
    } finally {
      setDeleteConfirmOpen(false);
    }
  };

  const openEdit = (event: Event) => {
    setEditingEvent(event);
    setForm({
      eventname: event.eventname,
      event_date: event.event_date,
      event_temple: event.event_temple,
      discription: event.discription,
    });
    setDialogMode("edit");
  };

  const columns = [
    { accessorKey: "eventname", header: "Event Name" },
    { accessorKey: "event_date", header: "Event Date" },
    { accessorKey: "event_temple", header: "Temple" },
    { accessorKey: "discription", header: "Description" },
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
              setEditingEvent(row.original);
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
    setForm({ eventname: "", event_date: "", event_temple: "", discription: "" });
    setDialogMode(null);
    setEditingEvent(null);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Events"
        description="Manage temple events"
        action={
          <Dialog open={dialogMode === "add"} onOpenChange={(v) => v ? setDialogMode("add") : resetForm()}>
            <DialogTrigger asChild>
              <Button>Add Event</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Event</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Event Name</Label>
                    <Input value={form.eventname} onChange={(e) => setForm({ ...form, eventname: e.target.value })} />
                  </div>
                  <div>
                    <Label>Event Date</Label>
                    <Input value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                  </div>
                  <div>
                    <Label>Temple</Label>
                    <Input value={form.event_temple} onChange={(e) => setForm({ ...form, event_temple: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input value={form.discription} onChange={(e) => setForm({ ...form, discription: e.target.value })} />
                  </div>
                </div>
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
        <DataTable columns={columns} data={events} searchPlaceholder="Search..." />
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogMode === "edit"} onOpenChange={(v) => v ? setDialogMode("edit") : resetForm()}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Event</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Event Name</Label>
                <Input value={form.eventname} onChange={(e) => setForm({ ...form, eventname: e.target.value })} />
              </div>
              <div>
                <Label>Event Date</Label>
                <Input value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
              </div>
              <div>
                <Label>Temple</Label>
                <Input value={form.event_temple} onChange={(e) => setForm({ ...form, event_temple: e.target.value })} />
              </div>
              <div>
                <Label>Description</Label>
                <Input value={form.discription} onChange={(e) => setForm({ ...form, discription: e.target.value })} />
              </div>
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
          <p>Are you sure you want to delete <strong>{editingEvent?.eventname}</strong>?</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default EventsPage;
