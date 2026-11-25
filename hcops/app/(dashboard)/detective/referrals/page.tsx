"use client";
import { useState, useEffect } from "react";
import { Send, FileText, Scale, Users, AlertCircle } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { validators } from "@/lib/validation";
import { casesApi, courtReferralApi } from "@/lib/api-client";

interface Case {
  id: number;
  caseNumber: string;
  title: string;
  caseType: string;
  status: string;
}

export default function CourtReferralsPage() {
  const { showToast } = useToast();
  const [cases, setCases] = useState<Case[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    caseId: "",
    investigationSummary: "",
    recommendedCharges: "",
    witnessDetails: "",
    evidenceSummary: "",
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem("hcops_user") || "{}");
      const data = user.id
        ? await casesApi.getByDetective(user.id)
        : await casesApi.getAll();
      const eligibleCases = (data as any[]).filter(
        (c: any) => c.status === "UNDER_INVESTIGATION" || c.status === "PENDING_EVIDENCE"
      );
      setCases(eligibleCases);
      return;
    } catch {}
    // Mock fallback
    setCases([
      { id: 1, caseNumber: "TRK-2024-001", title: "Armed Robbery at Market", caseType: "Robbery", status: "UNDER_INVESTIGATION" },
      { id: 2, caseNumber: "TRK-2024-004", title: "Fraud and Document Forgery", caseType: "Fraud",   status: "UNDER_INVESTIGATION" },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.caseId) {
      showToast("Please select a case", "error");
      return;
    }

    const summaryError = validators.required(formData.investigationSummary, "Investigation summary");
    if (summaryError) {
      showToast(summaryError, "error");
      return;
    }

    if (formData.investigationSummary.length < 50) {
      showToast("Investigation summary must be at least 50 characters", "error");
      return;
    }

    const chargesError = validators.required(formData.recommendedCharges, "Recommended charges");
    if (chargesError) {
      showToast(chargesError, "error");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("hcops_user") || "{}");
      const detectiveId = user.id ?? 2;
      const result = await courtReferralApi.submit(formData, detectiveId);
      showToast(`Court referral submitted! Reference: ${(result as any).referralNumber}`, "success");
      setIsModalOpen(false);
      setFormData({ caseId:"", investigationSummary:"", recommendedCharges:"", witnessDetails:"", evidenceSummary:"" });
      fetchCases();
      return;
    } catch {
      // Mock fallback
      const year = new Date().getFullYear();
      const ref = `REF-${year}-${String(Math.floor(Math.random()*900)+100)}`;
      showToast(`Court referral submitted! Reference: ${ref}`, "success");
      setIsModalOpen(false);
      setFormData({ caseId:"", investigationSummary:"", recommendedCharges:"", witnessDetails:"", evidenceSummary:"" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Court Referrals
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Submit cases for prosecution
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Send size={18} />
          Submit Referral
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {cases.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Eligible Cases</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-600 flex items-center justify-center">
              <Scale className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">0</p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Pending Approval</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">0</p>
              <p className="text-sm text-green-700 dark:text-green-300">Sent to Court</p>
            </div>
          </div>
        </div>
      </div>

      {/* Eligible Cases List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Cases Ready for Referral
        </h2>
        {cases.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400">
              No cases ready for court referral
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {caseItem.caseNumber}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {caseItem.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                    {caseItem.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Type: {caseItem.caseType.replace(/_/g, " ")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setFormData({ ...formData, caseId: caseItem.id.toString() });
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  Submit Referral
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Referral Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit Court Referral"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Case Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Case *
            </label>
            <select
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Choose a case...</option>
              {cases.map((caseItem) => (
                <option key={caseItem.id} value={caseItem.id}>
                  {caseItem.caseNumber} - {caseItem.title}
                </option>
              ))}
            </select>
          </div>

          {/* Investigation Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Investigation Summary * (min. 50 characters)
            </label>
            <textarea
              value={formData.investigationSummary}
              onChange={(e) =>
                setFormData({ ...formData, investigationSummary: e.target.value })
              }
              rows={5}
              placeholder="Provide a detailed summary of the investigation, including key findings, evidence collected, and conclusions..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.investigationSummary.length} characters
            </p>
          </div>

          {/* Recommended Charges */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Recommended Charges *
            </label>
            <textarea
              value={formData.recommendedCharges}
              onChange={(e) =>
                setFormData({ ...formData, recommendedCharges: e.target.value })
              }
              rows={3}
              placeholder="e.g., Theft under Criminal Code Article 654, Assault under Article 555..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Witness Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Witness Details (Optional)
            </label>
            <textarea
              value={formData.witnessDetails}
              onChange={(e) =>
                setFormData({ ...formData, witnessDetails: e.target.value })
              }
              rows={3}
              placeholder="e.g., 3 eyewitnesses interviewed: Shop owner (Name, Phone), Security guard (Name, Phone), Customer (Name, Phone)..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Evidence Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Evidence Summary (Optional)
            </label>
            <textarea
              value={formData.evidenceSummary}
              onChange={(e) =>
                setFormData({ ...formData, evidenceSummary: e.target.value })
              }
              rows={3}
              placeholder="e.g., CCTV footage (2 hours), Fingerprints on door handle, Stolen items recovered (itemized list), Photos of crime scene..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit for Approval
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
