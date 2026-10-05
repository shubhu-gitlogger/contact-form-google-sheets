import { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess("");
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      console.log("API status:", response.status);
      console.log("API response:", text);

      let data;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(`Server returned invalid JSON: ${text}`);
        }
      } else {
        throw new Error(
          `Server returned an empty response. HTTP status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit enquiry.");
      }

      setSuccess(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
      });
    } catch (err) {
      console.error("Contact form error:", err);
      setError(err.message || "Unable to submit enquiry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <form className="contact-form" onSubmit={handleSubmit}>
        <h1>Contact Us</h1>

        <div className="form-group">
          <label>Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="form-group">
          <label>Subject</label>

          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          >
            <option value="">Select subject</option>
            <option value="General Enquiry">General Enquiry</option>
            <option value="Product Enquiry">Product Enquiry</option>
            <option value="Rental Enquiry">Rental Enquiry</option>
            <option value="Support">Support</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Message *</label>

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message"
            rows="5"
          />
        </div>

        {/* Honeypot */}
        <input
          type="text"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="honeypot"
          tabIndex="-1"
          autoComplete="off"
        />

        {error && <p className="error">{error}</p>}

        {success && <p className="success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
};