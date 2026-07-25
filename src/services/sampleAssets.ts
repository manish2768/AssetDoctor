import { saveAssetToCloud } from './assetCloudService';

export interface SampleAsset {
  name: string;
  category: string;
  brand?: string;
  purchaseDate: string;
  expiryDate?: string;
  price?: number;
  notes?: string;
  imageUrl?: string;
  [key: string]: any;
}

export const SAMPLE_ASSETS: SampleAsset[] = [];

export const loadDemoAssets = async (_userId: string) => {
  return true;
};

