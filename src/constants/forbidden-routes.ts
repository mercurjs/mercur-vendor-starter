export const forbiddenRoutes = [
  "/products",
  "/products/:id",
  "/orders",
  "/orders/:id",
  "/inventory",
  "/draft-orders",
  "/draft-orders/:id",
  "/login",
  "/oauth",
  "/oauth/:app_name",
] as const;

export const isSettingsRoute = (route: string) => {
  return route.startsWith("/settings");
};

export const isForbiddenRoute = (route: any): boolean => {
  if (isSettingsRoute(route)) {
    return true;
  }

  return false;
};
