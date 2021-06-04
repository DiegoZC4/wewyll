const express = require('express');

const router = express.Router();

const Event = require('../models/event');


// Routes
router.get('/', (req, res) => {
    Event.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/save', (req, res) => {
    const data = req.body;

    const newEvent = new Event(data);

    newEvent.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        // Event
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});

router.post('/delete',(req, res) => {
    Event.deleteOne({ _id: req.body.id })
        .then(() => {
            return res.json({
                msg: 'Data Deleted'
            });
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

// router.get('/name', (req, res) => {
//     const data =  {
//         username: 'peterson',
//         age: 5
//     };
//     res.json(data);
// });



module.exports = router;