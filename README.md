# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Development

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```

## Prisma

To create some data

```shell

npm run seed

```

To open your database dashboard

```shell

npx prisma studio

```

```
remix-blog
├─ app
│  ├─ entry.client.jsx
│  ├─ entry.server.jsx
│  ├─ root.tsx
│  ├─ routes
│  │  ├─ auth
│  │  │  ├─ login.tsx
│  │  │  └─ logout.tsx
│  │  ├─ index.tsx
│  │  └─ posts
│  │     ├─ $postId.tsx
│  │     ├─ index.tsx
│  │     └─ new.tsx
│  ├─ styles
│  │  └─ global.css
│  └─ utils
│     ├─ db.server.ts
│     ├─ session.server.ts
│     └─ validateField.ts
├─ global.td.ts
├─ jsconfig.json
├─ package-lock.json
├─ package.json
├─ prisma
│  ├─ schema.prisma
│  └─ seed.js
├─ public
│  └─ favicon.ico
├─ README.md
└─ remix.config.js

```
