import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Doctor } from '../types';

interface SearchBarProps {
  doctors: Doctor[];
  currentSearch: string;
  onSearchChange: (search: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ doctors, currentSearch, onSearchChange }) => {
  const [input, setInput] = useState(currentSearch);
  const [suggestions, setSuggestions] = useState<Doctor[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update suggestions when input changes
  useEffect(() => {
    if (input.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    const matchingDoctors = doctors
      .filter(doctor => 
        doctor.name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 3); // Show only top 3 matches

    setSuggestions(matchingDoctors);
  }, [input, doctors]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        inputRef.current && 
        suggestionsRef.current && 
        !inputRef.current.contains(e.target as Node) && 
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (name: string) => {
    setInput(name);
    onSearchChange(name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(input);
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            data-testid="autocomplete-input"
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Search doctors by name..."
            value={input}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg suggestions-dropdown"
        >
          <ul className="py-1">
            {suggestions.map(doctor => (
              <li 
                key={doctor.id}
                data-testid="suggestion-item"
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                onClick={() => handleSelectSuggestion(doctor.name)}
              >
                {doctor.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;