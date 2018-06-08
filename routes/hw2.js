const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/cs591');
const db = mongoose.connection;
const Schema = mongoose.Schema;

const wordSchema = new Schema({
    string: String,
    length: Number
});

const Word = mongoose.model('Word', wordSchema);

const getter = (res, word) => { //for post and get requests
    Word.find({string: word}, (err, docs) => { //find if in db already
        if (err) {
            console.log(err);
        } else if (!docs.length) { //if not in db
            const entry = new Word({string: word, length: word.length});
            entry.save((err) => { //save entry to db
                if (err) {
                    console.log(err);
                } else { //send out
                    res.json({string: word, length: word.length}); 
                    console.log('Added to DB');
                }
            });
        } else { //if already in db
            docs.forEach((element) => { //send out previous occurence
                res.json({string: element.string, length: element.length});
                console.log('Read from DB');
            });
        }
    });
}

/* GET new db item from url */
router.get('/:word', function(req, res, next) {
    const word = req.params.word;
    getter(res, word);
});

router.get('/', (req, res, next) => { //sends entire collection
    Word.find({}, (err, docs) => {
        res.json(docs);
    })
});

router.post('/', (req, res) => {
    const word = req.body.string;  //take string from body
    getter(res, word);
});

router.delete('/:word', (req, res) => {
    const word = req.params.word;
    Word.find({string: word})
        .remove((err, removed) => {
            if (err) { //error removing
                console.log(err);
            } else if (removed.n === 0){ //if not in db send nf message
                res.json({result: 'string not found'});
                console.log('String not found in DB');
            } else { //if word is in db then send deleted message
                res.json({result: 'document deleted'}); 
                console.log('Deleted from DB');
            }
        });
});

module.exports = router;
