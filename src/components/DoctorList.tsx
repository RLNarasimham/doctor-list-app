import React from 'react';
import { Doctor } from '../types/Doctor';
import DoctorCard from './DoctorCard';

interface DoctorListProps {
  doctors: Doctor[];
}

const DoctorList: React.FC<DoctorListProps> = ({ doctors }) => {
  return (
    <div className="space-y-4">
      {doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">No doctors found</h3>
          <p className="text-gray-500">
            Try adjusting your filters or search criteria.
          </p>
        </div>
      ) : (
        doctors.map(doctor => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))
      )}
    </div>
  );
};

export default DoctorList;