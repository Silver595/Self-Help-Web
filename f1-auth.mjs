// F1: API client + auth wiring. Run from the repo root:  node f1-auth.mjs
import fs from 'node:fs';
const edit = (file, find, repl) => {
  const s = fs.readFileSync(file, 'utf8');
  const n = s.split(find).length - 1;
  if (n !== 1) { console.error(`FAIL ${file}: expected 1 match, found ${n} for:\n   ${find.split('\n')[0]}`); process.exitCode = 1; return; }
  fs.writeFileSync(file, s.replace(find, () => repl)); console.log(`ok   ${file}`);
};
const write = (file, body) => { fs.mkdirSync(file.replace(/\/[^/]+$/, ''), { recursive: true }); fs.writeFileSync(file, body); console.log(`new  ${file}`); };
const A = 'Frontend/app';

write(`${A}/lib/api.ts`, `const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1';

export class ApiRequestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

// Paths where a 401 means "bad credentials", not "session expired".
const NO_REFRESH = ['/users/login', '/users/register', '/users/refresh-token'];

let refreshing: Promise<boolean> | null = null;

// Single-flight: many parallel 401s share ONE refresh call. Two refreshes with
// the same cookie would look like token replay and the server revokes the session.
export function refreshSession(): Promise<boolean> {
  if (!refreshing) {
    refreshing = fetch(\`\${BASE_URL}/users/refresh-token\`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((r) => r.ok)
      .catch(() => false)
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

async function parse(res: Response) {
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiRequestError(res.status, body?.message || \`Request failed (\${res.status})\`);
  }
  return body?.data;
}

export async function api<T = any>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<T> {
  const doFetch = () =>
    fetch(\`\${BASE_URL}\${path}\`, {
      method: options.method ?? 'GET',
      credentials: 'include',
      headers: options.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });

  let res = await doFetch();
  if (res.status === 401 && !NO_REFRESH.some((p) => path.startsWith(p))) {
    if (await refreshSession()) res = await doFetch();
  }
  return parse(res);
}
`);

write(`${A}/lib/auth.ts`, `import { api } from './api';

export interface User {
  _id: string;
  fullname: string;
  email: string;
  username: string;
}

export const loginRequest = (email: string, password: string) =>
  api<{ user: User }>('/users/login', { method: 'POST', body: { email, password } });

export const registerRequest = (data: {
  fullname: string;
  email: string;
  username: string;
  password: string;
}) => api<User>('/users/register', { method: 'POST', body: data });

export const getCurrentUser = () => api<User>('/users/current-user');

export const logoutRequest = () => api('/users/logout', { method: 'POST' });
`);

// ---- login
const L = `${A}/routes/login.tsx`;
edit(L, `import { Link } from 'react-router';`, `import { Link, useNavigate } from 'react-router';\nimport { loginRequest } from '~/lib/auth';`);
edit(L, `  const [email, setEmail] = useState<string>('');`, `  const navigate = useNavigate();\n  const [email, setEmail] = useState<string>('');`);
edit(L, `  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {`, `  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {`);
edit(L, `    // Simulate API Auth Request
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(email);
      } else {
        alert(\`Logged in successfully as \${email}\`);
      }
    }, 1200);`, `    try {
      await loginRequest(email, password);
      if (onLoginSuccess) onLoginSuccess(email);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsLoading(false);
    }`);

// ---- signup
const S = `${A}/routes/signup.tsx`;
edit(S, `import { Link } from 'react-router';`, `import { Link, useNavigate } from 'react-router';\nimport { loginRequest, registerRequest } from '~/lib/auth';`);
edit(S, `  const [fullName, setFullName] = useState<string>('');`, `  const navigate = useNavigate();\n  const [fullName, setFullName] = useState<string>('');\n  const [username, setUsername] = useState<string>('');`);
edit(S, `  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {`, `  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {`);
edit(S, `if (!fullName || !email || !password) {`, `if (!fullName || !username || !email || !password) {`);
edit(S, `    // Simulate Registration Request
    setTimeout(() => {
      setIsLoading(false);
      if (onSignUpSuccess) {
        onSignUpSuccess(fullName, email);
      } else {
        alert(\`Account created successfully for \${fullName}\`);
      }
    }, 1200);`, `    try {
      await registerRequest({ fullname: fullName, email, username, password });
      await loginRequest(email, password);
      if (onSignUpSuccess) onSignUpSuccess(fullName, email);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed.');
    } finally {
      setIsLoading(false);
    }`);
edit(S, `          {/* Email Input */}`, `          {/* Username Input */}
          <div className='space-y-1.5'>
            <label
              htmlFor='username'
              className='block text-xs font-semibold uppercase tracking-wider text-[#5C5E62]'
            >
              Username
            </label>
            <input
              id='username'
              type='text'
              required
              minLength={3}
              maxLength={30}
              placeholder='alexmorgan'
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className='w-full h-11 bg-[#F4F4F4] border border-transparent rounded-lg px-4 text-sm text-[#171A20] placeholder-[#5C5E62]/60 focus:bg-white focus:border-[#171A20] focus:outline-none transition-all duration-200'
            />
          </div>

          {/* Email Input */}`);
edit(S, `placeholder='At least 8 characters'`, `placeholder='8+ chars, letter, number, symbol'`);

// ---- header
const H = `${A}/components/layout/Header.tsx`;
edit(H, `import { useState } from 'react';
import { Link, NavLink } from 'react-router/internal/react-server-client';`, `import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { logoutRequest } from '~/lib/auth';`);
edit(H, `  const [isOpen, setIsOpen] = useState(false);
`, `  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutRequest();
    } finally {
      navigate('/login');
    }
  };
`);
edit(H, `        </div>

        {/* Mobile Hamburger Button */}`, `          <button
            onClick={handleLogout}
            className='text-[#393C41] hover:text-[#171A20]'
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger Button */}`);
edit(H, `          ))}
        </div>
      )}
    </header>`, `          ))}
          <button
            onClick={handleLogout}
            className='text-left text-base font-medium text-[#393C41] hover:text-[#171A20]'
          >
            Logout
          </button>
        </div>
      )}
    </header>`);

// ---- layout guard
write(`${A}/layouts/AppLayout.tsx`, `import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import Header from '~/components/layout/Header';
import { getCurrentUser } from '~/lib/auth';

export default function AppLayout() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  // Auth cookies are httpOnly and only exist in the browser, so the check runs here.
  useEffect(() => {
    getCurrentUser()
      .then(() => setReady(true))
      .catch(() => navigate('/login', { replace: true }));
  }, [navigate]);

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  return (
    <div className="min-h-screen bg-white text-[#171A20]">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
`);
