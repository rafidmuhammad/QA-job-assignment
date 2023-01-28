const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))

describe("Update a movie", () => {
let response;
const body = {
    year : "2023",
    genre : "Family", 
    rating : "5",
    one_line : "Film Comedy",
    stars : "Ernest Prakasa", 
    votes : "150", 
    runtime : "120", 
    gross : "Rp.1M"
}
   
    test("with a path parameter and found", async () => {
        const title = "Cek_Toko_Sebelah_2";

        response = await axios.put(`http://localhost:5000/update-movie/${title}`,body);
        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
        expect(response.data).toHaveProperty('statusCode',200);
        expect(response.data).toHaveProperty('status','success');
        expect(response.data).toHaveProperty('message','Data updated successfully');
    })

    test("with a query parameter but not found", async() => {
        const title = 'Life of Rafid'
        try {
            response = await axios.put(`http://localhost:5000/update-movie/${title}`);
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
            response = await axios.put(`http://localhost:5000/update-movie/`,body);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Parameter input empty");
        }
    })
})