import { ArrowLeft, Check, Globe, Image, Mail, Palette } from "lucide-react";
import Link from "next/link";
import { getWhiteLabelConfig } from "../actions";

export const metadata = {
  title: "Branding",
  description: "White-label customization",
};

export default async function BrandingPage() {
  const config = await getWhiteLabelConfig();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/partners"
            className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Partners
          </Link>
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Branding
        </h1>
        <p className="mt-2 text-sm text-white/40">
          Customize your white-label platform appearance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Domain */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 gradient-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 text-indigo-400">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Custom Domain</h2>
              <p className="text-sm text-white/40">Your branded endpoint</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
            <p className="text-sm font-mono text-white">{config.customDomain}</p>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400">
            <Check className="h-3.5 w-3.5" />
            SSL certificate active
          </div>
        </div>

        {/* Logo */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 gradient-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/5 text-purple-400">
              <Image className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Logo</h2>
              <p className="text-sm text-white/40">Displayed on tenant dashboard</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-center h-20">
            <img src={config.logoUrl} alt="Partner logo" className="max-h-10" />
          </div>
        </div>

        {/* Colors */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 gradient-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-500/5 text-amber-400">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Colors</h2>
              <p className="text-sm text-white/40">Brand color scheme</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Primary</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: config.primaryColor }} />
                <span className="text-sm font-mono text-white/60">{config.primaryColor}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Accent</span>
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full border border-white/10" style={{ backgroundColor: config.accentColor }} />
                <span className="text-sm font-mono text-white/60">{config.accentColor}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Dark Mode</span>
              <span className="text-sm text-emerald-400">{config.darkMode ? "Enabled" : "Disabled"}</span>
            </div>
          </div>
        </div>

        {/* Email Templates */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md p-6 gradient-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Email Templates</h2>
              <p className="text-sm text-white/40">Automated tenant emails</p>
            </div>
          </div>
          <div className="space-y-2">
            {Object.entries(config.emailTemplates).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/60 capitalize">{key}</span>
                <span className={`text-xs ${enabled ? "text-emerald-400" : "text-white/30"}`}>
                  {enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
