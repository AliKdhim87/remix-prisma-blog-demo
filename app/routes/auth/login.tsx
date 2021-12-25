import { ActionFunction, useActionData, json, redirect, MetaFunction } from "remix"
import { db } from "~/utils/db.server"
import { login, createUserSession, register } from "~/utils/session.server"
import { validateField } from "~/utils/validateField"


const badRequest = (data) => json(data, { status: 400 })

export const meta: MetaFunction = () => {
  return {
    title: "Remix blog post | Login",
    description:
      "Login to submit your own Posts!"
  };
};

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData()
    const loginType = form.get('loginType')
    const username = form.get('username')
    const password = form.get('password')

    const fields = { loginType, username, password }

    const fieldsError = {
        username: validateField(username, 'Username'),
        password: validateField(password, 'Password')
    }

    if (Object.values(fieldsError).some(Boolean)) {
        return badRequest({ fieldsError, fields })
    }

    switch (loginType) {
        case 'login': {
            // Find user
            const user = await login({ username, password })
      
            // Check user
            if (!user) {
              return badRequest({
                fields,
                fieldErrors: { username: 'Invalid credentials' },
              })
            }
      
            // Create Session
            return createUserSession(user.id, '/posts')
          }

          case 'register': {
            // Check if user exists
            const userExists = await db.user.findFirst({
              where: {
                username,
              },
            })
            if (userExists) {
              return badRequest({
                fields,
                fieldErrors: { username: `User ${username} already exists` },
              })
            }
      
            // Create user
            const user = await register({ username, password })
            if (!user) {
              return badRequest({
                fields,
                formError: 'Something went wrong',
              })
            }
      
            // Create session
            return createUserSession(user.id, '/posts')
          }
          default: {
            return badRequest({
              fields,
              formError: 'Login type is invalid',
            })
          }
    }
    return redirect('/posts')

}


function Login() {
    const actionData = useActionData()
    console.log(actionData);

    return (
        <div className="auth-container">
            <div className="page-header">
                <h1>Login</h1>
            </div>
            <div className="page-content">
                <form method="post">
                    <fieldset>
                        <legend>Login or Register</legend>
                        <label>
                            <input type="radio" name="loginType" value="login" defaultChecked={!actionData?.fields?.loginType || actionData?.fields?.loginType === 'login'} />
                            Login
                        </label>
                        <label>
                            <input type="radio" name="loginType" value="register" />
                            Register
                        </label>
                    </fieldset>
                    <div className="form-control">
                        <label htmlFor="username">Username</label>
                        <input type="text" id="username" name="username" defaultValue={actionData?.fields?.username && actionData?.fields?.username} />
                        {actionData?.fieldsError?.username && <div className="error"><p>{actionData?.fieldsError.username}</p></div>}
                    </div>
                    <div className="form-control">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" name="password" defaultValue={actionData?.fields?.password && actionData?.fields?.password} />
                        {actionData?.fieldsError?.password && <div className="error"><p>{actionData.fieldsError.password}</p></div>}
                    </div>
                    <button type="submit" className="btn btn-block">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login
