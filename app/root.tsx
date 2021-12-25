import {
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData
} from 'remix';

import globalStyleUrl from '~/styles/global.css';
import { getUser } from './utils/session.server';

export function meta() {
  return { title: 'New Remix App' };
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  return {
    user
  }
}

export const links = () => [{ rel: 'stylesheet', href: globalStyleUrl }];



const Nav: React.FC = () => {
  const data = useLoaderData()

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        Remix
      </Link>
      <ul className="nav">
       <li>
          <Link to="/posts">Posts</Link>
        </li>
        {data?.user ? (
        <li>
          <form action="/auth/logout" method="post">
            <button className="btn" type='submit'>
              Logout {data?.user?.username}
            </button>
          </form>
        </li>
        ) : ( <li>
          <Link to="/auth/login">Login</Link>
        </li>)}
       
      </ul>
    </nav>
  )
}

interface LayoutProps {
  title: string
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <title>{title}</title>
      </head>
      <body>
        <Nav />
        <main className="container">{children}</main>
        {process.env.NODE_ENV === 'development' && <LiveReload />}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}


const App = () => {
  return (
    <Layout title={'This is the Home page'} >
      <Outlet />
    </Layout>
  );
}
export default App
