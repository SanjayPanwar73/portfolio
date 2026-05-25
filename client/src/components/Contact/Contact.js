/**
 * Contact.js — Contact form section
 *
 * Controlled form that submits to POST /api/contact via axios.
 * Shows a success or error toast (react-hot-toast) after submission.
 * Validates fields client-side before making the API call.
 */

import { useState } from "react";
import toast from "react-hot-toast";
import { FiSend, FiMail, FiUser, FiMessageSquare } from "react-icons/fi";
import { sendMessage } from "../../utils/api";
import "./Contact.css";

const INITIAL_FORM = { name: "", email: "", message: "" };

const Contact = () => {
  const [form,       setForm]       = useState(INITIAL_FORM);
  const [errors,     setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Simple client-side validation
  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2)
      e.name = "Name must be at least 2 characters";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email address";
    if (!form.message.trim() || form.message.length < 10)
      e.message = "Message must be at least 10 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await sendMessage(form);
      toast.success("Message sent! I'll get back to you soon 🙌");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        // Map server validation errors back to fields
        const mapped = {};
        serverErrors.forEach(({ field, message }) => { mapped[field] = message; });
        setErrors(mapped);
        toast.error("Please fix the form errors");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact section">
      <div className="container contact__inner">
        {/* Left: text content */}
        <div className="contact__info">
          <p className="section-tag">Get In Touch</p>
          <h2 className="section-title">Let's work<br />together</h2>
          <p className="contact__desc">
            Have a project in mind, a question, or just want to say hi?
            My inbox is always open. I try to respond within 24 hours.
          </p>

          <div className="contact__details">
            <a href="mailto:you@email.com" className="contact__detail-item">
              <span className="contact__detail-icon"><FiMail /></span>
              <span>panwarsanjay710@email.com</span>
            </a>
          </div>
        </div>

        {/* Right: form */}
        <form
          className="contact__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form"
        >
          {/* Name */}
          <div className={`form-group ${errors.name ? "form-group--error" : ""}`}>
            <label htmlFor="name" className="form-label">
              <FiUser size={14} /> Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Your full name"
              autoComplete="name"
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? "form-group--error" : ""}`}>
            <label htmlFor="email" className="form-label">
              <FiMail size={14} /> Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          {/* Message */}
          <div className={`form-group ${errors.message ? "form-group--error" : ""}`}>
            <label htmlFor="message" className="form-label">
              <FiMessageSquare size={14} /> Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="form-input form-textarea"
              placeholder="Tell me about your project or just say hello..."
            />
            {errors.message && <p className="form-error">{errors.message}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary contact__submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="contact__spinner" /> Sending...
              </>
            ) : (
              <>
                <FiSend size={15} /> Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
