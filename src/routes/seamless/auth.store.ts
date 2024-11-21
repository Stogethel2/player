import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

export const token = writable(browser ? localStorage.getItem('token') ?? '' : '');
export const username = writable(browser ? localStorage.getItem('username') ?? '' : '');

if (browser) {
    token.subscribe(value => {
        if (value) localStorage.setItem('token', value);
    });

    username.subscribe(value => {
        if (value) localStorage.setItem('username', value);
    });
}