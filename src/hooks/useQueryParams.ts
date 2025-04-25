import { useEffect, useState } from 'react';
import { FilterState } from '../types';

const defaultFilterState: FilterState = {
  search: '',
  consultationType: '',
  specialties: [],
  sort: '',
};

const useQueryParams = () => {
  // Initialize state from URL params or defaults
  const [filterState, setFilterState] = useState<FilterState>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      search: urlParams.get('search') || defaultFilterState.search,
      consultationType: urlParams.get('consultationType') || defaultFilterState.consultationType,
      specialties: urlParams.get('specialties') ? 
        urlParams.get('specialties')!.split(',') : 
        defaultFilterState.specialties,
      sort: urlParams.get('sort') || defaultFilterState.sort,
    };
  });

  // Update URL when filter state changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filterState.search) {
      params.set('search', filterState.search);
    }
    
    if (filterState.consultationType) {
      params.set('consultationType', filterState.consultationType);
    }
    
    if (filterState.specialties.length > 0) {
      params.set('specialties', filterState.specialties.join(','));
    }
    
    if (filterState.sort) {
      params.set('sort', filterState.sort);
    }
    
    const newUrl = params.toString() ? 
      `${window.location.pathname}?${params.toString()}` : 
      window.location.pathname;
    
    window.history.pushState({}, '', newUrl);
  }, [filterState]);

  // Listen for browser navigation events
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      
      setFilterState({
        search: urlParams.get('search') || defaultFilterState.search,
        consultationType: urlParams.get('consultationType') || defaultFilterState.consultationType,
        specialties: urlParams.get('specialties') ? 
          urlParams.get('specialties')!.split(',') : 
          defaultFilterState.specialties,
        sort: urlParams.get('sort') || defaultFilterState.sort,
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const updateFilterState = (newState: FilterState) => {
    setFilterState(newState);
  };

  return { filterState, updateFilterState };
};

export default useQueryParams;