import { Request, Response } from 'express';
import catchAsync from '../../app/utils/catchAsync';
import sendResponse from '../../app/utils/sendResponse';
import { BlogService } from './blog.service';
import { UploadService } from '../upload/upload.service';


const createBlog = catchAsync(async (req: Request, res: Response) => {
  let blogData;

  try {
    blogData =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
  } catch {
    throw new Error("Invalid JSON format in data field");
  }

  const files = req.files as {
    thumbnail?: Express.Multer.File[];
    sectionImages?: Express.Multer.File[];
  };

  // thumbnail upload
  if (files?.thumbnail?.length) {
    const uploadResult = UploadService.processSingleFile(files.thumbnail[0]);

    if (uploadResult) {
      blogData.thumbnail = uploadResult.url;
    }
  }

  // section images upload
  if (files?.sectionImages && blogData.contentSections) {
    files.sectionImages.forEach((file, index) => {
      const uploadResult = UploadService.processSingleFile(file);

      if (uploadResult && blogData.contentSections[index]) {
        blogData.contentSections[index].image = uploadResult.url;
      }
    });
  }

  const result = await BlogService.createBlog(blogData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created successfully",
    data: result,
  });
});



const getAllBlogs = catchAsync(async (req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blogs fetched successfully',
    data: result,
  });
});


const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await BlogService.getSingleBlog(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog fetched successfully',
    data: result,
  });
});


const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  let blogData;

  try {
    blogData =
      typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body;
  } catch {
    throw new Error("Invalid JSON format in data field");
  }

  const files = req.files as {
    thumbnail?: Express.Multer.File[];
    sectionImages?: Express.Multer.File[];
  };

  // thumbnail update
  if (files?.thumbnail?.length) {
    const uploadResult = UploadService.processSingleFile(files.thumbnail[0]);

    if (uploadResult) {
      blogData.thumbnail = uploadResult.url;
    }
  }

  // section images update
  if (files?.sectionImages && blogData.contentSections) {
    files.sectionImages.forEach((file, index) => {
      const uploadResult = UploadService.processSingleFile(file);

      if (uploadResult && blogData.contentSections[index]) {
        blogData.contentSections[index].image = uploadResult.url;
      }
    });
  }

  const result = await BlogService.updateBlog(id as string, blogData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Blog updated successfully",
    data: result,
  });
});



const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await BlogService.deleteBlog(id as string);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Blog deleted successfully',
    data: null, 
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
};