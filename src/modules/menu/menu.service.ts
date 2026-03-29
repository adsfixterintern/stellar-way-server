import { UploadService } from '../upload/upload.service';
import { IMenu } from './menu.interface';
import { Menu } from './menu.model';

const createMenuIntoDB = async (payload: IMenu) => {
  const result = await Menu.create(payload);
  return result;
};

const getAllMenusFromDB = async (query: Record<string, unknown>) => {
  const { searchTerm, category, page, limit } = query;

  // Search Logic
  let searchTermQuery = {};
  if (searchTerm) {
    searchTermQuery = {
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { subTitle: { $regex: searchTerm, $options: 'i' } },
      ],
    };
  }

  // Filter by Category
  const filterQuery = category ? { categoryId: category } : {};

  // Pagination
  const currentPage = Number(page) || 1;
  const currentLimit = Number(limit) || 10;
  const skip = (currentPage - 1) * currentLimit;

  const result = await Menu.find({ ...searchTermQuery, ...filterQuery })
    .populate('chefId')
    .populate('categoryId')
    .sort({ sortOrder: 1 })
    .skip(skip)
    .limit(currentLimit);

  const total = await Menu.countDocuments({ ...searchTermQuery, ...filterQuery });

  return {
    meta: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPage: Math.ceil(total / currentLimit),
    },
    data: result,
  };
};


const getSingleMenuFromDB = async (id: string) => {
  const result = await Menu.findById(id).populate('chefId').populate('categoryId');
  if (!result) {
    throw new Error('Menu item not found!');
  }
  return result;
};


const updateMenuInDB = async (id: string, payload: any) => {
  let updateQuery = {};

  if (payload.rating || payload.review) {
    updateQuery = {
      $push: {
        reviews: {
          rating: Number(payload.rating),
          comment: payload.review,
          userId: payload.userId, 
        },
      },
    };
  } else {
   
    updateQuery = { $set: payload };
  }

  const result = await Menu.findByIdAndUpdate(
    id,
    updateQuery, 
    {
      new: true,
      runValidators: true,
    }
  );

  return result;
};

const deleteMenuFromDB = async (id: string) => {
  const result = await Menu.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Menu item not found to delete!');
  }

  if (result.image?.publicId) {
    await UploadService.deleteImageFromCloudinary(result.image.publicId);
  }
  return result;
};

const getLowStockMenusFromDB = async () => {
  // $lt: 5 মানে stock ৫ এর নিচে হতে হবে
  const result = await Menu.find({ stock: { $lt: 5 } })
    .populate('categoryId')
    .sort({ stock: 1 }); // সবচেয়ে কমগুলো আগে দেখাবে
    
  return result;
};

export const MenuService = {
  createMenuIntoDB,
  getAllMenusFromDB,
  getSingleMenuFromDB,
  updateMenuInDB,
  deleteMenuFromDB,
  getLowStockMenusFromDB
};

