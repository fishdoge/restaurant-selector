import express from "express";
import prisma from "./index"; // importing the prisma instance we created.

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/restaurants", async (req, res) => {
	const allRestaurants = await prisma.restaurant.findMany();
	res.json(allRestaurants);
});

app.post("/restaurants", async (req, res) => {
	const { name, mapUrl } = req.body;
	const newRestaurant = await prisma.restaurant.create({
		data: {
			name,
			mapUrl,
		},
	});
	if (!newRestaurant) {
		return res.status(400).json({ message: "Could not create restaurant." });
	}
	res.status(200).json(newRestaurant);
});

app.get("/restaurants/:id", async (req, res) => {
	const { id } = req.params;
	const specificRes = await prisma.restaurant.findUnique({
		where: {
			id: id,
		},
	});
	res.json(specificRes);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
