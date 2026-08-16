import React, { useEffect, useState } from "react";
import {
  FiCheck,
  FiCopy,
  FiGlobe,
  FiLink,
  FiLock,
  FiMail,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

import {
  addFileShare,
  addFolderShare,
  getFileSharing,
  getFolderSharing,
  removeFileShare,
  removeFolderShare,
  updateFileGeneralAccess,
  updateFolderGeneralAccess,
} from "../services/share.service";

const roleOptions = [
  {
    value: "VIEWER",
    label: "Viewer",
    description: "Can view",
  },
  {
    value: "COMMENTER",
    label: "Commenter",
    description: "Can view and comment",
  },
  {
    value: "EDITOR",
    label: "Editor",
    description: "Can edit",
  },
];

const ShareModal = ({ item, type, onClose }) => {
  const [sharing, setSharing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");

  const [adding, setAdding] = useState(false);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [updatingAccess, setUpdatingAccess] = useState(false);

  const [showAccessOptions, setShowAccessOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const isFile = type === "file";

  useEffect(() => {
    const fetchSharing = async () => {
      try {
        setLoading(true);
        setError("");

        const response = isFile
          ? await getFileSharing(item.id)
          : await getFolderSharing(item.id);

        setSharing(response);
      } catch (error) {
        console.error("Failed to fetch sharing information:", error);
        setError(
          error.response?.data?.message ||
            "Unable to load sharing information.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (item) {
      fetchSharing();
    }
  }, [item, isFile]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleAddShare = async () => {
    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Enter an email address.");
      return;
    }

    try {
      setAdding(true);
      setError("");

      const response = isFile
        ? await addFileShare(item.id, normalizedEmail, role)
        : await addFolderShare(item.id, normalizedEmail, role);

      setSharing((current) => ({
        ...current,
        people: [
          ...current.people.filter(
            (person) => person.user.id !== response.share.user.id,
          ),
          response.share,
        ],
      }));

      setEmail("");
      setRole("VIEWER");
    } catch (error) {
      console.error("Failed to share item:", error);
      setError(error.response?.data?.message || "Unable to share this item.");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveShare = async (userId) => {
    try {
      setRemovingUserId(userId);
      setError("");

      if (isFile) {
        await removeFileShare(item.id, userId);
      } else {
        await removeFolderShare(item.id, userId);
      }

      setSharing((current) => ({
        ...current,
        people: current.people.filter((person) => person.user.id !== userId),
      }));
    } catch (error) {
      console.error("Failed to remove access:", error);
      setError(error.response?.data?.message || "Unable to remove access.");
    } finally {
      setRemovingUserId(null);
    }
  };

  const handleGeneralAccessChange = async (linkAccess) => {
    try {
      setUpdatingAccess(true);
      setError("");

      const response = isFile
        ? await updateFileGeneralAccess(item.id, linkAccess)
        : await updateFolderGeneralAccess(item.id, linkAccess);

      setSharing((current) => ({
        ...current,
        generalAccess: response.generalAccess,
        shareToken: response.shareToken,
      }));

      setShowAccessOptions(false);
    } catch (error) {
      console.error("Failed to update general access:", error);
      setError(
        error.response?.data?.message || "Unable to update general access.",
      );
    } finally {
      setUpdatingAccess(false);
    }
  };

  const handleCopyLink = async () => {
    if (!sharing?.shareToken) return;

    const link = `${window.location.origin}/share/${type}/${sharing.shareToken}`;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const getInitials = (user) => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "?";
  };

  const getRoleLabel = (value) => {
    return roleOptions.find((option) => option.value === value)?.label || value;
  };

  if (!item) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-7 py-6">
          <div className="min-w-0 pr-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <FiLink size={20} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-xl font-bold text-slate-900">
                  Share "{item.name}"
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage who can access this {isFile ? "file" : "folder"}.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto px-7 py-6">
          {error && (
            <div className="mb-5 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading sharing information...
              </p>
            </div>
          ) : (
            <>
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Add people
                  </h3>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-2">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex flex-1 items-center gap-3 rounded-xl bg-white px-4 py-3">
                      <FiMail className="shrink-0 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            handleAddShare();
                          }
                        }}
                        placeholder="Add people by email"
                        className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                        disabled={adding}
                      />
                    </div>

                    <select
                      value={role}
                      onChange={(event) => setRole(event.target.value)}
                      className="rounded-xl border-0 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500"
                      disabled={adding}
                    >
                      {roleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={handleAddShare}
                      disabled={adding}
                      className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      <FiUserPlus size={17} />

                      {adding ? "Sharing..." : "Share"}
                    </button>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  People with access
                </h3>

                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  {sharing?.owner && (
                    <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                        {getInitials(sharing.owner)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {sharing.owner.firstName} {sharing.owner.lastName}
                        </p>

                        <p className="truncate text-xs text-slate-500">
                          {sharing.owner.email}
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Owner
                      </span>
                    </div>
                  )}

                  {sharing?.people?.length > 0 ? (
                    sharing.people.map((person) => (
                      <div
                        key={person.user.id}
                        className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                          {getInitials(person.user)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {person.user.firstName} {person.user.lastName}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {person.user.email}
                          </p>
                        </div>

                        <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
                          {getRoleLabel(person.role)}
                        </span>

                        <button
                          onClick={() => handleRemoveShare(person.user.id)}
                          disabled={removingUserId === person.user.id}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Remove access"
                        >
                          <FiX size={17} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-7 text-center">
                      <p className="text-sm font-medium text-slate-600">
                        No other people have access
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Add someone above to share this item.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              <section className="mt-8">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  General access
                </h3>

                <div className="relative">
                  <button
                    onClick={() => setShowAccessOptions((current) => !current)}
                    disabled={updatingAccess}
                    className="flex w-full items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      {sharing?.generalAccess?.type === "ANYONE" ? (
                        <FiGlobe size={19} />
                      ) : (
                        <FiLock size={19} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800">
                        {sharing?.generalAccess?.type === "ANYONE"
                          ? "Anyone with the link"
                          : "Restricted"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {sharing?.generalAccess?.type === "ANYONE"
                          ? "Anyone with the link can access"
                          : "Only people with access can open"}
                      </p>
                    </div>

                    <span className="text-sm font-medium text-slate-500">
                      {sharing?.generalAccess?.role || "Viewer"}
                    </span>

                    <span className="text-slate-400">›</span>
                  </button>

                  {showAccessOptions && (
                    <div className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                      <button
                        onClick={() => handleGeneralAccessChange("RESTRICTED")}
                        disabled={updatingAccess}
                        className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <FiLock />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Restricted
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Only people with access can open
                          </p>
                        </div>

                        {sharing?.generalAccess?.type === "RESTRICTED" && (
                          <FiCheck className="mt-1 text-emerald-600" />
                        )}
                      </button>

                      <button
                        onClick={() => handleGeneralAccessChange("ANYONE")}
                        disabled={updatingAccess}
                        className="flex w-full items-start gap-3 rounded-xl p-3 text-left transition hover:bg-slate-50"
                      >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                          <FiGlobe />
                        </div>

                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Anyone with the link
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Anyone with the link can access
                          </p>
                        </div>

                        {sharing?.generalAccess?.type === "ANYONE" && (
                          <FiCheck className="mt-1 text-emerald-600" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {sharing?.generalAccess?.type === "ANYONE" &&
                sharing?.shareToken && (
                  <section className="mt-4">
                    <button
                      onClick={handleCopyLink}
                      className="flex w-full items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3.5 text-left transition hover:bg-emerald-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                          <FiLink size={17} />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {copied ? "Link copied" : "Copy link"}
                          </p>

                          <p className="text-xs text-slate-500">
                            Share this link with anyone
                          </p>
                        </div>
                      </div>

                      <div className="text-emerald-600">
                        {copied ? <FiCheck size={19} /> : <FiCopy size={19} />}
                      </div>
                    </button>
                  </section>
                )}
            </>
          )}
        </div>

        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/60 px-7 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
