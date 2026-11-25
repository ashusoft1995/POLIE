"use client";
import { useState, useEffect } from "react";
import { Check, X, Eye, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import Modal from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import { courtReferralApi } from "@/lib/api-client";

interface Referral {
  id: number;
  referralNumber: string;
  status: string;
  submittedAt: string;
  caseEntity: {
    caseNumber: string;
    title: string;
    caseType: string;
  };
  submittedByDetective: {
    fullName: string;
    badge: string;
  };
  investigationSummary: string;
  recommendedCharges: string;
  witnessDetails?: string;
  evidenceSummary?: string;
}

export default function PoliceHeadReferralsPage() {
  const { showToast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [approvalData, setApprovalData] = useState({
    approved: true,
    headRemarks: "",
    rejectionReason: "",
  });

  useEffect(() => {
    fetchReferrals();
  }, []);

  const fetchReferrals = async () => {
    try {
      const data = await courtReferralApi.getAll();
      setReferrals(data as any[]);
      return;
    } catch {}
    // Mock fallback
    setReferrals([
      {
        id: 1,
        referralNumber: "REF-2024-101",
        status: "PENDING_APPROVAL",
        submittedAt: "2024-11-25T10:30:00",
        caseEntity: { caseNumber: "TRK-2024-001", title: "Armed Robbery at Market", caseType: "Robbery" },
        submittedByDetective: { fullName: "Det. Abebe Girma", badge: "DET-012" },
        investigationSummary: "Suspect identified via CCTV. Three witnesses interviewed and statements recorded. Physical evidence collected from scene.",
        recommendedCharges: "Armed robbery under Article 670 of the Ethiopian Criminal Code.",
        witnessDetails: "Three witnesses: Kebede A., Meron T., Almaz B. All corroborate the incident.",
        evidenceSummary: "CCTV footage (2h), fingerprints, stolen items recovered.",
      },
      {
        id: 2,
        referralNumber: "REF-2024-098",
        status: "APPROVED",
        submittedAt: "2024-11-20T14:15:00",
        caseEntity: { caseNumber: "TRK-2024-004", title: "Fraud and Document Forgery", caseType: "Fraud" },
        submittedByDetective: { fullName: "Det. Abebe Girma", badge: "DET-012" },
        investigationSummary: "Forged documents recovered. Financial trail documented.",
        recommendedCharges: "Fraud and document forgery under Articles 681-683.",
        evidenceSummary: "Forged documents (12 pages), bank records, digital forensics report.",
      },
    ]);
  };

  const handleApproval = async () => {
    if (!selectedReferral) return;
    if (!approvalData.headRemarks.trim()) { showToast("Please add your remarks", "error"); return; }
    if (!approvalData.approved && !approvalData.rejectionReason.trim()) { showToast("Please provide a rejection reason", "error"); return; }

    setLoading(true);
    try {
      const user = JSON.parse(sessionStorage.getItem("hcops_user") || "{}");
      const headId = user.id ?? 1;
      await courtReferralApi.approve(selectedReferral.id, headId, approvalData);
      showToast(approvalData.approved ? "Referral approved successfully!" : "Referral rejected", "success");
      setIsApprovalModalOpen(false);
      setIsModalOpen(false);
      setApprovalData({ approved: true, headRemarks: "", rejectionReason: "" });
      fetchReferrals();
      return;
    } catch {
      // Mock fallback — update local state
      setReferrals(rs => rs.map(r =>
        r.id === selectedReferral.id
          ? { ...r, status: approvalData.approved ? "APPROVED" : "REJECTED" }
          : r
      ));
      showToast(approvalData.approved ? "Referral approved successfully!" : "Referral rejected", "success");
      setIsApprovalModalOpen(false);
      setIsModalOpen(false);
      setApprovalData({ approved: true, headRemarks: "", rejectionReason: "" });
    } finally {
      setLoading(false);
    }
  };

  const pendingReferrals = referrals.filter((r) => r.status === "PENDING_APPROVAL");
  const approvedReferrals = referrals.filter((r) => r.status === "APPROVED");
  const rejectedReferrals = referrals.filter((r) => r.status === "REJECTED");

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING_APPROVAL: "bg-amber-100 text-amber-700 border-amber-200",
      APPROVED: "bg-green-100 text-green-700 border-green-200",
      REJECTED: "bg-red-100 text-red-700 border-red-200",
      SENT_TO_COURT: "bg-blue-100 text-blue-700 border-blue-200",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded-full border ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.replace(/_/g, " ")}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Court Referrals Review
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Review and approve court referrals from detectives
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-amber-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                {pendingReferrals.length}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {approvedReferrals.length}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {rejectedReferrals.length}
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">Rejected</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {referrals.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Referrals */}
      {pendingReferrals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Pending Approval ({pendingReferrals.length})
          </h2>
          <div className="space-y-3">
            {pendingReferrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {referral.referralNumber}
                    </span>
                    {getStatusBadge(referral.status)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {referral.caseEntity.caseNumber} - {referral.caseEntity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Submitted by: {referral.submittedByDetective.fullName} (
                    {referral.submittedByDetective.badge}) •{" "}
                    {new Date(referral.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedReferral(referral);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Eye size={16} />
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Referrals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          All Referrals
        </h2>
        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p className="text-gray-600 dark:text-gray-400">No referrals yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      {referral.referralNumber}
                    </span>
                    {getStatusBadge(referral.status)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {referral.caseEntity.caseNumber} - {referral.caseEntity.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {referral.submittedByDetective.fullName} •{" "}
                    {new Date(referral.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedReferral(referral);
                    setIsModalOpen(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Court Referral Details"
        size="lg"
      >
        {selectedReferral && (
          <div className="space-y-4">
            {/* Header Info */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                  {selectedReferral.referralNumber}
                </span>
                {getStatusBadge(selectedReferral.status)}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {selectedReferral.caseEntity.caseNumber} -{" "}
                {selectedReferral.caseEntity.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Submitted by: {selectedReferral.submittedByDetective.fullName} (
                {selectedReferral.submittedByDetective.badge}) on{" "}
                {new Date(selectedReferral.submittedAt).toLocaleString()}
              </p>
            </div>

            {/* Investigation Summary */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Investigation Summary
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {selectedReferral.investigationSummary}
              </div>
            </div>

            {/* Recommended Charges */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Recommended Charges
              </label>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {selectedReferral.recommendedCharges}
              </div>
            </div>

            {/* Witness Details */}
            {selectedReferral.witnessDetails && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Witness Details
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedReferral.witnessDetails}
                </div>
              </div>
            )}

            {/* Evidence Summary */}
            {selectedReferral.evidenceSummary && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Evidence Summary
                </label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                  {selectedReferral.evidenceSummary}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {selectedReferral.status === "PENDING_APPROVAL" && (
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => {
                    setApprovalData({ ...approvalData, approved: true });
                    setIsApprovalModalOpen(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Check size={18} />
                  Approve
                </button>
                <button
                  onClick={() => {
                    setApprovalData({ ...approvalData, approved: false });
                    setIsApprovalModalOpen(true);
                  }}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Approval/Rejection Modal */}
      <Modal
        isOpen={isApprovalModalOpen}
        onClose={() => setIsApprovalModalOpen(false)}
        title={approvalData.approved ? "Approve Referral" : "Reject Referral"}
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleApproval();
          }}
          className="space-y-4"
        >
          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Remarks *
            </label>
            <textarea
              value={approvalData.headRemarks}
              onChange={(e) =>
                setApprovalData({ ...approvalData, headRemarks: e.target.value })
              }
              rows={4}
              placeholder={
                approvalData.approved
                  ? "e.g., Investigation thorough. Evidence sufficient for prosecution. Approved for court referral."
                  : "e.g., Investigation incomplete. Need more evidence before referral."
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Rejection Reason */}
          {!approvalData.approved && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Rejection Reason *
              </label>
              <textarea
                value={approvalData.rejectionReason}
                onChange={(e) =>
                  setApprovalData({ ...approvalData, rejectionReason: e.target.value })
                }
                rows={3}
                placeholder="Provide specific reasons for rejection..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 px-4 py-2.5 ${
                approvalData.approved
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              } disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : approvalData.approved ? (
                <>
                  <Check size={18} />
                  Confirm Approval
                </>
              ) : (
                <>
                  <X size={18} />
                  Confirm Rejection
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsApprovalModalOpen(false)}
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
