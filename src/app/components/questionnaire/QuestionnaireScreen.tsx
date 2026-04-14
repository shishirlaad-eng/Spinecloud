import { useState } from "react";
import { ChevronLeft, ChevronRight, Upload, X, FileImage, File } from "lucide-react";

interface QuestionnaireScreenProps {
  categoryName: string;
  categoryDescription: string;
  onBack: () => void;
  onSubmit: (data: {
    complaintDescription: string;
    functionalDifficulties: string[];
    relievingFactors: string[];
    overallChange: string;
    painDescription: string[];
    currentPainLevel: number | null;
    worstPainLevel: number | null;
    medicalImages?: File[];
  }) => void;
}

export function QuestionnaireScreen({
  categoryName,
  categoryDescription,
  onBack,
  onSubmit,
}: QuestionnaireScreenProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Multi-checkbox states
  const [functionalDifficulties, setFunctionalDifficulties] = useState<string[]>([]);
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [painDescriptions, setPainDescriptions] = useState<string[]>([]);

  // Single-select (radio) state
  const [overallChange, setOverallChange] = useState("");

  // Slider states
  const [currentPainLevel, setCurrentPainLevel] = useState<number | null>(null);
  const [worstPainLevel, setWorstPainLevel] = useState<number | null>(null);

  // Complaint Description state
  const [complaintDescription, setComplaintDescription] = useState("");

  // Medical Imaging Upload state (Step 5)
  const [medicalImages, setMedicalImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const functionalDifficultiesOptions = [
    "Housekeeping",
    "Climbing stairs",
    "Getting dressed",
    "Sitting for long periods",
    "Standing for long periods",
    "Walking",
    "Lifting objects",
    "Reaching overhead",
    "Sleeping",
    "Driving",
    "Working at a desk",
    "Exercise / physical activity",
    "Bending or twisting",
  ];

  const relievingFactorsOptions = [
    "Heating pad",
    "Aspirin",
    "Lying down",
    "Ice pack",
    "Rest",
    "Stretching",
    "Massage",
    "Changing posture",
    "Over-the-counter pain medication",
    "Prescription medication",
    "Gentle movement",
    "Physical therapy exercises",
    "Hot shower or bath",
  ];

  const overallChangeOptions = [
    "Stayed the same",
    "Improved 5–20%",
    "Improved 21–40%",
    "Improved 41–60%",
    "Improved 61–80%",
    "Improved 81–100%",
    "Worsened 5–20%",
    "Worsened 21–40%",
    "Worsened 41–60%",
  ];

  const painDescriptionOptions = [
    "Aching",
    "Sharp",
    "Shooting",
    "Dull",
    "Throbbing",
    "Burning",
    "Stabbing",
    "Tight",
    "Stiff",
    "Cramping",
    "Sore",
    "Tender",
    "Numbness / tingling",
  ];

  const toggleArrayValue = (
    currentArray: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string
  ) => {
    if (currentArray.includes(value)) {
      setter(currentArray.filter((item) => item !== value));
    } else {
      setter([...currentArray, value]);
    }
  };

  // Validation for each step
  const isStep1Valid = () => {
    return complaintDescription.trim().length > 0 && functionalDifficulties.length > 0;
  };

  const isStep2Valid = () => {
    return relievingFactors.length > 0;
  };

  const isStep3Valid = () => {
    return overallChange !== "" && painDescriptions.length > 0;
  };

  const isStep4Valid = () => {
    return currentPainLevel !== null && worstPainLevel !== null;
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Step 5 is optional, so we can submit anytime after step 4
    onSubmit({
      complaintDescription,
      functionalDifficulties,
      relievingFactors,
      overallChange,
      painDescription: painDescriptions,
      currentPainLevel,
      worstPainLevel,
      medicalImages: medicalImages.length > 0 ? medicalImages : undefined,
    });
  };

  const handleSkip = () => {
    // Skip step 5 and submit without images
    onSubmit({
      complaintDescription,
      functionalDifficulties,
      relievingFactors,
      overallChange,
      painDescription: painDescriptions,
      currentPainLevel,
      worstPainLevel,
    });
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Complaint & functional difficulties";
      case 2:
        return "Relieving factors";
      case 3:
        return "Overall change & pain description";
      case 4:
        return "Pain levels";
      case 5:
        return "Medical imaging upload";
      default:
        return "";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-5 md:p-6 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-2xl">
        {/* Logo - Outside Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
            SpineCloudIQ
          </h1>
          <div className="w-16 h-1 bg-primary-600 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={currentStep === 1 ? onBack : handlePrevious}
              className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-4"
            >
              <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>
            
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white text-center">
              {categoryName}
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
              {categoryDescription}
            </p>

            {/* Step Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    step === currentStep
                      ? "w-8 bg-primary-600"
                      : step < currentStep
                      ? "w-2 bg-primary-600"
                      : "w-2 bg-neutral-300 dark:bg-neutral-700"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-2">
              Step {currentStep} of {totalSteps}: {getStepTitle()}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6">
              {/* Step 1: Complaint Description + Functional Difficulties */}
              {currentStep === 1 && (
                <>
                  {/* Complaint Description */}
                  <div>
                    <label htmlFor="complaintDescription" className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                      Complaint description
                    </label>
                    <textarea
                      id="complaintDescription"
                      value={complaintDescription}
                      onChange={(e) => {
                        if (e.target.value.length <= 140) {
                          setComplaintDescription(e.target.value);
                        }
                      }}
                      maxLength={140}
                      rows={3}
                      placeholder="Describe your pain or discomfort affecting the selected area..."
                      className="flex w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] resize-none"
                    />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 text-right">
                      {complaintDescription.length}/140 characters
                    </p>
                  </div>

                  {/* Functional Difficulties */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Functional difficulties / Aggravating activities
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {functionalDifficultiesOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={functionalDifficulties.includes(option)}
                            onChange={() =>
                              toggleArrayValue(
                                functionalDifficulties,
                                setFunctionalDifficulties,
                                option
                              )
                            }
                            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 2: Relieving Factors */}
              {currentStep === 2 && (
                <div>
                  <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                    Relieving or improving factors
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {relievingFactorsOptions.map((option) => (
                      <label
                        key={option}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={relievingFactors.includes(option)}
                          onChange={() =>
                            toggleArrayValue(
                              relievingFactors,
                              setRelievingFactors,
                              option
                            )
                          }
                          className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Overall Change + Pain Description */}
              {currentStep === 3 && (
                <>
                  {/* Overall Change Since Last Visit */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Overall change since last visit
                    </label>
                    <div className="space-y-2">
                      {overallChangeOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="overallChange"
                            checked={overallChange === option}
                            onChange={() => setOverallChange(option)}
                            className="w-4 h-4 border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pain Description */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                      Pain description
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {painDescriptionOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={painDescriptions.includes(option)}
                            onChange={() =>
                              toggleArrayValue(
                                painDescriptions,
                                setPainDescriptions,
                                option
                              )
                            }
                            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-primary-600 focus:ring-2 focus:ring-primary-500/20 cursor-pointer"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Pain Levels (Sliders) */}
              {currentStep === 4 && (
                <>
                  {/* Current Pain Level */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                      Current pain level
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentPainLevel ?? 0}
                      onChange={(e) => setCurrentPainLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        0 - No pain
                      </span>
                      {currentPainLevel !== null && (
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {currentPainLevel}
                        </span>
                      )}
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        10 - Worst possible pain
                      </span>
                    </div>
                  </div>

                  {/* Worst Pain Level */}
                  <div>
                    <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-3">
                      Worst pain level (in the last 24 hours)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={worstPainLevel ?? 0}
                      onChange={(e) => setWorstPainLevel(parseInt(e.target.value))}
                      className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        0 - No pain
                      </span>
                      {worstPainLevel !== null && (
                        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                          {worstPainLevel}
                        </span>
                      )}
                      <span className="text-sm text-neutral-500 dark:text-neutral-400">
                        10 - Worst possible pain
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Step 5: Medical Imaging Upload */}
              {currentStep === 5 && (
                <div>
                  <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-1.5">
                    Upload medical imaging (optional)
                  </label>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    If you have any existing X-rays, MRI, CT scans, or other imaging related to your condition, you may upload them here. This is optional.
                  </p>
                  <div
                    className={`w-full min-h-32 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg flex items-center justify-center transition-colors ${
                      isDragging ? "bg-primary-50 dark:bg-primary-950/30 border-primary-500" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                    }`}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const files = e.dataTransfer.files;
                      const acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/dicom'];
                      const newFiles = Array.from(files).filter(
                        (file) => acceptedTypes.some(type => file.type.includes(type.split('/')[1])) || file.name.endsWith('.dcm')
                      );
                      if (newFiles.length > 0) {
                        setMedicalImages((prev) => [...prev, ...newFiles]);
                      }
                    }}
                  >
                    <div className="flex flex-col items-center p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      </div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                        Drag & drop files here
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                        or
                      </p>
                      <button
                        type="button"
                        className="px-4 h-9 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium text-sm"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/jpeg,image/jpg,image/png,application/pdf,.dcm,application/dicom";
                          input.multiple = true;
                          input.onchange = (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files) {
                              const newFiles = Array.from(files);
                              setMedicalImages((prev) => [...prev, ...newFiles]);
                            }
                          };
                          input.click();
                        }}
                      >
                        Browse files
                      </button>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                        Supported formats: JPG, PNG, PDF, DICOM
                      </p>
                    </div>
                  </div>
                  {medicalImages.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium mb-3">
                        Uploaded files ({medicalImages.length})
                      </p>
                      <div className="space-y-2">
                        {medicalImages.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg group hover:bg-neutral-100 dark:hover:bg-neutral-750 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                {file.type.includes('pdf') ? (
                                  <File className="w-5 h-5 text-destructive" />
                                ) : (
                                  <FileImage className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                  {file.name}
                                </p>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="flex-shrink-0 p-1.5 text-neutral-400 hover:text-destructive dark:hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                              onClick={() =>
                                setMedicalImages((prev) =>
                                  prev.filter((_, i) => i !== index)
                                )
                              }
                              aria-label="Remove file"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}\n                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer with Navigation */}
            <div className="px-6 pb-6 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between gap-3">
                {/* Back Button */}
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-4 h-10 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none inline-flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>

                {/* Continue/Submit Button */}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={
                      (currentStep === 1 && !isStep1Valid()) ||
                      (currentStep === 2 && !isStep2Valid()) ||
                      (currentStep === 3 && !isStep3Valid())
                    }
                    className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none inline-flex items-center gap-2"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSkip}
                      className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      Skip & submit
                    </button>
                    <button
                      type="submit"
                      disabled={!isStep4Valid()}
                      className="px-6 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
                    >
                      Submit questionnaire
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}