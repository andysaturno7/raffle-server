"use strict";

import { Router } from "express";
import { controllers } from "./zoom.controller.js";

const router = Router();

router.post('/oauth/set-token', controllers.setToken);
router.get('/users', controllers.getUsersAccounts);
router.get('/users/me', controllers.getUserInfo);
router.get('/:wm', controllers.getAllWM);
router.get('/:wm/:wmId', controllers.getWM);
router.get('/:wm/:wmId/participants', controllers.getAllParticipants);
router.get('/:wm/:wmId/registrants', controllers.getRegistrants);

export {router};