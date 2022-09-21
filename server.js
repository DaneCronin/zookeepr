const express = require('express');
const fs = require('fs');
const path = require('path');

//require data that front-end can request data from
const { animals } = require('./data/animals');

//use test environment portal 3001 if not portal 80
const PORT = process.env.PORT || 3001;

//instantiate the server
const app = express();

//Parse(convert) incoming POST data string or array data
app.use(express.urlencoded({ extended : true}));
//Parse(convert) incoming JSON data
app.use(express.json());

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

//function to find a single animal from the animals array by ID
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  };

//function to accept POST route's req.body value and the array we want to add new data to
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return finished code to post route for response
    return animal;
};

//function to validate data for animal values
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || typeof animal.personalityTraits !== 'string') {
        return false; 
    }
    return true;

};

//Add the route for the request
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

//Setup route to accept user data to be used or stored server-side
app.post('/api/animals', (req, res) => {
    //Set ID based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error back
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted.');
    } else {
        
        
    
    //add animal to JSON file and animals array in this function
    const animal = createNewAnimal(req.body, animals);

    res.json(animal);
    }
});

//chain listen() method to server to have server listen for requests
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});