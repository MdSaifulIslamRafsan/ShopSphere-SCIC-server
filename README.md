## Installation

- Clone the Repository:

```sh
git clone https://github.com/MdSaifulIslamRafsan/SOULMATE-server-side.git
cd SOULMATE-server-side
```

- Install Dependencies:

```sh
npm install
```

- Set Up Environment Variables:
  
Create a .env file in the root directory with the following variables:

```sh
# MongoDB Configuration
DB_USER=your_database_username
DB_PASSWORD=your_database_password

# Authentication Token Secret
ACCESS_TOKEN_SECRET=your_access_token_secret

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
```
- Start the Development Server:

```sh
nodemon index.js
```
