const path = require('path');
const router = require('express').Router();

//GET route to connect server with API to index.html
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});


router.get('/animals', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/animals.html'));
});
router.get('/zookeepers', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

//Wildcard Route to catch unintentional routes
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


module.exports = router;