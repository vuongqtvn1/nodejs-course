import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().required("name is required"),
  email: yup
    .string()
    .email()
    .trim()
    .lowercase()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: "Email is not correct format" }
    )
    .required("email is required"),
  password: yup.string().required("password is required"),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email()
    .trim()
    .lowercase()
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: "Email is not correct format" }
    )
    .required("email is required"),
  password: yup.string().required("password is required"),
});
