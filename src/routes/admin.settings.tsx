import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("shop_settings").select("*").then(({ data }) => {
      const map: Record<string, string> = {};
      (data || []).forEach((s: { key: string; value: string }) => { map[s.key] = s.value; });
      setSettings(map);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const [key, value] of Object.entries(settings)) {
      await supabase.from("shop_settings").upsert({ key, value }, { onConflict: "key" });
    }
    setSaving(false);
  };

  const update = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const fields = [
    { key: "company_name", label: "Company Name", type: "text" },
    { key: "ecocash_number", label: "EcoCash Number", type: "text" },
    { key: "whatsapp_number", label: "WhatsApp Number", type: "text" },
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "email" },
    { key: "address", label: "Address", type: "text" },
    { key: "gps_lat", label: "GPS Latitude", type: "text" },
    { key: "gps_lng", label: "GPS Longitude", type: "text" },
    { key: "payment_instructions", label: "Payment Instructions", type: "textarea" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure shop details</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="mt-6 max-w-2xl space-y-4">
        {fields.map((f) => (
          <div key={f.key}>
            <Label>{f.label}</Label>
            {f.type === "textarea" ? (
              <Textarea value={settings[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
            ) : (
              <Input type={f.type} value={settings[f.key] || ""} onChange={(e) => update(f.key, e.target.value)} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
