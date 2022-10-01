//start an instance of router
const router = require('express').Router();

const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');
const {animals} = require('../../data/animals');




//Add the route for the request
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });
  
  router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      res.json(result);
    } else {
      res.send(404);
    }
  });

//Setup route to accept user data to be used or stored server-side
router.post('/animals', (req, res) => {
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


//export the router
module.exports = router;