## Login Flow Instructions:

### Step 1: Register and Automatically Log In a New User
- **Access the `/users` POST route** in Swagger UI.
- **Input the required fields** for registration (such as `username`, `email`, `password`) in the request body.
- **Execute the request**. The server will create the user account and log the user in, returning `accessToken` and `refreshToken` in the response. Make sure to securely store these tokens.

### Step 2: Log In to Authenticate and Obtain New Tokens
- When the user needs to log in again (e.g., in a new session):
  1. **Navigate to the `/login` POST route**.
  2. **Provide the user's `username` and `password`** in the request body schema.
  3. **Execute the request**. Upon successful authentication, the server will issue new tokens. Store these new tokens securely for use in authenticated requests.

### Step 3: Use the Access Token for Authenticated Requests
- For making authenticated requests to the API:
  1. **Copy the `accessToken`** received from the login or user registration response.
  2. **Locate and click the "Authorize" button** in Swagger UI.
  3. **Enter the access token** as `Bearer <accessToken>` in the authorization modal and confirm to apply it.

### Step 4: Retrieve Stories Associated with the User
- To get all stories related to the authenticated user:
  1. **Go to the `/story` GET route** (as opposed to the previously mentioned `/stories/{storyId}` for a specific story).
  2. Ensure the request includes the access token for authentication (set in Step 3).
  3. **Execute the request**. Authenticated requests to this endpoint will return a list of stories associated with the user.

### Additional Notes:
- **First-time User Registration**: The `/users` route not only registers the user but also logs them in by returning tokens right away, simplifying the process for new users.
- **Subsequent Logins**: The `/login` route is used for subsequent logins, providing a fresh set of tokens each time, which includes generating a new refresh token.
- **Retrieving Stories**: The simplified `/story` GET route returns all stories for the authenticated user, showcasing how user-specific data can be securely accessed using tokens.
