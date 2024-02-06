const { StatusCodes } = require("http-status-codes");
const { registerUser } = require("../services/user.service");

const userCtrl = {
  register: async (req, res) => {
    try {
      const data = req.body;
      if (!data) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "Invalid Data!" });
      } else {
        const response = await registerUser(data);
        return res.status(response.data.status).json(response.data);
      }
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error });
    }
  },
};

module.exports = userCtrl;
