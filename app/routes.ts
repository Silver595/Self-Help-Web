import {
  type RouteConfig,
  index,
  layout,
  route,
} from '@react-router/dev/routes';

export default [
  // Landing page (no layout)

  index('routes/home.tsx'),
  // App pages wrapped in AppLayout
  layout('layouts/AppLayout.tsx', [
    // route('dashboard', 'routes/dashboard.tsx'),
    // route('habits', 'routes/habits.tsx'),
    // route('library', 'routes/library.tsx'),
    // route('expenses', 'routes/expenses.tsx'),
    // route('inspiration', 'routes/inspiration.tsx'),
    // route('/', 'routes/home.tsx'),
  ]),
] satisfies RouteConfig;
