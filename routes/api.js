const express = require('express');

const router = express.Router();

const Event = require('../models/event');

const Organization = require('../models/organization');

const Volunteer = require('../models/volunteer');

// const multer = require('multer')

// //img storage
// const storage = multer.diskStorage({
//     destination: function(request, file, callback) {
//         callback(null, './images');
//     },

//     filename: function(request, file, callback) {
//         callback(null, Date.now()+file.originalname);
//     }

// });

// const upload = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5
//     }
// })

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



// api routes for organization
router.get('/getOrganization', (req, res) => {
    Organization.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/saveOrganization', (req, res) => {
    const data = req.body;

    const newOrganization = new Organization(data);

    newOrganization.save((error) => {
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

router.post('/deleteOrganization',(req, res) => {
    Organization.deleteOne({ _id: req.body.id })
        .then(() => {
            return res.json({
                msg: 'Data Deleted'
            });
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});


// api routes for volunteers
router.get('/getVolunteer', (req, res) => {
    Volunteer.find({  })
        .then((data) => {
            console.log('Data: ', data);
            res.json(data);
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});

router.post('/saveVolunteer', (req, res) => {
    const data = req.body;

    const newVolunteer = new Volunteer(data);

    newVolunteer.save((error) => {
        if (error) {
            res.status(500).json({ msg: 'Sorry, internal server errors' });
            return;
        }
        return res.json({
            msg: 'Your data has been saved!!!!!!'
        });
    });
});

router.post('/deleteVolunteer',(req, res) => {
    Volunteer.deleteOne({ _id: req.body.id })
        .then(() => {
            return res.json({
                msg: 'Data Deleted'
            });
        })
        .catch((error) => {
            console.log('error: ', error);
        });
});



module.exports = router;