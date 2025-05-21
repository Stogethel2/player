import { writable } from 'svelte/store';

const browser = typeof window !== 'undefined';

function getLocal(key: string): string {
    if (!browser) return '';
    const value = localStorage.getItem(key);
    return value && value !== 'null' ? value : '';
}

export const token = writable(getLocal('token'));
export const username = writable(getLocal('username'));
export const agent_name = writable(getLocal('agent_name'));
export const agent_id = writable<string | null>(null);

let tokenValue = '';
let usernameValue = '';
let agentNameValue = '';

if (browser) {
    token.subscribe(value => {
        tokenValue = value;
        if (value) {
            localStorage.setItem('token', value);
        } else {
            localStorage.removeItem('token');
        }
    });

    username.subscribe(value => {
        usernameValue = value;
        if (value) {
            localStorage.setItem('username', value);
        } else {
            localStorage.removeItem('username');
        }
    });

    agent_name.subscribe(value => {
        agentNameValue = value;
        if (value) {
            localStorage.setItem('agent_name', value);
        } else {
            localStorage.removeItem('agent_name');
        }
    });
}

export const getToken = () => tokenValue;
export const getUsername = () => usernameValue;
export const getAgentName = () => agentNameValue;