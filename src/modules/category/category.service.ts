
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryIntoDB = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const filter: any = {};
  
  if (query.status) {
    filter.status = query.status;
  }
  
  const result = await Category.find(filter).sort({ sortOrder: 1 });
  return result;
};

const updateCategoryInDB = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, { 
    new: true,
    runValidators: true 
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryInDB,
  deleteCategoryFromDB,
};