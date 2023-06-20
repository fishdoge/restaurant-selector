import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "./index";
import { body, param, validationResult } from "express-validator";

const validateIsExist = async (filter: Prisma.RestaurantWhereUniqueInput) => {
  const result = await prisma.restaurant.findUnique({ where: filter });
  return result ? true : false;
};

export const validateNameExist = async (req: Request, res: Response, next: NextFunction) => {
  const isNameExist = await validateIsExist({ name: req.body.name });
  if (isNameExist) {
    return res.status(409).json();
  }
  next();
};

export const validateIdExist = async (req: Request, res: Response, next: NextFunction) => {
  const isIdExist = await validateIsExist({ id: req.params.id });
  if (!isIdExist) {
    return res.status(404).json();
  }
  next();
};

export const restaurantsParamsValidator = () => [
  body("name").isString().notEmpty(),
  body("mapUrl")
    .isString()
    .isURL({ protocols: ["http", "https"] }),
  body("notes").isString(),
];

export const restaurantIdValidator = () => [param("id").isString().isUUID()];

//Custom middleware
export const validator = (req: Request, res: Response, next: NextFunction) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return res.status(400).json();
  }

  next();
};
