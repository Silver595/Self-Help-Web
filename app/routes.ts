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
    // <Route path="*" element={<PageNotFound />} />
    route('dashboard', 'routes/dashboard.tsx'),
    // route('habits', 'routes/habits.tsx'),
    route('library', 'routes/library.tsx'),
    // route('expenses', 'routes/expenses.tsx'),
    // route('inspiration', 'routes/inspiration.tsx'),
    route('*', 'components/ComingSoon.tsx'),
  ]),
] satisfies RouteConfig;
