// Middleware to verify idea will generate at least $1,000,000
const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;

    if (numWeeks === undefined || weeklyRevenue === undefined) {
        return res.status(400).send();
    }

    const nWeeks = Number(numWeeks);
    const rev = Number(weeklyRevenue);

    if (Number.isNaN(nWeeks) || Number.isNaN(rev)) {
        return res.status(400).send();
    }

    if (nWeeks * rev < 1000000) {
        return res.status(400).send();
    }

    next();
};

module.exports = checkMillionDollarIdea;
