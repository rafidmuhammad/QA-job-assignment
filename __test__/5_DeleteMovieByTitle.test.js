const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))

describe("Delete a movie", () => {
let response;
   
    test("with a path parameter and found", async () => {
        const title = "Cek_Toko_Sebelah_2";

        response = await axios.delete(`http://localhost:5000/delete-movie/${title}`);
        expect(response.status).toBe(204);
        expect(response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
    })

    test("with a query parameter but not found", async() => {
        const title = 'Life of Rafid'
        try {
            response = await axios.delete(`http://localhost:5000/delete-movie/${title}`);
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
            response = await axios.delete(`http://localhost:5000/delete-movie/`);
        } catch (error) {
            expect(error.response.status).toBe(400);
            expect(error.response.headers.get('Content-Type')).toEqual("application/json; charset=utf-8");
            expect(error.response.data).toHaveProperty('statusCode',400);
            expect(error.response.data).toHaveProperty('status','Bad Request');
            expect(error.response.data).toHaveProperty('message', "Parameter input empty");
        }
    })
})