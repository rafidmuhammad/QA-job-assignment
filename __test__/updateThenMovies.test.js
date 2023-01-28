const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))


describe("Integration for update and get movie details should newly updated data", () => {
    let response;
    
    const updateBody = {
        year : "2022",
        genre : "Hidup", 
        rating : "9.5",
         one_line : "Film tentang kehidupan",
          stars : "Rafid Muhammad", 
          votes : "1000000", 
          runtime : "120", 
          gross : "Rp.1M"
    }

    const expectedBody = {title : "Life of Rafid", description : "Film tentang kehidupan"}

    beforeAll(async () => {
        const title = "Life of Rafid"
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

    test("First we update the data", async() => {
        const title = "Life_of_Rafid"
       try {
	    response = await axios.put(`http://localhost:5000/update-movie/${title}`,updateBody);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('statusCode',200);
        expect(response.data).toHaveProperty('status','success');
        expect(response.data).toHaveProperty('message','Data updated successfully');
	        
        } catch (error) {
            expect(error.response.status).toBe(404);
            expect(error.response.data).toHaveProperty('statusCode',404);
            expect(error.response.data).toHaveProperty('status','Not Found');
            expect(error.response.data).toHaveProperty('message', "Not Found");
        }
    })

    test("Then get the movies and validate if the updated object is contained", async() => {
        try {
         response = await axios.get(`http://localhost:5000/allmovie`);
         expect(response.status).toBe(200);
         expect(response.data).toHaveProperty('statusCode',200);
         expect(response.data).toHaveProperty('status','success');
         expect(response.data.data.movies).toContainEqual(expectedBody);
             
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