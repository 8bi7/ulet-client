import { writable, Writable } from 'svelte/store';
export const groups: Writable<any[]> = writable([]);
export const error: Writable<string> = writable('');
export const hostIp: Writable<string> = writable(
  ''
  // localStorage.getItem('hostIp') || ''
);
hostIp.set('');

// hostIp.subscribe((val) => localStorage.setItem('hostIp', val));
