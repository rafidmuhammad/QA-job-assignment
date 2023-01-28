const allMovieHandler = async (request, h) => {
  let { limit, sort, page } = request.query;

  //NOTE : set limitations for request queries
  if (limit > 100 || limit === undefined || limit == 0) {
    limit = 100;
  }
  if (sort !== undefined) {
    sort = sort.toLowerCase();
    if (sort !== "desc") {
      sort = "asc";
    }
  } else {
    sort = "asc";
  }
  if (page === undefined || page == 0) {
    page = 1;
  }
  //NOTE : calculating offset and querying
  const offset = (page - 1) * limit;
  if (limit > 0 && page > 0) {
    const [movies] = await request.server.app.db
      .promise()
      .execute(
        `SELECT movies as title, one_line as description FROM movies ORDER BY movies ${sort} LIMIT ${limit} OFFSET ${offset}`
      );
      
    return h
      .response({
        statusCode : 200,
        status: "success",
        page: parseInt(page),
        

        data: { movies },
      })
      .type("application/json");
  }
  //NOTE : cases when request queries are invalid
  const response = h.response({
    statusCode : 400,
    status: "Bad Request",
    message: "Query parameter invalid",
  });
  response.code(400);
  return response.type("application/json");
};

const getMovieDetailByTitleHandler = async (request, h) => {
  let { title } = request.params;

  //NOTE : when request parameter not empty
  if (title.length !== 0) {
    let res = title.split("_").join(" ");
    let [particularMovie, fields] = await request.server.app.db
      .promise()
      .execute(`SELECT * FROM movies WHERE movies = ?`, [res]);
      //NOTE : if a movie found
    if (particularMovie.length !== 0) {
      return h
        .response({ statusCode : 200,status: "success", data: particularMovie[0] })
        .type("application/json");
    } 
    //NOTE : when movie not found
    else {
      const response = h.response({
        statusCode : 404,
        status: "Not Found",
        message: "Not Found",
      });
      response.code(404);
      return response.type("application/json");
    }
  } //NOTE :  when user does not give request parameter input
  else {
    const response = h.response({
      statusCode : 400,
      status : "Bad Request",
      message : "Parameter input empty"
    }).code(400).type("application/json");
    return response
  }
};

const deleteMovieHandlerByTitle = async (request, h) => {
  let { title } = request.params;
  //NOTE : when request parameter not empty
  if (title.length !== 0) {
    let res = title.split("_").join(" ");
    let [particularMovie, fields] = await request.server.app.db
      .promise()
      .execute(`SELECT movies FROM movies WHERE movies = ?`, [res]);
      //NOTE : if a movie found
    if (particularMovie.length !== 0) {
      await request.server.app.db
      .promise()
      .execute(`DELETE FROM movies WHERE movies = ?`, [res]);
    const response = h.response({
      statusCode : 204,
      status: "No Content",
      message: "Data deleted successfully",
    });
    response.code(204);
    return response.type("application/json");
    } 
    //NOTE : when movie not found
    else {
      const response = h.response({
        statusCode : 404,
        status: "Not Found",
        message: "Not Found",
      });
      response.code(404);
      return response.type("application/json");
    }
  } 
  //NOTE :  when user does not give request parameter input
  else {
    const response = h.response({
      statusCode : 400,
      status : "Bad Request",
      message : "Parameter input empty"
    }).code(400).type("application/json");
    return response
  }
  

};

const updateMovieByTitleHandler = async (request, h) => {
  const { title } = request.params;
  const { year, genre, rating, one_line, stars, votes, runtime, gross } =
    request.payload;
  //NOTE : when request parameter not empty
  if (title.length !== 0) {
    let res = title.split("_").join(" ");
    let [particularMovie, fields] = await request.server.app.db
      .promise()
      .execute(`SELECT movies FROM movies WHERE movies = ?`, [res]);  
      //NOTE : if a movie found
    if (particularMovie.length !== 0) {
      await request.server.app.db
      .promise()
      .execute(
        `UPDATE movies SET year = ?, genre = ?, rating = ?, one_line = ?, stars = ?, votes = ?, runtime = ?, gross = ?  WHERE movies = ?`,
        [year, genre, rating, one_line, stars, votes, runtime, gross, res]
      );
    const response = h.response({
      statusCode : 200,
      status: "success",
      message: "Data updated successfully",
    }).type("application/json");
    return response;
    } 
    //NOTE : when movie not found
    else {
      const response = h.response({
        statusCode : 404,
        status: "Not Found",
        message: "Not Found",
      });
      response.code(404);
      return response.type("application/json");
    }
  } 
  //NOTE :  when user does not give request parameter input
  else {
    const response = h.response({
      statusCode : 400,
      status : "Bad Request",
      message : "Parameter input empty"
    }).code(400).type("application/json");
    return response
  }
 
};

const addMovieHandler = async (request, h) => {
  const {
    movies,
    year,
    genre,
    rating,
    one_line,
    stars,
    votes,
    runtime,
    gross,
  } = request.payload;
  //NOTE : movie not empty
  if (movies.length !== 0) {
    await request.server.app.db
      .promise()
      .execute(`INSERT INTO movies VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )`, [
        movies,
        year,
        genre,
        rating,
        one_line,
        stars,
        votes,
        runtime,
        gross,
      ]);
    const response = h.response({
      statusCode : 201,
      status: "Created",
      message: "Data added successfully",
      data: {
        title: movies,
      },
    }).code(201);
    return response;
  }
  const response = h
    .response({
      statusCode : 400,
      status: "Bad Request",
      message: "Movies must not be empty",
    })
    .code(400);
  return response;
};

const methodNotAllowedHandler = (request, h) => {
  const response = h.response({
    statusCode:405,
    status: "Method not Allowed",
    message: "Method not Allowed",
  });
  response.code(405);
  return response;
};

module.exports = {
  allMovieHandler,
  methodNotAllowedHandler,
  addMovieHandler,
  updateMovieByTitleHandler,
  deleteMovieHandlerByTitle,
  getMovieDetailByTitleHandler,
};
