import { Request, Response } from 'express';
import { MenuService } from './menu.service';






const createMenu = async (req: Request, res: Response) => {
  try {
    const result = await MenuService.createMenuIntoDB(req.body);
    res.status(200).json({ success: true, message: 'Menu created successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not create menu', error });
  }
};





const getAllMenus = async (req: Request, res: Response) => {
  try {
    const result = await MenuService.getAllMenusFromDB();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menus', error });
  }
};





const getSingleMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MenuService.getSingleMenuFromDB(id as string);
    if (!result) {
      return res.status(404).json({ success: false, message: 'Menu not found' });
    }
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch menu details', error });
  }
};





const updateMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await MenuService.updateMenuInDB(id as string, req.body);
    res.status(200).json({ success: true, message: 'Menu updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Update failed', error });
  }
};




const deleteMenu = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MenuService.deleteMenuFromDB(id as string);
    res.status(200).json({ success: true, message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed', error });
  }
};




export const MenuController = {
  createMenu,
  getAllMenus,
  getSingleMenu,
  updateMenu,
  deleteMenu,
};