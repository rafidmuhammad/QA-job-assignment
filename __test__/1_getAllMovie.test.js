const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))

describe("get all movies without query parameters",  () =>{
    let response;
      beforeAll(async () => {
        response = await axios.get(`http://localhost:5000/allmovie`, {
          headers: {
            "Accept-Encoding": "application/json",
            //"Content-Type": "application/json",
          },
        });
        
      });
      test("Validate status code", () => { expect(response.status).toBe(200);})
      test("Validate Content Type", () => { expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");})
      test("Response body object should have correct property and value", () => {
        expect(response.data).toHaveProperty('statusCode',200);
        expect(response.data).toHaveProperty('status','success');
        expect(response.data).toHaveProperty('page',1);
        expect(response.data).toHaveProperty('data');

    });

    test("Response body data should have array of movies and at least contain one movies", () => {
        const data = response.data.data;
        expect(data).toHaveProperty('movies');
        expect(data.movies.length).toBeGreaterThanOrEqual(1);
    
    })

    test("validate json schema", () => {
        const schema = {
            "type": "object",
            "properties": {
              "statusCode": {
                "type": "integer"
              },
              "status": {
                "type": "string"
              },
              "page": {
                "type": "integer"
              },
              "data": {
                "type": "object",
                "properties": {
                  "movies": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string"
                        },
                        "description": {
                          "type": "string"
                        }
                      },
                      "required": [
                        "title",
                        "description"
                      ]
                    }
                  }
                },
                "required": [
                  "movies"
                ]
              }
            },
            "required": [
              "statusCode",
              "status",
              "page",
              "data"
            ]
          }
          expect(response.data).toMatchSchema(schema);
    })
        
})


describe("get movies with queries",  () =>{
    let response;

    test.each([
        {
            limit : 2,
            page : 1,
            expected_length : 2,
            expected_array : [
                {
                "title": "American Psycho",
                "description": "\nA wealthy New York City investment banking executive, Patrick Bateman, hides his alternate psychopathic ego from his co-workers and friends as he delves deeper into his violent, hedonistic fantasies."
                },
                {
                "title": "Don't Breathe",
                "description": "\nHoping to walk away with a massive fortune, a trio of thieves break into the house of a blind man who isn't as helpless as he seems."
                }
                ]
        },
        {
            limit : 2,
            page : 2,
            expected_length :2,
            expected_array : [
                {
                "title": "Escape Room",
                "description": "\nSix strangers find themselves in a maze of deadly mystery rooms and must use their wits to survive."
                },
                {
                "title": "Gone Girl",
                "description": "\nWith his wife's disappearance having become the focus of an intense media circus, a man sees the spotlight turned on him when it's suspected that he may not be innocent."
                }
                ]
        }
    ])("Should show ($expected_length) amount of movies", async ({limit,page,expected_length,expected_array}) => {
        response = await axios.get(`http://localhost:5000/allmovie?limit=${limit}&page=${page}`, {
          headers: {
            "Accept-Encoding": "application/json",
          },
        });
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
        expect(response.data).toHaveProperty('statusCode',200);
        expect(response.data).toHaveProperty('status','success');
        expect(response.data).toHaveProperty('page', page);
        expect(response.data.data.movies).toStrictEqual(expected_array);
        expect(response.data.data.movies).toHaveLength(expected_length);
        
    })

    test.skip("Limit bigger that 100", async () => {
        response =  await axios.get(`http://localhost:5000/allmovie?limit=101`, {
            headers: {
              "Accept-Encoding": "application/json",
            },
          });
          expect(response.status).toBe(200);
          expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
          expect(response.data).toHaveProperty('statusCode',200);
          expect(response.data).toHaveProperty('status','success');
          expect(response.data.data.movies).toHaveLength(100);
    })

    test("Query with limit with value -1", async () => {
        try {
            response =  await axios.get(`http://localhost:5000/allmovie?limit=-1`, {
                headers: {
                  "Accept-Encoding": "application/json",
                },
              });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Query parameter invalid");
        }
    })

    test("Query with page with value -1", async () => {
        try {
            response =  await axios.get(`http://localhost:5000/allmovie?page=-1`, {
                headers: {
                  "Accept-Encoding": "application/json",
                },
              });
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Query parameter invalid");
        }
    })


    describe.each([
        {
            type : 'asc'
        },
        {
            type : 'desc'
        }
    ])("validating data sorted with query parameter $type ",  (type) => {
        beforeAll(async () => {
            response = await axios.get(`http://localhost:5000/allmovie?sort=${type}`, {
                headers: {
                  "Accept-Encoding": "application/json",
                },
              });
        })
        test("validate sorting order", async () => {
            response = await axios.get(`http://localhost:5000/allmovie?sort=${type}`, {
                headers: {
                  "Accept-Encoding": "application/json",
                },
              });
            expect(response.status).toBe(200);
            expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            data = response.data.data.movies;
            expect(data).toMatchSnapshot();
        })
    })
    
})
