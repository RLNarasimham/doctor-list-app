import React from 'react';
import { Doctor } from '../types/Doctor';
import { Video, MapPin, Star, Clock } from 'lucide-react';

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div 
      data-testid="doctor-card"
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
        {/* Doctor Photo */}
        <div className="sm:w-1/4 md:w-1/5 flex-shrink-0">
          <img 
            src={doctor.photo || 'https://via.placeholder.com/150x150?text=Doctor'} 
            alt={doctor.name}
            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full mx-auto sm:mx-0"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/150x150?text=Doctor';
            }}
          />
        </div>
        
        {/* Doctor Info */}
        <div className="flex-1">
          <div className="mb-3">
            <h2 
              data-testid="doctor-name"
              className="text-xl font-semibold text-gray-800"
            >
              Dr. {doctor.name}
            </h2>
            <p 
              data-testid="doctor-specialty"
              className="text-gray-600"
            >
              {(doctor.specialties || []).join(', ')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-cyan-600 mr-2" />
              <span 
                data-testid="doctor-experience"
                className="text-gray-700"
              >
                {doctor.experience} years of experience
              </span>
            </div>
            {doctor.rating && (
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-700">
                  {doctor.rating.toFixed(1)} ({doctor.reviews} reviews)
                </span>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {doctor.videoConsult && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                <Video className="h-3 w-3 mr-1" />
                Video Consult
              </span>
            )}
            {doctor.inClinic && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                <MapPin className="h-3 w-3 mr-1" />
                In Clinic
              </span>
            )}
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Fees: ₹<span data-testid="doctor-fee">{doctor.fees}</span>
            </span>
          </div>
          
          {doctor.address && (
            <div className="text-gray-600 text-sm flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <span>
                {doctor.address}
                {doctor.city && `, ${doctor.city}`}
              </span>
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="sm:w-1/4 md:w-1/5 flex flex-row sm:flex-col gap-2 justify-center items-center sm:items-end">
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-4 py-2 rounded-md transition-colors duration-300 w-full">
            Book Now
          </button>
          <button className="border border-cyan-600 text-cyan-600 hover:bg-cyan-50 font-medium px-4 py-2 rounded-md transition-colors duration-300 w-full">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;