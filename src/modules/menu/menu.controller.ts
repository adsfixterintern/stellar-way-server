import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { MenuService } from './menu.service';
import { UploadService } from '../upload/upload.service';

const createMenu = catchAsync(async (req: Request, res: Response) => {

  if (req.file) {
    const uploadResult = UploadService.processSingleFile(req.file as Express.Multer.File);
    if (uploadResult) {
      req.body.image = uploadResult; 
    }
  }
  const result = await MenuService.createMenuIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Menu created successfully',
    data: result,
  });
});

const getAllMenus = catchAsync(async (req: Request, res: Response) => {
  
 const result = await MenuService.getAllMenusFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menus fetched successfully',
    data: result.data,
    meta: result.meta, 
  });
});

const getSingleMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await MenuService.getSingleMenuFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu details fetched successfully',
    data: result,
  });
});

const updateMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (req.file) {
    const uploadResult = UploadService.processSingleFile(req.file as Express.Multer.File);
    if (uploadResult) req.body.image = uploadResult;
  }
  
  const result = await MenuService.updateMenuInDB(id as string, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu updated successfully',
    data: result,
  });
});

const deleteMenu = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await MenuService.deleteMenuFromDB(id as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Menu deleted successfully',
    data: null,
  });
});

export const MenuController = {
  createMenu,
  getAllMenus,
  getSingleMenu,
  updateMenu,
  deleteMenu,
};