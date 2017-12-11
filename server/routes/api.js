var conflictsEmail = require('./conflictsEmail.js');
var resultsEmail = require('./resultsEmail.js');

const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
'use strict';
const nodemailer = require('nodemailer');



// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/mean', (err, db) => {
        if (err) return console.log(err);

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get users
router.get('/users', (req, res) => {
    connection((db) => {
        db.collection('users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

router.post('/newGroup', (req, res) => {
    console.log(req.body);
    let memberObject = { members: [], date: req.body.date, numHours: req.body.numHours, numMinutes: req.body.numMinutes };
    for (var email of req.body.users) {
        memberObject.members.push({ email: email, conflicts: [] });
    }
    connection((db) => {
        db.collection('groups').insert(memberObject, function (err, docsInserted) {
            var groupId = docsInserted.insertedIds[0];
            console.log(docsInserted);
            for (var email of req.body.users) {
                if (email != 'organizer') {
                    console.log(groupId);
                    sendEmail(groupId, email, false);
                }
            }
            res.send(groupId);
        });
    });

})

router.post('/newConflicts', (req, res) => {
    connection((db) => {
        db.collection('groups')
            .find()
            .toArray()
            .then((groups) => {
                for (let group of groups) {
                    if (group._id == req.body.groupId) {
                        var numberOfMembersWithConflicts = 0;
                        for (let member of group.members) {
                            if (member.email == req.body.email) {
                                member.conflicts = req.body.conflicts;
                            }
                            if (member.conflicts.length > 0) {
                                numberOfMembersWithConflicts++;
                            }
                        }
                        if (numberOfMembersWithConflicts == group.members.length) {
                            for (let member of group.members) {
                                if (member.email != 'organizer') {
                                    sendEmail(group._id, member.email, true);
                                }
                            }
                            //do calculations and send email here
                        }
                        db.collection('groups').update({ _id: new ObjectID(req.body.groupId) }, group, { upsert: true });

                    }
                }
                res.send();
            })
    });
})

router.post('/results', (req, res) => {

    connection((db) => {
        db.collection('groups')
            .find()
            .toArray()
            .then((groups) => {
                for (let group of groups) {
                    if (group._id == req.body.groupId) {
                        res.json(group);
                    }
                }
            });
    });
    //res.redirect('/results'+req.body.groupId);
});

function sendEmail(groupId, email, doneEmail) {

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        var smtpConfig = {
            service: 'Gmail',
            auth: {
                user: 'groupmeetingscheduler@gmail.com',
                pass: 'Scheduler'
            }
        };
        var transporter = nodemailer.createTransport(smtpConfig);

        var newGroupLink = 'http://localhost:3000';
        // var newGroupLink = 'http://ec2-18-221-67-154.us-east-2.compute.amazonaws.com:3000/'

        var myHtml = "";
        var mySSubject = "";
        if (doneEmail) {
            //var myResultsLink = "http://ec2-18-221-67-154.us-east-2.compute.amazonaws.com:3000/results/" + groupId// html body
            var myResultsLink = "http://localhost:3000/results/" + groupId // html body

            myHtml = resultsEmail.replace("resultsURL", myResultsLink);
            mySubject = "View Results";
        }
        else {
            // var myConflictsLink= "http://ec2-18-221-67-154.us-east-2.compute.amazonaws.com:3000/conflicts/" + groupId + "/" + email // html body
            var myConflictsLink = ("http://localhost:3000/conflicts/" + groupId + "/" + email); // html body
            console.log(groupId);
            myHtml = conflictsEmail.replace("conflictURL", myConflictsLink);
            mySubject = "Add Conflicts";
        }
        myHtml = myHtml.replace("newGroupURL", newGroupLink);

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Group Scheduler" <groupmeetingscheduler@gmail.com>', // sender address
            to: email, // list of receivers
            subject: mySubject, // Subject line
            text: 'Add conflicts', // plain text body
            // html: "<div>http://ec2-18-221-67-154.us-east-2.compute.amazonaws.com:3000/conflicts/" + groupId + "/" + email + "</div>" // html body
            html: myHtml
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });

}


module.exports = router;