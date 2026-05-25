import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { PROFILE } from "../../content/portfolio";
import { sendMessage } from "../../utils/api";
import "./Contact.css";

const INITIAL_FORM = { name: "", email: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim() || form.name.length < 2) {
      nextErrors.name = "Name must be at least 2 characters";
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Please enter a valid email address";
    }

    if (!form.message.trim() || form.message.length < 10) {
      nextErrors.message = "Message must be at least 10 characters";
    }

    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      await sendMessage(form);
      toast.success("Message sent. I'll get back to you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      const serverMessage = err.response?.data?.error || err.response?.data?.message;

      if (serverErrors) {
        const mappedErrors = {};
        serverErrors.forEach((issue) => {
          const field = issue.field || issue.path;
          const message = issue.message || issue.msg;

          if (field && message) {
            mappedErrors[field] = message;
          }
        });
        setErrors(mappedErrors);
        toast.error("Please fix the form errors");
      } else {
        toast.error(serverMessage || "Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact section">
      <div className="container contact__inner">
        <div className="contact__info">
          <p className="section-tag">Get In Touch</p>
          <h2 className="section-title">
            Let's work
            <br />
            together
          </h2>
          <p className="contact__desc">
            Have a project in mind, want to discuss an internship, or just want
            to say hello? Reach out and I will get back to you as soon as I can.
          </p>

          <div className="contact__details">
            <a
              href={`mailto:${PROFILE.email}`}
              className="contact__detail-item"
            >
              <span className="contact__detail-icon">
                <FiMail />
              </span>
              <span>{PROFILE.email}</span>
            </a>

            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact__detail-item"
            >
              <span className="contact__detail-icon">
                <FiLinkedin />
              </span>
              <span>LinkedIn Profile</span>
            </a>

            <div className="contact__detail-item">
              <span className="contact__detail-icon">
                <FiMapPin />
              </span>
              <span>{PROFILE.location}</span>
            </div>
          </div>
        </div>

        <form
          className="contact__form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form"
        >
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
