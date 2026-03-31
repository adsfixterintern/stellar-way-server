import { Schema, model } from 'mongoose';
import { IBlog, IBlogSection } from './blog.interface';

const sectionSchema = new Schema<IBlogSection>({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String }
});

const blogSchema = new Schema<IBlog>({
  thumbnail: { type: String, required: true },
  blogTitle: { type: String, required: true },
  blogSubtitle: { type: String, required: true },
  contentSections: [sectionSchema], 
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  categoryId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['draft', 'published'], 
    default: 'draft' 
  },
  publishDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Blog = model<IBlog>('Blog', blogSchema);