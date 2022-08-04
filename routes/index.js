const router = require('express').Router();
const authRouter = require('./auth');

router.get('/', (req, res)=> {
    res.send('node server working fine');
})

router.use('/auth', authRouter);


module.exports = router;