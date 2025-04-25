import React, { useEffect, useState } from 'react';
import { useSearchParams } from './hooks/useSearchParams';
import { Search } from 'lucide-react';
import DoctorList from './components/DoctorList';
import FilterPanel from './components/FilterPanel';
import AutocompleteSearch from './components/AutocompleteSearch';
import { fetchDoctors } from './api/doctorsApi';
import { Doctor } from './types/Doctor';
import { applyFilters } from './utils/filterUtils';

function App() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filters from URL params
  const searchTerm = searchParams.get('search') || '';
  const consultationType = searchParams.get('consultation') || '';
  const specialties = searchParams.getAll('specialty') || [];
  const sortBy = searchParams.get('sort') || '';
  
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  
  // Fetch doctors data
  useEffect(() => {
    const getDoctors = async () => {
      try {
        setLoading(true);
        const data = await fetchDoctors();
        setDoctors(data || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
        setLoading(false);
      }
    };
    
    getDoctors();
  }, []);
  
  // Apply filters when any filter changes or doctors data changes
  useEffect(() => {
    if (doctors.length > 0) {
      const filtered = applyFilters(
        doctors,
        searchTerm,
        consultationType,
        specialties,
        sortBy
      );
      setFilteredDoctors(filtered);
    }
  }, [doctors, searchTerm, consultationType, specialties, sortBy]);
  
  // Handle search
  const handleSearch = (query: string) => {
    updateSearchParams('search', query);
  };
  
  // Handle consultation type filter
  const handleConsultationChange = (type: string) => {
    updateSearchParams('consultation', type);
  };
  
  const handleClearSpecialties = () => {
    specialties.forEach(specialty => {
      handleSpecialtyChange(specialty, false);
    });
  };  

  // Handle specialty filter
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    const currentSpecialties = [...specialties];
    
    if (checked && !currentSpecialties.includes(specialty)) {
      updateSearchParams('specialty', [...currentSpecialties, specialty], true);
    } else if (!checked && currentSpecialties.includes(specialty)) {
      const filtered = currentSpecialties.filter(s => s !== specialty);
      updateSearchParams('specialty', filtered, true);
    }
  };
  
  // Handle sort
  const handleSort = (sortOption: string) => {
    updateSearchParams('sort', sortOption);
  };
  
  // Update search params
  const updateSearchParams = (param: string, value: string | string[], isArray = false) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (isArray) {
      newParams.delete(param);
      if (Array.isArray(value)) {
        value.forEach(val => {
          newParams.append(param, val);
        });
      }
    } else {
      if (value) {
        newParams.set(param, value as string);
      } else {
        newParams.delete(param);
      }
    }
    
    setSearchParams(newParams);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-cyan-700">Doctor Finder</h1>
            <div className="w-full md:w-2/3 lg:w-1/2">
              <AutocompleteSearch 
                doctors={doctors} 
                initialValue={searchTerm}
                onSearch={handleSearch} 
              />
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-1/4">
            <FilterPanel 
              specialties={Array.from(new Set(doctors.flatMap(doctor => doctor.specialties || [])))}
              selectedConsultationType={consultationType}
              selectedSpecialties={specialties}
              selectedSort={sortBy}
              onConsultationChange={handleConsultationChange}
              onSpecialtyChange={handleSpecialtyChange}
              onClearSpecialties={handleClearSpecialties}
              onSortChange={handleSort}
            />
          </aside>
          
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-700"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 bg-red-50 p-4 rounded-md">{error}</div>
            ) : (
              <>
                <div className="mb-4 text-gray-600">
                  <span className="font-medium">{filteredDoctors.length}</span> doctors found
                </div>
                <DoctorList doctors={filteredDoctors} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;