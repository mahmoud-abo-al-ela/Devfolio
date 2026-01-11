import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAllowed: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";

// Load Google Identity Services script
function loadGoogleScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.getElementById("google-identity-script")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google script"));
    document.head.appendChild(script);
  });
}

// Remove Google sign-in button
function removeGoogleButton() {
  const btn = document.getElementById("google-signin-button");
  if (btn) btn.remove();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (): Promise<void> => {
    try {
      await loadGoogleScript();

      return new Promise((resolve, reject) => {
        const google = (window as any).google;

        if (!google) {
          reject(new Error("Google Identity Services not loaded"));
          return;
        }

        google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: async (response: any) => {
            try {
              const res = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ idToken: response.credential }),
              });

              if (!res.ok) {
                const error = await res.json();
                toast.error(error.error || "Login failed");
                reject(new Error(error.error));
                return;
              }

              const data = await res.json();
              localStorage.setItem(TOKEN_KEY, data.token);
              setUser(data.user);
              removeGoogleButton();
              toast.success("Successfully signed in!");
              resolve();
            } catch (error) {
              toast.error("Login failed");
              reject(error);
            }
          },
        });

        // Show the One Tap prompt
        google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback: render a button
            removeGoogleButton(); // Remove any existing button first

            const buttonDiv = document.createElement("div");
            buttonDiv.id = "google-signin-button";
            buttonDiv.style.position = "fixed";
            buttonDiv.style.top = "50%";
            buttonDiv.style.left = "50%";
            buttonDiv.style.transform = "translate(-50%, -50%)";
            buttonDiv.style.zIndex = "9999";
            buttonDiv.style.background = "white";
            buttonDiv.style.padding = "20px";
            buttonDiv.style.borderRadius = "8px";
            buttonDiv.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)";
            document.body.appendChild(buttonDiv);

            google.accounts.id.renderButton(buttonDiv, {
              theme: "outline",
              size: "large",
              text: "signin_with",
            });
          }
        });
      });
    } catch (error) {
      toast.error("Failed to initialize Google Sign-In");
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      removeGoogleButton();
      toast.success("Successfully signed out");
    }
  }, []);

  // Clean up Google button when user becomes authenticated
  useEffect(() => {
    if (user) {
      removeGoogleButton();
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
