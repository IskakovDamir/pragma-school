import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const SITE_URL = "https://edu.pragma.com.kz/";

/**
 * Absolute URL of the 1200x630 share card. Absolute on purpose: most link
 * previewers do not resolve a relative og:image against the page URL, so a
 * "/og-image.png" here would silently render as a bare text link.
 *
 * public/og-image.png is composed from the site's own markup — the real logo,
 * the real Manrope/Inter/Roboto Mono faces and the established palette — so the
 * Cyrillic renders in the actual brand face. Regenerate it from the same markup
 * if the hero copy changes.
 */
const OG_IMAGE: string | null = `${SITE_URL}og-image.png`;
const OG_IMAGE_ALT = "Pragma School — Разберись с ИИ с нуля";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-ink">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-ink">Страница не найдена</h2>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Страница не загрузилась
        </h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-orange px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Pragma School" },
      {
        name: "description",
        content: "Онлайн-школа автоматизации на ИИ. Начни с трёх бесплатных уроков.",
      },
      { property: "og:title", content: "Pragma School" },
      {
        property: "og:description",
        content: "Онлайн-школа автоматизации на ИИ. Начни с трёх бесплатных уроков.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Pragma School" },
      { property: "og:url", content: SITE_URL },
      ...(OG_IMAGE
        ? [
            { property: "og:image", content: OG_IMAGE },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { property: "og:image:alt", content: OG_IMAGE_ALT },
            { name: "twitter:image", content: OG_IMAGE },
            { name: "twitter:image:alt", content: OG_IMAGE_ALT },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Pragma School" },
      {
        name: "twitter:description",
        content: "Онлайн-школа автоматизации на ИИ. Начни с трёх бесплатных уроков.",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&family=Roboto+Mono:wght@400&display=swap&subset=latin,cyrillic",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
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
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
