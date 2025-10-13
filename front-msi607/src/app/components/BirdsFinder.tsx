"use client";
import React, { useState, useRef, ChangeEvent, DragEvent } from "react";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";

import {
  IdentificationResult,
  ExpandedSections,
  FileValidation,
} from "@/app/interfaces/index";

type ConfidenceLevel = "high" | "medium" | "low";

const BirdIdentifierApp: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    characteristics: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_FORMATS: string[] = [
    "audio/mpeg",
    "audio/wav",
    "audio/x-m4a",
    "audio/ogg",
  ];
  const MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10 MB

  const validateFile = (file: File | null): FileValidation => {
    if (!file)
      return { valid: false, error: "No se seleccionó ningún archivo" };

    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return {
        valid: false,
        error:
          "Formato no válido. Solo se aceptan archivos MP3, WAV, M4A y OGG",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: "El archivo excede el tamaño máximo de 10 MB",
      };
    }

    return { valid: true };
  };

  const handleFileSelect = (selectedFile: File | null): void => {
    if (!selectedFile) return;

    const validation = validateFile(selectedFile);

    if (!validation.valid) {
      setError(validation.error || "Error desconocido");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (): void => {
    setIsDragging(false);
  };

  const simulateAnalysis = (): Promise<IdentificationResult> => {
    return new Promise((resolve) => {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        // Simulación de resultado
        resolve({
          confidence: 87,
          commonName: "Zorzal Patagónico",
          scientificName: "Turdus falcklandii",
          alternatives: [
            { name: "Zorzal Austral", confidence: 72 },
            { name: "Zorzal Colorado", confidence: 65 },
          ],
          details: {
            image:
              "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop",
            size: "23-25 cm de longitud",
            weight: "85-110 gramos",
            colors:
              "Plumaje marrón oliváceo en el dorso, pecho amarillento con manchas oscuras",
          },
        });
      }, 1000);
    });
  };

  const handleIdentify = async (): Promise<void> => {
    if (!file) {
      setError("Por favor, carga un archivo de audio primero");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisResult = await simulateAnalysis();
      setResult(analysisResult);
    } catch (err) {
      setError(
        "Ocurrió un error al procesar el audio. Por favor, intenta nuevamente."
      );
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const handleCancel = (): void => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleSection = (section: keyof ExpandedSections): void => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (confidence >= 60)
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 80) return "Alta confianza";
    if (confidence >= 60) return "Confianza media";
    return "Baja confianza";
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
            Identificador de Aves de Chile (Zona centro)
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Sube un audio del canto de un ave y descubre qué especie es
          </p>
          <p className="text-base sm:text-lg text-gray-600 font-bold">
            * Importante: Por el momento el modelo solo puede identificar a las
            aves Chercan, Zorzal, Chincol y Cachudito *
          </p>
        </header>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
              aria-label="Cerrar mensaje de error"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                Cargar Audio
              </h2>

              {/* Drag & Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all ${
                  isDragging
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <Upload className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-700 font-medium mb-2">
                  Arrastra tu archivo aquí
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  o haz clic para seleccionar
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".mp3,.wav,.m4a,.ogg,audio/mpeg,audio/wav,audio/x-m4a,audio/ogg"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className=" px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors font-medium min-h-[44px] flex items-center justify-center"
                >
                  Seleccionar Archivo
                </label>
                <p className="text-xs text-gray-500 mt-4">
                  Formatos aceptados: MP3, WAV, M4A, OGG (máx. 10 MB)
                </p>
              </div>

              {/* File Info */}
              {file && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-green-800 font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-green-700 text-sm">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCancel}
                      className="text-green-600 hover:text-green-800 flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      aria-label="Cancelar y eliminar archivo"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Identify Button */}
              <button
                onClick={handleIdentify}
                disabled={!file || isAnalyzing}
                className={`w-full mt-6 px-6 py-4 rounded-lg font-semibold text-white transition-all min-h-[44px] flex items-center justify-center gap-2 ${
                  file && !isAnalyzing
                    ? "bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analizando...
                  </>
                ) : (
                  "Identificar Ave"
                )}
              </button>

              {/* Progress Bar */}
              {isAnalyzing && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Procesando audio...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {result && (
              <>
                {/* Main Result */}
                <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
                    Resultado de Identificación
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        {result.commonName}
                      </h3>
                      <p className="text-lg text-gray-600 italic">
                        {result.scientificName}
                      </p>
                    </div>

                    <div
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getConfidenceColor(
                        result.confidence
                      )}`}
                    >
                      <Info className="w-5 h-5" />
                      <span className="font-semibold">
                        {getConfidenceLabel(result.confidence)} (
                        {result.confidence}%)
                      </span>
                    </div>

                    {result.alternatives && result.alternatives.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Otras especies posibles:
                        </p>
                        <div className="space-y-2">
                          {result.alternatives.map((alt, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-800">{alt.name}</span>
                              <span className="text-gray-600">
                                {alt.confidence}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Species Details */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img
                    src={result.details.image}
                    alt={result.commonName}
                    className="w-full h-48 sm:h-64 object-cover"
                  />

                  <div className="p-6 sm:p-8 space-y-4">
                    {/* Características Físicas */}
                    <div className="border-b border-gray-200 pb-4">
                      <button
                        onClick={() => toggleSection("characteristics")}
                        className="w-full flex items-center justify-between text-left min-h-[44px]"
                        aria-expanded={expandedSections.characteristics}
                      >
                        <h3 className="text-lg font-semibold text-gray-800">
                          Características Físicas
                        </h3>
                        {expandedSections.characteristics ? (
                          <ChevronUp className="w-5 h-5 text-gray-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-600" />
                        )}
                      </button>
                      {expandedSections.characteristics && (
                        <div className="mt-3 space-y-2 text-gray-700">
                          <p>
                            <strong>Tamaño:</strong> {result.details.size}
                          </p>
                          <p>
                            <strong>Peso:</strong> {result.details.weight}
                          </p>
                          <p>
                            <strong>Colores:</strong> {result.details.colors}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {!result && !isAnalyzing && (
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Info className="w-16 h-16 mx-auto" />
                </div>
                <p className="text-gray-600">
                  Carga un archivo de audio y presiona "Identificar Ave" para
                  comenzar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirdIdentifierApp;
