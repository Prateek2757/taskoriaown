"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ImageIcon, Loader2, MapPin, Pencil, Search } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Location = {
  id: string;
  place_name: string;
  display_name: string | null;
  postal_code: string | null;
  state_name: string | null;
  state_code: string | null;
  state_slug: string | null;
  place_slug: string | null;
  popularity: number | null;
  image_url: string | null;
  description: string | null;
  updated_at: string;
};

type LocationsResponse = {
  locations: Location[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

async function fetcher(url: string): Promise<LocationsResponse> {
  const response = await fetch(url);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Unable to load locations");
  return data;
}

export default function AdminLocationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [enriched, setEnriched] = useState<"all" | "yes" | "no">("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Location | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin");
    if (status === "authenticated" && session?.user.adminrole !== "admin") {
      router.replace("/provider/dashboard");
    }
  }, [router, session, status]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const isAdmin = status === "authenticated" && session?.user.adminrole === "admin";
  const params = new URLSearchParams({
    page: String(page),
    limit: "25",
    enriched,
  });
  if (search) params.set("search", search);

  const { data, error, isLoading, mutate } = useSWR<LocationsResponse>(
    isAdmin ? `/api/admin/australia-locations?${params}` : null,
    fetcher,
    { keepPreviousData: true },
  );

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Checking permissions…
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Australian locations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add ranking, an image URL, and descriptive content to specific locations.
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search place, postcode, or state…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "yes", "no"] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={enriched === value ? "default" : "outline"}
              onClick={() => {
                setEnriched(value);
                setPage(1);
              }}
            >
              {value === "all" ? "All" : value === "yes" ? "Configured" : "Not configured"}
            </Button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground lg:ml-auto">
          {data?.pagination.total.toLocaleString() ?? "—"} locations
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead>Location</TableHead>
                <TableHead>Postcode</TableHead>
                <TableHead className="text-center">Popularity</TableHead>
                <TableHead>Content</TableHead>
                <TableHead className="w-24 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && !data ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center">
                    <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-destructive">
                    {error.message}
                  </TableCell>
                </TableRow>
              ) : data?.locations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-40 text-center text-muted-foreground">
                    No matching locations found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="flex items-start gap-3">
                        {location.image_url ? (
                          <img
                            src={location.image_url}
                            alt=""
                            className="h-10 w-14 rounded-md border object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-14 items-center justify-center rounded-md border bg-muted">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{location.place_name}</div>
                          <div className="font-medium">{location.display_name}</div>
                          <div className="text-xs text-muted-foreground">
                            {location.state_name ?? location.state_code ?? "State unavailable"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {location.postal_code ?? "—"}
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {location.popularity ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={location.image_url ? "text-emerald-600" : "text-muted-foreground"}>
                          Image {location.image_url ? "✓" : "—"}
                        </span>
                        <span className={location.description ? "text-emerald-600" : "text-muted-foreground"}>
                          Description {location.description ? "✓" : "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => setEditing(location)}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Page {data?.pagination.page ?? page} of {data?.pagination.totalPages ?? 1}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1 || isLoading} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!data || page >= data.pagination.totalPages || isLoading}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <LocationEditor
        location={editing}
        onOpenChange={(open) => !open && setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await mutate();
        }}
      />
    </div>
  );
}

function LocationEditor({
  location,
  onOpenChange,
  onSaved,
}: {
  location: Location | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => Promise<void>;
}) {
  const [popularity, setPopularity] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPopularity(location?.popularity?.toString() ?? "");
    setImageUrl(location?.image_url ?? "");
    setDescription(location?.description ?? "");
  }, [location]);

  async function save() {
    if (!location) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/australia-locations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: location.id,
          popularity: popularity.trim() === "" ? null : Number(popularity),
          image_url: imageUrl,
          description,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to save location");
      toast.success(`${location.place_name} updated`);
      await onSaved();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save location");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={Boolean(location)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit {location?.place_name}</DialogTitle>
          <DialogDescription>
            Only enrichment fields are editable. Location, postcode, and SEO slugs remain unchanged.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-2">
          <div className="grid gap-2">
            <Label htmlFor="popularity">Popularity</Label>
            <Input
              id="popularity"
              type="number"
              min="0"
              step="1"
              value={popularity}
              onChange={(event) => setPopularity(event.target.value)}
              placeholder="Higher values appear first"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input
              id="image-url"
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/location.webp"
            />
            {imageUrl && (
              <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border bg-muted">
                <img src={imageUrl} alt="Location preview" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Write location-specific content…"
              rows={6}
            />
            <span className="text-right text-xs text-muted-foreground">
              {description.length.toLocaleString()} characters
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={saving} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={saving} onClick={save}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
            Save location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
