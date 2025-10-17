"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";

export default function LeadSettingsCard() {
  const [profile, setProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<
    { category_id: number; name: string }[]
  >([]);

  // Fetch user profile
  useEffect(() => {
    fetch("/api/user_profiles")
      .then((r) => r.json())
      .then(setProfile);
  }, []);

  // Fetch all categories once (for searching)
  useEffect(() => {
    fetch("/api/signup/category-selection") // ✅ make sure this returns all category_id + name
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  if (!profile) return <div>Loading...</div>;

  // Filter categories locally
  const searchResults =
    search.length > 1
      ? categories.filter((c) =>
          c.name.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  // Handlers
  async function toggleNationwide(value: boolean) {
    setProfile((prev: any) => ({ ...prev, is_nationwide: value }));
    await fetch("/api/user_profiles", {
      method: "PUT",
      body: JSON.stringify({
        location_id: profile.location_id,
        is_nationwide: value,
      }),
    });
  }

  async function removeCategory(category_id: number) {
    setProfile((prev: any) => ({
      ...prev,
      categories: prev.categories.filter((c: any) => c.category_id !== category_id),
    }));
    await fetch("/api/user_categories", {
      method: "DELETE",
      body: JSON.stringify({ category_id }),
    });
  }

  async function addCategory(category_id: number, category_name: string) {
    // prevent duplicates
    if (profile.categories.some((c: any) => c.category_id === category_id)) return;
    setProfile((prev: any) => ({
      ...prev,
      categories: [...prev.categories, { category_id, category_name }],
    }));
    await fetch("/api/user_categories", {
      method: "POST",
      body: JSON.stringify({ category_id }),
    });
    setSearch("");
  }
console.log(categories);

  return (
    <Card className="border rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-800">
          ⚙️ Lead Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Services</h3>
            <Button
              variant="link"
              className="p-0 h-auto text-sm text-green-700"
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? "Done" : "Edit"}
            </Button>
          </div>

          <p className="text-sm text-slate-500 mb-3">
            You’ll receive leads in these categories:
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {profile.categories?.map((c: any) => (
              <Badge
                key={c.category_id}
                variant="secondary"
                className="bg-slate-100 text-slate-700 cursor-pointer"
                onClick={() => isEditing && removeCategory(c.category_id)}
              >
                {c.category_name}
                {isEditing && <span className="ml-1 text-red-500">×</span>}
              </Badge>
            ))}
          </div>

          {/* 🔍 Inline Search Bar (visible only when editing) */}
          {isEditing && (
            <div className="space-y-2 relative">
              <Input
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <div className="absolute z-10 bg-white border rounded-md w-full shadow-md max-h-56 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((c) => (
                      <div
                        key={c.category_id}
                        className="px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer"
                        onClick={() => addCategory(c.category_id, c.name)}
                      >
                        {c.name}
                    
                      </div>
                    
                    ))
                  ) : (
                    <div className="text-sm text-center text-slate-500 py-3">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">Location</h3>
          </div>

          <p className="text-sm text-slate-500 mb-3">
            You’re receiving customers within:
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-green-600" />
            {profile.is_nationwide
              ? "Nationwide"
              : profile.location_name || "Not set"}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Switch
              checked={profile.is_nationwide}
              onCheckedChange={toggleNationwide}
            />
            <span className="text-sm text-slate-600">Offer Nationwide</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
