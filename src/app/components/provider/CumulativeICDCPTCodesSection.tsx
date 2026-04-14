import { useState } from "react";
import { Sparkles, Plus, Trash2, Link2, X } from "lucide-react";
import { CumulativeICDCPTDrawer } from "./CumulativeICDCPTDrawer";

export interface ICDCPTCode {
  code: string;
  description: string;
  type: "ICD" | "CPT";
}

export interface LinkedCodeGroup {
  id: string;
  icdCode: ICDCPTCode;
  cptCodes: ICDCPTCode[];
}

interface CumulativeICDCPTCodesSectionProps {
  soapData: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  onSave: (linkedGroups: LinkedCodeGroup[]) => void;
  initialLinkedGroups?: LinkedCodeGroup[];
}

export function CumulativeICDCPTCodesSection({
  soapData,
  onSave,
  initialLinkedGroups = [],
}: CumulativeICDCPTCodesSectionProps) {
  const [linkedGroups, setLinkedGroups] = useState<LinkedCodeGroup[]>(initialLinkedGroups);
  const [showDrawer, setShowDrawer] = useState(false);
  const [draggedICD, setDraggedICD] = useState<ICDCPTCode | null>(null);
  const [draggedCPT, setDraggedCPT] = useState<ICDCPTCode | null>(null);

  // Separate unlinked codes
  const [unlinkedICDCodes, setUnlinkedICDCodes] = useState<ICDCPTCode[]>([]);
  const [unlinkedCPTCodes, setUnlinkedCPTCodes] = useState<ICDCPTCode[]>([]);

  const handleCodesConfirmed = (icdCodes: ICDCPTCode[], cptCodes: ICDCPTCode[]) => {
    // Add new codes to unlinked arrays, avoiding duplicates
    const newICDCodes = icdCodes.filter(
      newCode => !unlinkedICDCodes.some(existing => existing.code === newCode.code) &&
                 !linkedGroups.some(group => group.icdCode.code === newCode.code)
    );
    const newCPTCodes = cptCodes.filter(
      newCode => !unlinkedCPTCodes.some(existing => existing.code === newCode.code) &&
                 !linkedGroups.some(group => group.cptCodes.some(cpt => cpt.code === newCode.code))
    );

    setUnlinkedICDCodes([...unlinkedICDCodes, ...newICDCodes]);
    setUnlinkedCPTCodes([...unlinkedCPTCodes, ...newCPTCodes]);
    setShowDrawer(false);
  };

  const handleLinkCodes = (icdCode: ICDCPTCode, cptCode: ICDCPTCode) => {
    // Check if the ICD code already has a group
    const existingGroupIndex = linkedGroups.findIndex(g => g.icdCode.code === icdCode.code);
    
    if (existingGroupIndex >= 0) {
      // Append to existing group avoiding duplicates
      const updatedGroups = [...linkedGroups];
      if (!updatedGroups[existingGroupIndex].cptCodes.some(c => c.code === cptCode.code)) {
        updatedGroups[existingGroupIndex].cptCodes.push(cptCode);
      }
      setLinkedGroups(updatedGroups);
    } else {
      // Create new linked group
      const newGroup: LinkedCodeGroup = {
        id: `group-${Date.now()}`,
        icdCode,
        cptCodes: [cptCode],
      };
      setLinkedGroups([...linkedGroups, newGroup]);
    }

    // Remove from unlinked
    setUnlinkedICDCodes(prev => prev.filter(code => code.code !== icdCode.code));
    setUnlinkedCPTCodes(prev => prev.filter(code => code.code !== cptCode.code));
  };

  const handleUnlinkCPT = (groupId: string, cptCodeCode: string) => {
    const groupIndex = linkedGroups.findIndex(g => g.id === groupId);
    if (groupIndex === -1) return;

    const group = linkedGroups[groupIndex];
    const cptCodeToUnlink = group.cptCodes.find(c => c.code === cptCodeCode);
    
    if (!cptCodeToUnlink) return;

    // Move CPT back to unlinked
    setUnlinkedCPTCodes(prev => [...prev, cptCodeToUnlink]);

    const updatedCptCodes = group.cptCodes.filter(c => c.code !== cptCodeCode);

    if (updatedCptCodes.length === 0) {
      // Move ICD back to unlinked and remove group
      setUnlinkedICDCodes(prev => [...prev, group.icdCode]);
      setLinkedGroups(prev => prev.filter(g => g.id !== groupId));
    } else {
      // Update group with remaining CPTs
      const updatedGroups = [...linkedGroups];
      updatedGroups[groupIndex] = { ...group, cptCodes: updatedCptCodes };
      setLinkedGroups(updatedGroups);
    }
  };

  const handleRemoveUnlinkedICD = (code: string) => {
    setUnlinkedICDCodes(prev => prev.filter(c => c.code !== code));
  };

  const handleRemoveUnlinkedCPT = (code: string) => {
    setUnlinkedCPTCodes(prev => prev.filter(c => c.code !== code));
  };

  const handleSave = () => {
    onSave(linkedGroups);
    alert("ICD-CPT code links saved successfully!");
  };

  // Drag and Drop handlers
  const handleDragStartICD = (code: ICDCPTCode) => {
    setDraggedICD(code);
  };

  const handleDragStartCPT = (code: ICDCPTCode) => {
    setDraggedCPT(code);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropOnCPT = (cptCode: ICDCPTCode) => {
    if (draggedICD) {
      handleLinkCodes(draggedICD, cptCode);
      setDraggedICD(null);
    }
  };

  const handleDropOnICD = (icdCode: ICDCPTCode) => {
    if (draggedCPT) {
      handleLinkCodes(icdCode, draggedCPT);
      setDraggedCPT(null);
    }
  };

  const handleDropOnGroup = (group: LinkedCodeGroup) => {
    if (draggedCPT) {
      handleLinkCodes(group.icdCode, draggedCPT);
      setDraggedCPT(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedICD(null);
    setDraggedCPT(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
            ICD-CPT Codes
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Link ICD diagnosis codes to multiple CPT procedure codes
          </p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="inline-flex items-center gap-2 h-9 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add ICD-CPT Codes
        </button>
      </div>

      {/* Linked Groups Section */}
      {linkedGroups.length > 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-950">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Linked ICD-CPT Groups
            </h4>
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              {linkedGroups.length} {linkedGroups.length === 1 ? 'group' : 'groups'} linked
            </span>
          </div>
          <div className="space-y-4">
            {linkedGroups.map((group) => (
              <div
                key={group.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDropOnGroup(group)}
                className="flex flex-col md:flex-row items-stretch md:items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800/80"
              >
                {/* ICD Code Container */}
                <div className="md:w-1/2 flex items-center gap-2 px-3 py-3 bg-white dark:bg-neutral-950 border border-blue-200 dark:border-blue-800 rounded shadow-sm">
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400">
                    ICD
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="block text-sm font-mono font-medium text-neutral-900 dark:text-white truncate">
                      {group.icdCode.code}
                    </span>
                    <span className="block text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {group.icdCode.description}
                    </span>
                  </div>
                </div>

                {/* Link Icon */}
                <div className="flex justify-center md:rotate-0 rotate-90">
                  <Link2 className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                </div>

                {/* CPT Codes List */}
                <div className="md:w-1/2 flex flex-col gap-2">
                  {group.cptCodes.map((cpt) => (
                    <div key={cpt.code} className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-950 border border-purple-200 dark:border-purple-800 rounded shadow-sm group/cpt">
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400">
                        CPT
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white mr-2">
                          {cpt.code}
                        </span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-1">
                          {cpt.description}
                        </span>
                      </div>
                      {/* Unlink Button */}
                      <button
                        onClick={() => handleUnlinkCPT(group.id, cpt.code)}
                        className="p-1.5 opacity-0 group-hover/cpt:opacity-100 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all focus:opacity-100"
                        title="Unlink CPT code"
                      >
                        <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unlinked Codes Section */}
      {(unlinkedICDCodes.length > 0 || unlinkedCPTCodes.length > 0) && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 bg-white dark:bg-neutral-950">
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
            Unlinked Codes
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Drag and drop to link ICD codes with CPT codes
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ICD Codes Column */}
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-3">
                ICD Codes (Diagnosis)
              </p>
              <div className="space-y-2">
                {unlinkedICDCodes.map((code) => (
                  <div
                    key={code.code}
                    draggable
                    onDragStart={() => handleDragStartICD(code)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnICD(code)}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-blue-200 dark:border-blue-800 rounded-lg cursor-move hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 flex-shrink-0">
                        ICD
                      </span>
                      <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white flex-shrink-0">
                        {code.code}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {code.description}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveUnlinkedICD(code.code)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                      title="Remove code"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
                {unlinkedICDCodes.length === 0 && (
                  <div className="px-3 py-8 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      No unlinked ICD codes
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* CPT Codes Column */}
            <div>
              <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-3">
                CPT Codes (Procedures)
              </p>
              <div className="space-y-2">
                {unlinkedCPTCodes.map((code) => (
                  <div
                    key={code.code}
                    draggable
                    onDragStart={() => handleDragStartCPT(code)}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDropOnCPT(code)}
                    className="flex items-center justify-between gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-purple-200 dark:border-purple-800 rounded-lg cursor-move hover:bg-purple-50 dark:hover:bg-purple-950/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 flex-shrink-0">
                        CPT
                      </span>
                      <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white flex-shrink-0">
                        {code.code}
                      </span>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                        {code.description}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveUnlinkedCPT(code.code)}
                      className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-colors flex-shrink-0"
                      title="Remove code"
                    >
                      <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                    </button>
                  </div>
                ))}
                {unlinkedCPTCodes.length === 0 && (
                  <div className="px-3 py-8 text-center border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      No unlinked CPT codes
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {linkedGroups.length === 0 && unlinkedICDCodes.length === 0 && unlinkedCPTCodes.length === 0 && (
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg p-8 text-center bg-white dark:bg-neutral-950">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-4">
            <Plus className="w-6 h-6 text-neutral-400" />
          </div>
          <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-2">
            No ICD-CPT codes added yet
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Click "Add ICD-CPT Codes" to generate codes based on all SOAP sections
          </p>
        </div>
      )}

      {/* Drawer */}
      <CumulativeICDCPTDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        soapData={soapData}
        onConfirm={handleCodesConfirmed}
      />
    </div>
  );
}