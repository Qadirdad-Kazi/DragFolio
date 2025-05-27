import { Portfolio } from '../models/mongoose-schema';

export const isSubdomainAvailable = async (subdomain: string): Promise<boolean> => {
  try {
    const existingPortfolio = await Portfolio.findOne({ subdomain });
    return !existingPortfolio;
  } catch (error) {
    console.error('Error checking subdomain availability:', error);
    throw error;
  }
};
