import React, { useState, useEffect, ChangeEvent, DragEvent } from "react";
import { XCircle } from "lucide-react";
import { PortfolioData } from "../redux/types/portfolioTypes";
import { getEnvironment } from "../utils/getEnvironment";

export interface FileWithPreview extends File {
  preview?: string;
}

interface ModalCreateEditPortfolioProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    id?: string;
    title: string;
    description: string;
    technologies: string[];
    keyFeatures: string[];
    files: FileWithPreview[];
  }) => void;
  initialData?: PortfolioData;
  mode?: "add" | "edit";
}

const ModalCreateEditPortfolio: React.FC<ModalCreateEditPortfolioProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  mode = "add",
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [github, setGithub] = useState<string>("");
  const [previewLink, setPreviewLink] = useState<string>("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [keyFeatureInput, setKeyFeatureInput] = useState<string>("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [techInput, setTechInput] = useState<string>("");
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setType(initialData.type || "");
      setGithub(initialData.github || "");
      setPreviewLink(initialData.previewLink || "");
      setKeyFeatures(initialData.keyFeatures?.map((keyFeature) => keyFeature.description) || [])
      setTechnologies(initialData.technologies?.map((tech) => tech.name) || []);

      var files = initialData.images?.map((image) => {
        return {
          name: image.filename,
          size: 0,
          type: "image/jpeg",
          preview: `${getEnvironment()}/uploads/${image.filename}`,
        } as FileWithPreview;
      });
      setFiles(files || []);
    }
  }, [initialData]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
    ) as FileWithPreview[];

    droppedFiles.forEach((file) => {
      file.preview = URL.createObjectURL(file);
    });

    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files).filter(
      (file) => file.type.startsWith("image/") && file.size <= 2 * 1024 * 1024
    ) as FileWithPreview[];

    selectedFiles.forEach((file) => {
      file.preview = URL.createObjectURL(file);
    });

    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const addTechnology = () => {
    if (techInput.trim() !== "") {
      setTechnologies((prev) => [...prev, techInput.trim()]);
      setTechInput("");
    }
  };

  const addKeyFeatures = () => {
    if (keyFeatureInput.trim() !== "") {
      setKeyFeatures((prev) => [...prev, keyFeatureInput.trim()]);
      setKeyFeatureInput("");
    }
  };

  const handleSubmit = async () => {
    const formData = {
      id: initialData?.id,
      title,
      description,
      type,
      github,
      previewLink,
      keyFeatures,
      technologies,
      files,
    };

    onSubmit(formData);
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setKeyFeatures([]);
    setKeyFeatureInput("");
    setTechnologies([]);
    setTechInput("");
    setFiles([]);
  
    onClose();
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 dark:bg-black/80 transition-opacity" />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {mode === "edit" ? "Edit Item" : "Add New Item"}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 transition-colors"
              type="button"
            >
              <XCircle className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter title"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter description"
              />
            </div>
            <div>
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Type
              </label>
              <input
                id="type"
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter Type"
              />
            </div>
            <div>
              <label
                htmlFor="github"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Github
              </label>
              <input
                id="github"
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter Github Link"
              />
            </div>

            <div>
              <label
                htmlFor="previewLink"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Preview Link
              </label>
              <input
                id="previewLink"
                type="text"
                value={previewLink}
                onChange={(e) => setPreviewLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                placeholder="Enter Preview Link"
              />
            </div>

            {/* Key Features */}
            <div>
              <label
                htmlFor="tech-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Key Features
              </label>
              <div className="flex gap-2">
                <input
                  id="tech-input"
                  type="text"
                  value={keyFeatureInput}
                  onChange={(e) => setKeyFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addKeyFeatures()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Add Key Feature"
                />
                <button
                  onClick={addKeyFeatures}
                  type="button"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {keyFeatures.map((keyFeature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-200"
                  >
                    {keyFeature}
                    <button
                      onClick={() =>
                        setKeyFeatures(
                          keyFeatures.filter((_, i) => i !== index)
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label
                htmlFor="tech-input"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Technologies
              </label>
              <div className="flex gap-2">
                <input
                  id="tech-input"
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTechnology()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Add technology"
                />
                <button
                  onClick={addTechnology}
                  type="button"
                  className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-gray-200"
                  >
                    {tech}
                    <button
                      onClick={() =>
                        setTechnologies(
                          technologies.filter((_, i) => i !== index)
                        )
                      }
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      type="button"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Images
              </label>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-amber-500 transition-colors bg-gray-50 dark:bg-gray-700"
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-gray-600 dark:text-gray-300"
                >
                  Drag & drop images here, or click to select
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    (Max size: 2MB per image)
                  </p>
                </label>
              </div>
              <div className="mt-2 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      {file.preview && (
                        <img
                          src={file.preview}
                          alt={`Preview ${index + 1}`}
                          className="h-8 w-8 object-cover rounded"
                        />
                      )}
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {file.name}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      type="button"
                    >
                      <XCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
              type="button"
            >
              {mode === "edit" ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateEditPortfolio;
