const Hapi = require("@hapi/hapi");
const routes = require("./routes");
const mysql = require("mysql2");

const server = Hapi.server({
  host: "localhost",
  port: 5000,
  routes: {
    cors: { origin: ["*"] },
  },
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: process.env.NODE_ENV === 'production' ? "recruitment_db_movies" : "mock_db_movies",
});

const init = async () => {
  connection.connect();

  server.app.db = connection;

  server.route(routes);
  await server.start();
  console.log(`Server is run on ${server.info.uri}`);
};

init();
