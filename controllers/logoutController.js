const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const cookieOptions = require("../config/cookieOptions");
const fsPormises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  //S1: Is Refresh token received from cookies?
  //S1-A: Cookie not found, nothing to clear hence return 204
  if (!cookies?.jwt) return res.sendStatus(204); //Success but NO content

  //S1-B: refresh token recieved from the cookie!
  const refreshToken = cookies.jwt;

  //S2: Is Refresh token in db?
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  //S2-A: token not found in DB but was received as cookie, hence clear the received cookie
  if (!foundUser) {
    res.clearCookie("jwt", cookieOptions.DEV);
    return res.sendStatus(204);
  }
  //S2-B: token found in DB, delete it from DB for the found user
  const otherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  //... removing refresh token for the found user and pushing back to DB
  const currentUser = { ...foundUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);
  //update DB
  await fsPormises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  //also delete the cookie
  res.clearCookie("jwt", cookieOptions.DEV);
  res.sendStatus(204); //successfully logged out and all found tokens cleared (the cookie one and the DB one)
};
module.exports = { handleLogout };
