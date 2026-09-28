// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// const client = new MongoClient("mongodb://localhost:27017/database");
// const db = client.db();

// export const auth = betterAuth({
//     emailAndPassword: {
//         enabled: true,
//     },
//     database: mongodbAdapter(db, {
//         // Optional: if you don't provide a client, database transactions won't be enabled.
//         client
//     }),
// });

import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.MONGODB_DB_URI || 'lazashops'); // Use the database name from environment variable or default to 'lazashops'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  user: {
    additionalFields: {
      role: {
        default: "customer",

      },
    }
  }
});