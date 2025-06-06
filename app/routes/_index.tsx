import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect, useRef } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Bookself - Your Collection Manager" },
    {
      name: "description",
      content: "Organize your light novels and manga collection",
    },
  ];
};

type BookType = "Light Novel" | "Manga" | string;

interface CollectionItem {
  id: number;
  title: string;
  author: string;
  publisher: string;
  type: BookType;
  coverUrl: string;
}

// Mock data - stable reference
const initialMockCollections: CollectionItem[] = [
  {
    id: 1,
    title: "Sword Art Online",
    author: "Reki Kawahara",
    publisher: "Yen Press",
    type: "Light Novel",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
  {
    id: 2,
    title: "Attack on Titan",
    author: "Hajime Isayama",
    publisher: "Kodansha",
    type: "Manga",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
  {
    id: 3,
    title: "Overlord",
    author: "Kugane Maruyama",
    publisher: "Yen Press",
    type: "Light Novel",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
  {
    id: 4,
    title: "One Piece",
    author: "Eiichiro Oda",
    publisher: "Viz Media",
    type: "Manga",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
  {
    id: 5,
    title: "Re:Zero",
    author: "Tappei Nagatsuki",
    publisher: "Yen Press",
    type: "Light Novel",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
  {
    id: 6,
    title: "Demon Slayer",
    author: "Koyoharu Gotouge",
    publisher: "Viz Media",
    type: "Manga",
    coverUrl:
      "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
  },
];

// Notion-style Select Component
interface NotionSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
}

function NotionSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option or create one",
  required = false,
}: NotionSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show "Create" option if search term doesn't match any existing option
  const showCreateOption =
    searchTerm.trim() &&
    !filteredOptions.some(
      (option) => option.toLowerCase() === searchTerm.toLowerCase()
    );

  const allOptions = showCreateOption
    ? [...filteredOptions, `Create "${searchTerm}"`]
    : filteredOptions;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < allOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : allOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < allOptions.length) {
          handleOptionSelect(allOptions[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const handleOptionSelect = (option: string) => {
    if (option.startsWith('Create "')) {
      // Extract the new value from the create option
      const newValue = option.slice(8, -1); // Remove 'Create "' and '"'
      onChange(newValue);
    } else {
      onChange(option);
    }
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer transition-colors ${
          isOpen
            ? "ring-2 ring-blue-500 border-transparent"
            : "hover:border-gray-400"
        }`}
        role="button"
        tabIndex={0}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
      >
        {value ? (
          <span className="text-gray-900">{value}</span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="w-full px-2 py-1 text-sm border-none outline-none"
            />
          </div>

          <div className="py-1">
            {allOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">
                No options found
              </div>
            ) : (
              allOptions.map((option, index) => (
                <div
                  key={option}
                  role="option"
                  tabIndex={0}
                  aria-selected={index === highlightedIndex}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center ${
                    index === highlightedIndex
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleOptionSelect(option);
                    }
                  }}
                >
                  {option.startsWith('Create "') ? (
                    <span className="text-blue-600">{option}</span>
                  ) : (
                    option
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Index() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [mounted, setMounted] = useState(false);
  const [collections, setCollections] = useState<CollectionItem[]>(
    initialMockCollections
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    type: "",
  });

  // Extract unique values from existing collections for Notion-style selects
  const getUniqueTypes = () => {
    const types = new Set(collections.map((item) => item.type));
    return Array.from(types).sort();
  };

  const getUniqueAuthors = () => {
    const authors = new Set(collections.map((item) => item.author));
    return Array.from(authors).sort();
  };

  const getUniquePublishers = () => {
    const publishers = new Set(
      collections.map((item) => item.publisher).filter(Boolean)
    );
    return Array.from(publishers).sort();
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique book types from collections
  const getBookTypes = () => {
    const types = new Set(collections.map((item) => item.type));
    return Array.from(types).sort();
  };

  const filterOptions = ["All", ...getBookTypes()];

  // Filter collections
  const filteredCollections = collections.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === "All" || item.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleAddItem = () => {
    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.type.trim()
    )
      return;

    const newItem: CollectionItem = {
      id: Math.max(...collections.map((c) => c.id)) + 1,
      title: formData.title.trim(),
      author: formData.author.trim(),
      publisher: formData.publisher.trim(),
      type: formData.type.trim(),
      coverUrl:
        "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop",
    };

    setCollections((prev) => [...prev, newItem]);

    // Reset form
    setFormData({
      title: "",
      author: "",
      publisher: "",
      type: "",
    });
    setShowAddModal(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publisher: "",
      type: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">📚 Bookself</h1>
            </div>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              Add Item
            </button>
          </div>
        </div>
      </header>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Add New Item
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddItem();
              }}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter book title"
                  required
                />
              </div>

              {/* Author - Notion Style */}
              <NotionSelect
                label="Author"
                value={formData.author}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, author: value }))
                }
                options={getUniqueAuthors()}
                required
              />

              {/* Publisher - Notion Style */}
              <NotionSelect
                label="Publisher"
                value={formData.publisher}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, publisher: value }))
                }
                options={getUniquePublishers()}
              />

              {/* Book Type - Notion Style */}
              <NotionSelect
                label="Book Type"
                value={formData.type}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                options={getUniqueTypes()}
                required
              />

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !formData.title.trim() ||
                    !formData.author.trim() ||
                    !formData.type.trim()
                  }
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search your collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter Tabs and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === filter
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">View:</span>
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="List view"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "card"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Card view"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Collection Display */}
        {viewMode === "list" ? (
          /* Simple Vertical List */
          <div className="space-y-3">
            {filteredCollections.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-lg">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.author}</p>
                      {item.publisher && (
                        <p className="text-gray-500 text-xs">
                          {item.publisher}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.type === "Light Novel"
                            ? "bg-purple-100 text-purple-800"
                            : item.type === "Manga"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Card View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCollections.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[3/4] bg-gray-200 rounded-t-lg overflow-hidden">
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">{item.author}</p>
                    {item.publisher && (
                      <p className="text-xs text-gray-500 mb-2">
                        {item.publisher}
                      </p>
                    )}
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.type === "Light Novel"
                            ? "bg-purple-100 text-purple-800"
                            : item.type === "Manga"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
