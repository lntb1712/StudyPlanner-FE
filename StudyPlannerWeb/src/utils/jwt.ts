// src/utils/jwt.ts
export type RawPermission = { id: string; ro: boolean };

export function base64UrlDecode(str: string): string {
  // base64url -> base64
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  // padding
  while (str.length % 4) str += "=";
  return atob(str);
}

export function decodeJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = base64UrlDecode(parts[1]);
    return JSON.parse(payload);
  } catch (e) {
    console.error("decodeJwt error", e);
    return null;
  }
}

/**
 * backend may send Permission as array of JSON-strings like:
 * ["{\"id\":\"ucAccountManagement\",\"ro\":false}", ...]
 * or already as objects. This function normalizes to object array.
 */
export function parsePermissions(raw: any): RawPermission[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((p) => {
      if (typeof p === "string") {
        try {
          return JSON.parse(p);
        } catch {
          return null;
        }
      } else if (typeof p === "object" && p !== null) {
        return p as RawPermission;
      }
      return null;
    }).filter(Boolean) as RawPermission[];
  }
  return [];
}
