import { createPool, Pool } from "mysql2/promise";
import { CREATE_USERS_TABLE } from "./tabels";

let pool: Pool;

const connectToDatabase = async () => {
  try {
    pool = createPool({
      port: +process!.env!.MYSQL_PORT!,
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    await pool.getConnection();
    await pool.execute(CREATE_USERS_TABLE);
    console.log("Connected to MySQL database successfully.");
  } catch (error) {
    console.log("Error connecting to MySQL database:", error);
    throw error;
  }
};

export { connectToDatabase, pool };
