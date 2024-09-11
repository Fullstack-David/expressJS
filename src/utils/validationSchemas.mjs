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
};

export default createUserValidationSchema;
