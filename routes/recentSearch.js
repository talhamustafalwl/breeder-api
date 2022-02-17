const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { adminauth } = require("../middleware/adminauth");
const RecentController = require("../controller/recent.controller");

// const {upload}=require("../middleware/multerimage")

router
  .route("/")
  .post(auth, RecentController.createRecentSearch)
  .get(auth, RecentController.getRecentSearch);

//for see/delete/update recent search by id
router.route("/:id").delete(auth, RecentController.deleteSearchbyId);
// .get(auth, RecentController.getRecentSearch);
router.route("/delete/all").delete(auth, RecentController.deleteall);
module.exports = router;
