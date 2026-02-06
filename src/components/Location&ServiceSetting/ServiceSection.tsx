"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { Category } from "@/hooks/useLeadProfile";
import AddServicesDialog from "./Addservicesdialog";
import { toast } from "sonner";

interface ServicesSectionProps {
  profile: any;
  categories: Category[];
  saving: boolean;
  addCategory: (categoryId: number, categoryName: string) => void;
  onRemove: (categoryId: number) => void;
}

export default function ServicesSection({
  profile,
  categories,
  saving,
  addCategory,
  onRemove,
}: ServicesSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Card className="rounded-2xl shadow-lg border p-0 border-gray-200 dark:border-gray-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 px-6 py-5 border-b dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Your Services
          </CardTitle>
          <Button
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={() => setDialogOpen(true)}
          >
            <PlusCircle className="w-4 h-4 mr-2" /> Add Services
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 space-y-4">
        <div className="min-h-[120px]">
          {profile.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.categories.map((c: any) => (
                <div
                  key={c.category_id}
                  className={` px-4 py-2 text-sm rounded-full
                   flex items-center gap-2 cursor-pointer
                    ${profile.categories.length <= 1 ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed" : "  bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-200 hover:bg-red-100 dark:hover:bg-red-700 hover:text-red-700 dark:hover:text-red-200 transition-all"}
                 `}
                  onClick={() => {
                    if (saving) return;

                    if (profile.categories.length <= 1) {
                      toast.error("You must have at least one service");
                      return;
                    }

                    !saving && onRemove(c.category_id);
                  }}
                >
                  {c.category_name} <Trash2 className="w-4.5 h-4.5" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500 py-8">
              <p className="text-base font-medium">No services selected yet</p>
              <p className="text-sm mt-1">
                Click "Add Services" to get started
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            💡 <strong>Tip:</strong> Click on a service badge to remove it from
            your profile
          </p>
        </div>
      </CardContent>

      <AddServicesDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        categories={categories}
        profile={profile}
        addCategory={addCategory}
      />
    </Card>
  );
}
