//use this incase just testing on thunderclient or postman
const DEV = {
  httpOnly: true,
  sameSite: "None",
  secure: true,
};

//PROD also required while testing it on DEV FE
const PROD = {
  httpOnly: true,
  sameSite: "None", //to allow crossite Cookie sharing (otherwise throws warning, defaul Val sameSite="Lax")
  secure: true, //also set secure to true otherwise will throw error
};

const cookieOptions = {
  DEV,
  PROD,
};
module.exports = cookieOptions;
