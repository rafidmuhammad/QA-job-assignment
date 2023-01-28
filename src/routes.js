const {
  allMovieHandler,
  methodNotAllowedHandler,
  addMovieHandler,
  updateMovieByTitleHandler,
  deleteMovieHandlerByTitle,
  getMovieDetailByTitleHandler,
} = require("./handler");

const routes = [
  {
    method: "GET",
    path: "/allmovie",
    handler: allMovieHandler,
  },
  {
    method: "*",
    path: "/allmovie",
    handler: methodNotAllowedHandler,
  },

  {
    method: "GET",
    path: "/movie-detail/{title?}",
    handler: getMovieDetailByTitleHandler,
  },
  {
    method: "*",
    path: "/movie-detail/{title?}",
    handler: methodNotAllowedHandler,
  },
  {
    method: "POST",
    path: "/add-movie",
    handler: addMovieHandler,
  },
  {
    method: "*",
    path: "/add-movie",
    handler: methodNotAllowedHandler,
  },
  {
    method: "PUT",
    path: "/update-movie/{title?}",
    handler: updateMovieByTitleHandler,
  },
  {
    method: "*",
    path: "/update-movie",
    handler: methodNotAllowedHandler,
  },
  {
    method: "DELETE",
    path: "/delete-movie/{title?}",
    handler: deleteMovieHandlerByTitle,
  },
  {
    method: "*",
    path: "/delete-movie",
    handler: methodNotAllowedHandler,
  },
];

module.exports = routes;
