import "dotenv/config";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
    host: process.env.MYSQL_ADDON_HOST,
    user: process.env.MYSQL_ADDON_USER,
    database: process.env.MYSQL_ADDON_DB,
    password: process.env.MYSQL_ADDON_PASSWORD,
    port: process.env.MYSQL_ADDON_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections
    idleTimeout: 60000, // idle timeout (ms)
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
});

// Kiểm tra kết nối
pool.getConnection()
    .then((conn) => {
        console.log("✅ MySQL Connected to Clever Cloud!");
        conn.release();
    })
    .catch((err) => {
        console.error("❌ MySQL Connection Failed:", err);
    });

export default pool;
