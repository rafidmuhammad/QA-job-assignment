const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))


describe("Integration for delete and get by title should return not found", () => {
    let response;
    
    beforeAll(async () => {
        const title = "Life of Rafid";
        const body = {
            movies : `${title}`,
            year : "2022",
            genre : "Hidup", 
            rating : "10",
             one_line : "Film tentang filantropi",
              stars : "Rafid Muhammad", 
              votes : "1000000", 
              runtime : "120", 
              gross : "Rp.1M"
        }
        response  = await axios.post(`http://localhost:5000/add-movie`,body);
        expect(response.status).toBe(201);
        expect(response.data.data).toHaveProperty('title',title);
    })

    test("First we delete the data", async() => {
        const title = "Life_of_Rafid"
        response = await axios.delete(`http://localhost:5000/delete-movie/${title}`);
        expect(response.status).toBe(204);
    })

    test("Then get the movie details should return not found", async() => {
       try {
	    response = await axios.get(`http://localhost:5000/movie-detail/${title}`);
	        
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('statusCode',404);
            expect(error.response.data).toHaveProperty('status','Not Found');
            expect(error.response.data).toHaveProperty('message', "Not Found");
        }
    })
})