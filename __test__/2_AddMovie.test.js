const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))

describe("Add movie", () => {
let response;
   
    test("with valid input", async () => {
        const body = {
            movies : "Cek Toko Sebelah 2",
            year : "2022",
            genre : "Comedy", 
            rating : "5",
             one_line : "Film Comedy",
              stars : "Ernest Prakasa", 
              votes : "100", 
              runtime : "120", 
              gross : "Rp.1M"
        }
        response = await axios.post(`http://localhost:5000/add-movie`, body);
        expect(response.status).toBe(201);
        expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
        expect(response.data).toHaveProperty('statusCode',201);
        expect(response.data).toHaveProperty('status','Created');
        expect(response.data).toHaveProperty('message','Data added successfully');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('title',"Cek Toko Sebelah 2");
    })

    test("with invalid input", async() => {
        const body = {
            movies : "",
            year : "2022",
            genre : "Comedy", 
            rating : "5",
             one_line : "Film Comedy",
              stars : "Ernest Prakasa", 
              votes : "100", 
              runtime : "120", 
              gross : "Rp.1M"
        }
        try {
            response = await axios.post(`http://localhost:5000/add-movie`, body);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Movies must not be empty");
        }
    })
})