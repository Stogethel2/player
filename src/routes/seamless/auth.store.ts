import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

export const token = writable(browser ? localStorage.getItem('token') ?? '' : '');
export const username = writable(browser ? localStorage.getItem('username') ?? '' : '');
export const agent_name = writable('');

let tokenValue = '';
let usernameValue = '';
let agentNameValue = '';

if (browser) {
    token.subscribe(value => {
        tokenValue = value;
        if (value) localStorage.setItem('token', value);
    });

    username.subscribe(value => {
        usernameValue = value;
        if (value) localStorage.setItem('username', value);
    });

    agent_name.subscribe(value => {
        agentNameValue = value;
    });
}

export const getToken = () => tokenValue;
export const getUsername = () => usernameValue;
export const getAgentName = () => agentNameValue;