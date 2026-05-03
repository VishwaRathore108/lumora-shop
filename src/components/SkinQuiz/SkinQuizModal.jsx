import React, { useMemo, useRef, useState } from 'react';
import { Sparkles, Sun, Moon, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analyzeSkinQuiz } from '../../services/quizService';

const skinTypeOptions = ['Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];
const climateOptions = ['Hot & Dry', 'Hot & Humid', 'Cold & Dry'];
const concernOptions = [
  'Acne',
  'Dark Spots',
  'Anti-aging',
  'Dryness',
  'Dullness',
  'Large Pores',
  'Pigmentation',
  'Uneven Texture',
  'Blackheads',
];

const baseCardClasses =
  'rounded-xl border px-4 py-3 text-sm font-medium transition-all text-left';

const convertToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

function OptionGrid({ label, options, value, onChange }) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = Array.isArray(value) ? value.includes(option) : value === option;
          return (
            <button
              type="button"
              key={option}
              onClick={() => onChange(option)}
              className={`${baseCardClasses} ${
                active
                  ? 'bg-[#985991] text-white border-[#985991] shadow-md shadow-rose-100'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-[#C892C1]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const SkinQuizModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    skinType: '',
    climate: '',
    primaryConcern: [],
    extraDetails: '',
    selfieBase64: '',
  });
  const [selfiePreview, setSelfiePreview] = useState('');
  const selfieInputRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const canSubmit = useMemo(
    () => !!form.skinType && !!form.climate && form.primaryConcern.length > 0 && !isAnalyzing,
    [form, isAnalyzing]
  );

  if (!isOpen) return null;

  const handleClose = () => {
    if (isAnalyzing) return;
    onClose?.();
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError('');
    setResult(null);
    setIsAnalyzing(true);
    try {
      const response = await analyzeSkinQuiz({
        skinType: form.skinType,
        climate: form.climate,
        primaryConcern: form.primaryConcern,
        extraDetails: form.extraDetails,
        selfieBase64: form.selfieBase64,
      });
      if (!response?.success || !response?.data) {
        throw new Error(response?.message || 'Unable to analyze quiz right now.');
      }
      const data = response.data;
      const tip = typeof data?.expertTip === 'string' ? data.expertTip : '';
      if (tip.includes('INVALID_IMAGE_ERROR')) {
        alert('Oops! Please upload a clear picture of a human face, not an object. Try again!');
        setForm((prev) => ({ ...prev, selfieBase64: '' }));
        setSelfiePreview('');
        if (selfieInputRef.current) selfieInputRef.current.value = '';
        setResult(null);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Unable to analyze quiz right now.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleConcern = (concern) => {
    setForm((prev) => {
      const exists = prev.primaryConcern.includes(concern);
      return {
        ...prev,
        primaryConcern: exists
          ? prev.primaryConcern.filter((item) => item !== concern)
          : [...prev.primaryConcern, concern],
      };
    });
  };

  const handleSelfieChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await convertToBase64(file);
      const normalized = typeof dataUrl === 'string' ? dataUrl : '';
      const base64WithoutPrefix = normalized.includes(',') ? normalized.split(',')[1] : normalized;
      setForm((prev) => ({ ...prev, selfieBase64: base64WithoutPrefix }));
      setSelfiePreview(normalized);
    } catch {
      setError('Could not process selected image. Please try another selfie.');
    }
  };

  const handleShopSteps = () => {
    if (!result) return;

    const combinedRoutinesArray = [...(result.amRoutine || []), ...(result.pmRoutine || [])]
      .map((item) => String(item || '').trim())
      .filter(Boolean);
    const combinedRoutines = combinedRoutinesArray.join(' ');

    handleClose();
    navigate('/shop', {
      state: {
        aiKeywords: combinedRoutines,
        aiRecommendations: combinedRoutinesArray,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={handleClose} />
      {/* 🟢 CHANGE IS HERE: Main Modal Content Container 🟢 */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#FFF7FB] to-white rounded-t-3xl">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#985991]">AI Skin Quiz</p>
            <h3 className="text-lg font-serif text-gray-900">Your Personalized Routine</h3>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full border border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            aria-label="Close quiz modal"
          >
            <X className="w-4 h-4 mx-auto" />
          </button>
        </div>

        <div className="p-6">
          {!isAnalyzing && !result && (
            <form onSubmit={handleAnalyze} className="space-y-5">
              <OptionGrid
                label="Select your skin type"
                options={skinTypeOptions}
                value={form.skinType}
                onChange={(skinType) => setForm((prev) => ({ ...prev, skinType }))}
              />
              <OptionGrid
                label="What's your climate?"
                options={climateOptions}
                value={form.climate}
                onChange={(climate) => setForm((prev) => ({ ...prev, climate }))}
              />
              <OptionGrid
                label="Primary concern"
                options={concernOptions}
                value={form.primaryConcern}
                onChange={toggleConcern}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Any specific details? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={form.extraDetails}
                  onChange={(e) => setForm((prev) => ({ ...prev, extraDetails: e.target.value }))}
                  placeholder="e.g., I have dark circles under my eyes..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#D8B4D3] focus:border-[#C892C1]"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-800">
                  Upload/Capture a Selfie (Optional)
                </label>
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleSelfieChange}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-full file:border-0 file:bg-[#F8EAF6] file:px-4 file:py-2 file:text-[#7A4774] file:font-semibold hover:file:bg-[#F1DDED]"
                />
                {selfiePreview ? (
                  <div className="w-28 h-28 rounded-xl overflow-hidden border border-pink-100 bg-gray-50">
                    <img src={selfiePreview} alt="Selfie preview" className="w-full h-full object-cover" />
                  </div>
                ) : null}
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3 rounded-full bg-[#985991] text-white text-sm font-semibold hover:bg-[#7A4774] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Analyze My Skin
              </button>
            </form>
          )}

          {isAnalyzing && (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-[#F8EAF6] flex items-center justify-center mb-4 animate-pulse">
                <Loader2 className="w-7 h-7 text-[#985991] animate-spin" />
              </div>
              <p className="text-base font-semibold text-gray-800">
                ✨ Our AI Dermatologist is crafting your routine...
              </p>
              <div className="mt-5 w-full max-w-md space-y-2">
                <div className="h-3 rounded-full bg-gray-100 animate-pulse" />
                <div className="h-3 rounded-full bg-gray-100 animate-pulse w-5/6 mx-auto" />
                <div className="h-3 rounded-full bg-gray-100 animate-pulse w-4/6 mx-auto" />
              </div>
            </div>
          )}

          {!isAnalyzing && result && (
            <div className="space-y-5">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <Sun className="w-4 h-4" /> AM Routine
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {(result.amRoutine || []).map((step, idx) => (
                    <li key={`am-${idx}`}>{idx + 1}. {step}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-indigo-800">
                  <Moon className="w-4 h-4" /> PM Routine
                </p>
                <ul className="mt-2 space-y-1 text-sm text-gray-700">
                  {(result.pmRoutine || []).map((step, idx) => (
                    <li key={`pm-${idx}`}>{idx + 1}. {step}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-pink-100 bg-[#FFF7FB] p-4">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#7A4774] mb-1">
                  <Sparkles className="w-4 h-4" /> Expert Tip
                </p>
                <p className="text-sm text-gray-700">{result.expertTip}</p>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 min-w-[140px] py-3 rounded-full border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleShopSteps}
                  className="flex-1 min-w-[140px] py-3 rounded-full bg-[#985991] text-white text-sm font-semibold hover:bg-[#7A4774] transition-colors"
                >
                  Shop These Steps
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkinQuizModal;