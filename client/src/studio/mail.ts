import { profile } from './content';

export function createEmailDraft(name: string, email: string, message: string) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio enquiry from ${name.trim()}`)}&body=${encodeURIComponent(`Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`)}`;
}
