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

/* GET new db item from url */
router.get('/:word', function(req, res, next) {
    const word = req.params.word;
    let arr;
    Word.find({string: word}, (err, docs) => { //find if in db already
        arr = docs; //store matching docs in array
    }).then(() => {
        if (JSON.stringify(arr) === "[]"){ //if new entry
            const entry = new Word({string: word, length: word.length});
            entry.save((err) => { //save entry to db
                if (err) {
                    console.log(err);
                } else { //send out
                    res.json({string: word, length: word.length}); 
                    console.log('Added to DB');
                }
            });
        } else { //if word is already in db 
            arr.forEach((element) => { //send out previous occurence
                res.json({string: element.string, length: element.length});
                console.log('Read from DB');
            });
        }
    });
});

router.get('/', (req, res, next) => { //sends entire collection
    Word.find({}, (err, docs) => {
        res.json(docs);
    })
});

router.post('/', (req, res) => {
    const word = req.body.string;  //take string from body
    let arr;
    Word.find({string: word}, (err, docs) => { //find if in db already
        arr = docs; //store matching docs in array
    }).then(() => {
        if (JSON.stringify(arr) === "[]"){ //if new entry
            const entry = new Word({string: word, length: word.length});
            entry.save((err) => { //save entry to db
                if (err) {
                    console.log(err);
                } else { //send out
                    res.json({string: word, length: word.length}); 
                    console.log('Added to DB');
                }
            });
        } else { //if word is already in db 
            arr.forEach((element) => { //send out previous occurence
                res.json({string: element.string, length: element.length});
                console.log('Read from DB');
            });
        }
    });
});

router.delete('/:word', (req, res) => {
    const word = req.params.word;
    let arr;
    Word.find({string: word}, (err, docs) => { //find if in db already
        arr = docs; //store matching docs in array
    }).then(() => {
        if (JSON.stringify(arr) === "[]"){ //if not in db send back message
            res.json({result: 'string not found'});
            console.log('String not found in DB');
        } else { //if word is in db 
            Word.deleteOne((err) => { //delete
                if (err) {
                    console.log(err);
                } else { //send out json message
                    res.json({result: 'document deleted'}); 
                    console.log('Deleted from DB');
                }
            });
        }
    });
});

module.exports = router;
