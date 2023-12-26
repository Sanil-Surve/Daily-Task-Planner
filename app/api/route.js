import { NextResponse } from "next/server";
import mysql from "mysql2";

let pool = null;

export function connect() {
  return mysql.createPool({
    host: process.env.TIDB_HOST, // TiDB host, for example: {gateway-region}.aws.tidbcloud.com
    port: process.env.TIDB_PORT || 4000, // TiDB port, default: 4000
    user: process.env.TIDB_USER, // TiDB user, for example: {prefix}.root
    password: process.env.TIDB_PASSWORD, // The password of TiDB user.
    database: process.env.TIDB_DATABASE || "test", // TiDB database name, default: test
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
    connectionLimit: 1, // Setting connectionLimit to "1" in a serverless function environment optimizes resource usage, reduces costs, ensures connection stability, and enables seamless scalability.
    maxIdle: 1, // max idle connections, the default value is the same as `connectionLimit`
    enableKeepAlive: true,
  });
}

export function getPool() {
  if (!pool) {
    pool = connect();
  }
  return pool;
}

export async function GET(req) {
  let myQuery = "SELECT * FROM test.todos LIMIT 100";
  let pool = await getPool();

  let rows = await new Promise((resolve, reject) => {
    pool.query(
      { sql: myQuery, rowsAsArray: true },
      function (err, results, fields) {
        console.log(results);
        console.log(fields);
        console.log(err);
        resolve(results);
      }
    );
  });
  return NextResponse.json({ rows: rows });
}

export async function POST(req) {
  const data = await req.json();
  console.log(data);

  let pool = await getPool();
  pool.query(
    "CREATE TABLE `test.todos` (`title` varchar(100), `description` varchar(100))"
  );
  const rsh = pool.query(
    "INSERT INTO `todos` (`title`, `description`) VALUES (?, ?)",
    [data.title, data.description]
  );

  console.log(req);
  return NextResponse.json({ res: rsh });
}
