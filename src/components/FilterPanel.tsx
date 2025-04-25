import React from "react";
import {
  Filter,
  Stethoscope,
  Video,
  Building2,
  ArrowUpDown,
} from "lucide-react";

interface FilterPanelProps {
  specialties: string[];
  selectedConsultationType: string;
  selectedSpecialties: string[];
  selectedSort: string;
  onConsultationChange: (type: string) => void;
  onSpecialtyChange: (specialty: string, checked: boolean) => void;
  onClearSpecialties: () => void;
  onSortChange: (sortOption: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  specialties,
  selectedConsultationType,
  selectedSpecialties,
  selectedSort,
  onConsultationChange,
  onSpecialtyChange,
  onSortChange,
}) => {
  // Format the specialty ID for data-testid with null checking
  const formatSpecialtyId = (specialty: string | undefined | null): string => {
    if (typeof specialty === "string") {
      return specialty.replace(/\s+/g, "-").toLowerCase();
    }
    return "";
  };

  function onClearSpecialties(): void {
    onSpecialtyChange("", false);
  }
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="mb-4 flex items-center text-cyan-700 font-medium">
        <Filter className="mr-2 h-5 w-5" />
        <h2 className="text-lg">Filters</h2>
      </div>

      {/* Consultation Type Filter */}
      <div className="mb-6">
        <h3
          data-testid="filter-header-moc"
          className="text-gray-700 font-medium mb-3 flex items-center"
        >
          <Video className="mr-2 h-4 w-4" />
          Consultation Mode
        </h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              data-testid="filter-video-consult"
              type="radio"
              name="consultationType"
              checked={selectedConsultationType === "Video Consult"}
              onChange={() => onConsultationChange("Video Consult")}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="ml-2 text-gray-700">Video Consult</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              data-testid="filter-in-clinic"
              type="radio"
              name="consultationType"
              checked={selectedConsultationType === "In Clinic"}
              onChange={() => onConsultationChange("In Clinic")}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="ml-2 text-gray-700">In Clinic</span>
          </label>
          {selectedConsultationType && (
            <button
              onClick={() => onConsultationChange("")}
              className="text-sm text-cyan-600 hover:text-cyan-700 mt-1"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Specialties Filter */}
      <div className="mb-6">
        <h3
          data-testid="filter-header-speciality"
          className="text-gray-700 font-medium mb-3 flex items-center"
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          Speciality
        </h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {specialties
            .filter(
              (specialty): specialty is string => typeof specialty === "string"
            )
            .sort()
            .map((specialty) => (
              <label
                key={specialty}
                className="flex items-center cursor-pointer"
              >
                <input
                  data-testid={`filter-specialty-${formatSpecialtyId(
                    specialty
                  )}`}
                  type="checkbox"
                  checked={selectedSpecialties.includes(specialty)}
                  onChange={(e) =>
                    onSpecialtyChange(specialty, e.target.checked)
                  }
                  className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 rounded"
                />
                <span className="ml-2 text-gray-700">{specialty}</span>
              </label>
            ))}
          {selectedSpecialties.length > 0 && (
            <button
              onClick={onClearSpecialties} // ✅ use the new prop here
              className="text-sm text-cyan-600 hover:text-cyan-700 mt-1"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Sort Filter */}
      <div>
        <h3
          data-testid="filter-header-sort"
          className="text-gray-700 font-medium mb-3 flex items-center"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort By
        </h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              data-testid="sort-fees"
              type="radio"
              name="sortBy"
              checked={selectedSort === "fees"}
              onChange={() => onSortChange("fees")}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="ml-2 text-gray-700">Fees (Low to High)</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              data-testid="sort-experience"
              type="radio"
              name="sortBy"
              checked={selectedSort === "experience"}
              onChange={() => onSortChange("experience")}
              className="h-4 w-4 text-cyan-600 focus:ring-cyan-500"
            />
            <span className="ml-2 text-gray-700">Experience (High to Low)</span>
          </label>
          {selectedSort && (
            <button
              onClick={() => onSortChange("")}
              className="text-sm text-cyan-600 hover:text-cyan-700 mt-1"
            >
              Clear sorting
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
