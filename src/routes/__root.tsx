import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { CartProvider } from "@/contexts/CartContext";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Supacrown SignageHub - Professional Signage Solutions" },
      { name: "description", content: "Premium signage solutions in Bulawayo, Zimbabwe. Shop fronts, vehicle wraps, banners, illuminated signs and more." },
      { name: "author", content: "Supacrown Pvt Ltd" },
      { property: "og:title", content: "Supacrown SignageHub - Professional Signage Solutions" },
      { property: "og:description", content: "Premium signage solutions in Bulawayo, Zimbabwe. Shop fronts, vehicle wraps, banners, illuminated signs and more." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1dec14f7-81bf-477c-b5cf-e7755ffa51b5/id-preview-15e85f2e--a0c76e4e-1f40-4e07-a95a-17f0917b9ff8.lovable.app-1775128028149.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1dec14f7-81bf-477c-b5cf-e7755ffa51b5/id-preview-15e85f2e--a0c76e4e-1f40-4e07-a95a-17f0917b9ff8.lovable.app-1775128028149.png" },
      { name: "twitter:title", content: "Supacrown SignageHub - Professional Signage Solutions" },
      { name: "twitter:description", content: "Premium signage solutions in Bulawayo, Zimbabwe. Shop fronts, vehicle wraps, banners, illuminated signs and more." },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
