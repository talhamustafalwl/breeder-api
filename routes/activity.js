const express = require("express");
const contactController = require("../controller/activity.controller");
const router = express.Router();
const {
  auth,
  allowAdmin,
  allowBreeder,
  authenticateRole,
  allowEmployee,
} = require("../middleware/auth");
const { autoCharge } = require("../middleware/autoCharge");

router
  .post(
    "/",
    auth,
    allowAdmin,
    allowBreeder,
    allowEmployee,
    autoCharge,
    authenticateRole,
    contactController.create
  )
  .post(
    "/create",
    auth,
    allowAdmin,
    allowBreeder,
    allowEmployee,
    autoCharge,
    authenticateRole,
    contactController.createActivity
  )
  .get("/", auth, contactController.getall)
  .get(
    "/getActivityData",
    auth,
    allowAdmin,
    allowBreeder,
    authenticateRole,
    contactController.getActivityData
  )
  .get(
    "/getActivityByCategory",
    auth,
    allowAdmin,
    allowBreeder,
    authenticateRole,
    contactController.getActivityByCategory
  )
  .get(
    "/getScheduleData",
    auth,
    allowAdmin,
    allowBreeder,
    authenticateRole,
    contactController.getScheduleData
  )

  .get("/group", auth, contactController.getallByType)
  .get("/:id", auth, contactController.getbyId)
  .put("/:id", auth, contactController.updatebyId)
  .put("/v2/:id", auth, contactController.activityUpdatebyId)
  .delete("/:id", auth, contactController.deletebyId);

module.exports = router;
