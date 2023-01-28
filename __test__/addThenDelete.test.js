const {axios, matchersWithOptions } = require("../testDepend");

expect.extend(matchersWithOptions({
    verbose: true
}))


describe("Integration for add a movie and delete", () => {
    let response;


    test("First add a movie", async () => {
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
        expect(response.data).toHaveProperty('status','Created');
        expect(response.data).toHaveProperty('message','Data added successfully');
        expect(response.data).toHaveProperty('data');
        expect(response.data.data).toHaveProperty('title',title);

    })

    test("Then delete the data and should return no content", async() => {
        const title = "Life_of_Rafid"
        response = await axios.delete(`http://localhost:5000/delete-movie/${title}`);
        expect(response.status).toBe(204);
    })

})