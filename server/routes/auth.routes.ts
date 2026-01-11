import type { Express, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyGoogleToken, getUserById, AuthUser } from "../auth";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Generate JWT token
function generateToken(user: AuthUser): string {
  return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
}

// Middleware to verify JWT token
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    getUserById(decoded.userId)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }
        req.user = user;
        next();
      })
      .catch(() => {
        return res.status(401).json({ error: "Invalid token" });
      });
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function registerAuthRoutes(app: Express) {
  // Google Sign-In endpoint - receives ID token from client
  app.post("/api/auth/google", async (req, res) => {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({ error: "ID token required" });
      }

      const user = await verifyGoogleToken(idToken);

      if (!user) {
        return res.status(401).json({ error: "Unauthorized email" });
      }

      const token = generateToken(user);

      res.json({ token, user });
    } catch {
      res.status(500).json({ error: "Authentication failed" });
    }
  });

  // Get current user
  app.get("/api/auth/user", requireAuth, (req, res) => {
    res.json(req.user);
  });

  // Logout (client just deletes the token, but we provide endpoint for consistency)
  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });
}
