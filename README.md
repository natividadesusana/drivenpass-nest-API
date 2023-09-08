# DrivenPass

DrivenPass is a sensitive data management application designed to provide functionality to create, access and delete user account information, credentials, secure notes and cards. The project aims to ensure data security and user privacy.

## Documentation
- [Access the API documentation](https://driven-pass-xj3q.onrender.com/api)

## Main Project Technologies:

![Static Badge](https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)\
![Static Badge](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)

- **Development Tools**:\
  ![Static Badge](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)\
  ![Static Badge](https://img.shields.io/badge/prettier-1A2C34?style=for-the-badge&logo=prettier&logoColor=F7BA3E)\
  ![Static Badge](https://img.shields.io/badge/eslint-3A33D1?style=for-the-badge&logo=eslint&logoColor=white)
  
- **Cryptography Libraries**:\
  ![Static Badge](https://img.shields.io/badge/bcrypt-f0772b?style=for-the-badge&logo=jest&logoColor=white)\
  ![Static Badge](https://img.shields.io/badge/cryptr-ffca28?style=for-the-badge&logo=jest&logoColor=white)
     
- **Automated Testing**:\
  ![Static Badge](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)\
  ![Static Badge](https://img.shields.io/badge/Supertest-5849be?style=for-the-badge&logo=jest&logoColor=white)

<br>

## How to Run

To run this application, follow these steps:

1. Clone the repository to your local machine.

   ```bash
   git clone https://github.com/natividadesusana/drivenpass-nest-API.git
   ```

2. Install project dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:
   - Make a copy of the `.env.example` file and configure the environment variable for development as `.env.development`.
<br>

4. Apply database migrations using Prisma in a development environment:
   ```bash
   npm run dev:migration:generate
   npm run dev:migration:run
   ```

5. Start the application:
   ```bash
   npm run start:dev
   ```
6. Documentation
   - After running the application at [http://localhost:3000](http://localhost:3000), the **documentation** will be available at [http://localhost:3000/api](http://localhost:3000/api)
   - Ensure you configure the database and other settings as appropriate before using the application in a production environment. Refer to the documentation for more details on configurations and additional features.

## Testing
1. Configure environment variables:
   - Make a copy of the `.env.example` file and configure the environment variable for testing as `.env.test`.

2. Apply database migrations using Prisma in a test environment:

    ```bash
    npm run test:migration:generate
    npm run test:migration:run
    ```

3. Run the following commands:
   ```bash
    # e2e tests
    $ npm run test:e2e

    # test coverage
    $ npm run test:e2e:cov
    ```

<br>

## Routes and Functionalities

### ❤️ Health (`/health`)

- Route solely for ensuring the application is up and running.
- **GET** `/health`: Returns the message `"I'm okay!"` with the status code `200 OK`.

### 👤 Users (`/users`)

- The application allows users to create accounts and use them to access other functionalities.

#### Account Creation

- Users must provide a valid email and password to create an account.
- If the email is already in use, the application will not allow the account creation (`409 Conflict`).
- Passwords must meet security criteria, including at least 10 characters, 1 number, 1 lowercase letter, 1 uppercase letter, and 1 special character (`400 Bad Request`).
- Passwords are stored securely in the database using the [bcrypt](https://www.npmjs.com/package/bcrypt) library.

#### Account Access

- Users must use the registered email and password to access their accounts.
- If incompatible data is provided, the application will respond with `401 Unauthorized`.
- After a successful login, users will receive a JWT token for future authentication.
- **This token must be sent in all requests to identify the user.**

### 🔑 Credentials (`/credentials`)

- Credentials refer to login information for websites and services.

#### Credential Creation

- To register a new credential, the user must provide a URL, a username, and a password.
- The user must also provide a title/name/label for the credential since it is possible to register multiple credentials for the same site.
- If none of the data is sent, the application will respond with `400 Bad Request`.
- Each credential must have a unique title/name/label. Attempts to create two credentials with the same name will be prevented (`409 Conflict`).
- Credential passwords are encrypted in the database using an application secret, with the use of the [cryptr](https://www.npmjs.com/package/cryptr) library.

#### Credential Retrieval

- The application allows users to retrieve all credentials on the `/credentials` route or a specific credential using its ID on the `/credentials/{id}` route.
- If a user tries to access a credential that does not belong to them, the application will respond with `403 Forbidden`.
- If an invalid ID is sent, the response will be `400 Bad Request`.
- If the ID does not exist, the response will be `404 Not Found`.
- All returned credentials appear with the password decrypted (`200 OK`).

#### Delete Credentials

- The application allows the deletion of credentials based on their ID.
- If an invalid ID is sent, the response will be `400 Bad Request`.
- If the ID does not exist, the response will be `404 Not Found`.
- If the credential belongs to another user, the response will be `403 Forbidden`.

### ✏️ Secure Notes (`/notes`)

- Secure Notes are text-based information.

#### Secure Note Creation

- To register a new secure note, the user must provide a title/name/label and the content of the note.
- If none of the data is sent, the application will respond with `400 Bad Request`.
- Each note must have a unique title. Attempts to create two notes with the same name will be prevented (`409 Conflict`).

#### Secure Note Retrieval

- The application allows users to retrieve all secure notes on the `/notes` route or a specific secure note using its ID on the `/notes/{id}` route.
- If a user tries to access a note that does not belong to them, the application will respond with `403 Forbidden`.
- If an invalid ID is sent, the response will be `400 Bad Request`.
- If the ID does not exist, the response will be `404 Not Found`.

#### Delete Secure Notes

- The application allows the deletion of secure notes based on their ID.
- If an invalid ID is sent, the response will be `400 Bad Request`.
- If the ID does not exist, the response will be `404 Not Found`.
- If the note belongs to another user, the response will be `403 Forbidden`.

### 💳 Cards (`/cards`)

- Cards represent credit and/or debit cards.

#### Card Creation

- To register a new card, the user must provide the card number, printed name, security code, expiration date, password, whether it is virtual, and its type (credit, debit, or both).
- If none of the data is sent, the application will respond with `400 Bad Request`.
- Each card must have a unique title/name/label. Attempts to create two cards with the same name will be prevented (`409 Conflict`).
- The card's security code and password are encrypted using an application secret, with the use of the [cryptr](https://www.npmjs.com/package/cryptr) library.

#### Card Retrieval

- The application allows users to retrieve all their cards on the `/cards` route or a specific card using its ID on the `/cards/{id}` route.
- If a user tries to access

 a card that does not belong to them, the application will respond with `403 Forbidden`.
- If the card does not exist, the response will be `404 Not Found`.

#### Delete Cards

- The application allows the deletion of cards based on their ID.
- If an invalid ID is sent, the response will be `400 Bad Request`.
- If the ID does not exist, the response will be `404 Not Found`.
- If the card belongs to another user, the response will be `403 Forbidden`.

### 🗑️ Delete Account and All User Data (`/erase`)

- The route allows the user to delete their account and all associated data.
- When this action occurs, credential, note, card, and other data are deleted from the database, along with the user's registration.
- Since it is a destructive action, the password must be sent again in the request body for the action to be executed. If the password is incorrect, the response will be `401 Unauthorized`.

## Contributions

Contributions are welcome! Feel free to open issues and send pull requests to improve this project.
