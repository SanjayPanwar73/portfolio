import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { profile } from './content';
import { createEmailDraft } from './mail';

export default function Contact() {
  const [copyState, setCopyState] = useState<'idle'|'copied'|'failed'>('idle');
  const [draftStatus, setDraftStatus] = useState('');
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const attempt = useRef(0);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; if (timer.current) clearTimeout(timer.current); }; }, []);
  async function copyEmail() {
    const currentAttempt = ++attempt.current;
    if (timer.current) clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(profile.email);
      if (!mounted.current || currentAttempt !== attempt.current) return;
      setCopyState('copied');
      timer.current = setTimeout(() => setCopyState('idle'), 4000);
    } catch { if (mounted.current && currentAttempt === attempt.current) setCopyState('failed'); }
  }
  function submitDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();
    const invalid = [
      ...(name.length < 2 || name.length > 80 ? ['name'] : []),
      ...(email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? ['email'] : []),
      ...(message.length < 10 || message.length > 5000 ? ['message'] : []),
    ];
    setInvalidFields(invalid);
    if (invalid.length) {
      setDraftStatus('Please enter your name, a valid email, and a message of 10–5,000 characters.');
      (form.elements.namedItem(invalid[0]) as HTMLElement | null)?.focus();
      return;
    }
    window.location.href = createEmailDraft(name, email, message);
    setDraftStatus('Email app requested. If no draft opened, use the email link below.');
  }
  function fieldAccessibility(name: string) {
    return {
      'aria-invalid': invalidFields.includes(name) || undefined,
      'aria-describedby': invalidFields.includes(name) ? 'draft-status' : undefined,
      onInput: () => setInvalidFields((fields) => fields.filter((field) => field !== name)),
    };
  }
  return <section id="contact" className="contact-section content-section" aria-labelledby="contact-title">
    <span className="availability-badge mono"><i />Available for internships & developer roles</span>
    <div className="contact-heading"><h2 id="contact-title">Let’s build something useful.</h2><p>I’m open to internships, entry-level roles, and conversations about web and AI projects. If you have an opportunity or a practical problem to work on, I’d love to hear from you.</p></div>
    <form className="contact-form" onSubmit={submitDraft}><div className="form-row"><label className="field"><span className="sr-only">Name</span><input {...fieldAccessibility('name')} name="name" placeholder="Name" required minLength={2} maxLength={80} autoComplete="name" /></label><label className="field"><span className="sr-only">Email address</span><input {...fieldAccessibility('email')} name="email" type="email" placeholder="Email address" required maxLength={254} autoComplete="email" /></label></div><label className="field"><span className="sr-only">Your message</span><textarea {...fieldAccessibility('message')} name="message" placeholder="Your message details…" required minLength={10} maxLength={5000} rows={6} /></label><button className="button button-primary form-submit" type="submit">Create email draft</button><p className="form-help">Opens your email app so you can review and send your message.</p>{draftStatus && <p id="draft-status" className="draft-status" role="status">{draftStatus}</p>}</form>
    <div className="contact-details"><a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={12} /></a><button className="copy-email" type="button" onClick={() => void copyEmail()}>{copyState === 'copied' ? <Check size={12} /> : <Copy size={12} />}{copyState === 'copied' ? 'Copied email' : 'Copy email'}</button></div><p className="copy-status" role="status" aria-live="polite">{copyState === 'copied' ? 'Email address copied.' : copyState === 'failed' ? 'Select the email address to copy.' : ''}</p>
    <nav className="social-links" aria-label="Find Sanjay online">{profile.socials.map((social) => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" aria-label={`${social.name} (opens in a new tab)`}>{social.name}<ArrowUpRight size={11} /></a>)}</nav>
  </section>;
}
