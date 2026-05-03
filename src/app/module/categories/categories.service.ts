import status from "http-status";
import { AppError } from "../../errors/AppError";
import { prisma } from "../../lib/prisma";
import { ICreateCategoryPayload, IUpdateCategoryPayload } from "./categories.types";

const createCategory = async (payload: ICreateCategoryPayload) => {
	const existingCategory = await prisma.category.findUnique({
		where: {
			name: payload.name,
		},
	});

	if (existingCategory) {
		throw new AppError(status.CONFLICT, "Category already exists");
	}

	const category = await prisma.category.create({
		data: payload,
	});

	return category;
};

const getCategories = async () => {
	const categories = await prisma.category.findMany({
		where: {
			isDeleted: false,
		},
		include: {
			_count: {
				select: {
					ideas: true,
				},
			},
		},
	});

	const chartData = categories
		.map((category) => ({
			name: category.name,
			value: category._count.ideas,
		}))
		.filter((category) => category.value > 0)
		.sort((x, y) => y.value - x.value);

	return { categories, chartData };
};

const updateCategory = async (categoryId: string, payload: IUpdateCategoryPayload) => {
	const category = await prisma.category.findUnique({
		where: {
			id: categoryId,
			isDeleted: false,
		},
	});

	if (!category) {
		throw new AppError(status.NOT_FOUND, "Category not found");
	}

	const updatedCategory = await prisma.category.update({
		where: {
			id: categoryId,
		},
		data: payload,
	});

	return updatedCategory;
};

const deleteCategory = async (categoryId: string) => {
	const category = await prisma.category.findUnique({
		where: {
			id: categoryId,
		},
	});

	if (!category) {
		throw new AppError(status.NOT_FOUND, "Category not found");
	}

	if (category.isDeleted) {
		throw new AppError(status.BAD_REQUEST, "Category already deleted");
	}

	const deletedCategory = await prisma.category.update({
		where: {
			id: categoryId,
		},
		data: {
			isDeleted: true,
			deletedAt: new Date(),
		},
	});

	return deletedCategory;
};

export const categoriesService = {
	createCategory,
	getCategories,
	updateCategory,
	deleteCategory,
};
