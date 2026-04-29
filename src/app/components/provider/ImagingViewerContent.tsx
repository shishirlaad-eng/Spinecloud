import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Pencil,
  Minus,
  Square,
  Type,
  Eraser,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Save,
  Lock,
  Circle,
  Palette,
  X,
  Trash2,
} from "lucide-react";

// Mock X-ray images
const xrayImage1 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Cervical+Spine+Lateral";
const xrayImage2 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Lumbar+Spine+AP";
const xrayImage3 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Thoracic+Spine+Lateral";
const xrayImage4 = "https://placehold.co/600x400/EEE/31343C?font=montserrat&text=Shoulder+AP";

interface Annotation {
  id: string;
  type: "draw" | "line" | "rectangle" | "circle" | "text";
  color: string;
  points: { x: number; y: number }[];
  text?: string;
}

interface ImagingFile {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  annotations: Annotation[];
}

interface ImagingViewerContentProps {
  appointmentId: string;
  isReadOnly?: boolean;
}

type AnnotationTool = "draw" | "line" | "rectangle" | "circle" | "text" | "eraser" | null;
type AnnotationColor = "#000000" | "#FFFFFF" | "#EF4444" | "#3B82F6" | "#EAB308" | "#10B981"; // Black, White, Red, Blue, Yellow, Green

const COLOR_OPTIONS: { value: AnnotationColor; label: string }[] = [
  { value: "#000000", label: "Black" },
  { value: "#FFFFFF", label: "White" },
  { value: "#EF4444", label: "Red" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#EAB308", label: "Yellow" },
  { value: "#10B981", label: "Green" },
];

export function ImagingViewerContent({
  appointmentId,
  isReadOnly = false,
}: ImagingViewerContentProps) {
  // Dummy X-ray imaging files
  const [imagingFiles, setImagingFiles] = useState<ImagingFile[]>([
    {
      id: "img-1",
      url: xrayImage1,
      filename: "Cervical_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
    {
      id: "img-2",
      url: xrayImage2,
      filename: "Lumbar_Spine_AP.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
    {
      id: "img-3",
      url: xrayImage3,
      filename: "Thoracic_Spine_Lateral.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
    {
      id: "img-4",
      url: xrayImage4,
      filename: "Shoulder_AP.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
    {
      id: "img-5",
      url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=1000&fit=crop",
      filename: "Hand_PA.jpg",
      uploadedAt: new Date().toISOString(),
      annotations: [],
    },
  ]);

  const [selectedImageId, setSelectedImageId] = useState<string>(imagingFiles[0]?.id || "");
  const [activeTool, setActiveTool] = useState<AnnotationTool>(null);
  const [activeColor, setActiveColor] = useState<AnnotationColor>("#EF4444");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const selectedImage = imagingFiles.find((img) => img.id === selectedImageId);

  const handleToolSelect = (tool: AnnotationTool) => {
    if (isReadOnly) return;
    setActiveTool(tool);
  };

  const handleColorSelect = (color: AnnotationColor) => {
    setActiveColor(color);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50));
  };

  const handleSaveAnnotations = () => {
    setHasUnsavedChanges(false);
    // In real app, save to backend
  };

  const handleUndo = () => {
    if (!selectedImage || selectedImage.annotations.length === 0) return;
    
    setImagingFiles((files) =>
      files.map((file) =>
        file.id === selectedImageId
          ? { ...file, annotations: file.annotations.slice(0, -1) }
          : file
      )
    );
    setHasUnsavedChanges(true);
  };

  const handleRedo = () => {
    // Simple implementation - in real app would have redo stack
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((file, index) => ({
        id: `img-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        filename: file.name,
        uploadedAt: new Date().toISOString(),
        annotations: [],
      }));
      setImagingFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDeleteImage = (imageId: string) => {
    setImagingFiles((prev) => prev.filter((file) => file.id !== imageId));
    // If deleted image was selected, select first available image
    if (selectedImageId === imageId) {
      const remaining = imagingFiles.filter((file) => file.id !== imageId);
      setSelectedImageId(remaining[0]?.id || "");
    }
    setDeleteConfirmId(null);
  };

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
    };

    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showColorPicker]);

  // Reset zoom when switching images
  useEffect(() => {
    setZoomLevel(100);
  }, [selectedImageId]);

  // Redraw canvas when image changes or annotations update
  useEffect(() => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image || !selectedImage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Wait for image to load
    const drawAnnotations = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw all annotations for this image
      selectedImage.annotations.forEach((annotation) => {
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (annotation.type === "draw" && annotation.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
          annotation.points.forEach((point) => {
            ctx.lineTo(point.x, point.y);
          });
          ctx.stroke();
        } else if (annotation.type === "line" && annotation.points.length === 2) {
          ctx.beginPath();
          ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
          ctx.lineTo(annotation.points[1].x, annotation.points[1].y);
          ctx.stroke();
        } else if (annotation.type === "rectangle" && annotation.points.length === 2) {
          const width = annotation.points[1].x - annotation.points[0].x;
          const height = annotation.points[1].y - annotation.points[0].y;
          ctx.strokeRect(annotation.points[0].x, annotation.points[0].y, width, height);
        } else if (annotation.type === "circle" && annotation.points.length === 2) {
          const centerX = annotation.points[0].x;
          const centerY = annotation.points[0].y;
          const radius = Math.sqrt(
            Math.pow(annotation.points[1].x - centerX, 2) +
            Math.pow(annotation.points[1].y - centerY, 2)
          );
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          ctx.stroke();
        } else if (annotation.type === "text" && annotation.points.length === 1 && annotation.text) {
          ctx.fillStyle = annotation.color;
          ctx.font = "16px sans-serif";
          ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
        }
      });
    };

    if (image.complete) {
      drawAnnotations();
    } else {
      image.onload = drawAnnotations;
    }
  }, [selectedImage, selectedImageId]);

  // Canvas interaction handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasPoint = (e: MouseEvent): { x: number; y: number } => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvas.width,
        y: ((e.clientY - rect.top) / rect.height) * canvas.height,
      };
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!activeTool || isReadOnly) return;

      const point = getCanvasPoint(e);
      setIsDrawing(true);
      setStartPoint(point);

      if (activeTool === "draw") {
        setCurrentAnnotation({
          id: Date.now().toString(),
          type: "draw",
          color: activeColor,
          points: [point],
        });
      } else if (activeTool === "text") {
        const text = prompt("Enter text annotation:");
        if (text) {
          const newAnnotation: Annotation = {
            id: Date.now().toString(),
            type: "text",
            color: activeColor,
            points: [point],
            text,
          };
          setImagingFiles((files) =>
            files.map((file) =>
              file.id === selectedImageId
                ? { ...file, annotations: [...file.annotations, newAnnotation] }
                : file
            )
          );
          setHasUnsavedChanges(true);
        }
        setIsDrawing(false);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing || !activeTool || !startPoint) return;

      const point = getCanvasPoint(e);
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (activeTool === "draw" && currentAnnotation) {
        setCurrentAnnotation({
          ...currentAnnotation,
          points: [...currentAnnotation.points, point],
        });
        
        // Draw immediately for smooth drawing
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        const points = currentAnnotation.points;
        if (points.length > 0) {
          ctx.beginPath();
          ctx.moveTo(points[points.length - 1].x, points[points.length - 1].y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        }
      } else if (activeTool === "line" || activeTool === "rectangle" || activeTool === "circle") {
        // Preview shape
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Redraw ALL existing annotations
        selectedImage?.annotations.forEach((annotation) => {
          ctx.strokeStyle = annotation.color;
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          if (annotation.type === "draw" && annotation.points.length > 1) {
            ctx.beginPath();
            ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            annotation.points.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.stroke();
          } else if (annotation.type === "line" && annotation.points.length === 2) {
            ctx.beginPath();
            ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
            ctx.lineTo(annotation.points[1].x, annotation.points[1].y);
            ctx.stroke();
          } else if (annotation.type === "rectangle" && annotation.points.length === 2) {
            const width = annotation.points[1].x - annotation.points[0].x;
            const height = annotation.points[1].y - annotation.points[0].y;
            ctx.strokeRect(annotation.points[0].x, annotation.points[0].y, width, height);
          } else if (annotation.type === "circle" && annotation.points.length === 2) {
            const centerX = annotation.points[0].x;
            const centerY = annotation.points[0].y;
            const radius = Math.sqrt(
              Math.pow(annotation.points[1].x - centerX, 2) +
              Math.pow(annotation.points[1].y - centerY, 2)
            );
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
            ctx.stroke();
          } else if (annotation.type === "text" && annotation.points.length === 1 && annotation.text) {
            ctx.fillStyle = annotation.color;
            ctx.font = "16px sans-serif";
            ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
          }
        });

        // Draw preview
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        if (activeTool === "line") {
          ctx.beginPath();
          ctx.moveTo(startPoint.x, startPoint.y);
          ctx.lineTo(point.x, point.y);
          ctx.stroke();
        } else if (activeTool === "rectangle") {
          ctx.strokeRect(
            startPoint.x,
            startPoint.y,
            point.x - startPoint.x,
            point.y - startPoint.y
          );
        } else if (activeTool === "circle") {
          const radius = Math.sqrt(
            Math.pow(point.x - startPoint.x, 2) + Math.pow(point.y - startPoint.y, 2)
          );
          ctx.beginPath();
          ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDrawing || !activeTool || !startPoint) return;

      const point = getCanvasPoint(e);

      if (activeTool === "draw" && currentAnnotation) {
        setImagingFiles((files) =>
          files.map((file) =>
            file.id === selectedImageId
              ? { ...file, annotations: [...file.annotations, currentAnnotation] }
              : file
          )
        );
        setHasUnsavedChanges(true);
      } else if (activeTool === "line" || activeTool === "rectangle" || activeTool === "circle") {
        const newAnnotation: Annotation = {
          id: Date.now().toString(),
          type: activeTool,
          color: activeColor,
          points: [startPoint, point],
        };
        setImagingFiles((files) =>
          files.map((file) =>
            file.id === selectedImageId
              ? { ...file, annotations: [...file.annotations, newAnnotation] }
              : file
          )
        );
        setHasUnsavedChanges(true);
      }

      setIsDrawing(false);
      setStartPoint(null);
      setCurrentAnnotation(null);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [activeTool, activeColor, isDrawing, startPoint, currentAnnotation, isReadOnly, selectedImageId, selectedImage]);

  return (
    <div className="h-full flex flex-col">
      {/* Top Controls - Upload and Annotation Toolbar */}
      <div className="flex items-center justify-between mb-4 gap-4">
        {/* Annotation Toolbar */}
        {imagingFiles.length > 0 && (
          <div className="flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-neutral-900 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700">
            <ToolButton
              icon={Pencil}
              active={activeTool === "draw"}
              onClick={() => handleToolSelect("draw")}
              disabled={isReadOnly}
              tooltip="Draw"
            />
            <ToolButton
              icon={Minus}
              active={activeTool === "line"}
              onClick={() => handleToolSelect("line")}
              disabled={isReadOnly}
              tooltip="Line"
            />
            <ToolButton
              icon={Square}
              active={activeTool === "rectangle"}
              onClick={() => handleToolSelect("rectangle")}
              disabled={isReadOnly}
              tooltip="Rectangle"
            />
            <ToolButton
              icon={Circle}
              active={activeTool === "circle"}
              onClick={() => handleToolSelect("circle")}
              disabled={isReadOnly}
              tooltip="Circle"
            />
            <ToolButton
              icon={Type}
              active={activeTool === "text"}
              onClick={() => handleToolSelect("text")}
              disabled={isReadOnly}
              tooltip="Text"
            />
            <ToolButton
              icon={Eraser}
              active={activeTool === "eraser"}
              onClick={() => handleToolSelect("eraser")}
              disabled={isReadOnly}
              tooltip="Eraser"
            />
            
            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
            
            {/* Color Picker */}
            {!isReadOnly && (
              <>
                <div ref={colorPickerRef} className="relative">
                  <ToolButton
                    icon={Palette}
                    active={showColorPicker}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    disabled={false}
                    tooltip="Color"
                  />
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 p-2 flex gap-2 z-50">
                      {COLOR_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorSelect(option.value);
                            setShowColorPicker(false);
                          }}
                          title={option.label}
                          className={`w-7 h-7 rounded-full transition-all ${
                            activeColor === option.value
                              ? "ring-2 ring-offset-2 ring-offset-white dark:ring-offset-neutral-800 scale-110"
                              : "hover:scale-110"
                          }`}
                          style={{ 
                            backgroundColor: option.value,
                            border: option.value === "#FFFFFF" ? "1px solid #e5e5e5" : "none",
                          }}
                        >
                          <span className="sr-only">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
              </>
            )}
            
            <ToolButton
              icon={Undo2}
              onClick={handleUndo}
              disabled={isReadOnly || !selectedImage || selectedImage.annotations.length === 0}
              tooltip="Undo"
            />
            <ToolButton
              icon={Redo2}
              onClick={handleRedo}
              disabled={isReadOnly}
              tooltip="Redo"
            />
            
            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
            
            <ToolButton
              icon={ZoomOut}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              tooltip="Zoom out"
            />
            <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 px-2">
              {zoomLevel}%
            </span>
            <ToolButton
              icon={ZoomIn}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              tooltip="Zoom in"
            />
            
            {!isReadOnly && (
              <>
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
                
                <ToolButton
                  icon={Save}
                  onClick={handleSaveAnnotations}
                  disabled={!hasUnsavedChanges}
                  tooltip="Save annotations"
                  variant="primary"
                />
              </>
            )}
            
            {isReadOnly && (
              <>
                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-1" />
                <div className="flex items-center gap-1 px-2">
                  <Lock className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                </div>
              </>
            )}
          </div>
        )}

        {/* Upload Button */}
        {!isReadOnly && (
          <label className="inline-flex items-center gap-2 px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            Upload imaging
            <input
              type="file"
              multiple
              accept="image/*,.dcm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Main Workspace */}
      {imagingFiles.length > 0 ? (
        <div className="flex-1 flex gap-4 min-h-0">
          {/* Primary Image Viewer - Left (~75%) */}
          <div className="flex-[3] relative flex items-center justify-center bg-neutral-900 rounded-lg overflow-hidden">
            {/* Delete Button on Main Image */}
            {!isReadOnly && (
              <button
                onClick={() => setDeleteConfirmId(selectedImageId)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-destructive flex items-center justify-center transition-all z-10 group"
                title="Delete image"
              >
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            )}

            {/* Image */}
            <div
              className="relative flex items-center justify-center"
              style={{ transform: `scale(${zoomLevel / 100})`, transition: "transform 0.2s" }}
            >
              <img
                ref={imageRef}
                src={selectedImage?.url}
                alt={selectedImage?.filename}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Canvas overlay for annotations */}
              <canvas
                ref={canvasRef}
                width={800}
                height={1000}
                className="absolute inset-0 w-full h-full"
                style={{ 
                  cursor: activeTool ? "crosshair" : "default",
                  pointerEvents: isReadOnly ? "none" : "auto",
                }}
              />
            </div>

            {/* Image Info Overlay */}
            <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg">
              <p className="text-xs font-medium text-white">{selectedImage?.filename}</p>
            </div>
          </div>

          {/* Thumbnail Gallery - Right (~25%) */}
          <div className="w-32 flex flex-col gap-2 overflow-y-auto pr-1">
            {imagingFiles.map((file) => (
              <div key={file.id} className="relative flex-shrink-0">
                <button
                  onClick={() => setSelectedImageId(file.id)}
                  className={`relative group aspect-[3/4] w-full rounded-md overflow-hidden transition-all ${
                    selectedImageId === file.id
                      ? "ring-2 ring-primary-500"
                      : "hover:ring-2 hover:ring-neutral-300 dark:hover:ring-neutral-600"
                  }`}
                >
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                  {selectedImageId === file.id && (
                    <div className="absolute inset-0 bg-primary-500/10" />
                  )}
                </button>
                
                {/* Delete Button */}
                {!isReadOnly && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(file.id);
                    }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10"
                    title="Delete image"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty State
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-600" />
            </div>
            <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No imaging files
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Upload X-rays, MRIs, or other imaging files
            </p>
            {!isReadOnly && (
              <label className="inline-flex items-center gap-2 px-4 h-9 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload imaging
                <input
                  type="file"
                  multiple
                  accept="image/*,.dcm"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-md w-full mx-4 border border-neutral-200 dark:border-neutral-800">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Delete image?
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                Are you sure you want to delete this image? This action cannot be undone.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 h-9 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteImage(deleteConfirmId)}
                  className="px-4 h-9 rounded-lg bg-destructive hover:bg-destructive/90 text-white text-sm font-medium transition-colors"
                >
                  Delete image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Utility Controls - Very Light */}
      {imagingFiles.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 italic">
            * Selected image: {selectedImage?.filename}
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {imagingFiles.length} images uploaded
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// Tool Button Component
interface ToolButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  tooltip?: string;
  variant?: "default" | "primary";
}

function ToolButton({
  icon: Icon,
  active = false,
  onClick,
  disabled = false,
  tooltip,
  variant = "default",
}: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
        variant === "primary"
          ? "bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
          : active
          ? "bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400"
          : "hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}