const paths: Record<string, string> = {
  dashboard: 'M3 10 12 3l9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z',
  appointments: 'M7 3v4m10-4v4M3 10h18M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z',
  messages: 'M21 11a8 8 0 0 1-8 8H6l-4 3V11a9 9 0 0 1 19 0ZM7 10h10M7 14h6',
  more: 'M5 12h.01M12 12h.01M19 12h.01',
  notifications: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
  telemedicine: 'M15 8l6-4v16l-6-4M3 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3Z',
  settings: 'm10 3-1 3-3-1-3 5 2 2-2 2 3 5 3-1 1 3h4l1-3 3 1 3-5-2-2 2-2-3-5-3 1-1-3Zm2 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
  waitlist: 'M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  profile: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2',
  patients: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2',
  check: 'm5 12 4 4L19 6',
  arrow: 'M5 12h14m-6-6 6 6-6 6',
  help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
};
export function UiIcon({ name, size = 22 }: { name: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.more} /></svg>;
}
