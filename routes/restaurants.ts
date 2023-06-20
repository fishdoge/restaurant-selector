import express, { Request, Response } from "express";
import prisma from "../index";
import { Restaurant } from "@prisma/client";
import {
  validateNameExist,
  validateIdExist,
  restaurantsParamsValidator,
  restaurantIdValidator,
  validator,
} from "../validator";

export const router = express.Router();

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
router.get("/:id", restaurantIdValidator(), validator, validateIdExist, async (req: Request, res: Response) => {
  const { id } = req.params;

  const specificRes = await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });

  const dto = new RestaurantDTO(specificRes as Restaurant);
  res.status(200).json({ data: dto });
});

//** Create a new restaurant
// 1. If the restaurant name already exists, return 409 conflicts
// 2. If the given information did not pass the validation, return 400 bad requests
router.post("/", restaurantsParamsValidator(), validator, validateNameExist, async (req: Request, res: Response) => {
  const { name, mapUrl, notes } = req.body;

  const newRestaurant = await prisma.restaurant.create({
    data: {
      name,
      mapUrl,
      notes,
    },
  });
  const data = new RestaurantDTO(newRestaurant);
  return res.status(201).json({ data });
});

//** Delete a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. Return 204 no content, if successfully deleted a restaurant record
router.delete("/:id", restaurantIdValidator(), validator, validateIdExist, async (req: Request, res: Response) => {
  const { id } = req.params;

  await prisma.restaurant.delete({
    where: {
      id,
    },
  });
  return res.status(204).json();
});

//** Update a detail of a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. If the given information did not pass the validation, return 400 bad requests
router.put(
  "/:id",
  restaurantsParamsValidator(),
  restaurantIdValidator(),
  validator,
  validateIdExist,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, mapUrl, notes } = req.body;

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
  },
);
