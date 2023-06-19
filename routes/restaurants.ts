import express from "express";
import prisma from "../index";
import { Prisma, Restaurant } from "@prisma/client";
export const router = express.Router();

interface RestaurantData {
  name: string;
  mapUrl: string;
  notes?: string;
}

class RestaurantDTO {
  public readonly id: string;
  public readonly createdAt: string;
  public readonly name: string;
  public readonly mapUrl: string;
  public readonly notes?: string | null;

  constructor(entity: Restaurant) {
    this.id = entity.id;
    this.createdAt = entity.createdAt.toISOString();
    this.name = entity.name;
    this.mapUrl = entity.mapUrl;
    this.notes = entity.notes;
  }
}

const validateIsExist = async (filter: Prisma.RestaurantWhereUniqueInput): Promise<boolean> => {
  const result = await prisma.restaurant.findUnique({ where: filter });
  return result ? true : false;
};

const validateParams = (params: any): params is RestaurantData => {
  return (
    typeof params.name === "string" &&
    typeof params.mapUrl === "string" &&
    (typeof params.notes === "string" || typeof params.notes === "undefined")
  );
};

//** Get the list of restaurants, return empty array if no data
router.get("/", async (req, res) => {
  const allRestaurants = await prisma.restaurant.findMany();
  const dtos = allRestaurants.map((restaurant) => new RestaurantDTO(restaurant));

  res.status(200).json({ data: dtos });
});

router.get("/random", async (req, res) => {
  const count = await prisma.restaurant.count();
  const rand = Math.random() * count;
  const result = await prisma.restaurant.findMany({
    skip: Math.floor(rand),
    take: 1,
  });
  const dto = new RestaurantDTO(result[0]);

  res.status(200).json({ data: dto });
});

// Get the detail of a restaurant, return 404 if not found
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const specificRes = await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });
  if (!specificRes) {
    return res.status(404).json();
  }

  const dto = new RestaurantDTO(specificRes);
  res.status(200).json({ data: dto });
});

//** Create a new restaurant
// 1. If the restaurant name already exists, return 409 conflicts
// 2. If the given information did not pass the validation, return 400 bad requests
router.post("/", async (req, res) => {
  const { name, mapUrl, notes } = req.body;

  if (!validateParams(req.body)) {
    return res.status(400).json();
  }

  const isNameExist = await validateIsExist({ name });

  if (!isNameExist) {
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        mapUrl,
        notes,
      },
    });
    const data = new RestaurantDTO(newRestaurant);
    return res.status(201).json({ data });
  } else {
    return res.status(409).json();
  }
});

//** Delete a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. Return 204 no content, if successfully deleted a restaurant record
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const isIdExist = await validateIsExist({ id });

  if (isIdExist) {
    await prisma.restaurant.delete({
      where: {
        id,
      },
    });
    return res.status(204).json();
  } else {
    return res.status(404).json();
  }
});

//** Update a detail of a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. If the given information did not pass the validation, return 400 bad requests
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, mapUrl, notes } = req.body;

  const isNameExist = await validateIsExist({ name });
  if (!validateParams(req.body) || isNameExist) {
    return res.status(400).json();
  }

  const isIdExist = await validateIsExist({ id });
  if (isIdExist) {
    const updatedRestaurant = await prisma.restaurant.update({
      where: {
        id,
      },
      data: {
        name,
        mapUrl,
        notes,
      },
    });

    const data = new RestaurantDTO(updatedRestaurant);
    res.status(200).json({ data });
  } else {
    return res.status(404).json();
  }
});
