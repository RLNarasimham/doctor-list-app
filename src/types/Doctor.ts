export interface Doctor {
  id: string;
  name: string;
  specialties: string[];
  experience: number;
  videoConsult: boolean;
  inClinic: boolean;
  fees: number;
  address: string;
  city: string;
  photo: string;
  rating: number;
  reviews: number;
}