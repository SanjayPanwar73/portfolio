import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Navigation from '../Navigation';
import Contact from '../Contact';
import * as mail from '../mail';
import SelectedWork from '../SelectedWork';
import { profile } from '../content';
import { Link } from '../routing';

beforeEach(() => {
  document.documentElement.dataset.theme = 'dark';
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  Object.defineProperty(window, 'matchMedia', { configurable: true, value: vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })) });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('mobile navigation', () => {
  it('provides five labelled destinations with an active Home tab', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    expect(within(nav).getAllByRole('link').map(link => link.getAttribute('href'))).toEqual(['/', '/skills', '/work', '/experience', '/about']);
    expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
    expect(screen.queryByRole('button', { name: 'Open navigation' })).toBeNull();
  });

  it('updates the active tab after navigation and browser history changes', () => {
    render(<Navigation />);
    const nav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    fireEvent.click(within(nav).getByRole('link', { name: 'Projects' }));
    expect(window.location.pathname).toBe('/work');
    expect(within(nav).getByRole('link', { name: 'Projects' }).getAttribute('aria-current')).toBe('page');
    expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBeNull();
    act(() => { window.history.replaceState(null, '', '/'); window.dispatchEvent(new PopStateEvent('popstate')); });
    expect(within(nav).getByRole('link', { name: 'Home' }).getAttribute('aria-current')).toBe('page');
    expect(document.body.style.overflow).toBe('');
  });
});

describe('contact actions', () => {
  it('creates an encoded email draft addressed to the real owner', () => {
    const draft = new URL(mail.createEmailDraft('  Aditi  ', 'aditi@example.com', 'A project & internship enquiry.'));
    expect(draft.pathname).toBe(profile.email);
    expect(draft.searchParams.get('subject')).toBe('Portfolio enquiry from Aditi');
    expect(draft.searchParams.get('body')).toContain('Email: aditi@example.com');
    expect(draft.searchParams.get('body')).toContain('A project & internship enquiry.');
  });

  it('validates and trims a complete form before requesting a reviewable email draft', () => {
    const createDraft = vi.spyOn(mail, 'createEmailDraft').mockReturnValue('#email-draft-preview');
    render(<Contact />);
    fireEvent.change(screen.getByRole('textbox', {name:'Name'}), {target:{value:'  Aditi  '}});
    fireEvent.change(screen.getByRole('textbox', {name:'Email address'}), {target:{value:'aditi@example.com'}});
    fireEvent.change(screen.getByRole('textbox', {name:'Your message'}), {target:{value:'  An internship & project enquiry.  '}});
    fireEvent.submit(screen.getByRole('button', {name:'Create email draft'}).closest('form')!);
    expect(createDraft).toHaveBeenCalledWith('Aditi', 'aditi@example.com', 'An internship & project enquiry.');
    expect(window.location.hash).toBe('#email-draft-preview');
    expect(screen.getByText('Email app requested. If no draft opened, use the email link below.')).toBeTruthy();
    expect(screen.queryByText('Message sent')).toBeNull();
  });

  it.each([
    {label:'a whitespace-only name',name:'   ',invalid:'Name'},
    {label:'a one-character name',name:'A',invalid:'Name'},
    {label:'an overlong name',name:'A'.repeat(81),invalid:'Name'},
    {label:'a malformed email',email:'person@example',invalid:'Email address'},
    {label:'an overlong email',email:`${'a'.repeat(243)}@example.com`,invalid:'Email address'},
    {label:'a whitespace-only message',message:'          ',invalid:'Your message'},
    {label:'a short message',message:'Too short',invalid:'Your message'},
    {label:'an overlong message',message:'M'.repeat(5001),invalid:'Your message'},
  ])('rejects $label and focuses the field without requesting a draft', ({name = 'Aditi',email = 'person@example.com',message = 'A valid internship enquiry.',invalid}) => {
    const createDraft = vi.spyOn(mail, 'createEmailDraft');
    render(<Contact />);
    fireEvent.change(screen.getByRole('textbox', {name:'Name'}), {target:{value:name}});
    fireEvent.change(screen.getByRole('textbox', {name:'Email address'}), {target:{value:email}});
    fireEvent.change(screen.getByRole('textbox', {name:'Your message'}), {target:{value:message}});
    fireEvent.submit(screen.getByRole('button', {name:'Create email draft'}).closest('form')!);
    expect(screen.getByText(/Please enter your name, a valid email/)).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('textbox', {name:invalid}));
    expect(createDraft).not.toHaveBeenCalled();
    expect(screen.queryByText('Message sent')).toBeNull();
  });
  it('copies the real email and reports successful completion', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Email address copied.'));
    expect(writeText).toHaveBeenCalledWith(profile.email);
    expect(screen.getByRole('link', { name: profile.email }).getAttribute('href')).toBe(`mailto:${profile.email}`);
  });

  it('offers manual copying when clipboard access fails without claiming success', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
    render(<Contact />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy email' }));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Select the email address to copy.'));
    expect(screen.queryByRole('button', { name: 'Copied email' })).toBeNull();
    for (const social of profile.socials) expect(screen.getByRole('link', { name: `${social.name} (opens in a new tab)` }).getAttribute('href')).toBe(social.url);
  });
});

it('exposes four native case studies with real source links and no unverified demos', () => {
  const { container } = render(<SelectedWork detailed />);
  const details = container.querySelectorAll('details');
  expect(details).toHaveLength(4);
  details.forEach((detail) => {
    expect(detail.querySelector('summary')?.textContent).toContain('Explore the build');
    expect(detail.querySelector('a')?.href).toMatch(/^https:\/\/github.com\/SanjayPanwar73\//);
  });
  expect(screen.getAllByRole('heading', {level:2}).map(heading => heading.textContent)).toEqual(['Samadhan-Setu', 'SearchNest', 'DietTracker', 'SnapTrip']);
  expect(screen.getAllByRole('heading', {level:3, name:'An engineering decision', hidden:true})).toHaveLength(4);
  expect(screen.queryByRole('link', { name: /live demo/i })).toBeNull();
});

it('leaves modified, download, new-window, and external links to the browser', () => {
  const scenarios = [
    {href:'/work',event:{ctrlKey:true}},
    {href:'/work',event:{metaKey:true}},
    {href:'/work',event:{shiftKey:true}},
    {href:'/work',event:{altKey:true}},
    {href:'/work',event:{button:1}},
    {href:'/work',target:'_blank'},
    {href:'/work',target:'project-window'},
    {href:'/resume.pdf',download:''},
    {href:'//example.com/work'},
    {href:'https://example.com/work'},
  ];
  for (const {event, ...props} of scenarios) {
    const {unmount} = render(<Link {...props}>Native destination</Link>);
    let browserHandlesClick = false;
    const interceptDefault = (click: MouseEvent) => {
      browserHandlesClick = !click.defaultPrevented;
      click.preventDefault();
    };
    document.addEventListener('click', interceptDefault, {once:true});
    fireEvent.click(screen.getByRole('link', {name:'Native destination'}), event);
    expect(browserHandlesClick, JSON.stringify(props)).toBe(true);
    expect(window.location.pathname).toBe('/');
    unmount();
  }
});

it('switches the reference-style theme and persists the preference', () => {
  render(<Navigation />);
  fireEvent.click(screen.getByRole('button', {name:'Switch to light theme'}));
  expect(document.documentElement.dataset.theme).toBe('light');
  expect(localStorage.getItem('portfolio-theme')).toBe('light');
  fireEvent.click(screen.getByRole('button', {name:'Switch to dark theme'}));
  expect(document.documentElement.dataset.theme).toBe('dark');
});
