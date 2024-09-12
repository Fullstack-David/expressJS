export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be at least 5-32 characters.",
    },
    notEmpty: {
      errorMessage: "Username must not be empty",
    },
    isString: {
      errorMessage: "Username must be string.",
    },
  },
  displayname: {
    notEmpty: {
      errorMessage: "Displayname must not be empty",
    },
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage: "Username must be at least 5-32 characters.",
    },
  },
  password: {
    isLength: {
      options: {
        min: 8,
        max: 32,
      },
      errorMessage: "Password must be at least 8 - 32 characters.",
    },
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
  },
};

export default createUserValidationSchema;
