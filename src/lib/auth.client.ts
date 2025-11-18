export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setAccessToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function isLoggedIn(): boolean {
  return !!getAccessToken();
}

export function getCurrentUser() {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
  return null;
}

export function setCurrentUser(user: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
}

export function logout() {
  if (typeof window !== 'undefined') {
    // Remove from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Remove cookie (overwrite with expired one)
    document.cookie = 'token=; path=/; max-age=0;';
    // Redirect to signin
    window.location.href = '/signin';
  }
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user && user.role === 'Admin';
}

export function isUser(): boolean {
  const user = getCurrentUser();
  return user && user.role === 'User';
}