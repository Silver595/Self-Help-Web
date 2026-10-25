import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  // Public landing page
  index('routes/home.tsx'),

  // Guest-only authentication pages
  layout('layouts/GuestLayout.tsx', [
    route('login', 'routes/login.tsx'),
    route('signup', 'routes/signup.tsx'),
  ]),

  // Authenticated App Pages (Wrapped in AppLayout)
  layout('layouts/AppLayout.tsx', [
    route('dashboard', 'routes/dashboard.tsx'),
    // route('habits', 'routes/habits.tsx'),
    route('library', 'routes/library.tsx'),
    // route('expenses', 'routes/expenses.tsx'),
    // route('inspiration', 'routes/inspiration.tsx'),

    // Catch-all route for features under construction or non-existent routes
    route('*', 'components/ComingSoon.tsx'),
  ]),
] satisfies RouteConfig;
