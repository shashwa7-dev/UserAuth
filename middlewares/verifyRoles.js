const verifyRoles = (...alowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    const rolesArray = [...alowedRoles];
    console.log("allowed roles", rolesArray);
    console.log("req roles", req.roles);
    //checking if the requested roles is a valid match
    //so the mapped role should have atleast one 'true' val to ensure the req user is a valid user otherwise they are unauthorized
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result) return res.sendStatus(401); //unauthorized
    next();
  };
};

module.exports = verifyRoles;
