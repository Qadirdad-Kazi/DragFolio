import mongoose, { Schema, Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio interface
export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
    title: string;
    content: any;
    order: number;
    layout: 'full' | 'half' | 'two-columns';
    settings?: Record<string, any>;
  }>;
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
  isPublished: boolean;
  subdomain?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Template interface
export interface ITemplate extends Document {
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  sections: Array<{
    id: string;
    type: 'about' | 'projects' | 'skills' | 'resume' | 'testimonials' | 'blog' | 'contact';
    title: string;
    content: any;
    order: number;
    layout: 'full' | 'half' | 'two-columns';
    settings?: Record<string, any>;
  }>;
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    fontSize: string;
  };
  isFeatured: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// User Schema
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  avatar: { type: String },
  socialLinks: {
    github: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    website: { type: String }
  },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date }
}, { timestamps: true });

// Portfolio Schema
const PortfolioSchema = new Schema<IPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  sections: [{
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['about', 'projects', 'skills', 'resume', 'testimonials', 'blog', 'contact'] },
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    order: { type: Number, required: true },
    layout: { type: String, required: true, enum: ['full', 'half', 'two-columns'] },
    settings: { type: Schema.Types.Mixed }
  }],
  theme: {
    mode: { type: String, required: true, enum: ['light', 'dark'] },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    fontFamily: { type: String, required: true },
    fontSize: { type: String, required: true }
  },
  isPublished: { type: Boolean, default: false },
  subdomain: { type: String, unique: true, sparse: true }
}, { timestamps: true });

// Template Schema
const TemplateSchema = new Schema<ITemplate>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  sections: [{
    id: { type: String, required: true },
    type: { type: String, required: true, enum: ['about', 'projects', 'skills', 'resume', 'testimonials', 'blog', 'contact'] },
    title: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    order: { type: Number, required: true },
    layout: { type: String, required: true, enum: ['full', 'half', 'two-columns'] },
    settings: { type: Schema.Types.Mixed }
  }],
  theme: {
    mode: { type: String, required: true, enum: ['light', 'dark'] },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    fontFamily: { type: String, required: true },
    fontSize: { type: String, required: true }
  },
  isFeatured: { type: Boolean, default: false },
  isPublic: { type: Boolean, default: true }
}, { timestamps: true });

// Create models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
export const Template = mongoose.model<ITemplate>('Template', TemplateSchema);
