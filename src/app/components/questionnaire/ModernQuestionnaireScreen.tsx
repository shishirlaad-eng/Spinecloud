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

export function ModernQuestionnaireScreen({
  categoryName,
  categoryDescription,
  onBack,
  onSubmit,
}: QuestionnaireScreenProps) {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form states
  const [functionalDifficulties, setFunctionalDifficulties] = useState<string[]>([]);
  const [relievingFactors, setRelievingFactors] = useState<string[]>([]);
  const [painDescriptions, setPainDescriptions] = useState<string[]>([]);
  const [overallChange, setOverallChange] = useState("");
  const [currentPainLevel, setCurrentPainLevel] = useState<number | null>(null);
  const [worstPainLevel, setWorstPainLevel] = useState<number | null>(null);
  const [complaintDescription, setComplaintDescription] = useState("");
  const [medicalImages, setMedicalImages] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const functionalDifficultiesOptions = [
    "Housekeeping", "Climbing stairs", "Getting dressed", "Sitting for long periods",
    "Standing for long periods", "Walking", "Lifting objects", "Reaching overhead",
    "Sleeping", "Driving", "Working at a desk", "Exercise / physical activity",
    "Bending or twisting"
  ];

  const relievingFactorsOptions = [
    "Heating pad", "Aspirin", "Lying down", "Ice pack", "Rest", "Stretching",
    "Massage", "Changing posture", "Over-the-counter pain medication",
    "Prescription medication", "Gentle movement", "Physical therapy exercises",
    "Hot shower or bath"
  ];

  const overallChangeOptions = [
    "Stayed the same", "Improved 5–20%", "Improved 21–40%", "Improved 41–60%",
    "Improved 61–80%", "Improved 81–100%", "Worsened 5–20%",
    "Worsened 21–40%", "Worsened 41–60%"
  ];

  const painDescriptionOptions = [
    "Aching", "Sharp", "Shooting", "Dull", "Throbbing", "Burning",
    "Stabbing", "Tight", "Stiff", "Cramping", "Sore", "Tender",
    "Numbness / tingling"
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

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return complaintDescription.trim().length > 0 && functionalDifficulties.length > 0;
      case 2:
        return relievingFactors.length > 0;
      case 3:
        return overallChange !== "" && painDescriptions.length > 0;
      case 4:
        return currentPainLevel !== null && worstPainLevel !== null;
      case 5:
        return true; // Optional step
      default:
        return false;
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 dark:from-neutral-950 dark:to-neutral-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header Title Area */}
        <div className="text-center mb-6">
          <div className="w-16 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Step {currentStep} of {totalSteps}
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </p>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-8 md:p-12 mb-6">
          <button
            onClick={currentStep === 1 ? onBack : handlePrevious}
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors group mb-8"
          >
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back
          </button>

          <div className="mb-8">
            <p className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-3">
              {categoryName}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight">
              {currentStep === 1 && "Tell us about your condition"}
              {currentStep === 2 && "What helps relieve your symptoms?"}
              {currentStep === 3 && "How are you feeling now?"}
              {currentStep === 4 && "Rate your pain levels"}
              {currentStep === 5 && "Share medical imaging (optional)"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Describe your complaint
                  </label>
                  <textarea
                    placeholder="Tell us what's bothering you..."
                    value={complaintDescription}
                    onChange={(e) => setComplaintDescription(e.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                    What activities are difficult for you?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {functionalDifficultiesOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          functionalDifficulties.includes(option)
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
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
                          className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                        />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <div>
                <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                  Select all that apply
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relievingFactorsOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        relievingFactors.includes(option)
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={relievingFactors.includes(option)}
                        onChange={() =>
                          toggleArrayValue(relievingFactors, setRelievingFactors, option)
                        }
                        className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                      />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                    Overall change since last visit
                  </label>
                  <div className="space-y-3">
                    {overallChangeOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          overallChange === option
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <input
                          type="radio"
                          name="overallChange"
                          checked={overallChange === option}
                          onChange={() => setOverallChange(option)}
                          className="w-5 h-5 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                        />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                    How would you describe your pain?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {painDescriptionOptions.map((option) => (
                      <label
                        key={option}
                        className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          painDescriptions.includes(option)
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={painDescriptions.includes(option)}
                          onChange={() =>
                            toggleArrayValue(painDescriptions, setPainDescriptions, option)
                          }
                          className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-2 focus:ring-primary-500/20"
                        />
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {currentStep === 4 && (
              <div className="space-y-10">
                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                    Current pain level
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={currentPainLevel || 0}
                      onChange={(e) => setCurrentPainLevel(parseInt(e.target.value))}
                      className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">No pain</span>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-primary-600 dark:text-primary-400">
                          {currentPainLevel !== null ? currentPainLevel : "—"}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">out of 10</p>
                      </div>
                      <span className="text-sm text-neutral-500">Worst pain</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-4">
                    Worst pain level (past week)
                  </label>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={worstPainLevel || 0}
                      onChange={(e) => setWorstPainLevel(parseInt(e.target.value))}
                      className="w-full h-3 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-destructive"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-500">No pain</span>
                      <div className="text-center">
                        <div className="text-5xl font-bold text-destructive">
                          {worstPainLevel !== null ? worstPainLevel : "—"}
                        </div>
                        <p className="text-sm text-neutral-500 mt-1">out of 10</p>
                      </div>
                      <span className="text-sm text-neutral-500">Worst pain</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5 - Medical Imaging */}
            {currentStep === 5 && (
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                  If you have any existing X-rays, MRI, CT scans, or other imaging related to your condition, you may upload them here. This step is completely optional.
                </p>
                <div
                  className={`w-full min-h-48 border-2 border-dashed rounded-xl flex items-center justify-center transition-colors ${
                    isDragging
                      ? "bg-primary-50 dark:bg-primary-950/30 border-primary-500"
                      : "border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
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
                    const acceptedTypes = [
                      "image/jpeg",
                      "image/jpg",
                      "image/png",
                      "application/pdf",
                      "application/dicom",
                    ];
                    const newFiles = Array.from(files).filter(
                      (file) =>
                        acceptedTypes.some((type) =>
                          file.type.includes(type.split("/")[1])
                        ) || file.name.endsWith(".dcm")
                    );
                    if (newFiles.length > 0) {
                      setMedicalImages((prev) => [...prev, ...newFiles]);
                    }
                  }}
                >
                  <div className="flex flex-col items-center p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center mb-4">
                      <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Drag & drop files here
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                      or click to browse
                    </p>
                    <button
                      type="button"
                      className="px-6 h-10 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors font-medium text-sm"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.accept =
                          "image/jpeg,image/jpg,image/png,application/pdf,.dcm,application/dicom";
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
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-4">
                      JPG, PNG, PDF, DICOM supported
                    </p>
                  </div>
                </div>

                {medicalImages.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                      Uploaded files ({medicalImages.length})
                    </p>
                    <div className="space-y-2">
                      {medicalImages.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {file.type.includes("pdf") ? (
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
                            className="flex-shrink-0 p-1.5 text-neutral-400 hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                            onClick={() =>
                              setMedicalImages((prev) => prev.filter((_, i) => i !== index))
                            }
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-12">
              {currentStep < totalSteps && (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="flex-1 h-12 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                >
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === totalSteps && (
                <>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 h-12 px-6 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors font-medium text-sm"
                  >
                    Skip & submit
                  </button>
                  <button
                    type="submit"
                    className="flex-1 h-12 px-6 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
                  >
                    Submit questionnaire
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
