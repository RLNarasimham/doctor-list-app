import { Doctor } from '../types/Doctor';

export const applyFilters = (
  doctors: Doctor[],
  searchTerm: string,
  consultationType: string,
  specialties: string[],
  sortBy: string
): Doctor[] => {
  // First apply search filter
  let filtered = searchTerm 
    ? doctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [...doctors];
  
  // Apply consultation type filter
  if (consultationType) {
    filtered = filtered.filter(doctor => {
      if (consultationType === 'Video Consult') {
        return doctor.videoConsult;
      } else if (consultationType === 'In Clinic') {
        return doctor.inClinic;
      }
      return true;
    });
  }
  
  // Apply specialties filter (doctor must have at least one of the selected specialties)
  if (specialties.length > 0) {
    filtered = filtered.filter(doctor => 
      doctor.specialties && doctor.specialties.some(specialty => specialties.includes(specialty))
    );
  }
  
  // Apply sorting
  if (sortBy) {
    filtered.sort((a, b) => {
      if (sortBy === 'fees') {
        return (a.fees || 0) - (b.fees || 0);
      } else if (sortBy === 'experience') {
        return (b.experience || 0) - (a.experience || 0);
      }
      return 0;
    });
  }
  
  return filtered;
};

export const getAutocompleteSuggestions = (
  doctors: Doctor[],
  query: string,
  maxSuggestions = 3
): Doctor[] => {
  if (!query.trim()) {
    return [];
  }
  
  const normalizedQuery = query.toLowerCase();
  
  // Sort doctors by name relevance to the query
  const matchedDoctors = doctors
    .filter(doctor => doctor.name && doctor.name.toLowerCase().includes(normalizedQuery))
    .sort((a, b) => {
      const aIndex = a.name.toLowerCase().indexOf(normalizedQuery);
      const bIndex = b.name.toLowerCase().indexOf(normalizedQuery);
      
      // Prioritize matches at the beginning of the name
      if (aIndex !== bIndex) {
        return aIndex - bIndex;
      }
      
      // Then sort alphabetically
      return a.name.localeCompare(b.name);
    })
    .slice(0, maxSuggestions);
  
  return matchedDoctors;
};