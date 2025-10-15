"use client";
import { useToast } from "@/components/uiComponents/custom-toast/custom-toast";
import { DataTable } from "@/components/uiComponents/data-table/data-table";
import { SYSTEM_CONSTANTS } from "@/constants/staticConstant";
import { PostCallData, apiGetCall } from "@/helper/apiService";
import React, { useCallback, useEffect, useState } from "react";
import { createKycColumns } from "./columns";
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  Folder,
  Building2,
  Database,
  Plus,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import PopupForm from "../../components/PopupForm";

type Item = {
  id: string;
  parent: string;
  text: string;
  children?: Item[];
};

// Function to build nested tree
function buildTree(data: Item[]): Item[] {
  const map: Record<string, Item> = {};
  const roots: Item[] = [];

  data.forEach((item) => {
    map[item.id] = { ...item, children: [] };
  });

  data.forEach((item) => {
    if (item.parent === "#####") {
      roots.push(map[item.id]);
    } else if (map[item.parent]) {
      map[item.parent].children!.push(map[item.id]);
    }
  });

  return roots;
}

// Recursive component for tree rendering
const TreeNode: React.FC<{
  node: Item;
  onSelect: (id: string) => void;
  selectedId: string | null;
  level?: number;
}> = ({ node, onSelect, selectedId, level = 0 }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedId === node.id;

  const handleClick = () => {
    onSelect(node.id);
    if (hasChildren) {
      setExpanded((prev) => !prev);
    }
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-2 px-3 mx-1 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
          isSelected
            ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700 shadow-sm"
            : "hover:bg-gray-100"
        }`}
        style={{ marginLeft: `${level * 20}px` }}
        onClick={handleClick}
      >
        <div className="flex items-center space-x-2 flex-1">
          {hasChildren ? (
            <div className="flex items-center">
              {expanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              {expanded ? (
                <FolderOpen className="w-4 h-4 text-blue-500 ml-1" />
              ) : (
                <Folder className="w-4 h-4 text-blue-500 ml-1" />
              )}
            </div>
          ) : (
            <div className="flex items-center ml-6">
              <Database className="w-4 h-4 text-green-500" />
            </div>
          )}
          <span
            className={`text-sm font-medium ${
              isSelected ? "text-blue-700" : "text-gray-700"
            }`}
          >
            {node.text}
          </span>
        </div>
      </div>

      {expanded && hasChildren && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onSelect={onSelect}
              selectedId={selectedId}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function FolderStructure() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { showToast } = useToast();
  const [backendData, setbackendData] = useState<Item[]>([]);
  const treeData = buildTree(backendData);
  const generateReferralLink = useCallback(async () => {
    try {
      // setIsLoading(true);
      const submitData: PostCallData = {
        endpoint: "leager_setup",
      };

      const response = await apiGetCall(submitData);


      if (response && response.data.code === SYSTEM_CONSTANTS.success_code) {
        setbackendData(response.data.jsTreeDetails);
      } else {
        showToast(response?.data.code, response?.data.message, "");
      }
    } catch (error) {
      console.error("Error generating referral link:", error);
      showToast(
        SYSTEM_CONSTANTS.error_code,
        `Error: ${error || "Failed to generate referral link"}`,
        "Referral Link"
      );
    }
  }, [showToast]);
  useEffect(() => {
    generateReferralLink();
    // }
  }, [generateReferralLink]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-0 py-6 px-3  space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Account Management
            </h1>
          </div>
          <p className="text-gray-600">
            Manage your organizational accounts and view detailed ledger
            information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Tree Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-fit">
              <div className="border-b border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Folder className="w-5 h-5 mr-2 text-blue-500" />
                  Account Structure
                </h2>
              </div>
              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-1">
                  {treeData.map((node) => (
                    <TreeNode
                      key={node.id}
                      node={node}
                      onSelect={setSelectedId}
                      selectedId={selectedId}
                    />
                  ))}
                </div>

               
              </div>
            </div>
          </div>

          {/* DataTable Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 p-4 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-500" />
                  Ledger Details
                  {selectedId && (
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Account: {selectedId}
                    </span>
                  )}
                </h2>
                <div className="flex space-x-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex  justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 "
                      >
                        <Plus color="#fff" size={18} />
                        <span className="font-bold">Add</span>
                      </Button>
                    </DialogTrigger>
                    <PopupForm ledgerNo={selectedId ?? ''} />
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex justify-center items-center gap-2 py-2 px-3 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 font-medium"
                      >
                        <Pencil color="#fff" size={18} />
                        <span className="font-bold">Edit</span>
                      </Button>
                    </DialogTrigger>
                    <PopupForm ledgerNo={selectedId ?? ''} />
                  </Dialog>
                </div>
              </div>
              <div className="p-4">
                {selectedId ? (
                  <DataTable
                    key={selectedId}
                    columns={createKycColumns}
                    endpoint="ledger_list"
                    searchOptions={[]}
                    extraData={
                      {
                        DisplayLength: "10",
                        DisplayStart: "0",
                        LgCode: selectedId,
                      } as any
                    }
                  />
                ) : (
                  <div className="text-center py-12">
                    <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 text-lg font-medium">
                      Select an account to view ledger details
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Choose an account from the tree structure to see its
                      transaction history
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
