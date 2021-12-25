import { Link, redirect, ActionFunction, useActionData, json, LoaderFunction } from 'remix';
import { db } from '~/utils/db.server';
import { getUser } from '~/utils/session.server';
import { validateField } from '~/utils/validateField';

const badRequest = (data) => json(data,  {status: 400})


export const loader: LoaderFunction = async ({request}) => {
  const user = await getUser(request)

if(!user) return redirect("/")


return {}
}

export const action: ActionFunction = async ({request, }) => {
const form = await request.formData()

const title = form.get('title')
const body = form.get('body')
const user = await getUser(request)

const fields: any = {title, body, userId: user.id}

const fieldsError = {
  title: validateField(title, 'Title'),
  body: validateField(body, 'Body')
}

if(Object.values(fieldsError).some(Boolean)) badRequest({fieldsError, ...fields, userId: user.id})

 const post = await db.post.create({data: fields })

    return redirect(`/posts/${post.id}`)
}

const NewPost = () => {
  const actionData = useActionData()
 
  
  return (
    <>
      <div className="page-header">
        <h1>New Post</h1>
        <Link to="/posts" className="btn btn-reverse">
          Back
        </Link>
      </div>
      <div className="page-content">
        <form method="POST">
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input type="text" id="title" name="title" defaultValue={actionData?.fields.title} />
            <div className="error">
            {actionData?.fieldsError.title&& <p>{actionData.fieldsError.title}</p>}
            </div>
          </div>
          <div className="form-control">
            <label htmlFor="body">Post body</label>
            <textarea id="body" name="body" defaultValue={actionData?.fields.body}/>
            <div className="error">
            {actionData?.fieldsError.body&& <p>{actionData.fieldsError.body}</p>}
            </div>
          </div>
          <button type="submit" className="btn btn-block">
            Add new Post
          </button>
        </form>
      </div>
    </>
  );
};

export default NewPost;

export function ErrorBoundary({ error }) {
    console.log(error);
    
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  }