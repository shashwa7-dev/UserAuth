const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const ROLES_LIST = require("../../config/roles");
const verifyRoles = require("../../middlewares/verifyRoles");

//AUTHORIZATION Middleware implementation
//1- every one can access the 'getAllEmployees'
//2- only admin and editor can update and create user
//3- only admin can delete user
router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR),
    employeesController.createEmployee
  )
  .put(
    verifyRoles(ROLES_LIST.ADMIN, ROLES_LIST.EDITOR),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.ADMIN), employeesController.deleteEmployee);

router.route("/:email").get(employeesController.getEmployee);

module.exports = router;
