// Nama cookie session Firebase — dipake konsisten di login/logout/middleware/current-user.
export const SESSION_COOKIE_NAME = "session";

// Batas maksimum Firebase createSessionCookie() adalah 14 hari, kita pakai 5 hari.
export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000;
