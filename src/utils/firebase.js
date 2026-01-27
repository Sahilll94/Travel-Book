// MOCK FIREBASE SETUP - Use this to fix the white screen
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "mock-key",
  authDomain: "mock-domain",
  projectId: "mock-project",
  storageBucket: "mock-bucket",
  messagingSenderId: "mock-sender",
  appId: "mock-app"
};

// Initialize a fake app
export const app = initializeApp(firebaseConfig);

// Provide empty objects so the exports exist and the app doesn't crash
export const auth = {
  currentUser: null,
  onAuthStateChanged: (auth, callback) => callback(null), // Simulates "logged out"
};

export const googleProvider = {};
export const githubProvider = {};
export const twitterProvider = {};

// Empty functions so the app doesn't break when calling them
export const signInWithGoogle = async () => ({});
export const signInWithGithub = async () => ({});
export const signInWithTwitter = async () => ({});
export const signOutUser = async () => true;
export const onAuthStateChangedListener = (callback) => callback(null);
export const checkExistingAccount = async () => [];
export const getProviderFromMethod = (m) => m;
export const linkAccounts = async () => ({});

// Link functions placeholders
export const linkGithubToGoogleAccount = async () => ({});
export const linkGoogleToGithubAccount = async () => ({});
export const linkTwitterToGoogleAccount = async () => ({});
export const linkTwitterToGithubAccount = async () => ({});
export const linkGoogleToTwitterAccount = async () => ({});
export const linkGithubToTwitterAccount = async () => ({});