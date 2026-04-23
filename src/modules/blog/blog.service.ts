import { UploadService } from '../upload/upload.service';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (payload: IBlog) => {
  const result = await Blog.create(payload);
  return result;
};

const getAllBlogs = async () => {
  const result = await Blog.find()
    .populate('userId')
    .populate('categoryId', 'name'); 
  return result;
};

const getSingleBlog = async (id: string) => {
  return await Blog.findById(id)
    .populate('userId')
    .populate('categoryId');
};

const updateBlog = async (id: string, payload: Partial<IBlog>) => {
  const result = await Blog.findByIdAndUpdate(
    id, 
    payload, 
    { 
      new: true,
      runValidators: true 
    }
  );
  return result;
};

const deleteBlog = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);
  return result;
};


export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
};