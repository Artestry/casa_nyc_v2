import React, { useState } from 'react';
import { UserPreferences, Borough } from '../types';
import { STEPS } from '../constants';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

interface IntakeFormProps {
  onComplete: (data: UserPreferences) => void;
}

const initialData: UserPreferences = {
  fullName: '',
  email: '',
  phone: '',
  contactMethod: 'email',
  boroughs: [],
  householdSize: 1,
  annualIncome: 0,
  employmentStatus: 'Full-time',
  bedroomPreference: '1BR',
  minRent: 0,
  maxRent: 2000,
  hasVoucher: false,
  moveTimeline: 'Immediately',
  accessibilityRequired: false,
  accessibilityFeatures: []
};

export const IntakeForm: React.FC<IntakeFormProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<UserPreferences>(initialData);

  const updateField = (field: keyof UserPreferences, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else onComplete(formData);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleBorough = (b: Borough) => {
    const current = formData.boroughs;
    if (current.includes(b)) {
      updateField('boroughs', current.filter(x => x !== b));
    } else {
      updateField('boroughs', [...current, b]);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-3xl mx-auto border border-gray-100">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center flex-1">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 transition-colors duration-300 ${
                  step >= s.id ? 'bg-nyc-blue text-white' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s.id ? <CheckCircle size={16} /> : s.id}
              </div>
              <span className={`text-xs font-medium ${step >= s.id ? 'text-nyc-blue' : 'text-gray-400'}`}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-nyc-blue transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1: Personal Info */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Who are we matching?</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue focus:outline-none"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue focus:outline-none"
                placeholder="jane@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue focus:outline-none"
                placeholder="(555) 555-5555"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Preference</label>
              <select 
                value={formData.contactMethod}
                onChange={(e) => updateField('contactMethod', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue focus:outline-none"
              >
                <option value="email">Email Only</option>
                <option value="sms">SMS Only</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Housing & Location */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Where do you want to live?</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Boroughs</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(Borough).map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBorough(b)}
                  className={`px-4 py-2 rounded-full border transition-all ${
                    formData.boroughs.includes(b) 
                      ? 'bg-nyc-blue text-white border-nyc-blue' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-nyc-blue'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Household Size</label>
              <input 
                type="number" 
                min="1"
                max="15"
                value={formData.householdSize}
                onChange={(e) => updateField('householdSize', parseInt(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Size</label>
              <select 
                value={formData.bedroomPreference}
                onChange={(e) => updateField('bedroomPreference', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue"
              >
                <option value="Studio">Studio</option>
                <option value="1BR">1 Bedroom</option>
                <option value="2BR">2 Bedroom</option>
                <option value="3BR">3 Bedroom</option>
                <option value="4+BR">4+ Bedroom</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Financials */}
      {step === 3 && (
        <div className="space-y-4 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Financial Profile</h2>
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4">
            This information is used solely to calculate your AMI (Area Median Income) percentage for eligibility.
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Annual Household Income ($)</label>
            <input 
              type="number" 
              value={formData.annualIncome}
              onChange={(e) => updateField('annualIncome', parseInt(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue text-lg font-mono"
              placeholder="50000"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status</label>
              <select 
                value={formData.employmentStatus}
                onChange={(e) => updateField('employmentStatus', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Self-employed">Self-employed</option>
                <option value="Unemployed">Unemployed</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Housing Voucher?</label>
              <select 
                value={formData.hasVoucher ? "yes" : "no"}
                onChange={(e) => updateField('hasVoucher', e.target.value === 'yes')}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue"
              >
                <option value="no">No</option>
                <option value="yes">Yes (Section 8, CityFHEPS, etc.)</option>
              </select>
            </div>
          </div>
        </div>
      )}

       {/* Step 4: Accessibility & Submit */}
       {step === 4 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800">Accessibility & Timeline</h2>
          
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">When do you need to move?</label>
              <select 
                value={formData.moveTimeline}
                onChange={(e) => updateField('moveTimeline', e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nyc-blue"
              >
                <option value="Immediately">Immediately (0-1 month)</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
              </select>
            </div>

            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-nyc-blue transition-colors">
              <input 
                type="checkbox"
                id="access_req"
                checked={formData.accessibilityRequired}
                onChange={(e) => updateField('accessibilityRequired', e.target.checked)}
                className="mt-1 h-4 w-4 text-nyc-blue focus:ring-nyc-blue rounded border-gray-300"
              />
              <label htmlFor="access_req" className="text-sm text-gray-700">
                <span className="font-bold block text-gray-900">I require an accessible unit</span>
                Wheelchair accessible, roll-in shower, visual alarms, etc.
              </label>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <label className="flex items-center space-x-2 text-sm text-gray-600">
                <input type="checkbox" required className="rounded text-nyc-blue" />
                <span>I consent to CASA NYC processing my data to find housing matches.</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
        <button 
          onClick={handleBack}
          disabled={step === 1}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft size={18} className="mr-2" />
          Back
        </button>
        <button 
          onClick={handleNext}
          className="flex items-center px-8 py-3 bg-nyc-blue hover:bg-blue-700 text-white rounded-lg font-medium shadow-md transition-all hover:shadow-lg transform active:scale-95"
        >
          {step === 4 ? 'Find My Matches' : 'Next Step'}
          {step < 4 && <ArrowRight size={18} className="ml-2" />}
        </button>
      </div>
    </div>
  );
};
