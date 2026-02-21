import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  Event,
} from "../services/firestore";

export default function ManageEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    image: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      alert("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({ title: "", date: "", image: "", location: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await updateEvent(editingId, formData);
      } else {
        await addEvent(formData);
      }
      await loadEvents();
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save event");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      await loadEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event");
    }
  }

  function handleEdit(event: Event) {
    setFormData({
      title: event.title,
      date: event.date,
      image: event.image || "",
      location: event.location,
      description: event.description,
    });
    setEditingId(event.id!);
    setShowForm(true);
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1>Manage Events</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addBtn}
          >
            {showForm ? "Cancel" : "+ Add Event"}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={styles.form}>
            <h2>{editingId ? "Edit Event" : "Add New Event"}</h2>
            
            <input
              type="text"
              placeholder="Event Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="date"
              placeholder="Event Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="url"
              placeholder="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              required
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              style={styles.input}
            />

            <textarea
              placeholder="Event Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              style={styles.textarea}
              rows={4}
            />

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? "Update" : "Create"} Event
              </button>
              <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div style={styles.grid}>
            {events.map((event) => (
              <div key={event.id} style={styles.card}>
                {event.image && (
                  <img src={event.image} alt={event.title} style={styles.cardImage} />
                )}
                <div style={styles.cardContent}>
                  <h3>{event.title}</h3>
                  <p style={styles.meta}>📅 {event.date} • 📍 {event.location}</p>
                  <p>{event.description}</p>
                  <div style={styles.cardActions}>
                    <button onClick={() => handleEdit(event)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(event.id!)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && events.length === 0 && !showForm && (
          <p style={styles.emptyState}>No events yet. Click "Add Event" to create one.</p>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: 20,
  } as React.CSSProperties,
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  } as React.CSSProperties,
  addBtn: {
    padding: "12px 24px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  } as React.CSSProperties,
  form: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    marginBottom: 30,
  } as React.CSSProperties,
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
  } as React.CSSProperties,
  textarea: {
    width: "100%",
    padding: 12,
    marginBottom: 16,
    border: "1px solid #ddd",
    borderRadius: 4,
    fontSize: 14,
    fontFamily: "inherit",
  } as React.CSSProperties,
  formActions: {
    display: "flex",
    gap: 12,
  } as React.CSSProperties,
  submitBtn: {
    padding: "12px 24px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
  } as React.CSSProperties,
  cancelBtn: {
    padding: "12px 24px",
    backgroundColor: "#666",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  } as React.CSSProperties,
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  cardImage: {
    width: "100%",
    height: 180,
    objectFit: "cover",
  } as React.CSSProperties,
  cardContent: {
    padding: 16,
  } as React.CSSProperties,
  meta: {
    color: "#666",
    fontSize: 14,
    marginBottom: 8,
  } as React.CSSProperties,
  cardActions: {
    display: "flex",
    gap: 8,
    marginTop: 16,
  } as React.CSSProperties,
  editBtn: {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  deleteBtn: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 14,
  } as React.CSSProperties,
  emptyState: {
    textAlign: "center",
    color: "#999",
    padding: 40,
  } as React.CSSProperties,
};
