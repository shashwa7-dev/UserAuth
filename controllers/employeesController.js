const updateEmployeeDB = require("../middlewares/updateEmployeeDB");
const data = {
  employees: require("../model/employees.json"),
  //   setEmployees: (data) => {
  //     this.employees = data;
  //   },
};

const { v4: uuid } = require("uuid");

const getAllEmployees = (req, res) => {
  console.log("requested by", req.user);
  res.json(data.employees);
};

const createEmployee = (req, res) => {
  const { firstname, lastname, email } = req.body;
  let new_emp = {
    id: uuid(),
    firstname,
    lastname,
    email,
  };
  //add new user to employees []
  if (!data.employees.find((emp) => emp.email === email)) {
    updateEmployeeDB([...data.employees, new_emp])
      .then(() => {
        console.log("Employee database updated successfully.");
        res.status(201).json({ userCreated: true, user: new_emp });
      })
      .catch((err) => {
        console.error("Failed to update employee database:", err);
        res.status(400).json({ userCreated: false });
      });
  } else {
    res
      .status(400)
      .json({ userCreated: false, err: "user already exist with the email!" });
  }
};

const updateEmployee = (req, res) => {
  const { email } = req.headers;
  const { firstname, lastname } = req.body;
  const employees = [...data.employees];
  const emp_data = employees.find((emp) => emp?.email === email);
  if (emp_data) {
    //add new user to employees []
    emp_data.firstname = firstname;
    emp_data.lastname = lastname;

    updateEmployeeDB([...employees])
      .then(() => {
        console.log("Employee database updated successfully.");
        res.status(200).json({ userUpdated: true, user: emp_data });
      })
      .catch((err) => {
        console.error("Failed to update employee database:", err);
        res
          .status(400)
          .json({ userUpdated: false, err: "Error updating user data!" });
      });
  } else {
    res.status(400).json({ userUpdated: false, err: "User not found!" });
  }
};

const deleteEmployee = (req, res) => {
  const { email } = req.headers;
  const employees = [...data.employees];
  const emp_data = employees.find((emp) => emp?.email === email);
  if (emp_data) {
    console.log(
      "emp delete",
      employees.filter((emp) => emp.email !== emp_data.email)
    );
    updateEmployeeDB(employees.filter((emp) => emp.email !== emp_data.email))
      .then(() => {
        console.log("Employee database updated successfully.");
        return res.status(200).json({ userDeleted: true, user: emp_data });
      })
      .catch((err) => {
        console.error("Failed to update employee database:", err);
        res
          .status(400)
          .json({ userDeleted: false, err: "Error deleting user data!" });
      });
  } else {
    res.status(400).json({ userDeleted: false, err: "User nor found!" });
  }
};

const getEmployee = (req, res) => {
  const { email } = req.params;
  const emp_data = data.employees.find((emp) => emp.email === email);
  console.log("emp data", emp_data);
  if (emp_data) {
    res.json({ user: emp_data });
  } else {
    res.status(404).json({ user: null, err: "user not found!" });
  }
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
