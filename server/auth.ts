import { db } from "../db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isAllowed: boolean;
}

// Verify Google ID token and return user
export async function verifyGoogleToken(
  idToken: string
): Promise<AuthUser | null> {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return null;
    }

    const { email, name, picture, sub: googleId } = payload;

    // Check if email is allowed
    const allowedEmail = process.env.ALLOWED_EMAIL;
    if (email !== allowedEmail) {
      return null;
    }

    // Check if user exists
    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      // Update existing user
      const updatedUser = await db
        .update(users)
        .set({
          name: name || existingUser[0].name,
          googleId,
          avatar: picture,
          isAllowed: true,
        })
        .where(eq(users.email, email))
        .returning();

      return updatedUser[0] as AuthUser;
    } else {
      // Create new user
      const newUser = await db
        .insert(users)
        .values({
          email,
          name: name || "User",
          googleId,
          avatar: picture,
          isAllowed: true,
        })
        .returning();

      return newUser[0] as AuthUser;
    }
  } catch (error) {
    console.error("Google token verification error:", error);
    return null;
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<AuthUser | null> {
  try {
    const user = await db.select().from(users).where(eq(users.id, id)).limit(1);

    if (user.length > 0 && user[0].isAllowed) {
      return user[0] as AuthUser;
    }
    return null;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
}
