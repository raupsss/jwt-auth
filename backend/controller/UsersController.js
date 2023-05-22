import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  // run getUsers
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'email']
    }); //query
    return res.json(users);
  } catch (error) {
    console.log(error);
  }
};

export const Register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    //validate if email already exist
    const isExistEmail = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (isExistEmail) return res.status(400).json({ msg: "Email is Already Exist !" });

    //validate password and confirm password
    if (password !== confirmPassword) return res.status(400).json({ msg: "Password and Confirm Password doesn't match" });

    // hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    //run Register
    await Users.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    return res.json({ msg: "Register Success" });
  }
  catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.email
      }
    });

    //validate password
    const match = await bcrypt.compare(req.body.password, user[0].password)
    if (!match) return res.status(400).json({ msg: "Wrong Password" });

    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '20s' }
    );

    const refreshToken = jwt.sign(
      { userId, name, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' });

    //update refresh_token to db
    await Users.update({ refresh_token: refreshToken }, {
      where: {
        id: userId
      }
    });

    //create http only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.json({ msg: `Login Success, Welcome ${name}`, accessToken });
  } catch (error) {
    res.status(404).json({ msg: `Email not found` });
  }
}

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken
    }
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  const name = user[0].name;
  await Users.update({ refresh_token: null }, {
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.json({
    mgs: `Logout Success, Good bye ${name}`
  })
}