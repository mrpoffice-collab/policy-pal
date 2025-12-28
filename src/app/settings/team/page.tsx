"use client";

import { useEffect, useState } from "react";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    email: string;
    image: string | null;
  };
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export default function TeamSettingsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<string>("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("viewer");
  const [inviting, setInviting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrg) {
      fetchMembers(selectedOrg);
    }
  }, [selectedOrg]);

  const fetchOrganizations = async () => {
    try {
      const res = await fetch("/api/organizations");
      const data = await res.json();
      setOrganizations(data.organizations || []);
      if (data.organizations?.length > 0) {
        setSelectedOrg(data.organizations[0].id);
      }
    } catch {
      console.error("Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (orgId: string) => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/members`);
      const data = await res.json();
      setMembers(data.members || []);
    } catch {
      console.error("Failed to fetch members");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg || !inviteEmail) return;

    setInviting(true);
    setMessage("");

    try {
      const res = await fetch(`/api/organizations/${selectedOrg}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Member invited successfully");
        setInviteEmail("");
        fetchMembers(selectedOrg);
      } else {
        setMessage(data.error || "Failed to invite member");
      }
    } catch {
      setMessage("Failed to invite member");
    } finally {
      setInviting(false);
    }
  };

  const currentOrg = organizations.find((o) => o.id === selectedOrg);
  const isAdmin = currentOrg?.role === "owner" || currentOrg?.role === "admin";

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Team Management</h2>
        <p className="text-sm text-gray-500">Manage your organization and team members</p>
      </div>

      {organizations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No organizations yet</p>
          <a
            href="/dashboard"
            className="text-indigo-600 hover:text-indigo-700"
          >
            Create your first organization
          </a>
        </div>
      ) : (
        <>
          {/* Organization Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization
            </label>
            <select
              value={selectedOrg}
              onChange={(e) => setSelectedOrg(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.role})
                </option>
              ))}
            </select>
          </div>

          {/* Team Members */}
          <div>
            <h3 className="text-md font-medium text-gray-900 mb-4">Team Members</h3>
            <div className="border border-gray-200 rounded-lg divide-y">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {member.user.image ? (
                        <img
                          src={member.user.image}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <span className="text-gray-500 font-medium">
                          {member.user.email[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.user.email}</p>
                      <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Member */}
          {isAdmin && (
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-4">Invite Member</h3>
              <form onSubmit={handleInvite} className="flex gap-4">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={inviting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {inviting ? "Inviting..." : "Invite"}
                </button>
              </form>
              {message && (
                <p className={`mt-2 text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
