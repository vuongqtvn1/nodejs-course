import * as yup from 'yup'

export const registerSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Email is not correct format')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: 'Email is not correct format' }
    )
    .required('Email is required'),
  password: yup.string().required('Password is required'),
})

export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Email is not correct format')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      { message: 'Email is not correct format' }
    )
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Min 6 character'),
})
