import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
for (const scope of SCOPES) {
  provider.addScope(scope);
}

provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

const TOKEN_STORAGE_KEY = 'google_sheets_access_token';
let cachedAccessToken: string | null = sessionStorage.getItem(TOKEN_STORAGE_KEY);
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = cachedAccessToken || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (token) {
        cachedAccessToken = token;
        if (onAuthSuccess) onAuthSuccess(user, token);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error('ไม่สามารถรับ Access Token สำหรับ Google Sheets ได้');
    }

    cachedAccessToken = credential.accessToken;
    sessionStorage.setItem(TOKEN_STORAGE_KEY, cachedAccessToken);

    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user') {
      console.warn('ผู้ใช้ปิดหน้าต่างเข้าสู่ระบบก่อนทำรายการเสร็จ');
      return null;
    }
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setCachedAccessToken = (token: string | null) => {
  cachedAccessToken = token;
  if (token) {
    sessionStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
};

export const getAuthUser = (): User | null => {
  return auth.currentUser;
};