const { StatusCodes } = require("http-status-codes");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt");

const userService = {
  registerUser: async (data) => {
    try {
      const userNameRegex = /^[a-zA-Z0-9_.-]{5,20}$/;
      const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$|^".+"$/;
      const passRegex =
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#$%^&*()_+{};':",./<>?|`~])[A-Za-z0-9!@#$%^&*()_+{};':",./<>?|`~]{8,}$/;
      const { username, name, email, password } = data;
      if (!username || !name || !email || !password) {
        return {
          data: { msg: "Please fill required fields!" },
          status: StatusCodes.BAD_REQUEST,
        };
      } else if (!userNameRegex.test(username)) {
        return {
          data: { msg: "Invalid username" },
          status: StatusCodes.BAD_REQUEST,
        };
      } else if (!emailRegex.test(email)) {
        return {
          data: { msg: "Invalid email" },
          status: StatusCodes.BAD_REQUEST,
        };
      } else if (password.length < 8) {
        return {
          data: { msg: "Password must be 8 characters long!" },
          status: StatusCodes.BAD_REQUEST,
        };
      } else if (!passRegex.test(password)) {
        return {
          data: {
            msg: "Password must contain at least 1 uppercase, 1 lowercase and 1 special character",
          },
          status: StatusCodes.BAD_REQUEST,
        };
      } else {
        const findUserByEmail = await User.findOne({ email: email });
        const findUserByUsername = await User.findOne({ username: username });
        if (findUserByEmail) {
          return {
            data: {
              msg: "Email already exist!",
              status: StatusCodes.CONFLICT,
            },
          };
        } else if (findUserByUsername) {
          return {
            data: {
              msg: "Username already exist!",
              status: StatusCodes.CONFLICT,
            },
          };
        } else {
          const hashedPassword = await bcrypt.hash(password, 12);
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            username,
          });
          await newUser.save();
          return {
            data: {
              msg: "User registered successfully",
              status: StatusCodes.OK,
            },
          };
        }
      }
    } catch (error) {
      return {
        data: {
          msg: error,
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        },
      };
    }
  },
};

module.exports = userService;
