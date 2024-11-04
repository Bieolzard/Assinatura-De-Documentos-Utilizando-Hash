import axios from 'axios'

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL,
});
