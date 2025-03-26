import { NextFunction, Request, Response } from "express";
import { AnySchema } from "yup";
import { formatErrorYup } from "~/utils/helper";
import { HttpResponse } from "~/utils/http-response";

export const validate = (schema: AnySchema) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      request.body = await schema.validate(request.body, {
        abortEarly: false,
        stripUnknown: true,
      });

      next();
    } catch (errorYup) {
      const errors = formatErrorYup(errorYup);
      next(HttpResponse.error({ message: "Dữ liệu không hợp lệ", errors }));
    }
  };
};
