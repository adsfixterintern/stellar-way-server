import { IMenu } from './menu.interface';
import { Menu } from './menu.model';

const createMenuIntoDB = async (payload: IMenu) => {
  const result = await Menu.create(payload);
  return result;
};

const getAllMenusFromDB = async () => {
  const result = await Menu.find().populate('chefId').populate('categoryId');
  return result;
};


const getSingleMenuFromDB = async (id: string) => {
  const result = await Menu.findById(id).populate('chefId').populate('categoryId');
  return result;
};

const updateMenuInDB = async (id: string, payload: Partial<IMenu>) => {
  const result = await Menu.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteMenuFromDB = async (id: string) => {
  const result = await Menu.findByIdAndDelete(id);
  return result;
};

export const MenuService = {
  createMenuIntoDB,
  getAllMenusFromDB,
  getSingleMenuFromDB,
  updateMenuInDB,
  deleteMenuFromDB,
};