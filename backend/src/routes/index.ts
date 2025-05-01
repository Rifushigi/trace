import express from 'express';

const router = express.Router();

//Router
import users from "./v1/user.js";
import auth from "./v1/auth.js";
import attendance from "./v1/attendance.js";
import classes from "./v1/class.js";
import notification from "./v1/notifications.js";

//Routes
router.use("/auth", auth);
router.use("/users", users);
router.use("/attendance", attendance);
router.use("/classes", classes);
router.use("/notification", notification);

export default router;