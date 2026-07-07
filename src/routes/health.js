import router from 'express';

const healthRouter = router();


healthRouter.get('/', (req, res) => {
    res.json({ status: 'ok' });
});

export default healthRouter;
