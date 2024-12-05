import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter(
  [
    // Your routes
  ],
  {
    future: {
      v7_startTransition: true, // Enable the v7 startTransition future flag
    },
  }
);

export default router;
