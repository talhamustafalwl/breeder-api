const express = require("express");
const router = express.Router();
const SearchController = require("../controller/search.controller");

const {
  auth,
  allowAdmin,
  allowBreeder,
  authenticateRole,
  allowEmployee,
} = require("../middleware/auth");

router.get(
  "/:name",
  auth,
  allowAdmin,
  allowBreeder,
  allowEmployee,
  authenticateRole,
  SearchController.globalSearch
);

module.exports = router;
