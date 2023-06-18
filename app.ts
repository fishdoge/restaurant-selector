import express from "express";
import prisma from "./index"; // importing the prisma instance we created
import { Request, Response } from "express";

const app = express();
app.use(express.json());

interface RestaurantData {
  name: string;
  mapUrl: string;
  notes?: string;
}

interface RestaurantFilter {
  id?: string;
  name?: string;
}

const PORT = process.env.PORT || 3000;

const validateIsExist = async (filter: RestaurantFilter): Promise<boolean> => {
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
app.get("/restaurants", async (req: Request, res: Response) => {
  const allRestaurants = await prisma.restaurant.findMany();
  res.status(200).json({ data: allRestaurants });
});

// Get the detail of a restaurant, return 404 if not found
app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const specificRes = await prisma.restaurant.findUnique({
    where: {
      id,
    },
  });
  if (!specificRes) {
    return res.status(404).json();
  }
  res.status(200).json({ data: specificRes });
});

//** Create a new restaurant
// 1. If the restaurant name already exists, return 409 conflicts
// 2. If the given information did not pass the validation, return 400 bad requests
app.post("/restaurants", async (req: Request, res: Response) => {
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
    return res.status(201).json({ data: newRestaurant });
  } else {
    return res.status(409).json();
  }
});

//** Update a detail of a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. If the given information did not pass the validation, return 400 bad requests
app.put("/restaurants/:id", async (req: Request, res: Response) => {
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
    res.status(200).json({ data: updatedRestaurant });
  } else {
    return res.status(404).json();
  }
});

//** Delete a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. Return 204 no content, if successfully deleted a restaurant record
app.delete("/restaurants/:id", async (req: Request, res: Response) => {
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

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
