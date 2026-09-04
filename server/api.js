const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, getFromDatabaseById, addToDatabase, updateInstanceInDatabase, deleteFromDatabasebyId, createMeeting, deleteAllFromDatabase } = require('./db');
const checkMillionDollarIdea = require('./checkMillionDollarIdea');

apiRouter.get('/minions', (req, res, next) => {
    const minions = getAllFromDatabase('minions');
    res.send(minions);
});

apiRouter.post('/minions', (req, res, next) => {
    const newMinion = addToDatabase('minions', req.body);
    res.status(201).send(newMinion);
});

apiRouter.get('/minions/:minionId', (req, res, next) => {
    const minion = getFromDatabaseById('minions', req.params.minionId);
    if (minion) {
        res.send(minion);
    } else {
        res.status(404).send();
    }
}); 

apiRouter.put('/minions/:minionId', (req, res, next) => {
    // ensure the instance id matches the URL param
    req.body.id = req.params.minionId;
    const updatedMinion = updateInstanceInDatabase('minions', req.body);
    if (updatedMinion) {
        res.send(updatedMinion);
    } else {
        res.status(404).send();
    }
});

apiRouter.delete('/minions/:minionId', (req, res, next) => {
    const deletedMinion = deleteFromDatabasebyId('minions', req.params.minionId);
    if (deletedMinion) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

/*---------------------BONUS---------------------*/

apiRouter.get('/minions/:minionID/work', (req, res, next) => {
    const minionID = req.params.minionID;
    if(Number.isNaN(Number(minionID))) {
        return res.status(404).send();
    }
    const minion = getFromDatabaseById('minions', minionID);
    if (!minion) {
        return res.status(404).send();
    }
    
    const work = getAllFromDatabase('work').filter((work) => {
        return work.minionId === req.params.minionID;
    });
    res.send(work);
});

apiRouter.post('/minions/:minionID/work', (req, res, next) => {
    req.body.minionId = req.params.minionID;
    const newWork = addToDatabase('work', req.body);
    res.status(201).send(newWork);
});

apiRouter.put('/minions/:minionID/work/:workID', (req, res, next) => {
    req.body.id = req.params.workID;
    req.body.minionId = req.params.minionID;
    
    const minionID = req.params.minionID;
    const workID = req.params.workID;
    if(minionID !== workID) {
        return res.status(400).send();
    }
    const updatedWork = updateInstanceInDatabase('work', req.body);
    if (updatedWork) {
        res.send(updatedWork);
    } else {
        res.status(404).send();
    }
});

apiRouter.delete('/minions/:minionID/work/:workID', (req, res, next) => {
    const deletedWork = deleteFromDatabasebyId('work', req.params.workID);
    if (deletedWork) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

apiRouter.get('/ideas', (req, res, next) => {
    const ideas = getAllFromDatabase('ideas');
    res.send(ideas);
});

apiRouter.post('/ideas', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);
    res.status(201).send(newIdea);
});

apiRouter.get('/ideas/:ideaId', (req, res, next) => {
    const idea = getFromDatabaseById('ideas', req.params.ideaId);
    if (idea) {
        res.send(idea);
    } else {
        res.status(404).send();
    }
}); 

apiRouter.put('/ideas/:ideaId', (req, res, next) => {

    req.body.id = req.params.ideaId;
    const updatedIdea = updateInstanceInDatabase('ideas', req.body);
    if (updatedIdea) {
        res.send(updatedIdea);
    } else {
        res.status(404).send();
    }
});

apiRouter.delete('/ideas/:ideaId', (req, res, next) => {
    const deletedIdea = deleteFromDatabasebyId('ideas', req.params.ideaId);
    if (deletedIdea) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

apiRouter.get('/meetings', (req, res, next) => {
    const meetings = getAllFromDatabase('meetings');
    res.send(meetings);
});

apiRouter.post('/meetings', (req, res, next) => {
    const meeting = createMeeting();
    const newMeeting = addToDatabase('meetings', meeting);
    res.status(201).send(newMeeting);
});

apiRouter.delete('/meetings/:meetingId', (req, res, next) => {
    const deletedMeeting = deleteFromDatabasebyId('meetings', req.params.meetingId);
    if (deletedMeeting) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

// delete all meetings
apiRouter.delete('/meetings', (req, res, next) => {
    const cleared = deleteAllFromDatabase('meetings');
    if (cleared !== null) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

module.exports = apiRouter;
