import { Router } from 'express';
import * as accountController from '../controllers/accountController.mjs';

const appRouter = Router();

appRouter.get('/login', accountController.getLoginForm);
appRouter.get('/logout', accountController.getLogout);
appRouter.post('/login', accountController.postLoginForm);

export default appRouter;
