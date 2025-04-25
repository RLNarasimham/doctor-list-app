import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Doctor } from '../types/Doctor';
import { getAutocompleteSuggestions } from '../utils/filterUtils';

interface AutocompleteSearchProps {
  doctors: Doctor[];
  initialValue: string;
  onSearch: (query: string) => void;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({ 
  doctors, 
  initialValue,
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Update suggestions when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const matchedDoctors = getAutocompleteSuggestions(doctors, searchQuery);
      setSuggestions(matchedDoctors);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, doctors]);
  
  // Handle outside clicks to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle arrow keys and enter for suggestion navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectSuggestion(suggestions[selectedIndex].name);
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
  const selectSuggestion = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    onSearch(name);
  };
  
  const submitSearch = () => {
    setShowSuggestions(false);
    onSearch(searchQuery);
  };
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          data-testid="autocomplete-input"
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search doctors by name..."
          className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <button
          type="button"
          onClick={submitSearch}
          className="absolute inset-y-0 right-0 px-4 text-cyan-600 hover:text-cyan-700 transition-colors font-medium"
        >
          Search
        </button>
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <ul>
            {suggestions.map((doctor, index) => (
              <li 
                key={doctor.id}
                data-testid="suggestion-item"
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  index === selectedIndex ? 'bg-gray-100' : ''
                }`}
                onClick={() => selectSuggestion(doctor.name)}
              >
                <div className="font-medium text-gray-800">{doctor.name}</div>
                <div className="text-sm text-gray-500">
                  {(doctor.specialties || []).slice(0, 2).join(', ')}
                  {doctor.specialties && doctor.specialties.length > 2 && '...'}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AutocompleteSearch;