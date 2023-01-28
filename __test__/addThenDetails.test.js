const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))


describe("Integration for add a movie and update", () => {
    let response;
    const body = {
        movies : "Life of Rafid",
        year : "2022",
        genre : "Hidup", 
        rating : "10",
         one_line : "Film tentang filantropi",
          stars : "Rafid Muhammad", 
          votes : "1000000", 
          runtime : "120", 
          gross : "Rp.1M"
    }
    test("First add a movie", async () => {
        const title = "Life of Rafid"
 
        response  = await axios.post(`http://localhost:5000/add-movie`,body);
        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('status','Created');
        expect(response.data).toHaveProperty('message','Data added successfully');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('title',title);

    })

    test("Then get the movie details and the object added should contained", async() => {
        const title = "Life_of_Rafid"
       try {
	    response = await axios.get(`http://localhost:5000/movie-detail/${title}`);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('statusCode',200);
        expect(response.data).toHaveProperty('status','success');
        expect(response.data.data).toEqual(expect.objectContaining(body));
	        
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('statusCode',404);
            expect(error.response.data).toHaveProperty('status','Not Found');
            expect(error.response.data).toHaveProperty('message', "Not Found");
        }
     })

     afterAll(async () => {
         const title = "Life_of_Rafid"
        response = await axios.delete(`http://localhost:5000/delete-movie/${title}`);
     })

})