// export default Leads;
import React, { useState } from "react";
import { useLeads, useCreateLead, useDeleteLead } from "@/hooks/useLeads"; // Import useDeleteLead
import { PlusCircle, Search, Trash2 } from "lucide-react"; // Import Trash2
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LeadCard from "@/components/leads/LeadCard"; // Assuming LeadCard
import AddLeadDialog from "@/components/leads/AddLeadDialog";
import { createPageUrl } from "@/lib/utils";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Leads = () => {
  const [isAddLeadDialogOpen, setIsAddLeadDialogOpen] = useState(false);
  const { data: leads, isLoading, isError, error, refetch } = useLeads(); // Add refetch
  const { mutate: createDummyLead, isLoading: isCreatingDummy } =
    useCreateLead();
  const { mutate: deleteLead, isLoading: isDeletingLead } = useDeleteLead(); // Use hook for delete

  const handleManualAdd = () => {
    const dummyLead = {
      name: `Dummy Lead ${Math.floor(Math.random() * 100000)}`,
      email: `dummy${Math.floor(Math.random() * 100000)}@example.com`,
      company: "Dummy Corp",
      phone: "555-123-4567",
      status: "new",
      source: "other",
      estimated_value: Math.floor(Math.random() * 10000) + 1000,
      notes: "This is a manually added dummy lead for testing.",
    };
    createDummyLead(dummyLead, {
      onSuccess: () => toast.success("Dummy lead added!"),
      onError: (err) =>
        toast.error(
          `Failed to add dummy lead: ${err.message || "Unknown error"}`
        ),
    });
  };

  const handleLeadUpdate = () => {
    refetch(); // Refetch leads after update from LeadCard
  };

  const handleLeadDelete = (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this lead? This action cannot be undone."
      )
    ) {
      deleteLead(id, {
        onSuccess: () => {
          toast.success("Lead deleted successfully.");
          refetch(); // Refetch leads after deletion
        },
        onError: (err) => {
          console.error("Error deleting lead:", err);
          toast.error(
            `Failed to delete lead: ${err.message || "Unknown error"}`
          );
        },
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 min-h-screen bg-transparent text-white">
      {" "}
      {/* Removed gradient from here, now in Layout */}
      <h1 className="text-4xl font-bold mb-6 text-white text-center">
        Lead Management
      </h1>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex-grow flex items-center bg-white/10 rounded-lg backdrop-blur-md border border-white/20 shadow-md">
          <Search className="h-5 w-5 text-gray-300 ml-3" />
          <Input
            placeholder="Search leads..."
            className="w-full bg-transparent border-none focus-visible:ring-0 text-white placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleManualAdd}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            disabled={isCreatingDummy}
          >
            <PlusCircle className="h-4 w-4" />{" "}
            {isCreatingDummy ? "Adding..." : "Add Dummy Lead"}
          </Button>
          <Button
            onClick={() => setIsAddLeadDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" /> Add New Lead
          </Button>
        </div>
      </div>
      <AddLeadDialog
        isOpen={isAddLeadDialogOpen}
        onOpenChange={setIsAddLeadDialogOpen}
      />
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-60 w-full bg-white/10 rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-red-400 text-center">
          Error loading leads: {error.message}
        </p>
      ) : leads && leads.length === 0 ? (
        <p className="text-center text-gray-300">
          No leads found. Add a new lead to get started!
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {leads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onUpdate={handleLeadUpdate}
              onDelete={handleLeadDelete} // Pass delete handler
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Leads;
