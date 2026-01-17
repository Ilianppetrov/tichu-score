import { HeadContent, Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        title: 'Tichu Score Tracker',
      },
      {
        name: 'description',
        content: 'Track and manage scores for your Tichu card game matches.',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: 'https://tichu.site/',
      },
      {
        property: 'og:title',
        content: 'Tichu Score Tracker',
      },
      {
        property: 'og:description',
        content: 'Track and manage scores for your Tichu card game matches.',
      },
      {
        property: 'og:image',
        content: 'https://tichu.site/logo512.png',
      },
      {
        property: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'twitter:url',
        content: 'https://tichu.site/',
      },
      {
        property: 'twitter:title',
        content: 'Tichu Score Tracker',
      },
      {
        property: 'twitter:description',
        content: 'Track and manage scores for your Tichu card game matches.',
      },
      {
        property: 'twitter:image',
        content: 'https://tichu.site/logo512.png',
      },
    ],
  }),
  component: () => (
    <>
      <HeadContent />
      <Outlet />
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  ),
})
