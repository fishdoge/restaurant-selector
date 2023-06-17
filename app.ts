import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

app.get("/restaurants", async (req, res) => {
  const restaurants = await prisma.restaurant.findMany();
  res.status(200).json({ data: restaurants });
});

app.get("/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
    select: { name: true, mapUrl: true },
  });

  res.status(200).json({ data: restaurant });
});

app.post("/restaurants", async (req, res) => {
  const { name, mapUrl } = req.body;
  const restaurant = await prisma.restaurant.create({
    data: { name, mapUrl },
  });
  res.status(201).json({ data: restaurant });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
