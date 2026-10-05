
// https://script.google.com/macros/s/AKfycbxpwuP1vadDNxSXQj4-HRJVvyzMihZibut90vdaupTP5eVeLVeK3aavgwXSepx7a_323w/exec
import { useState } from "react";

function ContactForm() {
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

    // Google Sheets connection will be added later
try {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(formData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to submit enquiry."
    );
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
    website: ""
  });

} catch (error) {

  console.error("Contact form error:", error);

  setError(
    error.message || "Unable to submit your enquiry."
  );

} finally {

  setLoading(false);

}
  };

  return (
    <div className="contact-container">
      <div className="contact-card">

        <div className="contact-header">
          <span className="section-label">GET IN TOUCH</span>

          <h1>Contact Us</h1>

          <p>
            Have a question or enquiry? Fill out the form below and
            we'll get back to you.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-row">

            <div className="form-group">
              <label>
                Name <span>*</span>
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label>
                Email <span>*</span>
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

          </div>

          <div className="form-row">

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
                <option value="">Select enquiry type</option>
                <option value="General Enquiry">
                  General Enquiry
                </option>
                <option value="Product Enquiry">
                  Product Enquiry
                </option>
                <option value="Rental Enquiry">
                  Rental Enquiry
                </option>
                <option value="Support">
                  Support
                </option>
                <option value="Other">
                  Other
                </option>
              </select>
            </div>

          </div>

          <div className="form-group">
            <label>
              Message <span>*</span>
            </label>

            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your enquiry..."
              rows="6"
              required
            ></textarea>
          </div>

          {/* Honeypot spam protection */}
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            tabIndex="-1"
            autoComplete="off"
            className="honeypot"
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {loading ? "Submitting..." : "Submit Enquiry"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ContactForm;