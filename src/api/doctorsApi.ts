import { Doctor } from '../types/Doctor';

const API_URL = 'https://srijandubey.github.io/campus-api-mock/SRM-C1-25.json';

export const fetchDoctors = async (): Promise<Doctor[]> => {
  try {
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch doctors: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};