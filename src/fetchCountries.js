const BASE_URL = 'https://restcountries.com/v3.1'

function fetchCountries(seekedCountry) {
    return fetch(`${BASE_URL}/name/${seekedCountry}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json()
        });

    // .catch(error => {
    //     console.log(error)   
    // })     
}
export default { fetchCountries };