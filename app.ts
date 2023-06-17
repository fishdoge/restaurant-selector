import express from "express";
import prisma from "./index"; // importing the prisma instance we created
import { Request, Response } from "express";

const app = express();
app.use(express.json());

interface restaurantData {
	name: string;
	mapUrl: string;
}

const PORT = process.env.PORT || 3000;

//** Get the list of restaurants, return empty array if no data
app.get("/restaurants", async (req, res) => {
	const allRestaurants = await prisma.restaurant.findMany();
	res.status(200).json(allRestaurants);
});

// Get the detail of a restaurant, return 404 if not found
app.get("/restaurants/:id", async (req, res) => {
	const { id } = req.params;
	const specificRes = await prisma.restaurant.findUnique({
		where: {
			id: id,
		},
	});
	if (!specificRes) {
		return res.status(404).json({ message: "Could not find restaurant." });
	}
	res.status(200).json(specificRes);
});

//** Create a new restaurant
// 1. If the restaurant name already exists, return 409 conflicts
// 2. If the given information did not pass the validation, return 400 bad requests
app.post("/restaurants", async (req: Request, res: Response) => {
	const { name, mapUrl } = req.body as { name: string; mapUrl: string };

	if (typeof name !== "string" || typeof mapUrl !== "string") {
		return res.status(400).json({ message: "Could not update restaurant" });
	}

	if (await prisma.restaurant.findUnique({ where: { name } })) {
		return res.status(409).json({ message: "Restaurant already exists" });
	}

	const newRestaurant = await prisma.restaurant.create({
		data: {
			name,
			mapUrl,
		},
	});

	if (!newRestaurant) {
		return res.status(400).json({ message: "Could not create restaurant." });
	}

	res.status(201).json(newRestaurant);
});

//** Update a detail of a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. If the given information did not pass the validation, return 400 bad requests
app.put("/restaurants/:id", async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };
	const { name, mapUrl } = req.body as { name: string; mapUrl: string };

	if (typeof name !== "string" || typeof mapUrl !== "string") {
		return res.status(400).json({ message: "Could not update restaurant" });
	}

	const updatedRestaurant = await prisma.restaurant.update({
		where: {
			id: id,
		},
		data: {
			name,
			mapUrl,
		},
	});

	if (!updatedRestaurant) {
		return res.status(404).json({ message: "Could not find restaurant" });
	}

	res.status(200).json(updatedRestaurant);
});

//** Delete a restaurant
//# 1. If restaurant ID did not exist or invalid, return 404 not found
//# 2. Return 204 no content, if successfully deleted a restaurant record
app.delete("/restaurants/:id", async (req: Request, res: Response) => {
	const { id } = req.params as { id: string };
	if (!id) {
		return res.status(404).json({ message: "Could not find restaurant" });
	}
	res.status(204).json(
		await prisma.restaurant.delete({
			where: {
				id: id,
			},
		})
	);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
