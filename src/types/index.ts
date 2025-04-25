export interface Doctor {
  id: number;
  name: string;
  specialty: string[];
  experience: number;
  fees: number;
  consultations: string[];
}

export interface FilterState {
  search: string;
  consultationType: string;
  specialties: string[];
  sort: string;
}