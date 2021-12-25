import { Link, LoaderFunction, MetaFunction } from 'remix';
import { useLoaderData } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const meta: MetaFunction = () => {
  return {
    title: "Remix blog post | posts",
    description:
      "Enjoy, reading new blog posts"
  };
};

export const loader: LoaderFunction = async ({request}) => {
 const user = await getUser(request)
  const data = {
    posts: await db.post.findMany({
      take: 20,
      select: { id: true, title: true, createAt: true },
      orderBy: { createAt: 'desc' },
    }),
  };
  return {
    data,
    user
  };
};
const PostItems: React.FC = () => {
  const { data, user } = useLoaderData();

  return (
    <>
      <div className="page-header">
        <h1>Posts</h1>
       { user&&<Link to="new" className="btn">
          New post
        </Link>}
      </div>
      <ul className="posts-list">
        {data.posts.map(({ title, id, createAt }) => (
          <li key={id} >
            <Link to={id}>
              <h3>{title}</h3>
              <p>{new Date(createAt).toLocaleString()}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};
export default PostItems;

export function ErrorBoundary({ error }) {
  
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
    </div>
  );
}