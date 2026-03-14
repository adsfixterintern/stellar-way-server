import { UploadService } from '../upload/upload.service';
import { IBlog } from './blog.interface';
import { Blog } from './blog.model';

const createBlog = async (payload: IBlog) => {
  const result = await Blog.create(payload);
  return result;
};

const getAllBlogs = async () => {
  const result = await Blog.find()
    .populate({
      path: 'userId',
      select: 'name image' 
    })
    .populate('categoryId', 'name'); 
  return result;
};

const getSingleBlog = async (id: string) => {
  return await Blog.findById(id)
    .populate('userId', 'name image')
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
  const blog = await Blog.findById(id);
  
  if (blog) {
    if (blog.thumbnail) {
      await UploadService.deleteImageFromCloudinary(blog.thumbnail);
    }

    if (blog.contentSections && blog.contentSections.length > 0) {
      for (const section of blog.contentSections) {
        if (section.image) {
          await UploadService.deleteImageFromCloudinary(section.image);
        }
      }
    }
  }

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