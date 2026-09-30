import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { motion } from "framer-motion";
import { Circle, MoreHorizontal, Home, User, Users, UserRound, BookOpen, ChevronLeft, ChevronRight, ChevronDown, LayoutGrid, ThumbsUp, ThumbsDown, Link, Search, ArrowLeft, ArrowRight, X, Check, AlertTriangle, Settings, MessageSquare, Library, Sun, Moon, Bell, Menu, Loader2, Info, Filter as FilterIcon } from "lucide-react";
import { StarIcon } from "@/components/StarIcon";
import logoCSOD from "@/assets/CSOD_logo_black.png";
import logoCSODWhite from "@/assets/CSOD_logo_white.png";
import davidLinAvatar from "@/assets/david-lin.jpg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/ui/search-bar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { SmartBarInline } from "@/components/smart-teaming/SmartBar";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SpacingSpec, TypographySpec, IconSupportSpec, LoadingSpec, MotionSpec, A11ySpec, UsageInContext, CodeSnippetSection } from "@/components/design-system/SpecSections";


/* ── Color swatch mapping ── */
const tokenToHsl: Record<string, string> = {
  "ds/300": "hsl(263 60% 92%)",
  "ds/500": "hsl(258 90% 66%)",
  "ds/700": "hsl(259 34% 37%)",
  "red/400": "hsl(0 91% 71%)",
  "red/700": "hsl(var(--red-700))",
  "amber/700": "hsl(var(--amber-700))",
  "foreground": "hsl(221 39% 11%)",
  "primary": "hsl(12 95% 57%)",
  "primary-foreground": "hsl(0 0% 100%)",
  "secondary": "hsl(220 14% 96%)",
  "secondary-foreground": "hsl(221 39% 11%)",
  "accent-foreground": "hsl(221 39% 11%)",
  "destructive": "hsl(4 90% 58%)",
  "destructive-foreground": "hsl(0 0% 100%)",
  "background": "hsl(0 0% 100%)",
  "muted-foreground": "hsl(220 9% 46%)",
  "popover": "hsl(0 0% 100%)",
  "card": "hsl(210 20% 98%)",
  "border": "hsl(220 13% 91%)",
  "sidebar": "hsl(220 14% 96%)",
  "avatar-bg": "hsl(240 5% 96%)",
  "avatar-text": "hsl(240 10% 4%)",
  "figma-c3": "hsl(252 83% 98%)",
  "figma/c1": "#E1C9F5",
  "figma/c1 80%": "#E1C9F5",
  "transparent": "transparent",
  "gray/200": "hsl(220 13% 91%)",
  "gray/300": "hsl(216 12% 84%)",
  "muted": "hsl(220 14% 96%)",
  "sidebar-primary": "hsl(263 49% 81%)",
  "sidebar-primary-foreground": "hsl(221 39% 11%)",
  "sidebar-primary-border": "hsl(258 90% 66%)",
  "accent": "hsl(258 90% 66%)",
};

/* ── Color tokens for Colors page ── */
interface ColorToken {
  name: string;
  lightHsl: string;
  darkHsl: string;
  lightHex?: string;
  darkHex?: string;
}

function hslToHex(hsl: string): string {
  const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  if (!match) return "—";
  const h = parseFloat(match[1]);
  const s = parseFloat(match[2]) / 100;
  const l = parseFloat(match[3]) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

const colorTokens: ColorToken[] = [
  { name: "background", lightHsl: "0 0% 98%", darkHsl: "240 10% 4%" },
  { name: "foreground", lightHsl: "240 10% 4%", darkHsl: "0 0% 98%" },


  { name: "card", lightHsl: "210 20% 98%", darkHsl: "224 71% 4%" },
  { name: "card-foreground", lightHsl: "221 39% 11%", darkHsl: "210 20% 98%" },
  { name: "popover", lightHsl: "0 0% 100%", darkHsl: "224 71% 4%" },
  { name: "popover-foreground", lightHsl: "221 39% 11%", darkHsl: "210 20% 98%" },
  { name: "primary", lightHsl: "252.14 35.9% 54.12%", darkHsl: "252 58% 72%" },
  { name: "primary-foreground", lightHsl: "0 0% 100%", darkHsl: "0 0% 100%" },
  { name: "secondary", lightHsl: "220 14% 96%", darkHsl: "215 28% 17%" },
  { name: "secondary-foreground", lightHsl: "221 39% 11%", darkHsl: "210 20% 98%" },
  { name: "muted", lightHsl: "220 14% 96%", darkHsl: "215 28% 17%" },
  { name: "muted-foreground", lightHsl: "220 9% 46%", darkHsl: "218 11% 65%" },
  { name: "accent", lightHsl: "270 76% 93%", darkHsl: "270 71% 90%" },
  { name: "accent-foreground", lightHsl: "221 39% 11%", darkHsl: "263 80% 75%" },
  { name: "destructive", lightHsl: "4 90% 58%", darkHsl: "0 63% 31%" },
  { name: "destructive-foreground", lightHsl: "0 0% 100%", darkHsl: "210 20% 98%" },
  { name: "success", lightHsl: "142 71% 45%", darkHsl: "142 71% 45%" },
  { name: "warning", lightHsl: "33 90% 37%", darkHsl: "43 96% 56%" },
  { name: "caution", lightHsl: "25 95% 50%", darkHsl: "25 95% 50%" },
  { name: "border", lightHsl: "220 13% 91%", darkHsl: "215 28% 17%" },
  { name: "input", lightHsl: "220 13% 91%", darkHsl: "215 28% 17%" },
  { name: "ring", lightHsl: "224 76% 48%", darkHsl: "213 94% 68%", lightHex: "#1D4ED8", darkHex: "#60A5FA" },
  { name: "ds-300", lightHsl: "263 60% 92%", darkHsl: "263 50% 25%" },
  { name: "ds-700", lightHsl: "259 34% 37%", darkHsl: "263 80% 75%" },
  { name: "red-400", lightHsl: "0 91% 71%", darkHsl: "0 63% 31%" },
  { name: "sidebar-background", lightHsl: "220 14% 96%", darkHsl: "222 47% 11%" },
  { name: "sidebar-foreground", lightHsl: "220 9% 46%", darkHsl: "218 11% 65%" },
  { name: "avatar-bg", lightHsl: "240 5% 96%", darkHsl: "240 5% 96%" },
  { name: "avatar-text", lightHsl: "240 10% 4%", darkHsl: "240 10% 4%" },
];

const colorPalettes: { name: string; colors: { shade: string; hex: string }[]; mainShades?: { shade: string; label: string }[] }[] = [
  {
    name: "Zinc (Neutral)",
    colors: [
      { shade: "50", hex: "FAFAFA" },
      { shade: "100", hex: "F4F4F5" },
      { shade: "200", hex: "E4E4E7" },
      { shade: "300", hex: "D4D4D8" },
      { shade: "400", hex: "A1A1AA" },
      { shade: "500", hex: "71717A" },
      { shade: "600", hex: "52525B" },
      { shade: "700", hex: "3F3F46" },
      { shade: "800", hex: "27272A" },
      { shade: "900", hex: "18181B" },
      { shade: "950", hex: "09090B" },
    ],
    mainShades: [],
  },
  {
    name: "Lilac (Accent)",
    colors: [
      { shade: "50", hex: "FDFBFE" },
      { shade: "100", hex: "F9F5FD" },
      { shade: "200", hex: "F4ECFC" },
      { shade: "300", hex: "EDE0FA" },
      { shade: "400", hex: "E6D3F8" },
      { shade: "500", hex: "D2BBE7" },
      { shade: "600", hex: "BA92DC" },
      { shade: "700", hex: "9858CE" },
      { shade: "800", hex: "6E35A0" },
      { shade: "900", hex: "492767" },
      { shade: "950", hex: "291839" },
    ],
    mainShades: [
      { shade: "300", label: "Main Light mode" },
      { shade: "400", label: "Main Dark mode" },
    ],
  },
  {
    name: "Peri (Primary)",
    colors: [
      { shade: "50", hex: "F7F5FC" },
      { shade: "100", hex: "EAE6F9" },
      { shade: "200", hex: "D6CFF2" },
      { shade: "300", hex: "BBAFEA" },
      { shade: "400", hex: "9F8EE1" },
      { shade: "500", hex: "8A75DB" },
      { shade: "600", hex: "7160B4" },
      { shade: "700", hex: "56498B" },
      { shade: "800", hex: "3B325E" },
      { shade: "900", hex: "241E39" },
      { shade: "950", hex: "13101F" },
    ],
    mainShades: [{ shade: "600", label: "Main" }],
  },
  {
    name: "Corange (Brand)",
    colors: [
      { shade: "50", hex: "FFF7F5" },
      { shade: "100", hex: "FEDED5" },
      { shade: "200", hex: "FDBEA0" },
      { shade: "300", hex: "FC9478" },
      { shade: "400", hex: "FB6740" },
      { shade: "500", hex: "FA4616" },
      { shade: "600", hex: "CD3912" },
      { shade: "700", hex: "9B2B0E" },
      { shade: "800", hex: "6C1E09" },
      { shade: "900", hex: "411206" },
      { shade: "950", hex: "230A03" },
    ],
    mainShades: [{ shade: "500", label: "Main" }],
  },
  {
    name: "Red (Status)",
    colors: [
      { shade: "50", hex: "FEF2F2" },
      { shade: "100", hex: "FEE2E2" },
      { shade: "200", hex: "FECACA" },
      { shade: "300", hex: "FCA5A5" },
      { shade: "400", hex: "F87171" },
      { shade: "500", hex: "EF4444" },
      { shade: "600", hex: "DC2626" },
      { shade: "700", hex: "B91C1C" },
      { shade: "800", hex: "991B1B" },
      { shade: "900", hex: "7F1D1D" },
      { shade: "950", hex: "450A0A" },
    ],
  },
  {
    name: "Yellow (Status)",
    colors: [
      { shade: "50", hex: "FEFCE8" },
      { shade: "100", hex: "FEF9C3" },
      { shade: "200", hex: "FEF08A" },
      { shade: "300", hex: "FDE047" },
      { shade: "400", hex: "FACC15" },
      { shade: "500", hex: "EAB308" },
      { shade: "600", hex: "CA8A04" },
      { shade: "700", hex: "A16207" },
      { shade: "800", hex: "854D0E" },
      { shade: "900", hex: "713F12" },
      { shade: "950", hex: "422006" },
    ],
  },
  {
    name: "Green (Status)",
    colors: [
      { shade: "50", hex: "F0FDF4" },
      { shade: "100", hex: "DCFCE7" },
      { shade: "200", hex: "BBF7D0" },
      { shade: "300", hex: "86EFAC" },
      { shade: "400", hex: "4ADE80" },
      { shade: "500", hex: "22C55E" },
      { shade: "600", hex: "16A34A" },
      { shade: "700", hex: "15803D" },
      { shade: "800", hex: "166534" },
      { shade: "900", hex: "14532D" },
      { shade: "950", hex: "052E16" },
    ],
  },
  {
    name: "Blue (Status)",
    colors: [
      { shade: "50", hex: "EFF6FF" },
      { shade: "100", hex: "DBEAFE" },
      { shade: "200", hex: "BFDBFE" },
      { shade: "300", hex: "93C5FD" },
      { shade: "400", hex: "60A5FA" },
      { shade: "500", hex: "3B82F6" },
      { shade: "600", hex: "2563EB" },
      { shade: "700", hex: "1D4ED8" },
      { shade: "800", hex: "1E40AF" },
      { shade: "900", hex: "1E3A8A" },
      { shade: "950", hex: "172554" },
    ],
  },
];

const basePalette = {
  name: "Base",
  colors: [
    { shade: "white", hex: "FFFFFF" },
    { shade: "black", hex: "000000" },
  ],
  mainShades: [],
};


// Map a hex value back to its Cornerstone palette token (e.g. "zinc/100").
// Falls back to semantic names for non-palette values used by Button (primary, link, etc.).
function hexToPaletteToken(hex: string): string {
  if (!hex) return "—";
  const v = hex.trim().toLowerCase();
  if (v === "transparent") return "transparent";
  const norm = v.startsWith("#") ? v.slice(1) : v;
  if (norm === "000000") return "base/black";
  if (norm === "ffffff") return "base/white";
  for (const palette of [basePalette, ...colorPalettes]) {
    const family = palette.name.split(" ")[0].toLowerCase(); // "zinc", "peri", "corange", "base", ...
    const match = palette.colors.find((c) => c.hex.toLowerCase() === norm);
    if (match) return `${family}/${match.shade}`;
  }
  // All Cornerstone hexes are in colorPalettes above; unmapped values fall back to the raw hex.
  return `#${norm.toUpperCase()}`;
}


function ColorPalette({ name, colors, mainShades = [] }: { name: string; colors: { shade: string; hex: string }[]; mainShades?: { shade: string; label: string }[] }) {
  const { toast } = useToast();
  const handleCopy = async (hex: string) => {
    const value = `#${hex}`;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    toast({ title: "Copied", description: `${value} copied to clipboard.` });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{name}</h3>
      <div className="grid grid-cols-11 gap-2">
        {colors.map((c) => {
          const main = mainShades.find((m) => m.shade === c.shade);
          return (
            <button
              key={c.shade}
              type="button"
              onClick={() => handleCopy(c.hex)}
              className="group flex flex-col items-center gap-1.5 text-left focus:outline-none"
              aria-label={`Copy hex ${c.hex}`}
            >
              <span className="text-[10px] font-mono text-muted-foreground leading-none">{c.hex}</span>
              <span
                className="w-full h-[47px] rounded-md border border-border shadow-sm transition-transform group-hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ backgroundColor: `#${c.hex}` }}
              />
              <span className="text-[10px] font-mono text-muted-foreground leading-none">{c.shade}</span>
              {main && <span className="text-[10px] font-medium text-foreground leading-none text-center">{main.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const newTokens = new Set(["background", "foreground", "primary", "accent", "ring"]);

function ColorTokenTable({ mode }: { mode: "light" | "dark" }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Token</TableHead>
          <TableHead className="w-[60px]">Swatch</TableHead>
          <TableHead className="w-[140px]">Tokens</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {colorTokens.map((t) => {
          const hsl = mode === "light" ? t.lightHsl : t.darkHsl;
          const exactHex = mode === "light" ? t.lightHex : t.darkHex;
          const isNew = newTokens.has(t.name);
          return (
            <TableRow key={t.name}>
              <TableCell className="font-mono text-sm text-foreground">
                <span className="inline-flex items-center gap-2">
                  {t.name}
                  {isNew && <Badge className="bg-green-500 text-white hover:bg-green-500">new</Badge>}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className="inline-block w-6 h-6 rounded-md border border-border"
                  style={{ backgroundColor: `hsl(${hsl})` }}
                />
              </TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">{hexToPaletteToken(exactHex || hslToHex(hsl))}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}


function ColorSwatch({ token }: { token?: string }) {
  if (!token || token === "transparent") return <span className="text-muted-foreground">—</span>;

  // Extract hex from strings like "zinc 300 (#D4D4D8)" or "peri 600 (#7160B4)"
  const hexMatch = token.match(/#[0-9A-Fa-f]{6}/);
  if (hexMatch) {
    const hex = hexMatch[0].toUpperCase();
    return (
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm border border-border flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
        <span>{hexToPaletteToken(hex)}</span>
      </span>
    );
  }

  if (token === "white") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm border border-border flex-shrink-0"
          style={{ backgroundColor: "#FFFFFF" }}
        />
        <span>white</span>
      </span>
    );
  }

  const color = tokenToHsl[token];
  if (color) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <span
          className="inline-block w-3 h-3 rounded-sm border border-border flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span>{token}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-3 h-3 rounded-sm border border-border flex-shrink-0 bg-muted" />
      <span>{token}</span>
    </span>
  );
}

/* ── Types ── */
interface VariantStateRow {
  state: string;
  textSize: string;
  textWeight: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  cornerRadius?: string;
  opacity?: string;
  render: () => React.ReactNode;
}


interface VariantRow {
  variant: string;
  type?: string;
  textSize: string;
  textWeight: string;
  bgColor?: string;
  textColor?: string;
  borderColor?: string;
  cornerRadius?: string;
  opacity?: string;
  render?: () => React.ReactNode;
  states?: VariantStateRow[];
}


interface ComponentType {
  name: string;
  rows: VariantRow[];
}

function ToastTrigger() {
  const { toast } = useToast();
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant="default"
        size="sm"
        onClick={() => toast({ title: "Action completed", description: "Your changes have been saved." })}
      >
        Default toast
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => toast({ title: "Error occurred", description: "Something went wrong.", variant: "destructive" })}
      >
        Destructive toast
      </Button>
    </div>
  );
}

function TogglePreview({ dark = false }: { dark?: boolean }) {
  const [value, setValue] = useState("Hierarchy");
  const containerCls = dark
    ? "bg-zinc-800 border border-zinc-500"
    : "bg-zinc-100 border border-zinc-300";
  const selectedCls = dark
    ? "bg-peri-700 border-peri-500"
    : "bg-peri-200 border-peri-400";
  const textCls = dark ? "text-zinc-50" : "text-zinc-950";
  return (
    <div className="w-full flex justify-center">
      <div className={`inline-flex items-center rounded-full p-1 ${containerCls}`}>
        {["Hierarchy", "List"].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setValue(label)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors border ${textCls} ${
              value === label ? selectedCls : "border-transparent bg-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

const componentTypes: ComponentType[] = [
  {
    name: "Avatar",
    rows: [
      { variant: "Small (32px)", textSize: "text-xs", textWeight: "font-medium", bgColor: "#F4F4F5", textColor: "#09090B", render: () => <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">JD</AvatarFallback></Avatar> },
      { variant: "Default (40px)", textSize: "text-sm", textWeight: "font-medium", bgColor: "#F4F4F5", textColor: "#09090B", render: () => <Avatar><AvatarFallback>JD</AvatarFallback></Avatar> },
      { variant: "Large (56px)", textSize: "text-lg", textWeight: "font-medium", bgColor: "#F4F4F5", textColor: "#09090B", render: () => <Avatar className="h-14 w-14"><AvatarFallback className="text-lg">JD</AvatarFallback></Avatar> },
      { variant: "With image", textSize: "—", textWeight: "—", bgColor: "#F4F4F5", textColor: "#09090B", render: () => <Avatar><AvatarImage src={davidLinAvatar} alt="User" /><AvatarFallback>JD</AvatarFallback></Avatar> },
    ],
  },
  {
    name: "Badge",
    rows: [
      { variant: "Outline", textSize: "text-xs", textWeight: "font-normal", bgColor: "transparent", textColor: "foreground", borderColor: "ds/500", cornerRadius: "Full", render: () => <Badge variant="outline">Outline</Badge> },
      { variant: "Outline destructive", textSize: "text-xs", textWeight: "font-normal", bgColor: "transparent", textColor: "red/700", borderColor: "red/700", cornerRadius: "Full", render: () => <Badge variant="outline-destructive">Destructive</Badge> },
      { variant: "Warning", textSize: "text-xs", textWeight: "font-normal", bgColor: "transparent", textColor: "amber/700", borderColor: "amber/700", cornerRadius: "Full", render: () => <Badge variant="outline-warning">Warning</Badge> },
      { variant: "Default", textSize: "text-xs", textWeight: "font-normal", bgColor: "ds/300", textColor: "foreground", cornerRadius: "Full", render: () => <Badge>Default</Badge> },
      { variant: "Secondary", textSize: "text-xs", textWeight: "font-normal", bgColor: "accent-foreground", textColor: "primary-foreground", cornerRadius: "Full", render: () => <Badge variant="secondary">Secondary</Badge> },
      { variant: "Tertiary", textSize: "text-xs", textWeight: "font-normal", bgColor: "muted", textColor: "foreground", cornerRadius: "Full", render: () => <Badge variant="tertiary">Tertiary</Badge> },
      { variant: "Destructive", textSize: "text-xs", textWeight: "font-normal", bgColor: "red/400", textColor: "foreground", cornerRadius: "Full", render: () => <Badge variant="destructive">Destructive</Badge> },
    ],
  },
  {
    name: "Button",
    rows: [
      { variant: "Primary", type: "Filled", textSize: "text-sm", textWeight: "font-medium", bgColor: "#7160B4", textColor: "#FFFFFF", cornerRadius: "Full", render: () => <button className="px-3 py-2 text-sm font-medium rounded-full bg-peri-600 text-white">Primary</button> },
      { variant: "Secondary", type: "Filled + Outline", textSize: "text-sm", textWeight: "font-medium", bgColor: "#F4F4F5", textColor: "#09090B", borderColor: "#D4D4D8", cornerRadius: "Full", render: () => <button className="px-3 py-2 text-sm font-medium rounded-full border bg-zinc-100 border-zinc-300 text-zinc-950">Secondary</button> },
      { variant: "Tertiary", type: "Outline", textSize: "text-sm", textWeight: "font-medium", bgColor: "#FFFFFF", textColor: "#09090B", borderColor: "#D4D4D8", cornerRadius: "Full", render: () => <button className="px-3 py-2 text-sm font-medium rounded-full border bg-white border-zinc-300 text-zinc-950">Tertiary</button> },
      { variant: "Ghost", type: "Text only", textSize: "text-sm", textWeight: "font-medium", bgColor: "transparent", textColor: "#09090B", cornerRadius: "Full", render: () => <button className="px-3 py-2 text-sm font-medium rounded-full bg-transparent text-zinc-950">Ghost</button> },
      { variant: "Link", type: "Text only", textSize: "text-sm", textWeight: "font-medium", bgColor: "transparent", textColor: "#09090B", cornerRadius: "Full", render: () => <button className="px-3 py-2 text-sm font-medium rounded-full bg-transparent text-zinc-950">Link</button> },
    ],
  },

  {
    name: "Checkbox",
    rows: [
      { variant: "Unchecked", textSize: "text-sm", textWeight: "font-normal", bgColor: undefined, textColor: undefined, borderColor: "zinc-500", render: () => <div className="flex items-center gap-2"><Checkbox id="ds-cb-u" /><Label htmlFor="ds-cb-u">Unchecked</Label></div> },
      { variant: "Checked", textSize: "text-sm", textWeight: "font-normal", bgColor: "peri-600", textColor: "primary-foreground", borderColor: "peri-600", render: () => <div className="flex items-center gap-2"><Checkbox id="ds-cb-c" defaultChecked /><Label htmlFor="ds-cb-c">Checked</Label></div> },
      { variant: "Disabled", textSize: "text-sm", textWeight: "font-normal", bgColor: undefined, textColor: undefined, borderColor: "border", render: () => <div className="flex items-center gap-2"><Checkbox id="ds-cb-d" disabled /><Label htmlFor="ds-cb-d" className="opacity-50">Disabled</Label></div> },
    ],
  },
  {
    name: "Radio",
    rows: [
      { variant: "Default", textSize: "text-sm", textWeight: "font-normal", bgColor: "base/white", textColor: "zinc/950", borderColor: "zinc/500", render: () => null },
    ],
  },
  {
    name: "Filter dropdown",
    rows: [
      {
        variant: "Default",
        textSize: "text-sm",
        textWeight: "font-normal",
        bgColor: "popover",
        textColor: "foreground",
        borderColor: "border",
        render: () => (
          <div className="w-full flex justify-center gap-6">
            <div className="w-full max-w-xs border border-border rounded-lg overflow-hidden">
              <Command>
                <CommandList>
                  <CommandGroup>
                    <div className="ds-filter-menu">
                      <div className="ds-filter-menu-item ds-filter-menu-item-selected">
                        <Checkbox id="ds-fs-1" defaultChecked className="shrink-0" />
                        <span>View profile</span>
                      </div>
                      <div className="ds-filter-menu-item">
                        <Checkbox id="ds-fs-2" className="shrink-0" />
                        <span>Search skills</span>
                      </div>
                    </div>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
            <div className="w-full max-w-xs border border-border rounded-lg overflow-hidden">
              <Command>
                <CommandList>
                  <CommandGroup>
                    <div className="ds-filter-menu">
                      <div className="ds-filter-menu-item ds-filter-menu-item-selected">
                        <span className="ds-filter-menu-check">
                          <Check className="w-4 h-4" strokeWidth={2} />
                        </span>
                        <span>View profile</span>
                      </div>
                      <div className="ds-filter-menu-item">
                        <span className="ds-filter-menu-check" />
                        <span>Search skills</span>
                      </div>
                    </div>
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          </div>
        ),
      },
      {
        variant: "Selected",
        textSize: "text-base",
        textWeight: "font-medium",
        bgColor: "muted",
        textColor: "popover-foreground",
        cornerRadius: "4px",
      },
      {
        variant: "Not selected",
        textSize: "text-base",
        textWeight: "font-medium",
        bgColor: undefined,
        textColor: "popover-foreground",
        cornerRadius: "4px",
      },
    ],
  },
  {
    name: "Table",
    rows: [
      {
        variant: "Default",
        textSize: "text-sm",
        textWeight: "font-normal",
        bgColor: "card",
        textColor: "foreground",
        borderColor: "border",
        render: () => (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-sm bg-card border border-border rounded-2xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm text-secondary-foreground">Name</TableHead>
                    <TableHead className="text-sm text-secondary-foreground">Role</TableHead>
                    <TableHead className="text-sm text-secondary-foreground">Match</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-sm text-foreground">Alice Chen</TableCell>
                    <TableCell className="text-sm text-foreground">Engineer</TableCell>
                    <TableCell className="text-sm text-foreground">92%</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-sm text-foreground">Bob Martinez</TableCell>
                    <TableCell className="text-sm text-foreground">Designer</TableCell>
                    <TableCell className="text-sm text-foreground">87%</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Filter",
    rows: [
      {
        variant: "Filter with dropdown",
        textSize: "text-sm",
        textWeight: "font-normal",
        bgColor: "background",
        textColor: "foreground",
        borderColor: "input",
        cornerRadius: "Full",
        render: () => (
          <div className="w-full flex justify-center">
            <button type="button" className="ds-filter">
              <span>Filter</span>
              <ChevronDown className="w-4 h-4 text-[hsl(var(--input))]" strokeWidth={2} />
            </button>
          </div>
        ),
      },
      {
        variant: "Filter with icon",
        textSize: "text-sm",
        textWeight: "font-normal",
        bgColor: "background",
        textColor: "foreground",
        borderColor: "input",
        cornerRadius: "Full",
        render: () => (
          <div className="w-full flex justify-center">
            <button type="button" className="ds-filter">
              <FilterIcon className="w-4 h-4 text-foreground" strokeWidth={2} />
              <span>Filter</span>
            </button>
          </div>
        ),
      },
    ],
  },
  {
    name: "Input",
    rows: [
      { variant: "Default", textSize: "text-sm", textWeight: "font-normal", bgColor: "zinc/50", textColor: "zinc/950", borderColor: "zinc/400", cornerRadius: "8px", render: () => <Input placeholder="Enter text..." className="w-full" /> },
      { variant: "Disabled", textSize: "text-sm", textWeight: "font-normal", bgColor: "zinc/50", textColor: "zinc/500", borderColor: "zinc/300", cornerRadius: "8px", opacity: "50%", render: () => <Input placeholder="Disabled" disabled className="w-full" /> },
      { variant: "Focus", textSize: "text-sm", textWeight: "font-normal", bgColor: "zinc/50", textColor: "zinc/950", borderColor: "zinc/400", cornerRadius: "8px", render: () => <Input placeholder="Focused" className="w-full" /> },
      { variant: "File", textSize: "text-sm", textWeight: "font-normal", bgColor: "zinc/50", textColor: "zinc/950", borderColor: "zinc/400", cornerRadius: "8px", render: () => <Input type="file" className="w-full" /> },
    ],
  },
  {
    name: "Title text — Page",
    rows: [
      {
        variant: "Header",
        textSize: "text-3xl",
        textWeight: "font-semibold",
        bgColor: "background",
        textColor: "foreground",
        render: () => (
          <div className="w-full flex items-center justify-center min-h-[120px]">
            <h1 className="ds-page-title">Header</h1>
          </div>
        ),
      },
    ],
  },
  {
    name: "Pagination",
    rows: [
      {
        variant: "Default",
        textSize: "text-sm",
        textWeight: "font-medium",
        bgColor: "background",
        textColor: "primary",
        borderColor: "border",
        render: () => (
          <Pagination>
            <PaginationContent>
              <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
              <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
              <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
              <PaginationItem><PaginationEllipsis /></PaginationItem>
              <PaginationItem><PaginationNext href="#" /></PaginationItem>
            </PaginationContent>
          </Pagination>
        ),
      },
    ],
  },
  {
    name: "Search",
    rows: [
      { variant: "Default", textSize: "text-sm", textWeight: "font-normal", bgColor: "background", textColor: "foreground", borderColor: "border", cornerRadius: "Full", render: () => (
        <div className="w-full flex justify-center">
          <SearchBar />
        </div>
      ) },
    ],
  },
  {
    name: "Title text — Section",
    rows: [
      {
        variant: "Section",
        textSize: "text-base",
        textWeight: "font-semibold",
        bgColor: "background",
        textColor: "foreground",
        render: () => (
          <div className="w-full flex items-center justify-center min-h-[120px]">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
              <StarIcon size={16} />
              Section
              <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">4</span>
            </h2>
          </div>
        ),
      },
      {
        variant: "Section with metadata",
        textSize: "text-base",
        textWeight: "font-semibold",
        bgColor: "background",
        textColor: "foreground",
        render: () => (
          <div className="w-full flex items-center justify-center min-h-[120px]">
            <div className="w-full max-w-[800px] flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                <StarIcon size={16} />
                Recent changes
                <span className="text-sm font-normal text-muted-foreground ml-1">Last 14 days</span>
              </h2>
              <Button variant="ghost" size="sm" className="text-foreground">
                View audit log
              </Button>
            </div>
          </div>
        ),
      },
      {
        variant: "Metadata text",
        textSize: "text-sm",
        textWeight: "font-normal",
        bgColor: "background",
        textColor: "muted-foreground",
      },
    ],
  },
  {
    name: "Smart Bar",
    rows: [
      {
        variant: "Default",
        textSize: "text-base",
        textWeight: "font-normal",
        bgColor: "background",
        textColor: "input",
        borderColor: "border",
        cornerRadius: "Full",
        render: () => (
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md">
              <SmartBarInline
                placeholder="Ask workforce AI..."
                showSparkle={false}
                micSize={24}
                micClassName="text-[hsl(var(--icon))] hover:text-foreground"
              />
            </div>
          </div>
        ),
      },
    ],
  },
  {
    name: "Toast",
    rows: [
      { variant: "Default / Destructive", textSize: "text-sm", textWeight: "font-medium", bgColor: "background", textColor: "foreground", borderColor: "border", render: () => <ToastTrigger /> },
    ],
  },
  {
    name: "Toggle",
    rows: [
      { variant: "Default", textSize: "text-sm", textWeight: "font-medium", bgColor: "zinc 100 (#F4F4F5)", textColor: "zinc 950 (#09090B)", borderColor: "zinc 300 (#D4D4D8)", cornerRadius: "Full", render: () => <TogglePreview /> },
    ],
  },
];

const componentNames = componentTypes.map((c) => c.name);

// Elements: alphabetical
const elementsOrder = (() => {
  const names = [...componentNames, "Cornerstone colors"];
  names.sort((a, b) => a.localeCompare(b));
  return names;
})();

// Patterns: alphabetical
const patternItems = [
  "Cards — Action Center",
  "Cards — Metrics",
  "Chat Design",
  "Filtering Chips",
  "Flyouts",
  "Nav — Header",
  "Nav — Primary",
  "Nav — Secondary",
  "Tabs",
].sort((a, b) => a.localeCompare(b));

const allNavItems = [...elementsOrder, ...patternItems];

const greenComponents = new Set(["Avatar", "Button", "Badge", "Cards — Action Center", "Cards — Metrics", "Cards — Icon", "Chat Design", "Checkbox", "Filter", "Filter dropdown", "Filtering Chips", "Flyouts", "Cards — Home", "Input", "Nav — Header", "Nav — Primary", "Title text — Page", "Pagination", "Radio", "Search", "Title text — Section", "Smart Bar", "Tabs", "Nav — Secondary", "Toggle"]);
const redComponents = new Set<string>();
const yellowPatterns = new Set<string>([]);
const previewAboveTable = new Set(["Title text — Page", "Title text — Section", "Table", "Filter", "Filter dropdown", "Flyouts", "Pagination", "Search", "Smart Bar", "Tabs", "Toast"]);

const navigationBarPattern = {
  name: "Navigation Bar",
  rows: [
    {
      variant: "Default",
      textSize: "text-base",
      textWeight: "font-normal",
      bgColor: "sidebar-background",
      textColor: "muted-foreground",
      borderColor: "sidebar-border",
      render: () => {
        const navItems = [
          { label: "Home", icon: Home },
          { label: "Profile", icon: User },
          { label: "Upskilling", icon: BookOpen },
        ];
        return (
          <div className="w-full max-w-xs">
            <nav className="bg-[hsl(var(--sidebar-background))] rounded-[32px] border border-[hsl(var(--sidebar-border))] p-2 space-y-1">
              {navItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    className={`w-full flex items-center gap-[22px] p-4 rounded-[100px] text-base font-normal border border-transparent transition-all duration-200 ${
                      i === 0
                        ? "bg-sidebar-accent border-[hsl(var(--sidebar-selected-border))] text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-foreground/5 hover:border-muted-foreground hover:rounded-[100px]"
                    }`}
                  >
                    <Icon size={24} className={i === 0 ? "text-[hsl(var(--icon-selected))]" : "text-[hsl(var(--icon))]"} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        );
      },
    },
  ],
};

const colorHeaders = (
  <>
    <TableHead className="w-[160px]">Background</TableHead>
    <TableHead className="w-[160px]">Text color</TableHead>
    <TableHead className="w-[160px]">Border</TableHead>
    <TableHead className="w-[120px]">Corner radius</TableHead>
  </>
);

function ColorCells({ row }: { row: Pick<VariantRow, 'bgColor' | 'textColor' | 'borderColor' | 'cornerRadius'> }) {
  return (
    <>
      <TableCell className="text-muted-foreground text-xs align-top"><ColorSwatch token={row.bgColor} /></TableCell>
      <TableCell className="text-muted-foreground text-xs align-top"><ColorSwatch token={row.textColor} /></TableCell>
      <TableCell className="text-muted-foreground text-xs align-top"><ColorSwatch token={row.borderColor} /></TableCell>
      <TableCell className="text-muted-foreground font-mono text-xs align-top">{row.cornerRadius || "—"}</TableCell>
    </>
  );
}

/* ── Nav pattern showcase ── */
/* Mirrors the real <AppSidebar /> nav item used on /combined */
type NavItemState = "default" | "hover" | "active" | "focus" | "disabled";

function NavItemSample({
  label,
  icon: Icon,
  state,
  collapsed = false,
}: {
  label: string;
  icon: typeof Home;
  state: NavItemState;
  collapsed?: boolean;
}) {
  const base = `w-full flex items-center ${collapsed ? "justify-center px-0" : "gap-3 px-4"} py-2 rounded-[100px] text-sm font-normal border transition-all duration-200`;
  const stateClasses: Record<NavItemState, string> = {
    default: "text-muted-foreground border-transparent dark:text-zinc-300",
    hover: "bg-foreground/5 text-muted-foreground border-muted-foreground dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-400",
    active: "bg-muted text-foreground border-muted-foreground dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-400",
    focus: "text-muted-foreground border-transparent ring-2 ring-ring ring-offset-2 ring-offset-background outline-none dark:text-zinc-300 dark:ring-zinc-300 dark:ring-offset-zinc-900",
    disabled: "text-muted-foreground/50 border-transparent cursor-not-allowed dark:text-zinc-500",
  };
  return (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      aria-current={state === "active" ? "page" : undefined}
      aria-disabled={state === "disabled" || undefined}
      aria-label={collapsed ? label : undefined}
      tabIndex={state === "disabled" ? -1 : 0}
      className={`${base} ${stateClasses[state]}`}
    >
      <Icon size={20} aria-hidden="true" />
      {!collapsed && <span>{label}</span>}
    </button>
  );
}

function SecondaryNavItemSample({
  label,
  icon: Icon,
  state,
}: {
  label: string;
  icon: typeof Home;
  state: NavItemState;
}) {
  const base = "w-full flex items-center gap-3 px-4 py-2 rounded-[100px] text-sm font-normal border transition-all duration-200";
  const stateClasses: Record<NavItemState, string> = {
    default: "text-muted-foreground border-transparent dark:text-zinc-300",
    hover: "bg-foreground/5 text-muted-foreground border-muted-foreground dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-400",
    active: "bg-muted text-foreground border-muted-foreground dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-400",
    focus: "text-muted-foreground border-transparent ring-2 ring-ring ring-offset-2 ring-offset-background outline-none dark:text-zinc-300 dark:ring-zinc-300 dark:ring-offset-zinc-900",
    disabled: "text-muted-foreground/50 border-transparent cursor-not-allowed dark:text-zinc-500",
  };
  return (
    <button
      type="button"
      onClick={(e) => e.preventDefault()}
      aria-current={state === "active" ? "page" : undefined}
      aria-disabled={state === "disabled" || undefined}
      tabIndex={state === "disabled" ? -1 : 0}
      className={`${base} ${stateClasses[state]}`}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}





function PreviewThemePanel({
  children,
  caption,
  ariaLabel = "Preview surface",
}: {
  children: React.ReactNode;
  caption?: string;
  ariaLabel?: string;
}) {
  const [isDark, setIsDark] = useState(false);
  return (
    <div className="p-6 border border-border rounded-lg bg-card space-y-3">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsDark((v) => !v)}
          aria-pressed={isDark}
          aria-label={isDark ? "Switch preview to light mode" : "Switch preview to dark mode"}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium border border-border rounded-md bg-background text-foreground hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
        >
          {isDark ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
          {isDark ? "Light preview" : "Dark preview"}
        </button>
      </div>
      <div
        className={`${isDark ? "dark" : "light"} rounded-md`}
        role="group"
        aria-label={`${ariaLabel} (${isDark ? "dark" : "light"} mode)`}
      >
        <div className="bg-background rounded-md p-4">
          {children}
        </div>
      </div>
      {caption && <p className="text-xs text-muted-foreground">{caption}</p>}
    </div>
  );
}

function NavShowcase() {
  const [navCollapsed, setNavCollapsed] = useState(false);
  return (
    <div className="space-y-8" style={{ "--ring": "212 100% 40%" } as React.CSSProperties}>
      {/* Header */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Used for primary site or app navigation.</p>
      </div>

      {/* Live interactive example — real /combined sidebar */}
      <section aria-labelledby="nav-live" className="space-y-3">
        <h3 id="nav-live" className="text-lg font-semibold text-foreground">Live example</h3>
        <PreviewThemePanel
          ariaLabel="Primary nav live example"
          caption="Live instance of the sidebar used on the /combined page. Use the caret on the right edge to collapse or expand, and toggle the button above to preview dark mode."
        >
          <div className="flex justify-center">
            <div className="relative flex h-[560px] rounded-lg bg-background pr-4">
              <div className={`h-full transition-[width] duration-200 ${navCollapsed ? "w-16" : "w-[240px]"}`}>
                <AppSidebar mode="team" forceCollapsed={navCollapsed} />
              </div>
              <button
                type="button"
                onClick={() => setNavCollapsed((v) => !v)}
                aria-label={navCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!navCollapsed}
                style={{ left: navCollapsed ? "calc(32px - 14px)" : "calc(240px - 14px)", top: 18 }}
                className="absolute z-40 h-7 w-7 inline-flex items-center justify-center rounded-full bg-background border border-border text-muted-foreground shadow-sm hover:text-foreground hover:bg-muted transition-[left,colors] duration-200"
              >
                {navCollapsed ? <ChevronRight size={14} aria-hidden="true" /> : <ChevronLeft size={14} aria-hidden="true" />}
              </button>
            </div>
          </div>
        </PreviewThemePanel>
      </section>


      {/* Variants */}
      <section aria-labelledby="nav-variants" className="space-y-3">
        <h3 id="nav-variants" className="text-lg font-semibold text-foreground">Variants</h3>
        <p className="text-sm text-muted-foreground">
          The sidebar is vertical-only and has two width variants. Use the caret on the
          right edge of the sidebar to switch between them in the live example above.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Expanded */}
          <div className="p-6 border border-border rounded-lg bg-card space-y-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Expanded — 240px</p>
            <nav aria-label="Expanded nav example" className="w-[240px] bg-background border border-border rounded-lg p-3 space-y-1 dark:bg-zinc-900 dark:border-zinc-700">
              <p className="px-4 pt-1 pb-2 text-sm font-medium text-muted-foreground dark:text-zinc-400">Workspace</p>
              <NavItemSample label="Action center" icon={Home} state="active" />
              <NavItemSample label="Skills" icon={User} state="default" />
              <NavItemSample label="Reflection" icon={BookOpen} state="default" />
              <NavItemSample label="Snapshot" icon={Settings} state="default" />
            </nav>
          </div>

          {/* Collapsed */}
          <div className="p-6 border border-border rounded-lg bg-card space-y-3">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Collapsed — 64px</p>
            <nav aria-label="Collapsed nav example" className="w-16 bg-background border border-border rounded-lg p-3 space-y-1 dark:bg-zinc-900 dark:border-zinc-700">
              <NavItemSample label="Action center" icon={Home} state="active" collapsed />
              <NavItemSample label="Skills" icon={User} state="default" collapsed />
              <NavItemSample label="Reflection" icon={BookOpen} state="default" collapsed />
              <NavItemSample label="Snapshot" icon={Settings} state="default" collapsed />
            </nav>
            <p className="text-xs text-muted-foreground">Labels move into a tooltip on hover / focus.</p>
          </div>
        </div>
      </section>

      {/* States */}
      <section aria-labelledby="nav-states" className="space-y-3">
        <h3 id="nav-states" className="text-lg font-semibold text-foreground">States</h3>
        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {(["default", "hover", "active", "focus", "disabled"] as NavItemState[]).map((s) => (
              <div key={s} className="flex flex-col items-start gap-2">
                <span className="text-xs font-semibold tracking-wide text-muted-foreground">{s}</span>
                <div className="w-full">
                  <NavItemSample label="Action center" icon={Home} state={s} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsiveness */}
      <section aria-labelledby="nav-responsive" className="space-y-3">
        <h3 id="nav-responsive" className="text-lg font-semibold text-foreground">Responsiveness</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Breakpoint</TableHead>
              <TableHead className="w-[160px]">Width</TableHead>
              <TableHead>Behavior</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-foreground">Desktop</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">≥ 1280px</TableCell>
              <TableCell className="text-muted-foreground text-sm">Sidebar defaults to expanded (240px) with full icon + label items.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-foreground">Tablet</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">768–1279px</TableCell>
              <TableCell className="text-muted-foreground text-sm">User-controlled: same sidebar, often collapsed (64px) to reclaim canvas width. Tooltips reveal labels.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-foreground">Mobile</TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">≤ 767px</TableCell>
              <TableCell className="text-muted-foreground text-sm">Force-collapsed to the 64px icon strip; tap the caret to expand as an overlay.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>


      {/* Accessibility */}
      <section aria-labelledby="nav-a11y" className="space-y-3">
        <h3 id="nav-a11y" className="text-lg font-semibold text-foreground">Accessibility</h3>
        <div className="p-6 border border-border rounded-lg bg-card text-sm text-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>Wrap items in a <code className="font-mono text-xs">&lt;nav&gt;</code> with <code className="font-mono text-xs">aria-label="Main navigation"</code>.</li>
            <li>All items are reachable via <kbd className="px-1 border rounded">Tab</kbd>; grouped item lists support arrow-key roving focus.</li>
            <li>Current page item sets <code className="font-mono text-xs">aria-current="page"</code>.</li>
            <li>Disabled item sets <code className="font-mono text-xs">aria-disabled="true"</code> and <code className="font-mono text-xs">tabIndex={-1}</code>.</li>
            <li>Collapse / expand toggle exposes <code className="font-mono text-xs">aria-expanded</code> and a clear label ("Expand sidebar" / "Collapse sidebar").</li>
            <li>In collapsed mode, each icon-only item carries an <code className="font-mono text-xs">aria-label</code> equal to its label, and the visible tooltip uses the same text.</li>
            <li>Section headers with toggle chevrons use <code className="font-mono text-xs">aria-expanded</code> and <code className="font-mono text-xs">aria-controls</code> pointing at the section list.</li>
            <li>Focus ring uses <code className="font-mono text-xs">ring-ring</code> token and remains visible (never <code className="font-mono text-xs">outline-none</code> without a replacement).</li>
            <li>Hover and active states add a visible border using <code className="font-mono text-xs">border-muted-foreground</code> (light) and <code className="font-mono text-xs">border-zinc-400</code> (dark) so state change is conveyed by outline in addition to color.</li>
            <li>In dark mode the rail uses Tailwind <code className="font-mono text-xs">zinc</code>: surface <code className="font-mono text-xs">zinc-900</code>, default label <code className="font-mono text-xs">zinc-300</code> (≈ 10.4:1 on zinc-900), active label <code className="font-mono text-xs">zinc-50</code> on <code className="font-mono text-xs">zinc-800</code> (≈ 15.3:1), and a <code className="font-mono text-xs">zinc-400</code> outline (≈ 5.7:1 on zinc-900) — all meeting WCAG AA for text and 1.4.11 Non-text Contrast.</li>
            <li>Color pairings (<code className="font-mono text-xs">foreground</code> on <code className="font-mono text-xs">background</code>, <code className="font-mono text-xs">sidebar-accent-foreground</code> on <code className="font-mono text-xs">sidebar-accent</code>) meet WCAG AA 4.5:1.</li>
          </ul>
        </div>
      </section>


      {/* Props */}
      <section aria-labelledby="nav-props" className="space-y-3">
        <h3 id="nav-props" className="text-lg font-semibold text-foreground">Props</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Prop</TableHead>
              <TableHead className="w-[220px]">Type</TableHead>
              <TableHead className="w-[120px]">Default</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">mode</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"me" | "team"</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"me"</TableCell>
              <TableCell className="text-sm text-muted-foreground">Switches the section + item set between Me mode and Team mode.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">forceCollapsed</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">boolean</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">false</TableCell>
              <TableCell className="text-sm text-muted-foreground">Forces the 64px collapsed width regardless of user preference (used when the Ask AI overlay is open).</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">NavItem.status</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">{`{ tone: "green" | "red" | "blue"; text: string }`}</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">undefined</TableCell>
              <TableCell className="text-sm text-muted-foreground">Optional status row beneath the label with a colored dot.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">NavItem.isActive</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">boolean</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">derived</TableCell>
              <TableCell className="text-sm text-muted-foreground">Active state is derived from the current route; sets <code className="font-mono text-xs">aria-current="page"</code>.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">Section.collapsible</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">boolean</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">false</TableCell>
              <TableCell className="text-sm text-muted-foreground">Renders the section header with a toggle chevron.</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* Code snippet */}
        <pre className="p-4 rounded-lg bg-muted text-foreground text-xs font-mono overflow-x-auto">
{`import { AppSidebar } from "@/components/AppSidebar";

<AppSidebar mode="team" forceCollapsed={askOpen} />`}
        </pre>
      </section>

    </div>
  );
}


/* ── Header pattern showcase ── */
type HeaderVariant = "default" | "activeTeam" | "withBadge" | "loggedOut" | "minimal";
type HeaderBreakpoint = "desktop" | "tablet" | "mobile" | "mobileStacked";

function HeaderPreview({
  variant = "default",
  breakpoint = "desktop",
  activeItem = "none",
  notificationCount = 4,
  loadingAvatar = false,
  loadingAskAI = false,
  disabled = false,
  onActiveItemChange,
}: {
  variant?: HeaderVariant;
  breakpoint?: HeaderBreakpoint;
  activeItem?: "me" | "team" | "none";
  notificationCount?: number;
  loadingAvatar?: boolean;
  loadingAskAI?: boolean;
  disabled?: boolean;
  onActiveItemChange?: (item: "me" | "team") => void;
}) {
  const isLoggedOut = variant === "loggedOut";
  const isMinimal = variant === "minimal";
  const showFullNav = breakpoint === "desktop";
  const showIconNav = breakpoint === "tablet";
  const showHamburger = breakpoint === "mobile";

  const pillBase =
    "h-7 inline-flex items-center justify-center gap-1 rounded-full text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed";

  if (breakpoint === "mobileStacked" && !isMinimal && !isLoggedOut) {
    return (
      <header
        role="banner"
        aria-label="Global header"
        className="w-full bg-background px-4 py-2 flex flex-col gap-2 border border-border rounded-md"
      >
        {/* Row 1: Logo + Avatar */}
        <div className="flex items-center justify-between h-9">
          <a href="#" aria-label="Rathbones home" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
            <img src={logoCSOD} alt="" className="h-7 dark:hidden" />
            <img src={logoCSODWhite} alt="" className="hidden h-7 dark:block" />
          </a>
          <button
            type="button"
            aria-label="User profile menu"
            className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <img src={davidLinAvatar} alt="" width={28} height={28} className="h-full w-full object-cover" />
          </button>
        </div>

        {/* Row 2: Ask AI + Me/Team toggle + Notifications */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            aria-label="Ask AI"
            className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <StarIcon size={14} />
            Ask AI
          </button>

          <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode">
            <button
              type="button"
              onClick={() => onActiveItemChange?.("me")}
              aria-current={activeItem === "me" ? "page" : undefined}
              aria-pressed={activeItem === "me"}
              className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeItem === "me"
                  ? "bg-primary/10 border border-primary text-foreground"
                  : "text-muted-foreground border border-transparent"
              }`}
            >
              <User size={14} aria-hidden="true" />
              Me
            </button>
            <button
              type="button"
              onClick={() => onActiveItemChange?.("team")}
              aria-current={activeItem === "team" ? "page" : undefined}
              aria-pressed={activeItem === "team"}
              className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                activeItem === "team"
                  ? "bg-primary/10 border border-primary text-foreground"
                  : "text-muted-foreground border border-transparent"
              }`}
            >
              <Users size={14} aria-hidden="true" />
              Team
            </button>
          </div>

          <button
            type="button"
            aria-label={`Notifications, ${notificationCount} unread`}
            aria-live="polite"
            className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Bell size={14} aria-hidden="true" />
            {notificationCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none border-2 border-background"
              >
                {notificationCount}
              </span>
            )}
          </button>
        </div>
      </header>
    );
  }


  return (
    <header
      role="banner"
      aria-label="Global header"
      className="w-full bg-background px-6 h-16 flex items-center border border-border rounded-md"
    >
      {/* Left: Logo */}
      <a href="#" aria-label="Rathbones home" className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        <img src={logoCSOD} alt="" className="h-7 dark:hidden" />
        <img src={logoCSODWhite} alt="" className="hidden h-7 dark:block" />
      </a>

      {!isMinimal && (
        <div className="ml-auto flex items-center gap-4">
          {/* Ask AI */}
          {!showHamburger && (
            <button
              type="button"
              aria-label="Ask AI"
              disabled={disabled || loadingAskAI}
              className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingAskAI ? (
                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              ) : (
                <StarIcon size={14} />
              )}
              Ask AI
            </button>
          )}

          {/* Me / Team segmented toggle — desktop & tablet */}
          {(showFullNav || showIconNav) && !isLoggedOut && (
            <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode">
              <button
                type="button"
                onClick={() => onActiveItemChange?.("me")}
                aria-current={activeItem === "me" ? "page" : undefined}
                aria-pressed={activeItem === "me"}
                disabled={disabled}
                className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeItem === "me"
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "text-muted-foreground border border-transparent"
                }`}
              >
                <User size={14} aria-hidden="true" />
                Me
              </button>
              <button
                type="button"
                onClick={() => onActiveItemChange?.("team")}
                aria-current={activeItem === "team" ? "page" : undefined}
                aria-pressed={activeItem === "team"}
                disabled={disabled}
                className={`flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeItem === "team"
                    ? "bg-primary/10 border border-primary text-foreground"
                    : "text-muted-foreground border border-transparent"
                }`}
              >
                <Users size={14} aria-hidden="true" />
                Team
              </button>
            </div>
          )}

          {/* Logged out CTAs */}
          {isLoggedOut ? (
            <>
              <button type="button" className={`${pillBase} px-3 bg-transparent border-transparent text-foreground hover:bg-foreground/5`}>Log in</button>
              <button type="button" className={`${pillBase} px-3 bg-primary text-primary-foreground border-primary hover:bg-primary/90`}>Sign up</button>
            </>
          ) : (
            <>
              {/* Notifications */}
              {!showHamburger && (
                <button
                  type="button"
                  aria-label={`Notifications, ${notificationCount} unread`}
                  aria-live="polite"
                  disabled={disabled}
                  className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Bell size={14} aria-hidden="true" />
                  {notificationCount > 0 && (
                    <span
                      aria-hidden="true"
                      className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none border-2 border-background"
                    >
                      {notificationCount}
                    </span>
                  )}
                </button>
              )}

              {/* Avatar */}
              {!showHamburger && (
                <button
                  type="button"
                  aria-label="User profile menu"
                  aria-busy={loadingAvatar || undefined}
                  disabled={disabled}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border overflow-hidden bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingAvatar ? (
                    <Loader2 size={14} className="animate-spin text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <img src={davidLinAvatar} alt="" width={28} height={28} className="h-full w-full object-cover" />
                  )}
                </button>
              )}

              {/* Mobile hamburger */}
              {showHamburger && (
                <button
                  type="button"
                  aria-label="Open menu"
                  aria-expanded={false}
                  aria-controls="header-mobile-drawer"
                  className="h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Menu size={14} aria-hidden="true" />
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
}

function HeaderShowcase() {
  const [liveActiveItem, setLiveActiveItem] = useState<"me" | "team">("team");

  return (
    <div className="space-y-8" style={{ "--ring": "212 100% 40%" } as React.CSSProperties}>
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">Global top bar used across all authenticated pages.</p>
      </div>

      {/* Live example */}
      <section aria-labelledby="header-live" className="space-y-3">
        <h3 id="header-live" className="text-lg font-semibold text-foreground">Live example</h3>
        <PreviewThemePanel ariaLabel="Header live example" caption="Full-width interactive example. Toggle the button above to preview dark mode.">
          <HeaderPreview activeItem={liveActiveItem} notificationCount={4} onActiveItemChange={setLiveActiveItem} />
        </PreviewThemePanel>
      </section>

      {/* Variants */}
      <section aria-labelledby="header-variants" className="space-y-3">
        <h3 id="header-variants" className="text-lg font-semibold text-foreground">Variants</h3>
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Default — logged in, Team selected", node: <HeaderPreview activeItem="team" notificationCount={0} /> },
            { label: "Active nav item — Team selected", node: <HeaderPreview activeItem="team" notificationCount={0} /> },
            { label: "With notification badge — 4 unread", node: <HeaderPreview activeItem="team" notificationCount={4} /> },
            { label: "Logged out — Log in / Sign up CTA", node: <HeaderPreview variant="loggedOut" /> },
            { label: "Minimal — logo only (onboarding)", node: <HeaderPreview variant="minimal" /> },
          ].map((v) => (
            <div key={v.label} className="p-4 border border-border rounded-lg bg-card space-y-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">{v.label}</p>
              {v.node}
            </div>
          ))}
        </div>
      </section>

      {/* States */}
      <section aria-labelledby="header-states" className="space-y-3">
        <h3 id="header-states" className="text-lg font-semibold text-foreground">States</h3>
        <p className="text-sm text-muted-foreground">Interactive states for every clickable element in the header.</p>
        <div className="p-6 border border-border rounded-lg bg-card">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Ask AI states */}
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Ask AI</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button type="button" className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    <StarIcon size={14} aria-hidden="true" />Ask AI
                  </button>
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                    <StarIcon size={14} aria-hidden="true" />Ask AI
                  </button>
                  <span className="text-xs text-muted-foreground">Hover</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold ring-2 ring-ring ring-offset-2 ring-offset-background">
                    <StarIcon size={14} aria-hidden="true" />Ask AI
                  </button>
                  <span className="text-xs text-muted-foreground">Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" disabled className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold opacity-50 cursor-not-allowed">
                    <StarIcon size={14} aria-hidden="true" />Ask AI
                  </button>
                  <span className="text-xs text-muted-foreground">Disabled</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" aria-busy="true" className="ask-ai-cta h-7 px-3 inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold">
                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />Ask AI
                  </button>
                  <span className="text-xs text-muted-foreground">Loading</span>
                </div>
              </div>
            </div>

            {/* Me / Team states */}
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Me / Team</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode default state">
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent"><User size={14} aria-hidden="true" />Me</button>
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent"><Users size={14} aria-hidden="true" />Team</button>
                  </div>
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode hover state">
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent"><User size={14} aria-hidden="true" />Me</button>
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold bg-foreground/5 border border-transparent text-foreground"><Users size={14} aria-hidden="true" />Team</button>
                  </div>
                  <span className="text-xs text-muted-foreground">Hover</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode selected state">
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent"><User size={14} aria-hidden="true" />Me</button>
                    <button type="button" aria-current="page" aria-pressed="true" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold bg-primary/10 border border-primary text-foreground"><Users size={14} aria-hidden="true" />Team</button>
                  </div>
                  <span className="text-xs text-muted-foreground">Active / Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-card border border-border p-0.5 rounded-full flex h-7" role="group" aria-label="Mode focus state">
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent"><User size={14} aria-hidden="true" />Me</button>
                    <button type="button" className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold bg-transparent border border-transparent text-muted-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"><Users size={14} aria-hidden="true" />Team</button>
                  </div>
                  <span className="text-xs text-muted-foreground">Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-card border border-border p-0.5 rounded-full flex h-7 opacity-50" role="group" aria-label="Mode disabled state">
                    <button type="button" disabled className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent cursor-not-allowed"><User size={14} aria-hidden="true" />Me</button>
                    <button type="button" disabled className="flex items-center justify-center gap-1 px-3 rounded-full text-sm font-semibold text-muted-foreground border border-transparent cursor-not-allowed"><Users size={14} aria-hidden="true" />Team</button>
                  </div>
                  <span className="text-xs text-muted-foreground">Disabled</span>
                </div>
              </div>
            </div>

            {/* Bell + Avatar states */}
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground">Bell + Avatar</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button aria-label="Notifications, 0 unread" className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground">
                    <Bell size={14} />
                  </button>
                  <span className="text-xs text-muted-foreground">Default</span>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="Notifications, 4 unread" className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground">
                    <Bell size={14} />
                    <span aria-hidden="true" className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 inline-flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-semibold leading-none border-2 border-background">4</span>
                  </button>
                  <span className="text-xs text-muted-foreground">With badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-muted border border-border text-foreground">
                    <Bell size={14} />
                  </button>
                  <span className="text-xs text-muted-foreground">Hover</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="relative h-7 w-7 inline-flex items-center justify-center rounded-full bg-card border border-border text-foreground ring-2 ring-ring ring-offset-2 ring-offset-background">
                    <Bell size={14} />
                  </button>
                  <span className="text-xs text-muted-foreground">Focus</span>
                </div>
                <div className="flex items-center gap-2">
                  <button aria-label="User profile menu" className="h-7 w-7 inline-flex items-center justify-center rounded-full border border-border overflow-hidden bg-muted">
                    <Loader2 size={14} className="animate-spin text-muted-foreground" />
                  </button>
                  <span className="text-xs text-muted-foreground">Avatar loading</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsiveness */}
      <section aria-labelledby="header-responsive" className="space-y-3">
        <h3 id="header-responsive" className="text-lg font-semibold text-foreground">Responsiveness</h3>
        <div className="space-y-4">
          <div className="p-4 border border-border rounded-lg bg-card space-y-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Desktop — 1280px+</p>
            <div className="w-full"><HeaderPreview breakpoint="desktop" activeItem="team" notificationCount={4} /></div>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card space-y-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Tablet — 768px (full Me / Team toggle retained)</p>
            <div className="w-[768px] max-w-full"><HeaderPreview breakpoint="tablet" activeItem="team" notificationCount={4} /></div>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card space-y-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Mobile — 375px (overflow into hamburger drawer)</p>
            <div className="w-[375px] max-w-full"><HeaderPreview breakpoint="mobile" notificationCount={4} /></div>
          </div>
          <div className="p-4 border border-border rounded-lg bg-card space-y-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground">Mobile stacked — 375px (two rows: logo + avatar / Ask AI + Me/Team + bell)</p>
            <div className="w-[375px] max-w-full"><HeaderPreview breakpoint="mobileStacked" activeItem="team" notificationCount={4} /></div>
          </div>
        </div>
      </section>


      {/* Accessibility */}
      <section aria-labelledby="header-a11y" className="space-y-3">
        <h3 id="header-a11y" className="text-lg font-semibold text-foreground">Accessibility</h3>
        <div className="p-6 border border-border rounded-lg bg-card text-sm text-foreground">
          <ul className="list-disc pl-5 space-y-2">
            <li>Rendered as a <code className="font-mono text-xs">&lt;header role="banner"&gt;</code> landmark exposed once per page.</li>
            <li>Logo link uses <code className="font-mono text-xs">aria-label="Rathbones home"</code>; image <code className="font-mono text-xs">alt=""</code> avoids redundant announcement.</li>
            <li>Ask AI button uses <code className="font-mono text-xs">aria-label="Ask AI"</code> and stays a real <code className="font-mono text-xs">&lt;button&gt;</code>.</li>
            <li>Me / Team set <code className="font-mono text-xs">aria-current="page"</code> on the active item; selection is conveyed by outline + fill in addition to color.</li>
            <li>Bell uses <code className="font-mono text-xs">aria-label="Notifications, N unread"</code> with <code className="font-mono text-xs">aria-live="polite"</code> so the count updates announce.</li>
            <li>Avatar uses <code className="font-mono text-xs">aria-label="User profile menu"</code>; image inside is decorative (<code className="font-mono text-xs">alt=""</code>).</li>
            <li>Every interactive element is a real button/link, reachable via <kbd className="px-1 border rounded">Tab</kbd> and activatable with <kbd className="px-1 border rounded">Enter</kbd> / <kbd className="px-1 border rounded">Space</kbd>.</li>
            <li>Focus ring uses the global <code className="font-mono text-xs">ring-ring</code> token (2px) with 2px offset against the background — visible on light and dark.</li>
            <li>Color pairings meet WCAG AA: <code className="font-mono text-xs">primary-foreground</code> on <code className="font-mono text-xs">primary</code> ≥ 4.5:1, <code className="font-mono text-xs">foreground</code> on <code className="font-mono text-xs">background</code> ≥ 4.5:1, badge <code className="font-mono text-xs">destructive-foreground</code> on <code className="font-mono text-xs">destructive</code> ≥ 4.5:1.</li>
            <li>Mobile hamburger uses <code className="font-mono text-xs">aria-expanded</code> + <code className="font-mono text-xs">aria-controls</code> pointing at the drawer it toggles.</li>
          </ul>
        </div>
      </section>

      {/* Props */}
      <section aria-labelledby="header-props" className="space-y-3">
        <h3 id="header-props" className="text-lg font-semibold text-foreground">Props</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Prop</TableHead>
              <TableHead className="w-[260px]">Type</TableHead>
              <TableHead className="w-[120px]">Default</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">activeItem</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"me" | "team" | "none"</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"none"</TableCell>
              <TableCell className="text-sm text-muted-foreground">Highlights the matching nav pill and sets <code className="font-mono text-xs">aria-current="page"</code>.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">notificationCount</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">number</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">0</TableCell>
              <TableCell className="text-sm text-muted-foreground">Unread count for the bell badge. Hidden when 0; announced via <code className="font-mono text-xs">aria-live="polite"</code>.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">isLoggedIn</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">boolean</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">true</TableCell>
              <TableCell className="text-sm text-muted-foreground">When false, hides avatar/bell and renders Log in / Sign up CTAs.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">avatarSrc</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">string</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">—</TableCell>
              <TableCell className="text-sm text-muted-foreground">Image URL for the user avatar. Falls back to initials when omitted.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">showAskAI</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">boolean</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">true</TableCell>
              <TableCell className="text-sm text-muted-foreground">Toggles the Ask AI pill. Hide on routes where the assistant is unavailable.</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-mono text-xs font-medium text-foreground">variant</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"default" | "minimal"</TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">"default"</TableCell>
              <TableCell className="text-sm text-muted-foreground">"minimal" renders only the logo — used for onboarding or focused flows.</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <pre className="p-4 rounded-lg bg-muted text-foreground text-xs font-mono overflow-x-auto">
{`<Header
  activeItem="team"
  notificationCount={4}
  isLoggedIn
  avatarSrc={user.avatar}
  showAskAI
  variant="default"
/>`}
        </pre>
      </section>
    </div>
  );
}





export default function DesignSystem() {
  const [sidebarTab, setSidebarTab] = useState<"elements" | "patterns">("elements");
  const defaultItem = sidebarTab === "elements" ? elementsOrder[0] : patternItems[0];
  const [selected, setSelected] = useState(allNavItems[0]);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [flyoutOpen, setFlyoutOpen] = useState(false);
  
  const [tabsLightSelected, setTabsLightSelected] = useState(0);
  const [tabsDarkSelected, setTabsDarkSelected] = useState(0);
  const [chipsLightSelected, setChipsLightSelected] = useState(0);
  const [chipsDarkSelected, setChipsDarkSelected] = useState(0);
  const selectChipLight = (i: number) => setChipsLightSelected(i);
  const selectChipDark = (i: number) => setChipsDarkSelected(i);


  const activeType = componentTypes.find((c) => c.name === selected) ?? componentTypes[0];

  const toggleVariantExpand = (variant: string) => {
    setExpandedVariants(prev => {
      const next = new Set(prev);
      if (next.has(variant)) next.delete(variant);
      else next.add(variant);
      return next;
    });
  };

  // When switching tabs, select first item of that tab if current selection isn't in it
  const handleTabSwitch = (tab: "elements" | "patterns") => {
    setSidebarTab(tab);
    const items = tab === "elements" ? elementsOrder : patternItems;
    if (!items.includes(selected)) {
      setSelected(items[0]);
    }
  };

  const visibleItems = sidebarTab === "elements" ? elementsOrder : patternItems;

  return (
    <>
    <div className="flex flex-1 overflow-hidden">
      {/* Left sidebar */}
      <aside className="w-[240px] flex-shrink-0 border-r border-border bg-background flex flex-col">
        {/* Tabs */}
        <div className="p-3 pt-6">
          <div className="bg-card border border-border p-1 rounded-full flex h-10">
            <button
              onClick={() => handleTabSwitch("elements")}
              className={`flex-1 flex items-center justify-center px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                sidebarTab === "elements"
                  ? "bg-ds-100 border border-ds-500 text-foreground"
                  : "text-muted-foreground border border-transparent"
              }`}
            >
              Elements
            </button>
            <button
              onClick={() => handleTabSwitch("patterns")}
              className={`flex-1 flex items-center justify-center px-3 rounded-full text-sm font-semibold transition-all duration-200 ${
                sidebarTab === "patterns"
                  ? "bg-ds-100 border border-ds-500 text-foreground"
                  : "text-muted-foreground border border-transparent"
              }`}
            >
              Patterns
            </button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <nav className="p-3 pt-0 space-y-1" aria-label="Component list">
            {visibleItems.map((name) => {
              const dotClass = greenComponents.has(name) ? "fill-green-500 text-green-500" : "fill-red-500 text-red-500";
              return (
                <button
                  key={name}
                  onClick={() => setSelected(name)}
                  aria-current={selected === name ? "page" : undefined}
                  className={`w-full text-left px-4 py-2 rounded-[100px] text-sm font-normal border transition-all duration-200 flex items-center gap-2 ${
                    selected === name
                      ? "bg-sidebar-accent border-[hsl(var(--sidebar-selected-border))] text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                  }`}
                >
                  <Circle size={8} className={dotClass} />
                  {name}
                </button>
              );
            })}
          </nav>
        </ScrollArea>
      </aside>

      {/* Right content — table */}
      <main className="flex-1 overflow-y-auto p-8" aria-label="Component preview">
        <div className="max-w-[1200px] mx-auto">
          <h2 className="text-2xl font-semibold text-foreground mb-6">{selected}</h2>

          {selected === "Cornerstone colors" ? (
            <>
              <p className="text-sm text-muted-foreground mb-6 -mt-2">Click a swatch to copy its hex value.</p>
              <div className="space-y-12">
              <section className="space-y-8">
                {(() => {
                  const zincIndex = colorPalettes.findIndex((p) => p.name === "Zinc (Neutral)");
                  const statusStart = colorPalettes.findIndex((p) => p.name === "Red (Status)");
                  const nodes: React.ReactNode[] = [];
                  for (let i = 0; i < statusStart; i++) {
                    const palette = colorPalettes[i];
                    nodes.push(<ColorPalette key={palette.name} name={palette.name} colors={palette.colors} mainShades={palette.mainShades} />);
                    if (i === zincIndex) {
                      nodes.push(<ColorPalette key={basePalette.name} name={basePalette.name} colors={basePalette.colors} mainShades={basePalette.mainShades} />);
                    }
                  }
                  return nodes;
                })()}
                <h3 className="text-lg font-semibold text-foreground">Status colors</h3>
                {colorPalettes.slice(colorPalettes.findIndex((p) => p.name === "Red (Status)")).map((palette) => (
                  <ColorPalette key={palette.name} name={palette.name} colors={palette.colors} mainShades={palette.mainShades} />
                ))}
              </section>
              <section className="space-y-6">
                <h3 className="text-lg font-semibold text-foreground">Semantic tokens</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Light mode</h4>
                    <div className="border border-border rounded-lg overflow-hidden bg-card">
                      <ColorTokenTable mode="light" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Dark mode</h4>
                    <div className="border border-border rounded-lg overflow-hidden bg-card">
                      <ColorTokenTable mode="dark" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
            </>
          ) : selected === "Button" ? (
            (() => {
              const STATES = ["Default", "Hover", "Active", "Focus", "Disabled"] as const;
              type StateName = typeof STATES[number];
              type V = { variant: string; type: string; isIconOnly?: boolean; states: Record<StateName, { bg: string; text: string; border?: string }> };
              const light: V[] = [
                { variant: "Primary", type: "Filled", states: {
                  Default:  { bg: "#7160B4", text: "#FFFFFF" },
                  Hover:    { bg: "#56498B", text: "#FFFFFF" },
                  Active:   { bg: "#3B325E", text: "#FFFFFF" },
                  Focus:    { bg: "#7160B4", text: "#FFFFFF" },
                  Disabled: { bg: "#7160B4", text: "#FFFFFF" },
                }},
                { variant: "Secondary", type: "Filled + Outline", states: {
                  Default:  { bg: "#F4F4F5", text: "#09090B", border: "#D4D4D8" },
                  Hover:    { bg: "#E4E4E7", text: "#09090B", border: "#D4D4D8" },
                  Active:   { bg: "#D4D4D8", text: "#09090B", border: "#D4D4D8" },
                  Focus:    { bg: "#F4F4F5", text: "#09090B", border: "#D4D4D8" },
                  Disabled: { bg: "#F4F4F5", text: "#09090B", border: "#D4D4D8" },
                }},
                { variant: "Tertiary", type: "Outline", states: {
                  Default:  { bg: "#FFFFFF", text: "#09090B", border: "#D4D4D8" },
                  Hover:    { bg: "#FAFAFA", text: "#09090B", border: "#D4D4D8" },
                  Active:   { bg: "#F4F4F5", text: "#09090B", border: "#D4D4D8" },
                  Focus:    { bg: "#FFFFFF", text: "#09090B", border: "#D4D4D8" },
                  Disabled: { bg: "#FFFFFF", text: "#09090B", border: "#D4D4D8" },
                }},
                { variant: "Ghost", type: "Text only", states: {
                  Default:  { bg: "transparent", text: "#09090B" },
                  Hover:    { bg: "#F4F4F5",   text: "#09090B" },
                  Active:   { bg: "#E4E4E7",   text: "#09090B" },
                  Focus:    { bg: "transparent", text: "#09090B" },
                  Disabled: { bg: "transparent", text: "#09090B" },
                }},
                { variant: "Link", type: "Text only", states: {
                  Default:  { bg: "transparent", text: "#09090B" },
                  Hover:    { bg: "transparent", text: "#09090B" },
                  Active:   { bg: "#F4F4F5",   text: "#09090B" },
                  Focus:    { bg: "transparent", text: "#09090B" },
                  Disabled: { bg: "transparent", text: "#09090B" },
                }},
                { variant: "Icon", type: "Icon only", isIconOnly: true, states: {
                  Default:  { bg: "transparent", text: "#09090B" },
                  Hover:    { bg: "#F4F4F5",   text: "#09090B" },
                  Active:   { bg: "#E4E4E7",   text: "#09090B" },
                  Focus:    { bg: "transparent", text: "#09090B" },
                  Disabled: { bg: "transparent", text: "#09090B" },
                }},
              ];
              const dark: V[] = [
                { variant: "Primary", type: "Filled", states: {
                  Default:  { bg: "#7160B4", text: "#FFFFFF" },
                  Hover:    { bg: "#8A75DB", text: "#FFFFFF" },
                  Active:   { bg: "#56498B", text: "#FFFFFF" },
                  Focus:    { bg: "#7160B4", text: "#FFFFFF" },
                  Disabled: { bg: "#7160B4", text: "#FFFFFF" },
                }},
                { variant: "Secondary", type: "Filled + Outline", states: {
                  Default:  { bg: "#27272A", text: "#FAFAFA", border: "#3F3F46" },
                  Hover:    { bg: "#3F3F46", text: "#FAFAFA", border: "#3F3F46" },
                  Active:   { bg: "#52525B", text: "#FAFAFA", border: "#52525B" },
                  Focus:    { bg: "#27272A", text: "#FAFAFA", border: "#3F3F46" },
                  Disabled: { bg: "#27272A", text: "#FAFAFA", border: "#3F3F46" },
                }},
                { variant: "Tertiary", type: "Outline", states: {
                  Default:  { bg: "transparent", text: "#FAFAFA", border: "#3F3F46" },
                  Hover:    { bg: "#27272A",     text: "#FAFAFA", border: "#3F3F46" },
                  Active:   { bg: "#3F3F46",     text: "#FAFAFA", border: "#3F3F46" },
                  Focus:    { bg: "transparent", text: "#FAFAFA", border: "#3F3F46" },
                  Disabled: { bg: "transparent", text: "#FAFAFA", border: "#3F3F46" },
                }},
                { variant: "Ghost", type: "Text only", states: {
                  Default:  { bg: "transparent", text: "#FAFAFA" },
                  Hover:    { bg: "#27272A",     text: "#FAFAFA" },
                  Active:   { bg: "#3F3F46",     text: "#FAFAFA" },
                  Focus:    { bg: "transparent", text: "#FAFAFA" },
                  Disabled: { bg: "transparent", text: "#FAFAFA" },
                }},
                { variant: "Link", type: "Text only", states: {
                  Default:  { bg: "transparent", text: "#BBAFEA" },
                  Hover:    { bg: "transparent", text: "#BBAFEA" },
                  Active:   { bg: "#27272A",     text: "#BBAFEA" },
                  Focus:    { bg: "transparent", text: "#BBAFEA" },
                  Disabled: { bg: "transparent", text: "#BBAFEA" },
                }},
                { variant: "Icon", type: "Icon only", isIconOnly: true, states: {
                  Default:  { bg: "transparent", text: "#FAFAFA" },
                  Hover:    { bg: "#27272A",     text: "#FAFAFA" },
                  Active:   { bg: "#3F3F46",     text: "#FAFAFA" },
                  Focus:    { bg: "transparent", text: "#FAFAFA" },
                  Disabled: { bg: "transparent", text: "#FAFAFA" },
                }},
              ];

              const renderBtn = (v: V, state: StateName, mode: "light" | "dark") => {
                const s = v.states[state];
                const ringOffset = mode === "light" ? "#FFFFFF" : "#09090B";
                const cls = [
                  "self-start inline-flex items-center justify-center gap-2 text-sm font-medium leading-5 rounded-full transition-colors",
                  v.isIconOnly ? "h-9 w-9 p-0 aspect-square shrink-0" : "px-3 py-2",
                  s.border ? "border" : "",
                  state === "Focus" ? "ring-2 ring-ring ring-offset-2" : "",
                  state === "Disabled" ? "opacity-50 cursor-not-allowed" : "",
                  v.variant === "Link" && state === "Hover" ? "underline" : "",
                ].filter(Boolean).join(" ");
                const style: React.CSSProperties = {
                  backgroundColor: s.bg === "transparent" ? "transparent" : s.bg,
                  color: s.text,
                  ...(s.border ? { borderColor: s.border } : {}),
                  ...(state === "Focus" ? { ["--tw-ring-offset-color" as any]: ringOffset } : {}),
                };
                return (
                  <button className={cls} style={style} disabled={state === "Disabled"} aria-label={v.isIconOnly ? `${v.variant} ${state}` : undefined}>
                    {v.isIconOnly ? <Settings className="h-4 w-4" strokeWidth={2} /> : v.variant}
                  </button>
                );
              };

              const renderModePanel = (mode: "light" | "dark", v: V) => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-5 gap-4">
                      {STATES.map((s) => {
                        const st = v.states[s];
                        return (
                          <div key={s} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{s}</p>
                            {renderBtn(v, s, mode)}
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>
                                bg: <span className="font-mono" style={{ color: valueColor }}>{hexToPaletteToken(st.bg)}</span>
                              </span>
                              <span className="text-[10px]" style={{ color: labelColor }}>
                                text: <span className="font-mono" style={{ color: valueColor }}>{hexToPaletteToken(st.text)}</span>
                              </span>
                              {st.border && (
                                <span className="text-[10px]" style={{ color: labelColor }}>
                                  border: <span className="font-mono" style={{ color: valueColor }}>{hexToPaletteToken(st.border)}</span>
                                </span>
                              )}
                              {s === "Focus" && (
                                <span className="text-[10px]" style={{ color: labelColor }}>
                                  ring: <span className="font-mono" style={{ color: valueColor }}>{mode === "light" ? "blue/700" : "blue/400"}</span>
                                </span>
                              )}
                              {s === "Disabled" && (
                                <span className="text-[10px]" style={{ color: labelColor }}>
                                  opacity: <span className="font-mono" style={{ color: valueColor }}>50%</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-10">
                  <div className="space-y-6">
                    {light.map((v, i) => {
                      const darkV = dark[i];
                      return (
                        <div key={v.variant} className="space-y-3">
                          <p className="text-sm font-medium text-muted-foreground">{v.variant}</p>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {renderModePanel("light", v)}
                            {renderModePanel("dark", darkV)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <SpacingSpec
                    rows={[
                      { size: "sm", paddingX: "12px", paddingY: "8px",  minHeight: "32px", minWidth: "64px", iconSize: "14px", iconGap: "8px", fontSize: "14px" },
                      { size: "md", paddingX: "12px", paddingY: "8px",  minHeight: "36px", minWidth: "80px", iconSize: "16px", iconGap: "8px", fontSize: "14px" },
                      { size: "lg", paddingX: "12px", paddingY: "8px",  minHeight: "40px", minWidth: "96px", iconSize: "18px", iconGap: "8px", fontSize: "14px" },
                    ]}
                    borderWidth="1px"
                    borderRadius="9999px (pill)"
                  />

                  <TypographySpec
                    values={{
                      fontFamilyToken: "font-sans (Lato)",
                      fontWeight: "500 (medium)",
                      letterSpacing: "0",
                      lineHeight: "20px (leading-5)",
                      textTransform: "none (sentence case)",
                      perSize: [
                        { size: "sm", fontSize: "14px / text-sm" },
                        { size: "md", fontSize: "14px / text-sm" },
                        { size: "lg", fontSize: "14px / text-sm" },
                      ],
                    }}
                  />

                  <IconSupportSpec
                    gap="8px (gap-2)"
                    iconSize="16px (h-4 w-4)"
                    iconLeft={
                      <Button className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600">
                        <Settings />
                        <span>Settings</span>
                      </Button>
                    }
                    iconRight={
                      <Button className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600">
                        <span>Continue</span>
                        <ArrowRight />
                      </Button>
                    }
                    iconOnly={
                      <Button
                        size="icon"
                        aria-label="Open settings"
                        title="Open settings"
                        className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600"
                      >
                        <Settings />
                      </Button>
                    }
                  />

                  <LoadingSpec
                    spinnerToken="base/white (inherits text-white)"
                    widthLocked
                    opacity="100% (button), label hidden, spinner replaces icon slot"
                    ariaLive="polite — announces 'Loading' once"
                    preview={
                      <Button
                        disabled
                        aria-busy="true"
                        aria-live="polite"
                        className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600"
                      >
                        <Loader2 className="animate-spin" />
                        <span>Saving…</span>
                      </Button>
                    }
                  />

                  <MotionSpec
                    rows={[
                      { transition: "Default → Hover",   properties: "background-color, color, border-color", duration: "150ms", easing: "ease-out" },
                      { transition: "Hover → Active",    properties: "background-color",                      duration: "75ms",  easing: "ease-in" },
                      { transition: "Default → Focus",   properties: "box-shadow (focus ring)",               duration: "100ms", easing: "ease-out" },
                      { transition: "Any → Disabled",    properties: "opacity",                               duration: "100ms", easing: "ease-out" },
                    ]}
                  />

                  <A11ySpec
                    values={{
                      role: "button (implicit on <button>)",
                      ariaAttributes: [
                        "aria-label — required for icon-only buttons",
                        "aria-disabled — for non-native disabled state",
                        "aria-busy=\"true\" — while loading",
                        "aria-pressed — for toggle buttons",
                      ],
                      keyboard: [
                        { key: "Tab",   action: "Move focus to the button" },
                        { key: "Enter", action: "Activate the button" },
                        { key: "Space", action: "Activate the button" },
                      ],
                      focusRing: "ring-2 ring-blue/700 (light) · ring-blue/400 (dark), 2px offset",
                      contrast: "≥ 4.5:1 (text), ≥ 3:1 (icon & focus ring) — WCAG AA",
                      loadingAnnouncement: "Screen readers announce 'Saving…, busy' via aria-busy + aria-live=\"polite\"",
                    }}
                  />

                  <UsageInContext
                    examples={[
                      {
                        label: "Inside a form (paired with an input)",
                        node: (
                          <form className="flex items-center gap-2" onSubmit={(e) => e.preventDefault()}>
                            <Input placeholder="Email address" className="flex-1" />
                            <Button type="submit" className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600">
                              Subscribe
                            </Button>
                          </form>
                        ),
                      },
                      {
                        label: "Modal footer (paired with a cancel action)",
                        node: (
                          <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                            <Button
                              variant="outline"
                              className="border-peri-600 text-peri-600 hover:bg-peri-50 hover:text-peri-700"
                            >
                              Cancel
                            </Button>
                            <Button className="bg-peri-600 text-white hover:bg-peri-700 border-peri-600">
                              Confirm
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                  />

                  <CodeSnippetSection
                    snippets={[
                      { label: "Default", code: `<Button>Save changes</Button>` },
                      { label: "Solid (primary)", code: `<Button variant="default">Save changes</Button>` },
                      { label: "Outline (tertiary)", code: `<Button variant="tertiary">Cancel</Button>` },
                      { label: "Ghost", code: `<Button variant="ghost">Dismiss</Button>` },
                      { label: "With icon", code: `<Button>\n  <Settings />\n  <span>Settings</span>\n</Button>` },
                      { label: "Icon only", code: `<Button size="icon" aria-label="Open settings">\n  <Settings />\n</Button>` },
                      { label: "Loading", code: `<Button disabled aria-busy="true">\n  <Loader2 className="animate-spin" />\n  <span>Saving\u2026</span>\n</Button>` },
                    ]}
                  />
                </div>
              );
            })()


          ) : selected === "Radio" ? (
            (() => {
              const STATES = ["Default", "Disabled", "Checked", "Checked + Disabled"] as const;
              type StateName = typeof STATES[number];
              type RState = { bg: string; border: string; dot?: string; text: string };
              const light: Record<StateName, RState> = {
                "Default":            { bg: "base/white", border: "zinc/500", text: "zinc/950" },
                "Disabled":           { bg: "zinc/100",   border: "zinc/300", text: "zinc/500" },
                "Checked":            { bg: "base/white", border: "peri/600", dot: "peri/600", text: "zinc/950" },
                "Checked + Disabled": { bg: "zinc/100",   border: "zinc/400", dot: "zinc/400", text: "zinc/500" },
              };
              const dark: Record<StateName, RState> = {
                "Default":            { bg: "transparent", border: "zinc/500", text: "zinc/50" },
                "Disabled":           { bg: "zinc/900",    border: "zinc/700", text: "zinc/500" },
                "Checked":            { bg: "transparent", border: "peri/400", dot: "peri/400", text: "zinc/50" },
                "Checked + Disabled": { bg: "zinc/900",    border: "zinc/700", dot: "zinc/600", text: "zinc/500" },
              };
              const tokenToHex: Record<string, string> = {
                "base/white": "#FFFFFF", "transparent": "transparent",
                "zinc/50": "#FAFAFA", "zinc/100": "#F4F4F5", "zinc/300": "#D4D4D8", "zinc/400": "#A1A1AA",
                "zinc/500": "#71717A", "zinc/600": "#52525B", "zinc/700": "#3F3F46", "zinc/900": "#18181B", "zinc/950": "#09090B",
                "peri/400": "#A493DB", "peri/600": "#7160B4",
              };
              const renderRadio = (s: RState, disabled: boolean) => (
                <span
                  className="inline-flex items-center justify-center rounded-full"
                  style={{
                    width: 24, height: 24, borderWidth: 1, borderStyle: "solid",
                    borderColor: tokenToHex[s.border] ?? s.border,
                    backgroundColor: tokenToHex[s.bg] ?? s.bg,
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  {s.dot && (
                    <span className="block rounded-full" style={{ width: 10, height: 10, backgroundColor: tokenToHex[s.dot] ?? s.dot }} />
                  )}
                </span>
              );
              const renderModePanel = (mode: "light" | "dark") => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                const map = mode === "light" ? light : dark;
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STATES.map((sName) => {
                        const s = map[sName];
                        const disabled = sName === "Disabled" || sName === "Checked + Disabled";
                        return (
                          <div key={sName} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{sName}</p>
                            <div className="flex items-center gap-2">
                              {renderRadio(s, disabled)}
                              <span className="text-sm" style={{ color: tokenToHex[s.text], opacity: disabled ? 0.6 : 1 }}>Label</span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>bg: <span className="font-mono" style={{ color: valueColor }}>{s.bg}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>border: <span className="font-mono" style={{ color: valueColor }}>{s.border}</span></span>
                              {s.dot && (
                                <span className="text-[10px]" style={{ color: labelColor }}>dot: <span className="font-mono" style={{ color: valueColor }}>{s.dot}</span></span>
                              )}
                              <span className="text-[10px]" style={{ color: labelColor }}>text: <span className="font-mono" style={{ color: valueColor }}>{s.text}</span></span>
                              {disabled && (
                                <span className="text-[10px]" style={{ color: labelColor }}>opacity: <span className="font-mono" style={{ color: valueColor }}>60%</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {renderModePanel("light")}
                    {renderModePanel("dark")}
                  </div>
                </div>
              );
            })()

          ) : selected === "Checkbox" ? (
            (() => {
              const STATES = ["Default", "Disabled", "Checked", "Checked + Disabled"] as const;
              type StateName = typeof STATES[number];
              type CState = { bg: string; border: string; check?: string; text: string };
              const light: Record<StateName, CState> = {
                "Default":            { bg: "base/white", border: "zinc/500", text: "zinc/950" },
                "Disabled":           { bg: "zinc/100",   border: "zinc/300", text: "zinc/500" },
                "Checked":            { bg: "peri/600",   border: "peri/600", check: "base/white", text: "zinc/950" },
                "Checked + Disabled": { bg: "zinc/100",   border: "zinc/400", check: "zinc/400", text: "zinc/500" },
              };
              const dark: Record<StateName, CState> = {
                "Default":            { bg: "transparent", border: "zinc/500", text: "zinc/50" },
                "Disabled":           { bg: "zinc/900",    border: "zinc/700", text: "zinc/500" },
                "Checked":            { bg: "peri/400",    border: "peri/400", check: "base/white", text: "zinc/50" },
                "Checked + Disabled": { bg: "zinc/900",    border: "zinc/700", check: "zinc/600", text: "zinc/500" },
              };
              const tokenToHex: Record<string, string> = {
                "base/white": "#FFFFFF", "transparent": "transparent",
                "zinc/50": "#FAFAFA", "zinc/100": "#F4F4F5", "zinc/300": "#D4D4D8", "zinc/400": "#A1A1AA",
                "zinc/500": "#71717A", "zinc/600": "#52525B", "zinc/700": "#3F3F46", "zinc/900": "#18181B", "zinc/950": "#09090B",
                "peri/400": "#A493DB", "peri/600": "#7160B4",
              };
              const renderCheckbox = (s: CState, disabled: boolean) => (
                <span
                  className="inline-flex items-center justify-center rounded-[4px]"
                  style={{
                    width: 24, height: 24, borderWidth: 1, borderStyle: "solid",
                    borderColor: tokenToHex[s.border] ?? s.border,
                    backgroundColor: tokenToHex[s.bg] ?? s.bg,
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  {s.check && (
                    <Check className="h-5 w-5" strokeWidth={3} style={{ color: tokenToHex[s.check] ?? s.check }} />
                  )}
                </span>
              );
              const renderModePanel = (mode: "light" | "dark") => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                const map = mode === "light" ? light : dark;
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STATES.map((sName) => {
                        const s = map[sName];
                        const disabled = sName === "Disabled" || sName === "Checked + Disabled";
                        return (
                          <div key={sName} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{sName}</p>
                            <div className="flex items-center gap-2">
                              {renderCheckbox(s, disabled)}
                              <span className="text-sm" style={{ color: tokenToHex[s.text], opacity: disabled ? 0.5 : 1 }}>Label</span>
                            </div>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>bg: <span className="font-mono" style={{ color: valueColor }}>{s.bg}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>border: <span className="font-mono" style={{ color: valueColor }}>{s.border}</span></span>
                              {s.check && (
                                <span className="text-[10px]" style={{ color: labelColor }}>check: <span className="font-mono" style={{ color: valueColor }}>{s.check}</span></span>
                              )}
                              <span className="text-[10px]" style={{ color: labelColor }}>text: <span className="font-mono" style={{ color: valueColor }}>{s.text}</span></span>
                              {disabled && (
                                <span className="text-[10px]" style={{ color: labelColor }}>opacity: <span className="font-mono" style={{ color: valueColor }}>50%</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {renderModePanel("light")}
                    {renderModePanel("dark")}
                  </div>
                </div>
              );
            })()

          ) : selected === "Cards — Upskilling" ? (

            <div className="space-y-6">
              {/* Preview — uses the canonical .ds-list-card class from design-system.css */}
              <div className="p-6 border border-border rounded-lg flex justify-center bg-background">
                <article className="ds-list-card" style={{ width: 800 }}>
                  <div className="ds-list-card-header">
                    <p className="ds-list-card-title">Negotiation basics and agreements</p>
                    <div className="ds-list-card-actions">
                      <button type="button" aria-label="Card options" className="ds-list-card-icon-button">
                        <MoreHorizontal size={24} />
                      </button>
                    </div>
                  </div>
                  <p className="ds-list-card-description">
                    Strengthen your ability to align, close, and formalize agreements.
                  </p>
                  <div className="ds-list-card-footer">
                    <p className="ds-list-card-meta">
                      Just now&nbsp; •&nbsp; Activities: 16&nbsp; •&nbsp; Primary skill: Deal closing
                    </p>
                    <Badge variant="outline">Assigned</Badge>
                  </div>
                </article>
              </div>
              {/* Spec table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Card header</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-xl</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="card" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Description</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Meta info</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Card container</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="card" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Tabs" ? (
            <div className="space-y-6">
              {/* Light mode preview */}
              <div className="p-6 border border-border rounded-lg space-y-4 bg-white">
                <h3 className="text-sm font-medium text-foreground">Light mode</h3>
                <div className="flex gap-0" role="tablist" aria-label="Tabs preview light mode">
                  {["Insights", "Skills", "Career exploration", "About"].map((label, i) => {
                    const isSelected = i === tabsLightSelected;
                    return (
                      <button
                        key={label}
                        role="tab"
                        type="button"
                        aria-selected={isSelected}
                        onClick={() => setTabsLightSelected(i)}
                        className={
                          isSelected
                            ? "px-4 py-4 text-sm font-bold transition-colors text-[#56498B] border-b-4 border-[#56498B]"
                            : "px-4 py-4 text-sm font-normal transition-colors text-[#71717A] border-b border-[#E4E4E7] hover:text-[#56498B]"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dark mode preview */}
              <div className="p-6 border border-border rounded-lg space-y-4 bg-[#09090B]">
                <h3 className="text-sm font-medium text-[#FAFAFA]">Dark mode</h3>
                <div className="flex gap-0" role="tablist" aria-label="Tabs preview dark mode">
                  {["Insights", "Skills", "Career exploration", "About"].map((label, i) => {
                    const isSelected = i === tabsDarkSelected;
                    return (
                      <button
                        key={label}
                        role="tab"
                        type="button"
                        aria-selected={isSelected}
                        onClick={() => setTabsDarkSelected(i)}
                        className={
                          isSelected
                            ? "px-4 py-4 text-sm font-bold transition-colors text-[#9F8EE1] border-b-4 border-[#9F8EE1]"
                            : "px-4 py-4 text-sm font-normal transition-colors text-[#A1A1AA] border-b border-[#3F3F46] hover:text-[#9F8EE1]"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Specs table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Mode</TableHead>
                    <TableHead className="w-[140px]">State</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    <TableHead className="w-[160px]">Text color</TableHead>
                    <TableHead className="w-[120px]">Padding</TableHead>
                    <TableHead className="w-[120px]">Gap</TableHead>
                    <TableHead className="w-[200px]">Bottom border</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground" rowSpan={2}>Light</TableCell>
                    <TableCell className="font-medium text-foreground">Selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-bold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 700 (#56498B)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px (all sides)</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">0px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono">4px solid</span>
                        <ColorSwatch token="peri 700 (#56498B)" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 500 (#71717A)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px (all sides)</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">0px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono">1px solid</span>
                        <ColorSwatch token="zinc 200 (#E4E4E7)" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground" rowSpan={2}>Dark</TableCell>
                    <TableCell className="font-medium text-foreground">Selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-bold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 400 (#9F8EE1)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px (all sides)</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">0px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono">4px solid</span>
                        <ColorSwatch token="peri 400 (#9F8EE1)" />
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 400 (#A1A1AA)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px (all sides)</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">0px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono">1px solid</span>
                        <ColorSwatch token="zinc 700 (#3F3F46)" />
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Prompt" ? (
            <div className="space-y-6">
              {/* Preview */}
              <div className="p-6 border border-border rounded-lg flex justify-center bg-primary-foreground">
                <button type="button" className="ds-prompt-card">
                  <Search className="ds-prompt-card-icon" />
                  <p className="ds-prompt-card-label">Explore team activity signals</p>
                </button>
              </div>

              {/* Specs table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                    <TableHead className="w-[120px]">Corner radius</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Prompt card</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Chat Design" ? (
            <div className="space-y-6">
              {/* Preview */}
              <div className="p-6 border border-border rounded-lg flex justify-center bg-primary-foreground">
                <div className="w-[800px] flex flex-col">
                  {/* User chat bubble */}
                  <div className="flex justify-end">
                    <div className="bg-figma-c3 rounded-full px-4 py-4 max-w-[80%]">
                      <p className="text-sm font-normal text-foreground">Identify team skill gaps and rank them by severity</p>
                    </div>
                  </div>

                  {/* 40px gap */}
                  <div className="h-10" />

                  {/* Anchoring prompt */}
                  <div className="flex justify-start">
                    <div className="bg-card border border-accent rounded-[16px] px-4 py-4 w-[475px] flex items-center justify-between gap-3">
                      <p className="text-sm font-normal text-foreground">Title of the current visualization goes here...</p>
                      <LayoutGrid size={24} className="text-accent flex-shrink-0" />
                    </div>
                  </div>

                  {/* 16px gap */}
                  <div className="h-4" />

                  {/* AI chat response */}
                  <div className="flex justify-start max-w-[475px]">
                    <p className="text-sm font-normal text-foreground whitespace-pre-line">
                      Here's an analysis of strategic skill gaps across your organization, ranked by severity and impact.{"\n\n"}
                      The panel on the right shows each skill's current coverage vs target, the gap magnitude, and how many employees are affected.
                    </p>
                  </div>

                  {/* 16px gap */}
                  <div className="h-4" />

                  {/* Interaction icons */}
                  <div className="flex items-center gap-4">
                    <ThumbsUp size={24} className="text-secondary-foreground" />
                    <ThumbsDown size={24} className="text-secondary-foreground" />
                    <Link size={24} className="text-secondary-foreground" />
                  </div>

                  {/* 16px gap */}
                  <div className="h-4" />

                  {/* Selection prompt bubble */}
                  <div className="flex">
                    <div className="rounded-full border border-border p-4">
                      <p className="text-sm font-normal text-foreground">Which skills pose the biggest risk to our strategy?</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Spec table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Element</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">User bubble</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="figma-c3" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Anchoring prompt</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="card" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="accent" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">AI response</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Interaction icons</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="secondary-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Selection prompt</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Filtering Chips" ? (
            <div className="space-y-6">
              {/* Light mode preview */}
              <div className="p-6 border border-border rounded-lg space-y-4 bg-white">
                <h3 className="text-sm font-medium text-foreground">Light mode</h3>
                <div className="gap-3 flex items-center justify-center" role="group" aria-label="Filtering chips light mode">
                  {["All", "In progress", "Completed", "Assigned"].map((label, i) => {
                    const isSelected = chipsLightSelected === i;
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectChipLight(i)}
                        className={
                          isSelected
                            ? "px-3 py-2 rounded-full text-sm font-medium border bg-[#D6CFF2] text-[#09090B] border-[#9F8EE1] transition-colors"
                            : "px-3 py-2 rounded-full text-sm font-medium border bg-[#FAFAFA] text-[#09090B] border-[#D4D4D8] hover:bg-[#F4F4F5] transition-colors"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dark mode preview */}
              <div className="p-6 border border-border rounded-lg space-y-4 bg-[#09090B]">
                <h3 className="text-sm font-medium text-[#FAFAFA]">Dark mode</h3>
                <div className="gap-3 flex items-center justify-center" role="group" aria-label="Filtering chips dark mode">
                  {["All", "In progress", "Completed", "Assigned"].map((label, i) => {
                    const isSelected = chipsDarkSelected === i;
                    return (
                      <button
                        key={label}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => selectChipDark(i)}
                        className={
                          isSelected
                            ? "px-3 py-2 rounded-full text-sm font-medium border bg-[#56498B] text-[#FAFAFA] border-[#8A75DB] transition-colors"
                            : "px-3 py-2 rounded-full text-sm font-medium border bg-[#09090B] text-[#FAFAFA] border-[#71717A] hover:bg-[#27272A] transition-colors"
                        }
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Mode</TableHead>
                    <TableHead className="w-[140px]">State</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    <TableHead className="w-[160px]">Background</TableHead>
                    <TableHead className="w-[160px]">Text color</TableHead>
                    <TableHead className="w-[160px]">Border</TableHead>
                    <TableHead className="w-[120px]">Corner radius</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground" rowSpan={2}>Light</TableCell>
                    <TableCell className="font-medium text-foreground">Selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 200 (#D6CFF2)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 950 (#09090B)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 400 (#9F8EE1)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 50 (#FAFAFA)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 950 (#09090B)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 300 (#D4D4D8)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground" rowSpan={2}>Dark</TableCell>
                    <TableCell className="font-medium text-foreground">Selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 700 (#56498B)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 50 (#FAFAFA)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="peri 500 (#8A75DB)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 950 (#09090B)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 50 (#FAFAFA)" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="zinc 500 (#71717A)" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">Full</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Nav — Header" ? (
            <HeaderShowcase />
          ) : selected === "Nav — Primary" ? (
            <NavShowcase />
          ) : selected === "Nav — Secondary" ? (
            <div className="space-y-6" style={{ "--ring": "212 100% 40%" } as React.CSSProperties}>
              <p className="text-sm text-muted-foreground">
                A vertical secondary rail used within a feature area (for example, the Ask AI chat experience). It provides a back link to the parent context, primary actions for the feature, and a grouped history list of recent items.
              </p>

              <PreviewThemePanel
                ariaLabel="Secondary nav live example"
                caption="Toggle the button above to preview the rail in dark mode."
              >
                <aside aria-label="Secondary navigation" className="w-[280px] max-w-full rounded-md p-2 dark:bg-zinc-900 dark:border dark:border-zinc-700">
                  {/* Back link */}
                  <button
                    type="button"
                    className="flex items-center gap-2 px-2 py-2 text-sm font-semibold text-foreground rounded-md hover:bg-foreground/5 transition-colors dark:text-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <ArrowLeft size={16} aria-hidden="true" />
                    Back
                  </button>

                  {/* Primary actions */}
                  <nav aria-label="Secondary actions" className="mt-4 space-y-1">
                    <button
                      type="button"
                      aria-current="page"
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-[100px] text-sm font-normal border bg-muted text-foreground border-muted-foreground dark:bg-zinc-800 dark:text-zinc-50 dark:border-zinc-400 transition-all duration-200"
                    >
                      <MessageSquare size={18} aria-hidden="true" className="text-muted-foreground dark:text-zinc-300" />
                      New chat
                    </button>
                    <button
                      type="button"
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-[100px] text-sm font-normal border border-transparent text-muted-foreground hover:bg-foreground/5 hover:border-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover:border-zinc-400 transition-all duration-200"
                    >
                      <Library size={18} aria-hidden="true" className="text-muted-foreground dark:text-zinc-300" />
                      Explore prompt library
                    </button>
                  </nav>

                  {/* Divider */}
                  <div className="my-4 border-t border-border dark:border-zinc-700" role="separator" />

                  {/* Grouped history */}
                  <div>
                    <h4 className="px-4 text-sm text-muted-foreground font-normal mb-2 dark:text-zinc-400">Chat history</h4>
                    <nav aria-label="Chat history" className="space-y-1">
                      {[
                        "Why is hiring risk flagged?",
                        "Employees needing support",
                        "Goals slipping this quarter",
                        "Skill readiness trends",
                      ].map((item) => (
                        <button
                          key={item}
                          type="button"
                          className="w-full text-left px-4 py-2 rounded-[100px] text-sm font-normal border border-transparent text-muted-foreground hover:bg-foreground/5 hover:border-muted-foreground dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 dark:hover:border-zinc-400 transition-all duration-200 truncate"
                        >
                          {item}
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>
              </PreviewThemePanel>

              {/* Anatomy */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Anatomy</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Element</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Back link</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Returns the user to the parent context. Pairs an `ArrowLeft` icon with a short label.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Primary actions</TableCell>
                      <TableCell className="text-muted-foreground text-sm">One or more feature-specific entry points (e.g. New chat, Explore prompt library). Each pairs a leading icon with a label.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Divider</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Horizontal rule that separates primary actions from grouped history.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Group label</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Sentence-case section heading (e.g. "Chat history") in muted-foreground.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">History items</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Truncated, single-line buttons representing recent items the user can resume.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Specs */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Specifications</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Element</TableHead>
                      <TableHead className="w-[120px]">Text size</TableHead>
                      <TableHead className="w-[140px]">Text weight</TableHead>
                      <TableHead className="w-[160px]">Text color</TableHead>
                      <TableHead className="w-[160px]">Icon color</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Back link</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">font-semibold</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Primary action</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Group label</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                      <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">History item</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                      <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Hover (any item)</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                      <TableCell className="text-muted-foreground text-xs">bg `foreground/5`</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Divider</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                      <TableCell className="text-muted-foreground text-xs">—</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Spacing */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Layout & spacing</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Rail width</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">280px (recommended)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Item padding</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">px-2 py-2</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Item gap</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">space-y-1 (4px)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Icon ↔ label gap</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">gap-3 (12px)</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Icon size</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">16–18px</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Item radius</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">rounded-md</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Section spacing</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">my-4 around divider</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Variants */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Variants</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">Variant</TableHead>
                      <TableHead className="w-[160px]">Width</TableHead>
                      <TableHead>Use when</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Default</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">280px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Standard rail for feature areas (e.g. Ask AI chat). Shows back link, actions, and a single grouped list.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Compact</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">240px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Use inside narrower split layouts where the primary nav is also visible.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Grouped</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">280px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Multiple history groups separated by dividers + group labels (e.g. "Today", "Last 7 days").</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Without history</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">280px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Back link + primary actions only — use for features that don't accumulate recent items.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* States */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">States</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  All interactive items (back link, primary actions, history items) share the same five states. State change is conveyed by background tone, not hue, so the rail stays neutral with the surrounding surface.
                </p>
                <div className="p-6 border border-border rounded-lg bg-card">
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(["default", "hover", "active", "focus", "disabled"] as NavItemState[]).map((s) => (
                      <div key={s} className="flex flex-col items-start gap-2">
                        <span className="text-xs font-semibold tracking-wide text-muted-foreground">{s}</span>
                        <div className="w-full">
                          <SecondaryNavItemSample label="New chat" icon={MessageSquare} state={s} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Responsiveness */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Responsiveness</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[140px]">Breakpoint</TableHead>
                      <TableHead className="w-[160px]">Width</TableHead>
                      <TableHead>Behavior</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Desktop</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">≥ 1280px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Rail is pinned at 280px next to the canvas. History list scrolls independently.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Tablet</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">768–1279px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Rail narrows to 240px. The primary sidebar collapses to 64px to preserve canvas width.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-foreground">Mobile</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">≤ 767px</TableCell>
                      <TableCell className="text-muted-foreground text-sm">Rail becomes a full-width overlay sheet triggered by a History button in the header. Back link doubles as the dismiss control.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Accessibility */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Accessibility</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>Wrap the rail in an <code className="font-mono text-xs">aside</code> with <code className="font-mono text-xs">aria-label="Secondary navigation"</code>.</li>
                  <li>Group each set of links in a <code className="font-mono text-xs">nav</code> with its own <code className="font-mono text-xs">aria-label</code> (e.g. "Secondary actions", "Chat history").</li>
                  <li>The group label ("Chat history") is rendered as a real heading so screen readers expose the structure.</li>
                  <li>All decorative icons use <code className="font-mono text-xs">aria-hidden="true"</code>; the adjacent text label is the accessible name.</li>
                  <li>Hover state uses a <code className="font-mono text-xs">foreground/5</code> fill in light mode and Tailwind <code className="font-mono text-xs">zinc-800</code> on a <code className="font-mono text-xs">zinc-900</code> rail in dark mode, so state is conveyed by a tonal shift rather than color hue.</li>
                  <li>Dark-mode token pairings — labels <code className="font-mono text-xs">zinc-100</code> on <code className="font-mono text-xs">zinc-900</code> (≈ 16.7:1), muted/icon <code className="font-mono text-xs">zinc-300</code> (≈ 10.4:1), group label <code className="font-mono text-xs">zinc-400</code> (≈ 6.4:1), and divider <code className="font-mono text-xs">zinc-700</code> — all meet WCAG AA for text and 1.4.11 Non-text Contrast.</li>
                  <li>Items are focusable buttons that follow the global focus-visible ring (2px <code className="font-mono text-xs">ring</code>), meeting WCAG 2.4.7 Focus Visible.</li>
                  <li>History item labels truncate visually but the full text remains the accessible name via the button's text content.</li>
                </ul>
              </div>

              {/* Props */}
              <div>
                <h3 className="text-base font-semibold text-foreground mb-3">Props</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[160px]">Prop</TableHead>
                      <TableHead className="w-[220px]">Type</TableHead>
                      <TableHead className="w-[120px]">Default</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-medium text-foreground">backHref</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">string</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">"/"</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Destination for the back link at the top of the rail.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-medium text-foreground">actions</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{`{ icon; label; onClick }[]`}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">[]</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Primary actions rendered above the history list (e.g. New chat, Prompt library).</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-medium text-foreground">history</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{`{ id; label; group? }[]`}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">[]</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Recent items. Optional <code className="font-mono text-xs">group</code> renders dated section headers (e.g. "Today").</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-medium text-foreground">variant</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">"default" | "compact" | "grouped" | "withoutHistory"</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">"default"</TableCell>
                      <TableCell className="text-sm text-muted-foreground">Switches between the four supported layouts.</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-mono text-xs font-medium text-foreground">activeId</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">string</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">undefined</TableCell>
                      <TableCell className="text-sm text-muted-foreground">ID of the currently selected history item; sets <code className="font-mono text-xs">aria-current="page"</code>.</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <pre className="p-4 rounded-lg bg-muted text-foreground text-xs font-mono overflow-x-auto mt-3">
{`import { SecondaryNav } from "@/components/SecondaryNav";

<SecondaryNav
  backHref="/home"
  actions={actions}
  history={history}
  activeId={currentChatId}
/>`}
                </pre>
              </div>
            </div>

          ) : selected === "Navigation Bar" ? (
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg flex justify-center gap-8 bg-primary-foreground">
                {navigationBarPattern.rows[0].render()}
                <div className="w-full max-w-xs">
                  <nav className="bg-[hsl(var(--sidebar-background))] rounded-[32px] border border-[hsl(var(--sidebar-border))] p-2 pt-6">
                    {/* Tab Switcher — matches /home sidebar */}
                    <div className="bg-card border border-border p-1 rounded-full flex h-[44px]">
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-200 bg-ds-100 border border-ds-500 text-foreground">
                        <User size={20} /> Me
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 rounded-full text-base font-semibold transition-all duration-200 text-muted-foreground border border-transparent">
                        <Users size={20} /> Team
                      </button>
                    </div>
                    {/* Divider — 8px gap from toggle, 16px padding around */}
                    <div className="mt-2 py-4 pt-[8px]">
                      <div className="border-t border-border" />
                    </div>
                    {/* Nav items */}
                    <div className="space-y-1 py-0">
                      {[
                        { label: "Home", icon: Home },
                        { label: "Profile", icon: User },
                        { label: "Upskilling", icon: BookOpen },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            className={`w-full flex items-center gap-[22px] p-4 rounded-[100px] text-base font-normal border transition-all duration-200 ${
                              i === 0
                                ? "bg-sidebar-accent border-[hsl(var(--sidebar-selected-border))] text-sidebar-accent-foreground"
                                : "border-transparent text-muted-foreground hover:bg-foreground/5"
                            }`}
                          >
                            <Icon size={24} className={i === 0 ? "text-[hsl(var(--icon-selected))]" : "text-[hsl(var(--icon))]"} />
                            {item.label}
                          </button>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">State</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    <TableHead className="w-[160px]">Background</TableHead>
                    <TableHead className="w-[160px]">Text color</TableHead>
                    <TableHead className="w-[160px]">Border</TableHead>
                    <TableHead className="w-[120px]">Icon color</TableHead>
                    <TableHead className="w-[100px]">Icon size</TableHead>
                    <TableHead className="w-[100px]">Gap</TableHead>
                    <TableHead className="w-[100px]">Padding</TableHead>
                    <TableHead className="w-[120px]">Corner radius</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Sidebar container</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">8px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">32px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-accent" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-accent-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-selected-border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon-selected" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">22px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">transparent</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">22px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">foreground/5</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">22px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Navigation Bar — Collapsed" ? (
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg flex justify-center bg-primary-foreground">
                <div className="w-[68px]">
                  <nav className="bg-[hsl(var(--sidebar-background))] rounded-[32px] border border-[hsl(var(--sidebar-border))] p-2 pt-6 flex flex-col items-center">
                    {/* Mode icon (collapsed Me/Team toggle) — 24x24, no border outline */}
                    <div className="h-[44px] flex items-center justify-center">
                      <User size={24} className="text-foreground" aria-label="Me mode" />
                    </div>
                    {/* Divider */}
                    <div className="mt-2 py-4 pt-[8px] w-full">
                      <div className="border-t border-border" />
                    </div>
                    {/* Icon-only nav items */}
                    <div className="space-y-1 w-full">
                      {[
                        { label: "Home", icon: Home, active: true },
                        { label: "Profile", icon: User, active: false },
                        { label: "Upskilling", icon: BookOpen, active: false },
                      ].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.label}
                            aria-label={item.label}
                            className={`w-full flex items-center justify-center p-3 rounded-[100px] transition-all duration-200 ${
                              item.active ? "bg-sidebar-accent" : "hover:bg-foreground/5"
                            }`}
                          >
                            <Icon size={24} className={item.active ? "text-[hsl(var(--icon-selected))]" : "text-[hsl(var(--icon))]"} />
                          </button>
                        );
                      })}
                    </div>
                  </nav>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Element</TableHead>
                    <TableHead className="w-[140px]">Icon size</TableHead>
                    <TableHead className="w-[160px]">Icon color</TableHead>
                    <TableHead className="w-[160px]">Background</TableHead>
                    <TableHead className="w-[140px]">Border</TableHead>
                    <TableHead className="w-[120px]">Width</TableHead>
                    <TableHead className="w-[140px]">Corner radius</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Sidebar container</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-border" /></TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">68px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">32px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Mode icon (Me / Team)</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">transparent</TableCell>
                    <TableCell className="text-muted-foreground text-xs">none</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Selected nav item</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon-selected" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="sidebar-accent" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">none</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Not selected nav item</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">transparent</TableCell>
                    <TableCell className="text-muted-foreground text-xs">none</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover nav item</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">foreground/5</TableCell>
                    <TableCell className="text-muted-foreground text-xs">none</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">100px</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Flyouts" ? (
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg bg-card flex justify-center">
                <Button onClick={() => setFlyoutOpen(true)}>Open flyout</Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Property</TableHead>
                    <TableHead className="w-[200px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Width</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">600px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Pinned to right edge</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs">None</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">0</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Header height</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">60px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Padding 24px L/R, 16px T/B</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Header text</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-lg / font-semibold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Back icon</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /> (gray/500)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Close (X) icon</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /> (gray/500), aligned right</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Icon" ? (
            <div className="space-y-6">
              {/* Preview — uses the canonical .ds-icon-card class from design-system.css */}
              <div className="p-6 border border-border rounded-lg bg-background flex justify-center">
                <div className="w-full max-w-[640px]">
                  <button type="button" className="ds-icon-card">
                    <AlertTriangle className="ds-icon-card-icon ds-icon-card-icon-danger" aria-hidden="true" />
                    <div className="ds-icon-card-body">
                      <h3 className="ds-icon-card-title">Skill decay risk</h3>
                      <p className="ds-icon-card-description">28 employees are long-tenured with no recent learning activity</p>
                    </div>
                    <ChevronRight className="ds-icon-card-chevron" aria-hidden="true" />
                  </button>
                </div>
              </div>
              {/* Spec table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Property</TableHead>
                    <TableHead className="w-[220px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Class</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">.ds-icon-card</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Reusable component in design-system.css</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px solid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Padding</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px 20px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Vertical / horizontal</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Inner gap</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Between icon, body, chevron</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Leading icon</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px · stroke 1.5</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="red/700" /> when danger, else <ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Title</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base / font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Description</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Trailing chevron</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px · stroke 1.5</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">box-shadow lift</TableCell>
                    <TableCell className="text-muted-foreground text-xs">var(--shadow-card-hover)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Reflections" ? (
            <div className="space-y-6">
              {/* Preview — uses the canonical .ds-list-card class from design-system.css */}
              <div className="p-6 border border-border rounded-lg flex justify-center bg-background">
                <article className="ds-list-card" style={{ width: 800 }}>
                  <div className="ds-list-card-header">
                    <p className="ds-list-card-title">John had a highly productive week advancing multiple strategic initiatives</p>
                    <div className="ds-list-card-actions">
                      <button type="button" aria-label="Card options" className="ds-list-card-icon-button">
                        <MoreHorizontal size={24} />
                      </button>
                      <button type="button" aria-label="Expand card" className="ds-list-card-icon-button">
                        <ChevronDown size={24} />
                      </button>
                    </div>
                  </div>
                  <div className="ds-list-card-footer">
                    <p className="ds-list-card-meta">Created 2 days ago</p>
                    <Badge variant="outline">Feedback available</Badge>
                  </div>
                </article>
              </div>
              {/* Spec table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Card title</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-xl</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="card" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Meta info</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Status badge</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-xs</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="transparent" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="ds/500" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Action icons</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="icon" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Card container</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="card" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Action Center" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Card with view action</p>
                <div className="p-6 border border-border rounded-lg bg-background flex justify-center">
                  <div className="w-full max-w-[420px]">
                    <div className="bg-background border border-border rounded-[24px] p-4 ds-card-hover transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="text-xs font-medium mb-1">
                            View your skills
                          </Badge>
                          <p className="font-semibold text-foreground truncate text-base">AI / ML Model Operations proficiency lifted 3 → 4</p>
                        </div>
                        <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label="View skill">
                          <ArrowRight size={20} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">System-inferred from role tasks · last 14d</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Card with critical action</p>
                <div className="p-6 border border-border rounded-lg bg-background flex justify-center">
                  <div className="w-full max-w-[420px]">
                    <div className="rounded-[24px] border border-border bg-background p-4 ds-card-hover transition-shadow">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-2">
                            <Badge variant="outline-destructive" className="text-xs font-medium">
                              Review agenda items
                            </Badge>
                          </div>
                          
                          <p className="font-semibold text-foreground truncate text-base">3 open agenda items for your next 1-1</p>
                        </div>
                        <button className="shrink-0 text-border inline-flex items-center justify-center" aria-label="Review agenda">
                          <ArrowRight size={20} aria-hidden="true" />
                        </button>
                      </div>
                      <p className="text-muted-foreground truncate text-sm">With Mateo Lee — review and add notes before tomorrow's session.</p>
                    </div>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Property</TableHead>
                    <TableHead className="w-[220px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px solid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Padding</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">All sides (p-4)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Tag badge</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-xs / font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Badge variant="outline" · e.g. "Sign-off"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Action icon</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">20×20px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /> · ArrowRight</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Title</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base / font-semibold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /> · truncate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Subtitle</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /> · truncate</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">ds-card-hover</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Shadow lift on hover</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Metrics" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Metric cards</p>
                <div className="p-6 border border-border rounded-lg bg-background">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "1", label: "Low-quality skill mappings" },
                      { value: "32", label: "Jobs without skills" },
                      { value: "5", label: "Roles missing market titles." },
                    ].map((m) => (
                      <div key={m.label} className="bg-background border border-border rounded-[24px] pt-4 pr-4 pb-2 pl-4 ds-card-hover transition-shadow scroll-mt-24 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-3xl font-bold text-foreground">{m.value}</p>
                          <button className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted shrink-0" aria-label="More info">
                            <Info size={20} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground leading-tight mt-3">{m.label}</p>
                        <div className="mt-auto flex justify-end">
                          <button className="-mt-1 shrink-0 text-border hover:text-foreground inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted" aria-label="View details">
                            <ArrowRight size={20} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Metric cards with change indicator</p>
                <div className="p-6 border border-border rounded-lg bg-background">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "1", label: "Low-quality skill mappings", change: "+0 this week" },
                      { value: "32", label: "Jobs without skills", change: "+6 this week" },
                      { value: "5", label: "Roles missing market titles.", change: "+2 this week" },
                    ].map((m) => (
                      <div key={m.label} className="bg-background border border-border rounded-[24px] pt-4 pr-4 pb-2 pl-4 ds-card-hover transition-shadow scroll-mt-24 flex flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-end gap-2">
                            <p className="text-3xl font-bold text-foreground">{m.value}</p>
                            <span className="text-sm text-green-600 font-medium">{m.change}</span>
                          </div>
                          <button className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted shrink-0" aria-label="More info">
                            <Info size={20} aria-hidden="true" />
                          </button>
                        </div>
                        <p className="text-sm text-muted-foreground leading-tight mt-3">{m.label}</p>
                        <div className="mt-auto flex justify-end">
                          <button className="-mt-1 shrink-0 text-border hover:text-foreground inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted" aria-label="View details">
                            <ArrowRight size={20} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Metric only (not clickable)</p>
                <div className="p-6 border border-border rounded-lg bg-background">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "1", label: "Low-quality skill mappings", change: "+0 this week" },
                      { value: "32", label: "Jobs without skills", change: "+6 this week" },
                      { value: "5", label: "Roles missing market titles.", change: "+2 this week" },
                    ].map((m) => (
                      <div key={m.label} className="bg-background border border-border rounded-[24px] p-4 scroll-mt-24 flex flex-col">
                        <div className="flex items-end gap-2">
                          <p className="text-3xl font-bold text-foreground">{m.value}</p>
                          <span className="text-sm text-green-600 font-medium">{m.change}</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-tight mt-3">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Property</TableHead>
                    <TableHead className="w-[220px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px solid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Padding</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">All sides (p-4) · Equal top and bottom</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Metric value</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-3xl / font-bold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /> · top-left</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Change indicator</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Bottom-aligned green text next to metric value · e.g. "+6 this week"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Label</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / leading-tight</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /> · below value</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Info icon button</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Not used in Metric only</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Action icon button</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Not used in Metric only</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">—</TableCell>
                    <TableCell className="text-muted-foreground text-xs">No hover effect in Metric only</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Property</TableHead>
                    <TableHead className="w-[220px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px solid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Padding</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">16px top/right/left · 8px bottom</TableCell>
                    <TableCell className="text-muted-foreground text-xs">pt-4 pr-4 pb-2 pl-4</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Metric value</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-3xl / font-bold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /> · top-left</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Info icon button</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">w-8 h-8 · rounded-md</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /> · Info 20×20px (lucide) · hover:bg-muted</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Label</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / leading-tight</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /> · below value</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Action icon button</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">w-8 h-8 · rounded-md</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /> · ArrowRight 20×20px · hover:bg-muted</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Change indicator</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / font-medium</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Bottom-aligned green text next to metric value · e.g. "+6 this week"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">ds-card-hover</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Shadow lift on hover · transition-shadow</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Cards — Home" ? (
            <div className="space-y-6">
              <div className="p-6 border border-border rounded-lg bg-background flex justify-center">
                <div className="w-full max-w-[360px]">
                  <div className="ds-home-card">
                    <div className="ds-home-card-header">
                      <UserRound size={24} strokeWidth={1.5} className="text-accent" aria-hidden="true" />
                      <h2 className="ds-home-card-title">Profile</h2>
                    </div>
                    <p className="ds-home-card-description">Explore your employee profile and skills</p>
                    <div className="ds-home-card-divider" role="separator" />
                    <div className="ds-home-card-stat">
                      <span className="ds-home-card-stat-value ds-home-card-stat-value-success">0%</span>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Property</TableHead>
                    <TableHead className="w-[200px]">Value</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Class</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">.ds-home-card</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Reusable component in design-system.css</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Background</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="background" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Border</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px solid</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Corner radius</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">—</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Padding</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">20px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">All sides</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Inner gap</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">12px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Between header, description, divider, stat</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Header gap</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">10px</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Between icon and title</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Icon</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">24×24px</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="accent" /> · stroke 1.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Title</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base / font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Description</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-sm / font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="muted-foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Divider</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="border" /></TableCell>
                    <TableCell className="text-muted-foreground text-xs">1px top border</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Stat value</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-2xl / font-semibold</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /> or <ColorSwatch token="success-foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Stat label</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">text-base / font-normal</TableCell>
                    <TableCell className="text-muted-foreground text-xs"><ColorSwatch token="foreground" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-foreground">Hover</TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">translateY(-4px)</TableCell>
                    <TableCell className="text-muted-foreground text-xs">Framer Motion lift on hover</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : selected === "Title text — Section" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Section title with counter</p>
                <div className="p-6 border border-border rounded-lg bg-background">
                  <div className="w-full flex items-center justify-center min-h-[120px]">
                    <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                      <StarIcon size={16} />
                      Section
                      <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-foreground bg-muted rounded">4</span>
                    </h2>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Section title with ghost button</p>
                <div className="p-6 border border-border rounded-lg bg-background">
                  <div className="w-full flex items-center justify-center min-h-[120px]">
                    <div className="w-full max-w-[800px] flex items-center justify-between">
                      <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <StarIcon size={16} />
                        Recent changes
                        <span className="text-sm font-normal text-muted-foreground ml-1">Last 14 days</span>
                      </h2>
                      <Button variant="ghost" size="sm" className="text-foreground">
                        View audit log
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeType.rows.map((r) => (
                    <TableRow key={r.variant}>
                      <TableCell className="font-medium text-foreground">{r.variant}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{r.textSize}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{r.textWeight}</TableCell>
                      <ColorCells row={r} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : selected === "Toggle" ? (
            (() => {
              const STATES = ["Default", "Disabled", "Selected", "Selected + Disabled"] as const;
              type StateName = typeof STATES[number];
              type TState = { bg: string; border: string; text: string };
              const light: Record<StateName, TState> = {
                "Default":              { bg: "zinc/100", border: "zinc/300", text: "zinc/950" },
                "Disabled":             { bg: "zinc/100", border: "zinc/300", text: "zinc/500" },
                "Selected":             { bg: "peri/200", border: "peri/400", text: "zinc/950" },
                "Selected + Disabled":  { bg: "peri/200", border: "peri/400", text: "zinc/500" },
              };
              const dark: Record<StateName, TState> = {
                "Default":              { bg: "zinc/800", border: "zinc/500", text: "zinc/50" },
                "Disabled":             { bg: "zinc/800", border: "zinc/500", text: "zinc/500" },
                "Selected":             { bg: "peri/700", border: "peri/500", text: "zinc/50" },
                "Selected + Disabled":  { bg: "peri/700", border: "peri/500", text: "zinc/500" },
              };
              const tokenToHex: Record<string, string> = {
                "zinc/50": "#FAFAFA", "zinc/100": "#F4F4F5", "zinc/300": "#D4D4D8",
                "zinc/500": "#71717A", "zinc/800": "#27272A", "zinc/950": "#09090B",
                "peri/200": "#D6CFF2", "peri/400": "#9F8EE1", "peri/500": "#7C6BC9", "peri/700": "#564A8C",
              };
              const renderToggle = (s: TState, disabled: boolean, selected: boolean) => (
                <span
                  role="switch"
                  aria-checked={selected}
                  aria-disabled={disabled || undefined}
                  className="inline-flex items-center rounded-full px-3 py-2 text-sm font-medium"
                  style={{
                    backgroundColor: tokenToHex[s.bg],
                    borderWidth: 1, borderStyle: "solid", borderColor: tokenToHex[s.border],
                    color: tokenToHex[s.text],
                    opacity: disabled ? 0.6 : 1,
                  }}
                >
                  Option
                </span>
              );
              const renderModePanel = (mode: "light" | "dark") => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                const map = mode === "light" ? light : dark;
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STATES.map((sName) => {
                        const s = map[sName];
                        const disabled = sName === "Disabled" || sName === "Selected + Disabled";
                        const isSelected = sName === "Selected" || sName === "Selected + Disabled";
                        return (
                          <div key={sName} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{sName}</p>
                            {renderToggle(s, disabled, isSelected)}
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>bg: <span className="font-mono" style={{ color: valueColor }}>{s.bg}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>border: <span className="font-mono" style={{ color: valueColor }}>{s.border}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>text: <span className="font-mono" style={{ color: valueColor }}>{s.text}</span></span>
                              {disabled && (
                                <span className="text-[10px]" style={{ color: labelColor }}>opacity: <span className="font-mono" style={{ color: valueColor }}>60%</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {renderModePanel("light")}
                    {renderModePanel("dark")}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Interactive pill group</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-6 border border-border rounded-lg bg-background"><TogglePreview /></div>
                      <div className="p-6 border border-border rounded-lg bg-zinc-950"><TogglePreview dark /></div>
                    </div>
                  </div>
                </div>
              );
            })()
          ) : selected === "Badge" ? (
            (() => {
              const STATES = ["Default", "Disabled", "Checked", "Checked + Disabled"] as const;
              type StateName = typeof STATES[number];
              type BState = { bg: string; text: string; border?: string; opacity?: string };
              const variants: { name: string; label: string; outline: boolean; light: Record<StateName, BState>; dark: Record<StateName, BState> }[] = [
                {
                  name: "Default",
                  label: "Badge",
                  outline: false,
                  light: {
                    Default: { bg: "#D6CFF2", text: "#09090B" },
                    Disabled: { bg: "#D6CFF2", text: "#09090B", opacity: "50%" },
                    Checked: { bg: "#D6CFF2", text: "#09090B" },
                    "Checked + Disabled": { bg: "#D6CFF2", text: "#09090B", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#56498B", text: "#FAFAFA" },
                    Disabled: { bg: "#56498B", text: "#FAFAFA", opacity: "50%" },
                    Checked: { bg: "#56498B", text: "#FAFAFA" },
                    "Checked + Disabled": { bg: "#56498B", text: "#FAFAFA", opacity: "50%" },
                  },
                },
                {
                  name: "Secondary",
                  label: "Badge",
                  outline: false,
                  light: {
                    Default: { bg: "#F4F4F5", text: "#09090B" },
                    Disabled: { bg: "#F4F4F5", text: "#09090B", opacity: "50%" },
                    Checked: { bg: "#F4F4F5", text: "#09090B" },
                    "Checked + Disabled": { bg: "#F4F4F5", text: "#09090B", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#27272A", text: "#FAFAFA" },
                    Disabled: { bg: "#27272A", text: "#FAFAFA", opacity: "50%" },
                    Checked: { bg: "#27272A", text: "#FAFAFA" },
                    "Checked + Disabled": { bg: "#27272A", text: "#FAFAFA", opacity: "50%" },
                  },
                },
                {
                  name: "Tertiary",
                  label: "Badge",
                  outline: false,
                  light: {
                    Default: { bg: "#F4F4F5", text: "#09090B" },
                    Disabled: { bg: "#F4F4F5", text: "#09090B", opacity: "50%" },
                    Checked: { bg: "#F4F4F5", text: "#09090B" },
                    "Checked + Disabled": { bg: "#F4F4F5", text: "#09090B", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#27272A", text: "#FAFAFA" },
                    Disabled: { bg: "#27272A", text: "#FAFAFA", opacity: "50%" },
                    Checked: { bg: "#27272A", text: "#FAFAFA" },
                    "Checked + Disabled": { bg: "#27272A", text: "#FAFAFA", opacity: "50%" },
                  },
                },
                {
                  name: "Destructive",
                  label: "Destructive",
                  outline: false,
                  light: {
                    Default: { bg: "#B91C1C", text: "#FFFFFF" },
                    Disabled: { bg: "#B91C1C", text: "#FFFFFF", opacity: "50%" },
                    Checked: { bg: "#B91C1C", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#B91C1C", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#F87171", text: "#450A0A" },
                    Disabled: { bg: "#F87171", text: "#450A0A", opacity: "50%" },
                    Checked: { bg: "#F87171", text: "#450A0A" },
                    "Checked + Disabled": { bg: "#F87171", text: "#450A0A", opacity: "50%" },
                  },
                },
                {
                  name: "Warning",
                  label: "Warning",
                  outline: false,
                  light: {
                    Default: { bg: "#A16207", text: "#FFFFFF" },
                    Disabled: { bg: "#A16207", text: "#FFFFFF", opacity: "50%" },
                    Checked: { bg: "#A16207", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#A16207", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#FACC15", text: "#422006" },
                    Disabled: { bg: "#FACC15", text: "#422006", opacity: "50%" },
                    Checked: { bg: "#FACC15", text: "#422006" },
                    "Checked + Disabled": { bg: "#FACC15", text: "#422006", opacity: "50%" },
                  },
                },
                {
                  name: "Success",
                  label: "Success",
                  outline: false,
                  light: {
                    Default: { bg: "#15803D", text: "#FFFFFF" },
                    Disabled: { bg: "#15803D", text: "#FFFFFF", opacity: "50%" },
                    Checked: { bg: "#15803D", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#15803D", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "#4ADE80", text: "#052E16" },
                    Disabled: { bg: "#4ADE80", text: "#052E16", opacity: "50%" },
                    Checked: { bg: "#4ADE80", text: "#052E16" },
                    "Checked + Disabled": { bg: "#4ADE80", text: "#052E16", opacity: "50%" },
                  },
                },
                {
                  name: "Outline",
                  label: "Badge",
                  outline: true,
                  light: {
                    Default: { bg: "transparent", text: "#7160B4", border: "#7160B4" },
                    Disabled: { bg: "transparent", text: "#7160B4", border: "#7160B4", opacity: "50%" },
                    Checked: { bg: "#7160B4", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#7160B4", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "transparent", text: "#9F8EE1", border: "#9F8EE1" },
                    Disabled: { bg: "transparent", text: "#9F8EE1", border: "#9F8EE1", opacity: "50%" },
                    Checked: { bg: "#9F8EE1", text: "#09090B" },
                    "Checked + Disabled": { bg: "#9F8EE1", text: "#09090B", opacity: "50%" },
                  },
                },
                {
                  name: "Outline destructive",
                  label: "Destructive",
                  outline: true,
                  light: {
                    Default: { bg: "transparent", text: "#B91C1C", border: "#B91C1C" },
                    Disabled: { bg: "transparent", text: "#B91C1C", border: "#B91C1C", opacity: "50%" },
                    Checked: { bg: "#B91C1C", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#B91C1C", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "transparent", text: "#F87171", border: "#F87171" },
                    Disabled: { bg: "transparent", text: "#F87171", border: "#F87171", opacity: "50%" },
                    Checked: { bg: "#F87171", text: "#450A0A" },
                    "Checked + Disabled": { bg: "#F87171", text: "#450A0A", opacity: "50%" },
                  },
                },
                {
                  name: "Outline warning",
                  label: "Warning",
                  outline: true,
                  light: {
                    Default: { bg: "transparent", text: "#A16207", border: "#A16207" },
                    Disabled: { bg: "transparent", text: "#A16207", border: "#A16207", opacity: "50%" },
                    Checked: { bg: "#A16207", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#A16207", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "transparent", text: "#FACC15", border: "#FACC15" },
                    Disabled: { bg: "transparent", text: "#FACC15", border: "#FACC15", opacity: "50%" },
                    Checked: { bg: "#FACC15", text: "#422006" },
                    "Checked + Disabled": { bg: "#FACC15", text: "#422006", opacity: "50%" },
                  },
                },
                {
                  name: "Outline success",
                  label: "Success",
                  outline: true,
                  light: {
                    Default: { bg: "transparent", text: "#15803D", border: "#15803D" },
                    Disabled: { bg: "transparent", text: "#15803D", border: "#15803D", opacity: "50%" },
                    Checked: { bg: "#15803D", text: "#FFFFFF" },
                    "Checked + Disabled": { bg: "#15803D", text: "#FFFFFF", opacity: "50%" },
                  },
                  dark: {
                    Default: { bg: "transparent", text: "#4ADE80", border: "#4ADE80" },
                    Disabled: { bg: "transparent", text: "#4ADE80", border: "#4ADE80", opacity: "50%" },
                    Checked: { bg: "#4ADE80", text: "#052E16" },
                    "Checked + Disabled": { bg: "#4ADE80", text: "#052E16", opacity: "50%" },
                  },
                },
              ];

              const renderBadge = (state: BState, label: string, outline: boolean) => {
                const disabled = state.opacity === "50%";
                const style: React.CSSProperties = {
                  backgroundColor: state.bg === "transparent" ? "transparent" : state.bg,
                  color: state.text,
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: state.border ? state.border : outline ? "transparent" : state.bg === "transparent" ? "transparent" : state.bg,
                  opacity: disabled ? 0.5 : 1,
                };
                return (
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-normal"
                    style={style}
                  >
                    {label}
                  </span>
                );
              };

              const renderModePanel = (mode: "light" | "dark", variant: typeof variants[number]) => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                const map = mode === "light" ? variant.light : variant.dark;
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STATES.map((sName) => {
                        const s = map[sName];
                        return (
                          <div key={sName} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{sName}</p>
                            {renderBadge(s, variant.label, variant.outline)}
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>bg: <span className="font-mono" style={{ color: valueColor }}>{s.bg === "transparent" ? "transparent" : hexToPaletteToken(s.bg)}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>text: <span className="font-mono" style={{ color: valueColor }}>{hexToPaletteToken(s.text)}</span></span>
                              {s.border && (
                                <span className="text-[10px]" style={{ color: labelColor }}>border: <span className="font-mono" style={{ color: valueColor }}>{hexToPaletteToken(s.border)}</span></span>
                              )}
                              {s.opacity && (
                                <span className="text-[10px]" style={{ color: labelColor }}>opacity: <span className="font-mono" style={{ color: valueColor }}>{s.opacity}</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-6">
                  {variants.map((v) => (
                    <div key={v.name} className="space-y-3">
                      <p className="text-sm font-medium text-muted-foreground">{v.name}</p>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {renderModePanel("light", v)}
                        {renderModePanel("dark", v)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()
          ) : selected === "Input" ? (
            (() => {
              const STATES = ["Default", "Disabled", "Focus", "File"] as const;
              type StateName = typeof STATES[number];
              type IState = {
                bg: string;
                border: string;
                text: string;
                placeholder: string;
                ring?: string;
                fileButton?: string;
                fileButtonText?: string;
              };
              const light: Record<StateName, IState> = {
                Default: { bg: "zinc/50", border: "zinc/400", text: "zinc/950", placeholder: "zinc/500" },
                Disabled: { bg: "zinc/50", border: "zinc/300", text: "zinc/500", placeholder: "zinc/500" },
                Focus: { bg: "zinc/50", border: "zinc/400", text: "zinc/950", placeholder: "zinc/500", ring: "blue/700" },
                File: { bg: "zinc/50", border: "zinc/400", text: "zinc/950", placeholder: "zinc/500", fileButton: "zinc/100", fileButtonText: "zinc/950" },
              };
              const dark: Record<StateName, IState> = {
                Default: { bg: "zinc/950", border: "zinc/700", text: "zinc/50", placeholder: "zinc/400" },
                Disabled: { bg: "zinc/900", border: "zinc/700", text: "zinc/500", placeholder: "zinc/400" },
                Focus: { bg: "zinc/950", border: "zinc/700", text: "zinc/50", placeholder: "zinc/400", ring: "blue/400" },
                File: { bg: "zinc/950", border: "zinc/700", text: "zinc/50", placeholder: "zinc/400", fileButton: "zinc/800", fileButtonText: "zinc/50" },
              };
              const tokenToHex: Record<string, string> = {
                "base/white": "#FFFFFF", "zinc/50": "#FAFAFA", "zinc/100": "#F4F4F5", "zinc/300": "#D4D4D8",
                "zinc/400": "#A1A1AA", "zinc/500": "#71717A", "zinc/600": "#52525B", "zinc/700": "#3F3F46",
                "zinc/800": "#27272A", "zinc/900": "#18181B", "zinc/950": "#09090B",
                "peri/400": "#A493DB", "peri/600": "#7160B4",
                "blue/400": "#60A5FA", "blue/700": "#1D4ED8",
              };
              const renderInput = (s: IState, disabled: boolean, stateName: StateName, mode: "light" | "dark") => {
                const ringColor = mode === "light" ? tokenToHex["blue/700"] : tokenToHex["blue/400"];
                const commonInputProps: React.InputHTMLAttributes<HTMLInputElement> = {
                  disabled,
                  className: "w-full",
                  style: {
                    backgroundColor: tokenToHex[s.bg],
                    borderColor: tokenToHex[s.border],
                    color: tokenToHex[s.text],
                    width: "100%",
                    height: 40,
                    padding: "8px 12px",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderStyle: "solid",
                    fontSize: 14,
                    lineHeight: "20px",
                    opacity: disabled ? 0.5 : 1,
                    outline: "none",
                    boxShadow: stateName === "Focus" ? `0 0 0 2px ${ringColor}` : undefined,
                  },
                };
                if (stateName === "File") {
                  return (
                    <div
                      className="w-full flex items-center justify-between"
                      style={{
                        backgroundColor: tokenToHex[s.bg],
                        borderColor: tokenToHex[s.border],
                        borderRadius: 8,
                        borderWidth: 1,
                        borderStyle: "solid",
                        height: 40,
                        padding: "8px 12px",
                        fontSize: 14,
                        lineHeight: "20px",
                      }}
                    >
                      <span style={{ color: tokenToHex[s.placeholder] }}>No file chosen</span>
                      <span
                        className="text-xs font-medium"
                        style={{
                          backgroundColor: tokenToHex[s.fileButton],
                          color: tokenToHex[s.fileButtonText],
                          padding: "4px 8px",
                          borderRadius: 4,
                        }}
                      >
                        Choose file
                      </span>
                    </div>
                  );
                }
                return (
                  <input
                    type="text"
                    placeholder={stateName === "Disabled" ? "Disabled" : "Enter text..."}
                    aria-label={stateName === "Disabled" ? "Disabled input" : "Text input"}
                    {...commonInputProps}
                  />
                );
              };
              const renderModePanel = (mode: "light" | "dark") => {
                const containerBg = mode === "light" ? "#FFFFFF" : "#09090B";
                const containerBorder = mode === "light" ? "#E4E4E7" : "#27272A";
                const labelColor = mode === "light" ? "#71717A" : "#A1A1AA";
                const valueColor = mode === "light" ? "#09090B" : "#FAFAFA";
                const map = mode === "light" ? light : dark;
                return (
                  <div className="p-4 rounded-lg border" style={{ backgroundColor: containerBg, borderColor: containerBorder }}>
                    <p className="text-xs font-medium mb-3" style={{ color: labelColor }}>{mode === "light" ? "Light mode" : "Dark mode"}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {STATES.map((sName) => {
                        const s = map[sName];
                        const disabled = sName === "Disabled";
                        return (
                          <div key={sName} className="flex flex-col items-start gap-2">
                            <p className="text-xs" style={{ color: labelColor }}>{sName}</p>
                            {renderInput(s, disabled, sName, mode)}
                            <div className="flex flex-col gap-0.5 mt-1">
                              <span className="text-[10px]" style={{ color: labelColor }}>bg: <span className="font-mono" style={{ color: valueColor }}>{s.bg}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>border: <span className="font-mono" style={{ color: valueColor }}>{s.border}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>text: <span className="font-mono" style={{ color: valueColor }}>{s.text}</span></span>
                              <span className="text-[10px]" style={{ color: labelColor }}>placeholder: <span className="font-mono" style={{ color: valueColor }}>{s.placeholder}</span></span>
                              {s.ring && (
                                <span className="text-[10px]" style={{ color: labelColor }}>ring: <span className="font-mono" style={{ color: valueColor }}>{s.ring}</span></span>
                              )}
                              {s.fileButton && (
                                <span className="text-[10px]" style={{ color: labelColor }}>file button: <span className="font-mono" style={{ color: valueColor }}>{s.fileButton}</span></span>
                              )}
                              {s.fileButtonText && (
                                <span className="text-[10px]" style={{ color: labelColor }}>file button text: <span className="font-mono" style={{ color: valueColor }}>{s.fileButtonText}</span></span>
                              )}
                              {disabled && (
                                <span className="text-[10px]" style={{ color: labelColor }}>opacity: <span className="font-mono" style={{ color: valueColor }}>50%</span></span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              };
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {renderModePanel("light")}
                    {renderModePanel("dark")}
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[160px]">Variant</TableHead>
                        <TableHead className="w-[120px]">Text size</TableHead>
                        <TableHead className="w-[140px]">Text weight</TableHead>
                        {colorHeaders}
                        {activeType.rows.some(r => r.opacity) && <TableHead className="w-[100px]">Opacity</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeType.rows.map((r) => (
                        <TableRow key={r.variant}>
                          <TableCell className="font-medium text-foreground">{r.variant}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{r.textSize}</TableCell>
                          <TableCell className="text-muted-foreground font-mono text-xs">{r.textWeight}</TableCell>
                          <ColorCells row={r} />
                          {activeType.rows.some(row => row.opacity) && <TableCell className="text-muted-foreground font-mono text-xs align-top">{r.opacity || "—"}</TableCell>}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="mt-6 p-4 border border-border rounded-lg bg-card space-y-2">
                    <p className="text-sm text-muted-foreground">Input fields used within forms should use an 8px corner radius.</p>
                    <p className="text-sm text-muted-foreground">Input fields displayed at the page level, such as search or filter controls, should use a 100% border radius to create a fully rounded (pill-shaped) appearance.</p>
                    <p className="text-sm text-muted-foreground">For additional guidance and usage examples, see the Search page.</p>
                  </div>
                </div>
              );
            })()
          ) : patternItems.includes(selected) && !previewAboveTable.has(selected) ? (
            <p className="text-muted-foreground">—</p>
          ) : previewAboveTable.has(selected) ? (
            <div className="space-y-6">
              {activeType.rows.filter(row => row.render).map((row) => (
                <div key={row.variant} className="space-y-2">
                  {selected === "Filter" && (
                    <p className="text-sm font-medium text-muted-foreground">{row.variant}</p>
                  )}
                  <div className={`p-6 border border-border rounded-lg ${selected === "Title text — Page" || selected === "Title text — Section" || selected === "Smart Bar" ? "bg-background" : "bg-card"}`}>
                    {row.render!()}
                  </div>
                </div>
              ))}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeType.rows.map((r) => (
                    <TableRow key={r.variant}>
                      <TableCell className="font-medium text-foreground">{r.variant}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{r.textSize}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-xs">{r.textWeight}</TableCell>
                      <ColorCells row={r} />
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {selected === "Search" && (
                <div className="p-4 border border-border rounded-lg bg-card">
                  <p className="text-sm text-muted-foreground">Page-level search bars use a 100% border radius, creating a fully rounded (pill-shaped) appearance.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* How to use section for Badge */}
              {selected === "Badge" && (
                <div className="mb-6 p-4 border border-border rounded-lg bg-card">
                  <h3 className="text-sm font-semibold text-foreground mb-2">How to use</h3>
                  <p className="text-sm text-muted-foreground">
                    Use the <span className="font-semibold">Outline</span> badge variant in upskilling cards to label topics, skills, or categories.
                  </p>
                </div>
              )}
              <Table>
                <TableHeader>
                   <TableRow>
                    <TableHead className={selected === "Input" ? "min-w-[360px]" : undefined}>Preview</TableHead>
                    <TableHead className="w-[160px]">Variant</TableHead>
                    {activeType.rows.some(r => r.type) && <TableHead className="w-[120px]">Type</TableHead>}
                    <TableHead className="w-[120px]">Text size</TableHead>
                    <TableHead className="w-[140px]">Text weight</TableHead>
                    {colorHeaders}
                    {activeType.rows.some(r => r.opacity) && <TableHead className="w-[100px]">Opacity</TableHead>}
                    {activeType.rows.some(r => r.states) && <TableHead className="w-[40px]" />}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {activeType.rows.map((row) => (
                    <>
                      <TableRow key={row.variant} className={row.states ? "cursor-pointer" : ""} onClick={() => row.states && toggleVariantExpand(row.variant)}>
                        <TableCell className="align-middle">{row.render?.()}</TableCell>
                        <TableCell className="font-medium text-foreground align-top">{row.variant}</TableCell>
                        {activeType.rows.some(r => r.type) && <TableCell className="text-muted-foreground align-top font-mono text-xs">{row.type || "—"}</TableCell>}
                        <TableCell className="text-muted-foreground align-top font-mono text-xs">{row.textSize}</TableCell>
                        <TableCell className="text-muted-foreground align-top font-mono text-xs">{row.textWeight}</TableCell>
                        <ColorCells row={row} />
                        {activeType.rows.some(r => r.opacity) && <TableCell className="text-muted-foreground font-mono text-xs align-top">{row.opacity || "—"}</TableCell>}
                        {row.states && (
                          <TableCell className="align-middle">
                            <ChevronRight
                              size={16}
                              className={`text-muted-foreground transition-transform duration-200 ${expandedVariants.has(row.variant) ? "rotate-90" : ""}`}
                            />
                          </TableCell>
                        )}
                      </TableRow>
                      {row.states && expandedVariants.has(row.variant) && row.states.map((s) => (
                        <TableRow key={`${row.variant}-${s.state}`} className="bg-muted/30">
                          <TableCell className="align-middle pl-8">{s.render()}</TableCell>
                          <TableCell className="font-medium text-muted-foreground align-top text-xs">{s.state}</TableCell>
                          {activeType.rows.some(r => r.type) && <TableCell />}
                          <TableCell className="text-muted-foreground align-top font-mono text-xs">{s.textSize}</TableCell>
                          <TableCell className="text-muted-foreground align-top font-mono text-xs">{s.textWeight}</TableCell>
                          <ColorCells row={s} />
                          {activeType.rows.some(r => r.opacity) && <TableCell className="text-muted-foreground font-mono text-xs align-top">{s.opacity || "—"}</TableCell>}
                          <TableCell />
                        </TableRow>
                      ))}
                    </>
                  ))}

                </TableBody>
              </Table>
              {selected === "Input" && (
                <div className="mt-6 p-4 border border-border rounded-lg bg-card space-y-2">
                  <p className="text-sm text-muted-foreground">Input fields used within forms should use an 8px corner radius.</p>
                  <p className="text-sm text-muted-foreground">Input fields displayed at the page level, such as search or filter controls, should use a 100% border radius to create a fully rounded (pill-shaped) appearance.</p>
                  <p className="text-sm text-muted-foreground">For additional guidance and usage examples, see the Search page.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
    {flyoutOpen && (
      <div className="fixed inset-0 z-50" role="dialog" aria-label="Flyout">
        <div className="absolute inset-0 bg-foreground/20" onClick={() => setFlyoutOpen(false)} />
        <div
          className="absolute top-0 right-0 h-full bg-background flex flex-col shadow-[var(--card-shadow)]"
          style={{ width: "600px" }}
        >
          <div
            className="flex items-center justify-between"
            style={{ height: "60px", paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "16px" }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFlyoutOpen(false)}
                aria-label="Back"
                className="text-[hsl(var(--icon))] hover:text-foreground"
              >
                <ArrowLeft size={24} />
              </button>
              <h3 className="text-lg font-semibold text-foreground">Header</h3>
            </div>
            <button
              type="button"
              onClick={() => setFlyoutOpen(false)}
              aria-label="Close"
              className="text-[hsl(var(--icon))] hover:text-foreground"
            >
              <X size={24} />
            </button>
          </div>
          <div style={{ paddingLeft: "24px", paddingRight: "24px", paddingTop: "16px", paddingBottom: "16px" }} className="flex-1 overflow-y-auto space-y-5">
            <div className="space-y-2">
              <Label htmlFor="flyout-first-name" className="text-sm font-normal text-foreground">
                <span aria-hidden="true">*</span>First name
              </Label>
              <Input id="flyout-first-name" placeholder="e.g Allen" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flyout-last-name" className="text-sm font-normal text-foreground">
                <span aria-hidden="true">*</span>Last name
              </Label>
              <Input id="flyout-last-name" placeholder="e.g Torence" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flyout-job-title" className="text-sm font-normal text-foreground">
                <span aria-hidden="true">*</span>Job title
              </Label>
              <Input id="flyout-job-title" placeholder="e.g Sr. VP of product" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flyout-email" className="text-sm font-normal text-foreground">
                <span aria-hidden="true">*</span>Email
              </Label>
              <Input id="flyout-email" type="email" placeholder="e.g abc@gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flyout-security-role" className="text-sm font-normal text-foreground">
                Security role
              </Label>
              <Select>
                <SelectTrigger id="flyout-security-role">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t" style={{ borderColor: "hsl(var(--icon))" }} />

            <h4 className="text-lg font-semibold text-foreground">Optional attributes</h4>

            <div className="space-y-2">
              <Label htmlFor="flyout-job-code" className="text-sm font-normal text-foreground">
                Job code
              </Label>
              <Input id="flyout-job-code" placeholder="e.g R507" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="flyout-job-level" className="text-sm font-normal text-foreground">
                Job level
              </Label>
              <Select>
                <SelectTrigger id="flyout-job-level">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="l1">L1</SelectItem>
                  <SelectItem value="l2">L2</SelectItem>
                  <SelectItem value="l3">L3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
