const express = require('express');
const app = express();
const cors = require('cors'); // To make API calls  to the backend
const dotenv = require('dotenv'); // To config environment
dotenv.config(); // We can access env when we need to.

const dbService = require('./db-service');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/getAll', (req, res) => {
    const db = dbService.getDbInstance();
    const result = db.getAlldata();

    result
        .then(response => res.json({ data: response }))
        .catch(err => console.log(err));
});
app.post('/insert', (req, res) => {
    const { name } = req.body;
    const db = dbService.getDbInstance();
    const result = db.insertNewName(name);

    result
        .then(response => res.json({ data: response }))
        .catch(err => console.log(err));
})
app.patch('/update', (req, res) => {
    const db = dbService.getDbInstance();
    const { id, name } = req.body;
 
    const result = db.updateRowById(id, name);

    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
 })
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const db = dbService.getDbInstance();
    const result = db.deleteRowById(id);

    result
        .then(data => res.json({ success: data }))
        .catch(err => console.log(err));
});
app.get('/search/:name', (request, response) => {
    
    const { name } = request.params;
    const db = dbService.getDbInstance();

    const result = db.searchByName(name);
    console.log(result);
    result
    .then(data => response.json({data : data}))
    .catch(err => console.log(err));
})
app.listen(process.env.PORT, () => { console.log(`Listeing to port ${process.env.PORT}....`) });

