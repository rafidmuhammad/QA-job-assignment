const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))

describe("Get a movie by title", () => {
let response;
   
    test("with a path parameter and found", async () => {
        const title = "Cek_Toko_Sebelah_2";
        response = await axios.get(`http://localhost:5000/movie-detail/${title}`);


        const body =response.data;
        const data = body.data;
       
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
        expect(body).toHaveProperty('statusCode',200);
        expect(body).toHaveProperty('status','success');
        expect(body).toHaveProperty('data');
        expect(data).toHaveProperty('movies',"Cek Toko Sebelah 2");
        expect(data).toHaveProperty('year',"2022");
        expect(data).toHaveProperty('genre',"Comedy");
        expect(data).toHaveProperty('rating',"5");
        expect(data).toHaveProperty('one_line',"Film Comedy");
        expect(data).toHaveProperty('stars',"Ernest Prakasa");
        expect(data).toHaveProperty('votes',"100");
        expect(data).toHaveProperty('runtime',"120");
        expect(data).toHaveProperty('gross',"Rp.1M");
    })

    test("with a query parameter but not found", async() => {
        const title = 'Life of Rafid'
        try {
            response = await axios.get(`http://localhost:5000/movie-detail/${title}`);
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',404);
            expect(error.response.data).toHaveProperty('status','Not Found');
            expect(error.response.data).toHaveProperty('message', "Not Found");
        }
    })

    test("without path parameter",async() => {
        try {
            response = await axios.get(`http://localhost:5000/movie-detail/`);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Parameter input empty");
        }
    })
})