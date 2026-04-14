import { useState, useEffect } from "react";
import { ClinicAdminLayout } from "./layout/ClinicAdminLayout";
import { Search, Plus, ClipboardList, MapPin, Filter, X } from "lucide-react";
import { Pagination } from "../shared/Pagination";
import { TooltipBubble } from "../shared/TooltipBubble";
import { isStepCompleted } from "../shared/walkthroughUtils";

interface Questionnaire {
  id: string;
  categoryName: string;
  description: string;
  questionCount: number;
  branchNames: string[];
  createdAt: string;
  updatedAt: string;
}

interface QuestionnaireListScreenProps {
  questionnaires: Questionnaire[];
  onNavigate: (menu: string) => void;
  onAddQuestionnaire: () => void;
  onEditQuestionnaire: (questionnaireId: string) => void;
  onLogout?: () => void;
}

export function QuestionnaireListScreen({
  questionnaires,
  onNavigate,
  onAddQuestionnaire,
  onEditQuestionnaire,
  onLogout,
}: QuestionnaireListScreenProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [questionCountFilter, setQuestionCountFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "questions" | "updated">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeGuide, setActiveGuide] = useState<string | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, questionCountFilter, branchFilter]);

  useEffect(() => {
    setActiveGuide(localStorage.getItem("spinecloud_active_guide"));
    setBubbleDismissed(localStorage.getItem("spinecloud_bubble_dismissed_questionnaires") === "true");
  }, []);

  const handleDismissBubble = () => {
    setBubbleDismissed(true);
    localStorage.setItem("spinecloud_bubble_dismissed_questionnaires", "true");
  };

  // Get unique branch names
  const allBranches = Array.from(
    new Set((questionnaires || []).flatMap((q) => q.branchNames))
  );

  const filteredQuestionnaires = (questionnaires || []).filter((q) => {
    const matchesSearch =
      searchQuery === "" ||
      q.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesQuestionCount =
      questionCountFilter === "all" ||
      (questionCountFilter === "1-3" && q.questionCount >= 1 && q.questionCount <= 3) ||
      (questionCountFilter === "4-6" && q.questionCount >= 4 && q.questionCount <= 6) ||
      (questionCountFilter === "7+" && q.questionCount >= 7);

    const matchesBranch =
      branchFilter === "all" || q.branchNames.includes(branchFilter);

    return matchesSearch && matchesQuestionCount && matchesBranch;
  });

  const sortedQuestionnaires = [...filteredQuestionnaires].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc"
        ? a.categoryName.localeCompare(b.categoryName)
        : b.categoryName.localeCompare(a.categoryName);
    } else if (sortBy === "questions") {
      return sortOrder === "asc"
        ? a.questionCount - b.questionCount
        : b.questionCount - a.questionCount;
    } else {
      return sortOrder === "asc"
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const handleSort = (field: "name" | "questions" | "updated") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const activeFilterCount = 
    (questionCountFilter !== "all" ? 1 : 0) +
    (branchFilter !== "all" ? 1 : 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedQuestionnaires.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <ClinicAdminLayout activeMenu="questionnaires" onNavigate={onNavigate} onLogout={onLogout}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-1">
              Questionnaire Management
            </h1>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Create and manage patient questionnaires for branches
            </p>
          </div>
          {/* Add Questionnaire button with guided tooltip bubble */}
          <div className="relative">
            <button
              onClick={onAddQuestionnaire}
              className="inline-flex items-center gap-2 px-4 h-10 bg-primary-600 text-white rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Questionnaire
            </button>
            <TooltipBubble
              step="Step 4"
              title="Setup patient questionnaires"
              description="Click 'Add Questionnaire' to create intake or assessment forms for your patients to fill out."
              side="left"
              visible={!bubbleDismissed && (activeGuide === "questionnaires" || (!isStepCompleted("questionnaires") && activeGuide !== "skipped"))}
              onDismiss={handleDismissBubble}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search questionnaires..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 outline-none focus:border-primary-500 dark:focus:border-primary-600 focus:ring-2 focus:ring-primary-500/10 dark:focus:ring-primary-600/20 transition-[border-color,box-shadow]"
            />
          </div>

          {/* Filter Button */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center gap-2 px-4 h-10 border rounded-lg transition-colors text-sm font-medium ${
                activeFilterCount > 0
                  ? "border-primary-500 dark:border-primary-600 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400"
                  : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-600 dark:bg-primary-500 text-white text-xs">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
              <div className="absolute right-0 top-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg z-10">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Filters
                    </h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Question Count
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: "all", label: "All" },
                          { value: "1-3", label: "1-3 questions" },
                          { value: "4-6", label: "4-6 questions" },
                          { value: "7+", label: "7+ questions" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="questionCount"
                              checked={questionCountFilter === option.value}
                              onChange={() => setQuestionCountFilter(option.value)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-neutral-700 dark:text-neutral-300 font-medium block mb-2">
                        Branch
                      </label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="branch"
                            checked={branchFilter === "all"}
                            onChange={() => setBranchFilter("all")}
                            className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                          />
                          <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            All Branches
                          </span>
                        </label>
                        {allBranches.map((branch) => (
                          <label
                            key={branch}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name="branch"
                              checked={branchFilter === branch}
                              onChange={() => setBranchFilter(branch)}
                              className="w-4 h-4 text-primary-600 border-neutral-300 dark:border-neutral-700"
                            />
                            <span className="text-sm text-neutral-700 dark:text-neutral-300">
                              {branch}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => {
                        setQuestionCountFilter("all");
                        setBranchFilter("all");
                      }}
                      className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Questionnaires Table */}
        {currentItems.length > 0 ? (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-2">
                        Category Name
                        {sortBy === "name" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Description
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("questions")}
                    >
                      <div className="flex items-center gap-2">
                        Questions
                        {sortBy === "questions" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                      Branches
                    </th>
                    <th
                      className="text-left px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      onClick={() => handleSort("updated")}
                    >
                      <div className="flex items-center gap-2">
                        Last Updated
                        {sortBy === "updated" && (
                          <span className="text-neutral-400">
                            {sortOrder === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {currentItems.map((questionnaire) => (
                    <tr
                      key={questionnaire.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <button
                          onClick={() => onEditQuestionnaire(questionnaire.id)}
                          className="flex items-center gap-3 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-950/30 flex items-center justify-center shrink-0">
                            <ClipboardList className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          </div>
                          <span className="text-sm font-medium text-neutral-900 dark:text-white">
                            {questionnaire.categoryName}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 max-w-md">
                          {questionnaire.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-sm text-neutral-700 dark:text-neutral-300">
                          {questionnaire.questionCount} {questionnaire.questionCount === 1 ? 'question' : 'questions'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-neutral-400" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">
                            {questionnaire.branchNames.length > 0
                              ? questionnaire.branchNames.slice(0, 2).join(", ") +
                                (questionnaire.branchNames.length > 2
                                  ? ` +${questionnaire.branchNames.length - 2}`
                                  : "")
                              : "No branches"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {formatDate(questionnaire.updatedAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={sortedQuestionnaires.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              totalPages={Math.ceil(sortedQuestionnaires.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
              No questionnaires found
            </p>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters"
                : "Get started by creating your first questionnaire"}
            </p>
            {!searchQuery && activeFilterCount === 0 && (
              <button
                onClick={onAddQuestionnaire}
                className="inline-flex items-center gap-2 px-4 h-9 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Questionnaire
              </button>
            )}
          </div>
        )}
      </div>
    </ClinicAdminLayout>
  );
}