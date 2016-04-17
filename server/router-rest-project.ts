import {logger} from "./util";
import {repository} from "./repository";
import {Router} from "express";

export const router = Router();



router.use('/:projectKey', async (req, res, next) => {

    try {
        res.send(await repository.findProjectByKey(req.params.projectKey));
    }
    catch(e) {
        next(e);
    }

});



