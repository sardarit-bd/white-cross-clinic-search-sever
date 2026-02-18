import scheduleModel from "./schedule.model";

export const createNews = async (payload, userId) => {
  const { category, subcategory } = payload;

  const hasCategory = await scheduleModel.findById(category);
  if (!hasCategory) throw new AppError(httpStatus.BAD_REQUEST, "Category not found");

  const hasSubCategory = await scheduleModel.findById(subcategory);
  if (!hasSubCategory) throw new AppError(httpStatus.BAD_REQUEST, "Subcategory not found");

  const news = await scheduleModel.create({ ...payload, user: userId });
  return news;
};
