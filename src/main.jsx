// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Client, Databases, Storage } from 'appwrite';

// Initialize Appwrite Client
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_API_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

// Initialize Appwrite Services
const databases = new Databases(client);
const storage = new Storage(client);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App databases={databases} storage={storage} />
    </React.StrictMode>
);
