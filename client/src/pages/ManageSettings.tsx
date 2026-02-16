import { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import {
  getSiteSettings,
  updateSiteSettings,
  SiteSettings,
} from "../services/firestore";

export default function ManageSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<SiteSettings>({
    presidentName: "",
    presidentImage: "",
    presidentTitle: "President",
    presidentBio: "",
    presidentFacebook: "",
    presidentEmail: "",
    vicePresidentName: "",
    vicePresidentImage: "",
    vicePresidentTitle: "Vice President",
    vicePresidentBio: "",
    vicePresidentFacebook: "",
    vicePresidentEmail: "",
    aboutUsTitle: "About Rotaract Club of Lamahi",
    aboutUsContent: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    setLoading(true);
    try {
      const data = await getSiteSettings();
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(formData);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={styles.container}>
          <p>Loading settings...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h1>Site Settings</h1>
        <p style={styles.subtitle}>
          Manage leadership team and about us content
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Leadership Section */}
          <div style={styles.section}>
            <h2>Leadership Team</h2>

            <div style={styles.row}>
              <div style={styles.column}>
                <h3>President</h3>
                <input
                  type="text"
                  placeholder="President Name"
                  value={formData.presidentName}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentName: e.target.value })
                  }
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="President Image URL"
                  value={formData.presidentImage}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentImage: e.target.value })
                  }
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Title (e.g., President)"
                  value={formData.presidentTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentTitle: e.target.value })
                  }
                  style={styles.input}
                />
                <textarea
                  placeholder="Short bio about the President"
                  value={formData.presidentBio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentBio: e.target.value })
                  }
                  style={styles.textarea}
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Facebook Profile URL"
                  value={formData.presidentFacebook || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentFacebook: e.target.value })
                  }
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.presidentEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, presidentEmail: e.target.value })
                  }
                  style={styles.input}
                />
                {formData.presidentImage && (
                  <img
                    src={formData.presidentImage}
                    alt="President Preview"
                    style={styles.preview}
                  />
                )}
              </div>

              <div style={styles.column}>
                <h3>Vice President</h3>
                <input
                  type="text"
                  placeholder="Vice President Name"
                  value={formData.vicePresidentName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vicePresidentName: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Vice President Image URL"
                  value={formData.vicePresidentImage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vicePresidentImage: e.target.value,
                    })
                  }
                  required
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Title (e.g., Vice President)"
                  value={formData.vicePresidentTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      vicePresidentTitle: e.target.value,
                    })
                  }
                  style={styles.input}
                />
                <textarea
                  placeholder="Short bio about the Vice President"
                  value={formData.vicePresidentBio || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vicePresidentBio: e.target.value })
                  }
                  style={styles.textarea}
                  rows={3}
                />
                <input
                  type="url"
                  placeholder="Facebook Profile URL"
                  value={formData.vicePresidentFacebook || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vicePresidentFacebook: e.target.value })
                  }
                  style={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={formData.vicePresidentEmail || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, vicePresidentEmail: e.target.value })
                  }
                  style={styles.input}
                />
                {formData.vicePresidentImage && (
                  <img
                    src={formData.vicePresidentImage}
                    alt="Vice President Preview"
                    style={styles.preview}
                  />
                )}
              </div>
            </div>
          </div>

          {/* About Us Section */}
          <div style={styles.section}>
            <h2>About Us</h2>
            <input
              type="text"
              placeholder="About Us Title"
              value={formData.aboutUsTitle}
              onChange={(e) =>
                setFormData({ ...formData, aboutUsTitle: e.target.value })
              }
              required
              style={styles.input}
            />
            <textarea
              placeholder="About Us Content (describe your club, mission, vision)"
              value={formData.aboutUsContent}
              onChange={(e) =>
                setFormData({ ...formData, aboutUsContent: e.target.value })
              }
              required
              style={styles.textarea}
              rows={8}
            />
          </div>

          <button type="submit" disabled={saving} style={styles.submitBtn}>
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
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
  subtitle: {
    color: "#666",
    marginBottom: 30,
  } as React.CSSProperties,
  form: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  } as React.CSSProperties,
  section: {
    marginBottom: 40,
    paddingBottom: 40,
    borderBottom: "1px solid #eee",
  } as React.CSSProperties,
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 30,
  } as React.CSSProperties,
  column: {
    display: "flex",
    flexDirection: "column",
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
  preview: {
    width: 150,
    height: 150,
    objectFit: "cover",
    borderRadius: 8,
    marginTop: 10,
    border: "2px solid #ddd",
  } as React.CSSProperties,
  submitBtn: {
    padding: "14px 32px",
    backgroundColor: "#B71C1C",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    fontSize: 16,
    fontWeight: 600,
  } as React.CSSProperties,
};
