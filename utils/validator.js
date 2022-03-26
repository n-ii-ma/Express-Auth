const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name Cannot be Empty")
    .bail()
    .isLength({ max: 255 })
    .withMessage("Name Must be Less than 255 Characters Long")
    .bail()
    .trim()
    .escape(),
  body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email Cannot be Empty")
    .bail()
    .isEmail()
    .withMessage("Email Must be a Valid Email")
    .bail()
    .isLength({ min: 5, max: 255 })
    .withMessage("Email Must be Between 5 to 255 Characters Long")
    .bail()
    .normalizeEmail()
    .trim()
    .escape(),
  body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username Cannot be Empty")
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage("Username Must be Between 8 to 255 Characters Long")
    .bail()
    .isAlphanumeric()
    .withMessage(
      "Username Must be Alphanumeric with No Space Between Characters"
    )
    .bail()
    .trim()
    .escape(),
  body("password")
    .exists({ checkFalsy: true })
    .withMessage("Password Cannot be Empty")
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage("Password Must be Between 8 to 255 Characters Long")
    .bail()
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,255}$/)
    .withMessage(
      "Password Must Contain at least One Number, One Lowercase, and One Uppercase Character"
    )
    .bail()
    .trim()
    .escape(),
];

module.exports = registerValidation;
