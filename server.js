const express = require('express');

//require data that front-end can request data from
const { animals } = require('./data/animals');

//instantiate the server
const app = express();

//New function to handle query filters from .get()
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //save animalsArray as filteredResults:
    let filteredResults = animalsArray;

    if (query.personalityTraits) {
        //Save personalityTraits as a dedicated Array
        //if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in personalityTraits Array
        personalityTraitsArray.forEach(trait => {
             // Check the trait against each animal in the filteredResults array.
      // Remember, it is initially a copy of the animalsArray,
      // but here we're updating it for each trait in the .forEach() loop.
      // For each trait being targeted by the filter, the filteredResults
      // array will then contain only the entries that contain the trait,
      // so at the end we'll have an array of animals that have every one 
      // of the traits when the .forEach() loop is finished.
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            );
        });
    };

    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}


//Add the route for the request
app.get('/api/animals', (req, res) => {
    let results = animals;
    //console.log(req.query);
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});

//chain listen() method to server to have server listen for requests
app.listen(3001, () => {
    console.log('API server now on port 3001!');
});