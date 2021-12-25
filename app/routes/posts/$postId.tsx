import { useState, useRef, useEffect } from 'react';
import {
    useLoaderData,
    LoaderFunction,
    Link,
    ActionFunction,
    redirect,
    MetaFunction,
} from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';

export const meta: MetaFunction = ({data}) => {
    if (!data) {
        return {
          title: "No Post",
          description: "No post found"
        };
      }
      
    return {
      title: data.title,
      description:
        data.body
    };
  };


export const loader: LoaderFunction = async ({ params, request }) => {
    const user = await getUser(request)
    const post = await db.post.findUnique({ where: { id: params.postId } });

    if (!post) throw new Error('Post is not found!');

    return { ...post, user };
};

export const action: ActionFunction = async ({ request, params }) => {
    const form = await request.formData();
    const user = await getUser(request)
    const post = await db.post.findUnique({ where: { id: params.postId } });

    if (!post) throw new Error('Post is not found!');
    let update: boolean
    if (form.get('_method') === 'delete') {
        await db.post.delete({ where: { id: params.postId } });
        update = false
    } else {
        update = true
        const title = form.get('title')
        const body = form.get('body')

        const fields = { title, body, userId: user.id }

        await db.post.update(
            {
                where: { id: post.id },
                data: fields as any
            })

    }

    return redirect(update ? post.id : '/posts');
};

const Post = () => {
    const { title, body, createAt, userId, user } = useLoaderData();
    const [showUpdate, setShowUpdate] = useState<boolean>(false)
    const titleInput = useRef(null)
    const bodyInput = useRef(null)


    useEffect(() => {
        if (titleInput.current) {
            titleInput.current.value = title
        }

        if (bodyInput.current) {
            bodyInput.current.value = body
        }

    }, [showUpdate])

    return (
        <div>
            <div className="page-header">
                <h1>{title} </h1>
                <Link to="/posts" className="btn btn-reverse">
                    Back
                </Link>
            </div>
            <div className="page-content">
                <p>{new Date(createAt).toLocaleString()}</p>
                <p>{body}</p>
            </div>
            <div className="page-footer">
                {userId === user?.id &&
                    <form method="post">
                        <input type="hidden" name="_method" value="delete" />
                        <button type="submit" className="btn btn-delete">
                            Delete
                        </button>
                    </form>
                }
                {userId === user?.id && <button className="btn btn-update" onClick={() => setShowUpdate(!showUpdate)}>Update</button>}
            </div>
            <div className="page-content">
                {showUpdate && userId === user?.id &&
                    <form method="POST" >
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" name="title" ref={titleInput} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="body">Post body</label>
                            <textarea id="body" name="body" ref={bodyInput} />
                        </div>
                        <button type="submit" className="btn btn-block">
                            Submit
                        </button>
                    </form>
                }
            </div>
        </div>
    );
};

export default Post;

export function ErrorBoundary({ error }) {
    return (
        <div>
            <h1>Error</h1>
            <p>{error.message}</p>
        </div>
    );
}
