"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import {
  Calculator,
  Layers,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Factory,
  Plus,
  X,
  ChevronDown,
  Package,
  Users,
  Zap,
  Home,
  Box,
  MoreHorizontal,
  Info,
  Globe,
  Wrench,
  ChevronUp,
  AlertTriangle,
  Save,
  Download,
  Share2,
  FileText,
  FileSpreadsheet,
  Bookmark,
  CheckCircle2,
  BarChart3,
  Settings2,
  Languages,
  FolderOpen,
  Search,
  Copy,
  Pencil,
  Trash2,
  BookmarkPlus,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// i18n — Translation system
// ─────────────────────────────────────────────────────────────
// One flat key map per language. English is the source of truth and
// the fallback. Missing keys in other languages automatically fall
// back to the English string, so the UI never breaks.
//
// Translation tone: simple business language a small-factory owner
// understands. Avoid accounting jargon. Use everyday words.
// Units (KG, Hour, Meter, etc.) stay in their universal forms.
//
// NOTE: native speakers should review tone before shipping.
// ─────────────────────────────────────────────────────────────

// MVP language scope: English + Roman Urdu/Hindi only.
// Arabic and other languages deferred to phase 2 when translations are reviewed by native speakers.
const LANGUAGES = [
  { code: "en",     name: "English",            nativeName: "English",    flag: "🇬🇧", rtl: false },
  { code: "ur-rom", name: "Roman Urdu / Hindi", nativeName: "Roman Urdu", flag: "🇵🇰", rtl: false },
  { code: "ar",     name: "Arabic",            nativeName: "العربية",   flag: "🇸🇦", rtl: true  },
  // Phase 3 — deferred:
  // { code: "ur", name: "Urdu",        nativeName: "اردو",    flag: "🇵🇰", rtl: true  },
  // { code: "hi", name: "Hindi",       nativeName: "हिन्दी",  flag: "🇮🇳", rtl: false },
  // { code: "zh", name: "Chinese",     nativeName: "中文",     flag: "🇨🇳", rtl: false },
  // { code: "es", name: "Spanish",     nativeName: "Español",  flag: "🇪🇸", rtl: false },
  // { code: "fr", name: "French",      nativeName: "Français", flag: "🇫🇷", rtl: false },
  // { code: "pt", name: "Portuguese",  nativeName: "Português",flag: "🇧🇷", rtl: false },
  // { code: "bn", name: "Bangla",      nativeName: "বাংলা",   flag: "🇧🇩", rtl: false },
  // { code: "ru", name: "Russian",     nativeName: "Русский",  flag: "🇷🇺", rtl: false },
];

const LOCALES = {
  en: {
    "app.name": "Costix",
    "app.tagline": "The simplest way to price what you make.",
    // Short category labels for the cost breakdown sidebar
    "cat.materials": "Materials",
    "cat.labor": "Labor",
    "cat.packaging": "Packaging",
    "cat.electricity": "Electricity",
    "cat.rent": "Rent",
    "cat.other": "Other",
    "cat.machines": "Machines",
    "tab.quickCost": "Quick Cost",
    "tab.batch": "Batch",
    "tab.monthly": "Monthly",
    "tab.saved": "Saved",
    "sc.emptyHint": "Save a costing from Quick Cost or Batch to see it here.",
    "sc.openAt": "Opens in",
    "sc.unit": "unit",
    "header.tryDemo": "Try demo",
    "quick.headerTitle": "Your expenses",
    "quick.headerSubtitle": "Just enter what you used and what you bought. We do the math.",
    "quick.modeSimple": "Simple",
    "quick.modeAdvanced": "Advanced",
    "quick.modeSimpleHint": "Just materials, labor, and price.",
    "quick.modeAdvancedHint": "Full breakdown — rent, electricity, machines, scaling.",
    "quick.productName": "Product name",
    "quick.productNamePlaceholder": "e.g. Cotton T-shirt",
    "quick.unitsProduced": "Units produced",
    "materials.title": "What raw materials did you use?",
    "materials.hint": "fabric, flour, oil — whatever you used",
    "materials.addLabel": "Add material",
    "materials.empty": "No materials added yet.",
    "materials.columnName": "Material",
    "materials.columnQty": "Qty consumed",
    "materials.columnUnit": "Unit",
    "materials.columnPurchased": "Purchased",
    "materials.columnCost": "Cost",
    "materials.columnAuto": "Auto",
    // Local / Imported material costing
    "mat.sourceLocal": "Local",
    "mat.sourceImported": "Imported",
    "mat.delivery": "Delivery",
    "mat.materialPrice": "Material price",
    "mat.freight": "Freight",
    "mat.duty": "Duty",
    "mat.taxes": "Taxes",
    "mat.taxAmount": "Tax Amount",
    "mat.taxRecoverable": "Tax can be claimed back",
    "mat.taxRecoverableYes": "Yes — excluded",
    "mat.taxRecoverableNo": "No — in cost",
    "mat.recoverableTaxNote": "Not included in product cost",
    "mat.taxInLandedCost": "Tax included in product cost",
    "mat.taxColNonRecov": "Tax (non-recoverable)",
    "mat.taxColRecov": "Tax (recoverable — excluded)",
    "mat.clearing": "Clearing / Other",
    "mat.landedCost": "Total landed cost",
    "mat.localHelper": "Local cost includes purchase cost and delivery.",
    "mat.importedHelper": "Imported cost includes freight, duty, taxes, and clearing.",
    "mat.warningImportedBlank": "Imported selected but no import costs entered yet.",
    "mat.warningZeroLanded": "Landed cost is zero — add material price first.",
    "labor.title": "Who worked on this production?",
    "labor.hint": "hours used vs total monthly hours",
    "labor.addLabel": "Add person",
    "labor.empty": "Add labor involved in this production.",
    "labor.columnRole": "Role",
    "labor.columnHours": "Hours used",
    "labor.columnMonthly": "Monthly",
    "labor.columnSalary": "Salary",
    "electricity.title": "How much electricity was used?",
    "electricity.hint": "share of the bill",
    "electricity.unitsUsed": "Units used",
    "electricity.billUnits": "Total bill units",
    "electricity.billAmount": "Bill amount",
    "electricity.warningUnitsExceed": "Units used exceed the bill's total units.",
    "rent.title": "How much rent applies to production?",
    "rent.hint": "factory portion only",
    "rent.tooltip": "Office and admin rent usually shouldn't affect manufacturing cost.",
    "rent.monthlyRent": "Monthly rent",
    "rent.factoryPct": "Factory %",
    "rent.warehousePct": "Warehouse %",
    "rent.officePct": "Office %",
    "rent.daysUsed": "Days used",
    "rent.daysInMonth": "Days in month",
    "rent.includeWarehouse": "Include warehouse",
    "rent.warningPct": "Percentages don't add to 100%",
    "packaging.title": "What packaging was used?",
    "packaging.hint": "boxes, bags, labels",
    "packaging.addLabel": "Add packaging",
    "packaging.empty": "Add packaging if applicable.",
    "other.title": "Any other expenses?",
    "other.hint": "transport, repairs, anything else",
    "other.addLabel": "Add expense",
    "other.columnItem": "Item",
    "other.columnCost": "Cost",
    "machines.title": "Include machine wear?",
    "machines.hint": "optional",
    "machines.description": "Optional: include machine wear cost in product costing.",
    "machines.on": "On",
    "machines.off": "Off",
    "machines.methodTime": "Time based",
    "machines.methodProduction": "Production based",
    "machines.columnMachine": "Machine",
    "machines.columnCost": "Cost",
    "machines.columnLife": "Life (years)",
    "machines.columnDaysUsed": "Days used",
    "machines.columnDaysYear": "Days / year",
    "machines.columnCapacity": "Lifetime capacity",
    "machines.columnBatch": "Batch units",
    "machines.columnAllocated": "Allocated",
    "machines.explainerTime": "Annual depreciation = cost ÷ life. Then prorated by days used.",
    "machines.explainerProduction": "Cost per unit = machine cost ÷ lifetime capacity. Multiplied by units produced.",
    "pricing.title": "How much profit do you want?",
    "pricing.modeMargin": "Margin %",
    "pricing.modeMarkup": "Markup %",
    "pricing.modeTarget": "Target profit",
    "pricing.marginField": "Desired margin (profit as % of price)",
    "pricing.markupField": "Desired markup (profit as % of cost)",
    "pricing.targetField": "Target profit per unit",
    "pricing.marginHint": "Margin: profit as a share of selling price. 30% margin = 30 profit on a 100 sale.",
    "pricing.markupHint": "Markup: profit as a share of cost. 40% markup on 100 cost = 140 selling price.",
    "pricing.targetHint": "Set a fixed profit you want per unit. Price = cost per unit + your target.",
    "whatif.title": "What if you produced more?",
    "whatif.hint": "see how cost per unit drops with scale",
    "whatif.empty": "Enter your costs and units first to simulate larger production.",
    "whatif.intro": "Fixed costs (rent, electricity, labor, machines) stay the same. Variable costs (materials, packaging) scale with production.",
    "whatif.columnProduction": "Production",
    "whatif.columnCostPerUnit": "Cost / unit",
    "whatif.columnSellAt": "Sell at",
    "whatif.columnProfit": "Profit",
    "whatif.columnMargin": "Margin",
    "whatif.now": "Now",
    "whatif.if": "If",
    "whatif.unitsLabel": "units",
    "whatif.addScenario": "Add scenario",
    "whatif.whyTitle": "Why this matters:",
    "whatif.whyBody": "Your fixed costs of {amount} are spread across every unit you make. Producing more units means each unit absorbs a smaller share — that's economy of scale.",
    "summary.live": "Live summary",
    "summary.suggestedPrice": "Suggested selling price",
    "summary.perUnit": "per unit",
    "summary.margin": "margin",
    "summary.costPerUnit": "Cost / unit",
    "summary.profitPerUnit": "Profit / unit",
    "summary.totalProfit": "Total profit",
    "summary.totalCost": "Total cost",
    "summary.costBreakdown": "Cost breakdown",
    "summary.groupCosts": "Costs",
    "summary.groupDirect": "Direct costs",
    "summary.groupIndirect": "Indirect costs",
    "summary.groupOptional": "Optional",
    "summary.insights": "Insights",
    "summary.savedSnapshots": "Saved snapshots",
    "summary.sellAt": "Sell at",
    "summary.enterData": "Enter data",
    "status.healthy": "Healthy margin",
    "status.low": "Low margin",
    "status.loss": "Loss risk",
    "actions.save": "Save",
    "actions.pdf": "PDF",
    "actions.excel": "Excel",
    "actions.share": "Share",
    "actions.copied": "Copied",
    "explainer.label": "How was this calculated?",
    "warning.usedExceedsPurchased": "Used quantity exceeds purchased quantity.",
    "warning.unitMismatch": "unit mismatch",
    "warning.rowsHaveWarnings": "Some rows have warnings",
    "insight.lossSelling": "You're selling below cost — every unit loses money.",
    "insight.marginLow": "Margin is {margin}% — below the recommended range for manufacturing.",
    "insight.marginHealthy": "Margin of {margin}% is strong — comfortable buffer for discounts and surprises.",
    "insight.biggestLever": "{name} cost is {pct}% of total — your biggest lever.",
    "insight.largestCost": "{name} is the largest cost at {pct}%.",
    "insight.laborHigh": "Labor cost is unusually high — check hours used vs. monthly capacity.",
    "insight.electricityMinimal": "Electricity impact is minimal here.",
    "insight.packagingHigh": "Packaging is eating into profit. Consider bulk purchase or alternatives.",
    "ui.quickAdd": "Quick add",
    "ui.selectCurrency": "Select currency",
    "ui.selectLanguage": "Language",
    "ui.searchCurrency": "Search currency or code…",
    "ui.noCurrencyMatch": "No currency matches",
    "ui.enterUnitsHint": "Enter units produced to calculate",
    "currency.warnTitle": "Currency not converted",
    "currency.warnBody": "Switching currency changes the symbol only — existing amounts are NOT converted. Your numbers will be treated as the new currency.",
    "currency.warnSwitch": "Switch anyway",
    "currency.warnCancel": "Keep current",
    "row.incomplete": "Incomplete · not counted",
    "mat.purchaseCostTotal": "Total purchase cost",
    "mat.consumed": "Consumed",
    "mat.purchaseCost": "Purchase cost",
    "mat.autoCost": "Auto cost",
    "mobile.sellAt": "Sell at",
    "report.brand": "Costix · Product Costing Report",
    "report.titleCosting": "Costing Summary",
    "report.titleBreakdown": "Cost Breakdown",
    "report.titleMaterials": "Raw Materials",
    "report.titleLabor": "Labor",
    "report.titleMachine": "Machine Cost",
    "report.titleWhatIf": "What-If Production Analysis",
    "report.metric": "Metric",
    "report.value": "Value",
    "report.category": "Category",
    "report.group": "Group",
    "report.amount": "Amount",
    "report.shareOfTotal": "Share of total",
    "report.totalCost": "Total cost",
    "report.totalMaterials": "Total materials",
    "report.totalLabor": "Total labor",
    "report.totalMachineCost": "Total machine cost",
    "report.note": "Note: Fixed costs of {amount} are spread across every unit produced.",
    "report.scaleNote": "As production volume increases, each unit absorbs a smaller share of fixed cost.",
    "report.footer": "Generated by Costix",
    "landing.heroTitle": "Know your true cost.",
    "landing.heroSubtitle": "Smarter than spreadsheets. Simpler than ERP. Tell us what you bought and used — Costix handles the rest.",
    "landing.cta": "Start calculating",
    "landing.badge": "Modern costing for modern manufacturing",
    "landing.heroTitleA": "Know your true cost.",
    "landing.heroTitleB": "in minutes.",
    "landing.stepExpenses": "Expenses",
    "landing.stepExpensesSub": "what you spend",
    "landing.stepCalculate": "Calculate",
    "landing.stepCalculateSub": "instant math",
    "landing.stepProfit": "Profit",
    "landing.stepProfitSub": "what you make",
    // Batch tab — step-by-step wizard
    "batch.stepLabel": "Step",
    "batch.stepOf": "of",
    "batch.resultLabel": "Result",
    "batch.back": "Back",
    "batch.continue": "Continue",
    "batch.calculate": "Calculate",
    "batch.q1Title": "How many items in this batch?",
    "batch.q1Hint": "Total pieces you'll produce.",
    "batch.q1Label": "Items in batch",
    "batch.q2Title": "How much material was used?",
    "batch.q2Hint": "Total raw material cost for this batch.",
    "batch.q2Label": "Material cost",
    "batch.q3Title": "How many labor hours?",
    "batch.q3Hint": "Hours and rate per hour.",
    "batch.q3LabelHours": "Hours",
    "batch.q3LabelRate": "Rate / hour",
    "batch.q4Title": "Any extra expenses?",
    "batch.q4Hint": "Packaging, electricity, transport.",
    "batch.q4LabelExtra": "Extra expenses",
    "batch.q4LabelMargin": "Profit margin",
    "batch.sellEachAt": "Sell each piece at",
    "batch.totalCost": "Batch cost",
    "batch.costPerPiece": "Cost per piece",
    "batch.items": "Items",
    "batch.startNew": "Start a new batch",
    // Redesigned Batch wizard — 8 steps using same intelligent costing as Quick Cost
    "batchwiz.step1Title": "Tell us about this production",
    "batchwiz.step1Hint": "Just the basics — name and how many you made.",
    "batchwiz.step2Title": "What raw materials did you use?",
    "batchwiz.step2Hint": "Add what you consumed. We'll work out the cost.",
    "batchwiz.step3Title": "Who worked on this production?",
    "batchwiz.step3Hint": "Add the hours people spent. Salaries do the rest.",
    "batchwiz.step4Title": "Electricity and rent",
    "batchwiz.step4Hint": "Optional. Skip if not relevant for this batch.",
    "batchwiz.step5Title": "What packaging was used?",
    "batchwiz.step5Hint": "Boxes, bags, labels — same row-based logic.",
    "batchwiz.step6Title": "Include machine wear?",
    "batchwiz.step6Hint": "Optional. Time-based or production-based.",
    "batchwiz.step7Title": "How much profit do you want?",
    "batchwiz.step7Hint": "Pick a margin, markup, or fixed profit per unit.",
    "batchwiz.step8Title": "Your batch is costed",
    "batchwiz.step8Hint": "Here's everything calculated automatically.",
    "batchwiz.miniLabel": "Live",
    "batchwiz.skipStep": "Skip this step",
    "batchwiz.openInQuickCost": "Open in Quick Cost",
    "batchwiz.print": "Print / Save PDF",
    "batchwiz.startOver": "Start a new batch",
    "batchwiz.save": "Save costing",
    "batchwiz.snapshotName": "Costing name",
    "batchwiz.snapshotNamePlaceholder": "e.g. June production run",
    "batchwiz.confirmClear": "Start a new batch? Your current unsaved progress will be cleared.",
    "batchwiz.confirmClearYes": "Yes, start new",
    "batchwiz.confirmClearNo": "Keep working",
    "batchwiz.electricity": "Electricity",
    "batchwiz.rent": "Rent",
    // Smart save & prefill — template system
    "tpl.button": "Saved Costings",
    "tpl.save": "Save costing",
    "tpl.saveNew": "Save as new",
    "tpl.update": "Update this costing",
    "tpl.duplicate": "Duplicate",
    "tpl.load": "Open saved costing",
    "tpl.loadEmpty": "No saved costings yet. Save this costing to revisit it later.",
    "tpl.searchPlaceholder": "Search saved costings…",
    "tpl.nameLabel": "Costing name",
    "tpl.namePlaceholder": "e.g. Cotton T-shirt — June 2025",
    "tpl.modalSaveTitle": "Save this costing",
    "tpl.modalSaveHint": "Saves a permanent record you can reopen, adjust prices, or duplicate whenever costs change.",
    "tpl.modalLoadTitle": "Saved Costings",
    "tpl.modalLoadHint": "Select a costing to reopen it or create a copy.",
    "tpl.chooseTitle": "How would you like to open this?",
    "tpl.chooseEdit": "Open original",
    "tpl.chooseEditHint": "Continue editing this costing. Changes update the saved record.",
    "tpl.choosePrefill": "Duplicate & edit",
    "tpl.choosePrefillHint": "Start a new costing from this one. The original stays untouched.",
    "tpl.cancel": "Cancel",
    "tpl.confirm": "Confirm",
    "tpl.delete": "Delete",
    "tpl.deleteConfirm": "Delete this saved costing?",
    "tpl.banner.editing": "Editing saved costing",
    "tpl.banner.prefilled": "Duplicated from saved costing",
    "tpl.banner.exit": "Clear",
    "tpl.savedJustNow": "Saved",
    "tpl.updated": "Updated",
    "tpl.duplicated": "Duplicated",
    // Monthly tab
    "monthly.title": "This month",
    "monthly.subtitle": "Three numbers — that's all we need.",
    "monthly.totalSales": "Total sales",
    "monthly.totalExpenses": "Total expenses",
    "monthly.unitsProduced": "Units produced",
    "monthly.netProfit": "Net profit this month",
    "monthly.netLoss": "Net loss this month",
    "monthly.marginSuffix": "margin",
    "monthly.avgCost": "Average cost per unit",
    "monthly.breakEven": "Break-even (units)",
  },

  "ur-rom": {
    "app.tagline": "Apni cheez ki sahi price janne ka sab se aasaan tareeqa.",
    "cat.materials": "Material",
    "cat.labor": "Labour",
    "cat.packaging": "Packaging",
    "cat.electricity": "Bijli",
    "cat.rent": "Kiraya",
    "cat.other": "Aur",
    "cat.machines": "Machinen",
    "tab.quickCost": "Jaldi Cost",
    "tab.batch": "Batch",
    "tab.monthly": "Mahana",
    "tab.saved": "Save kiye",
    "sc.emptyHint": "Quick Cost ya Batch se costing save karein — yahan dikhega.",
    "sc.openAt": "Kholein:",
    "sc.unit": "unit",
    "header.tryDemo": "Demo dekhein",
    "quick.headerTitle": "Aap ke kharchay",
    "quick.headerSubtitle": "Bas batayein kya use hua aur kya khareeda. Hisaab hum karenge.",
    "quick.modeSimple": "Asaan",
    "quick.modeAdvanced": "Tafseeli",
    "quick.modeSimpleHint": "Sirf material, labour, aur price.",
    "quick.modeAdvancedHint": "Poori tafseel — kiraya, bijli, machinen, scale.",
    "quick.productName": "Product ka naam",
    "quick.productNamePlaceholder": "jaise Cotton T-shirt",
    "quick.unitsProduced": "Kitne units banaye",
    "materials.title": "Aap ne kaunsa raw material use kiya?",
    "materials.hint": "kapra, atta, tel — jo bhi use hua",
    "materials.addLabel": "Material add karein",
    "materials.empty": "Abhi koi material add nahi kiya.",
    "materials.columnName": "Material",
    "materials.columnQty": "Asal mein kitna use hua",
    "materials.columnUnit": "Unit",
    "materials.columnPurchased": "Khareeda gaya",
    "materials.columnCost": "Cost",
    "materials.columnAuto": "Auto",
    "mat.sourceLocal": "Local",
    "mat.sourceImported": "Imported",
    "mat.delivery": "Delivery",
    "mat.materialPrice": "Material ki price",
    "mat.freight": "Freight",
    "mat.duty": "Duty",
    "mat.taxes": "Tax",
    "mat.taxAmount": "Tax Amount",
    "mat.taxRecoverable": "Tax wapas claim ho sakta hai",
    "mat.taxRecoverableYes": "Haan — exclude",
    "mat.taxRecoverableNo": "Nahi — cost mein",
    "mat.recoverableTaxNote": "Product cost mein shamil nahi",
    "mat.taxInLandedCost": "Tax product cost mein shamil hai",
    "mat.taxColNonRecov": "Tax (non-recoverable)",
    "mat.taxColRecov": "Tax (recoverable — excluded)",
    "mat.clearing": "Clearing / Aur",
    "mat.landedCost": "Total landed cost",
    "mat.localHelper": "Local cost mein purchase cost aur delivery shamil hai.",
    "mat.importedHelper": "Imported cost mein freight, duty, tax aur clearing shamil hai.",
    "mat.warningImportedBlank": "Imported select hai lekin abhi koi import cost nahi daala.",
    "mat.warningZeroLanded": "Landed cost zero hai — pehle material ki price daalein.",
    "labor.title": "Is production par kaun kaam karta tha?",
    "labor.hint": "kitne ghante use hue vs mahanay ke total ghante",
    "labor.addLabel": "Banda add karein",
    "labor.empty": "Production mein lage logon ko add karein.",
    "labor.columnRole": "Role",
    "labor.columnHours": "Ghante use hue",
    "labor.columnMonthly": "Mahana",
    "labor.columnSalary": "Tankhwah",
    "electricity.title": "Kitni bijli use hui?",
    "electricity.hint": "bill ka hissa",
    "electricity.unitsUsed": "Units use hue",
    "electricity.billUnits": "Bill ke total units",
    "electricity.billAmount": "Bill ki raqam",
    "electricity.warningUnitsExceed": "Use hue units bill ke total units se zyada hain.",
    "rent.title": "Production ke liye kitna kiraya lagega?",
    "rent.hint": "sirf factory wala hissa",
    "rent.tooltip": "Office aur admin ka kiraya manufacturing cost mein nahi aana chahiye.",
    "rent.monthlyRent": "Mahana kiraya",
    "rent.factoryPct": "Factory %",
    "rent.warehousePct": "Warehouse %",
    "rent.officePct": "Office %",
    "rent.daysUsed": "Kitne din use hue",
    "rent.daysInMonth": "Mahanay ke din",
    "rent.includeWarehouse": "Warehouse shamil karein",
    "rent.warningPct": "Percentage ka jorr 100% nahi hai",
    "packaging.title": "Kaunsi packaging use ki?",
    "packaging.hint": "boxes, bags, labels",
    "packaging.addLabel": "Packaging add karein",
    "packaging.empty": "Agar packaging hai to add karein.",
    "other.title": "Koi aur kharchay?",
    "other.hint": "transport, marammat, koi bhi cheez",
    "other.addLabel": "Kharcha add karein",
    "other.columnItem": "Cheez",
    "other.columnCost": "Cost",
    "machines.title": "Machine ka wear shamil karein?",
    "machines.hint": "optional",
    "machines.description": "Optional: machine ke wear ka kharcha bhi shamil karein.",
    "machines.on": "On",
    "machines.off": "Off",
    "machines.methodTime": "Waqt ke hisaab se",
    "machines.methodProduction": "Production ke hisaab se",
    "machines.columnMachine": "Machine",
    "machines.columnCost": "Cost",
    "machines.columnLife": "Umar (saal)",
    "machines.columnDaysUsed": "Din use hue",
    "machines.columnDaysYear": "Saal ke din",
    "machines.columnCapacity": "Total capacity",
    "machines.columnBatch": "Batch units",
    "machines.columnAllocated": "Hissa",
    "pricing.title": "Kitna profit chahiye?",
    "pricing.modeMargin": "Margin %",
    "pricing.modeMarkup": "Markup %",
    "pricing.modeTarget": "Profit per piece",
    "pricing.marginField": "Margin chahiye (price ka %)",
    "pricing.markupField": "Markup chahiye (cost ka %)",
    "pricing.targetField": "Har piece par kitna profit",
    "pricing.marginHint": "Margin: profit price ka kitna hissa. 30% margin = 100 ki sale par 30 profit.",
    "pricing.markupHint": "Markup: profit cost ka kitna hissa. 100 cost par 40% markup = 140 sale price.",
    "pricing.targetHint": "Har piece par fixed profit set karein. Price = cost per unit + aap ka profit.",
    "whatif.title": "Agar zyada banayein to kya hoga?",
    "whatif.hint": "scale par cost per unit kaise kam hota hai",
    "whatif.empty": "Pehle apne kharchay aur units enter karein.",
    "whatif.intro": "Fixed kharchay (kiraya, bijli, labour, machinen) wahi rahein gay. Variable kharchay (material, packaging) production ke saath barhein gay.",
    "whatif.columnProduction": "Production",
    "whatif.columnCostPerUnit": "Cost / unit",
    "whatif.columnSellAt": "Sale price",
    "whatif.columnProfit": "Profit",
    "whatif.columnMargin": "Margin",
    "whatif.now": "Abhi",
    "whatif.if": "Agar",
    "whatif.unitsLabel": "units",
    "whatif.addScenario": "Scenario add karein",
    "whatif.whyTitle": "Yeh important kyun hai:",
    "whatif.whyBody": "Aap ke fixed kharchay {amount} har banaye gaye piece par baatte hain. Zyada banayein gay to har piece ka hissa kam ho jayega — yehi scale ka faida hai.",
    "summary.live": "Live summary",
    "summary.suggestedPrice": "Tajweez kardah sale price",
    "summary.perUnit": "per unit",
    "summary.margin": "margin",
    "summary.costPerUnit": "Cost / unit",
    "summary.profitPerUnit": "Profit / unit",
    "summary.totalProfit": "Total profit",
    "summary.totalCost": "Total cost",
    "summary.costBreakdown": "Cost ki tafseel",
    "summary.groupCosts": "Kharchay",
    "summary.groupDirect": "Direct kharchay",
    "summary.groupIndirect": "Indirect kharchay",
    "summary.groupOptional": "Optional",
    "summary.insights": "Insights",
    "summary.savedSnapshots": "Save kiye snapshots",
    "summary.sellAt": "Sale karein",
    "summary.enterData": "Data enter karein",
    "status.healthy": "Acha margin",
    "status.low": "Kam margin",
    "status.loss": "Loss ka khatra",
    "actions.save": "Save",
    "actions.pdf": "PDF",
    "actions.excel": "Excel",
    "actions.share": "Share",
    "actions.copied": "Copy ho gaya",
    "explainer.label": "Yeh kaise count hua?",
    "warning.usedExceedsPurchased": "Use hui quantity khareedi gayi quantity se zyada hai.",
    "warning.unitMismatch": "unit match nahi",
    "warning.rowsHaveWarnings": "Kuch rows mein warning hai",
    "insight.lossSelling": "Aap cost se kam par bech rahe hain — har piece par loss ho raha hai.",
    "insight.marginLow": "Margin {margin}% hai — manufacturing ke liye kam hai.",
    "insight.marginHealthy": "{margin}% margin acha hai — discount aur surprises ke liye buffer hai.",
    "insight.biggestLever": "{name} kharcha total ka {pct}% hai — yeh sab se bara lever hai.",
    "insight.largestCost": "{name} sab se bara kharcha hai, {pct}%.",
    "insight.laborHigh": "Labour cost ziyada lag rahi hai — ghantay aur capacity check karein.",
    "insight.electricityMinimal": "Bijli ka asar yahan minimum hai.",
    "insight.packagingHigh": "Packaging profit kha rahi hai. Bulk khareedne ya kuch aur try karein.",
    "ui.quickAdd": "Jaldi add",
    "ui.selectCurrency": "Currency chunein",
    "ui.selectLanguage": "Zaban",
    "ui.searchCurrency": "Currency ya code search karein…",
    "ui.noCurrencyMatch": "Koi currency nahi mili",
    "ui.enterUnitsHint": "Calculate karne ke liye units daalen",
    "currency.warnTitle": "Currency convert nahi hogi",
    "currency.warnBody": "Currency switch karne se sirf symbol badlega — existing amounts convert NAHI honge. Aapke numbers naye currency mein count honge.",
    "currency.warnSwitch": "Phir bhi switch karein",
    "currency.warnCancel": "Current rakhein",
    "row.incomplete": "Adhoora · count nahi",
    "mat.purchaseCostTotal": "Total khareed cost",
    "mat.consumed": "Istimal hua",
    "mat.purchaseCost": "Khareed ki cost",
    "mat.autoCost": "Automatic cost",
    "mobile.sellAt": "Sale price",
    "report.titleCosting": "Costing Summary",
    "report.titleBreakdown": "Cost ki tafseel",
    "report.titleMaterials": "Raw Material",
    "report.titleLabor": "Labour",
    "report.titleMachine": "Machine cost",
    "report.titleWhatIf": "What-If Analysis",
    "report.metric": "Cheez",
    "report.value": "Value",
    "report.amount": "Raqam",
    "report.shareOfTotal": "Total ka hissa",
    "report.totalCost": "Total cost",
    "report.totalMaterials": "Total material",
    "report.totalLabor": "Total labour",
    "report.totalMachineCost": "Total machine cost",
    "report.note": "Note: Fixed kharchay {amount} har piece par baatte hain.",
    "report.scaleNote": "Jab production barhta hai, har piece ka fixed cost hissa kam hota hai.",
    "report.footer": "Costix se banaya gaya",
    "landing.badge": "Chote factories aur workshops ke liye",
    "landing.heroTitleA": "Apne product ki cost janein",
    "landing.heroTitleB": "minutes mein.",
    "landing.heroSubtitle": "Factories aur manufacturers ke liye simple costing calculator. Jo khareeda aur use kiya wo enter karein — hisaab hum karenge.",
    "landing.cta": "Calculate shuru karein",
    "landing.stepExpenses": "Kharchay",
    "landing.stepExpensesSub": "jo lagta hai",
    "landing.stepCalculate": "Hisaab",
    "landing.stepCalculateSub": "foran",
    "landing.stepProfit": "Profit",
    "landing.stepProfitSub": "jo aap kamate hain",
    "batch.stepLabel": "Step",
    "batch.stepOf": "of",
    "batch.resultLabel": "Result",
    "batch.back": "Wapas",
    "batch.continue": "Aage",
    "batch.calculate": "Hisaab karein",
    "batch.q1Title": "Is batch mein kitne pieces hain?",
    "batch.q1Hint": "Total kitne pieces banane hain.",
    "batch.q1Label": "Batch mein pieces",
    "batch.q2Title": "Kitna material use hua?",
    "batch.q2Hint": "Is batch ka total raw material cost.",
    "batch.q2Label": "Material cost",
    "batch.q3Title": "Kitne labour ghante lage?",
    "batch.q3Hint": "Ghante aur rate per hour.",
    "batch.q3LabelHours": "Ghante",
    "batch.q3LabelRate": "Rate per hour",
    "batch.q4Title": "Aur kuch kharchay?",
    "batch.q4Hint": "Packaging, bijli, transport.",
    "batch.q4LabelExtra": "Aur kharchay",
    "batch.q4LabelMargin": "Profit margin",
    "batch.sellEachAt": "Har piece is rate par bechein",
    "batch.totalCost": "Batch ki cost",
    "batch.costPerPiece": "Per piece cost",
    "batch.items": "Pieces",
    "batch.startNew": "Nayi batch shuru karein",
    "batchwiz.step1Title": "Is production ke baare mein batayein",
    "batchwiz.step1Hint": "Bas naam aur kitne banaye — itna kaafi hai.",
    "batchwiz.step2Title": "Kaunsa raw material use kiya?",
    "batchwiz.step2Hint": "Jo use hua wo add karein. Cost hum nikalein gay.",
    "batchwiz.step3Title": "Is production par kaun kaam karta tha?",
    "batchwiz.step3Hint": "Logon ke ghante add karein. Salary se baki sab calculate ho jayega.",
    "batchwiz.step4Title": "Bijli aur kiraya",
    "batchwiz.step4Hint": "Optional. Agar is batch par lagu nahi to skip karein.",
    "batchwiz.step5Title": "Kaunsi packaging use ki?",
    "batchwiz.step5Hint": "Boxes, bags, labels — same smart logic.",
    "batchwiz.step6Title": "Machine ka wear shamil karein?",
    "batchwiz.step6Hint": "Optional. Waqt ya production ke hisaab se.",
    "batchwiz.step7Title": "Kitna profit chahiye?",
    "batchwiz.step7Hint": "Margin, markup, ya har piece par fixed profit chunein.",
    "batchwiz.step8Title": "Aap ki batch ki costing tayar hai",
    "batchwiz.step8Hint": "Sab kuch auto calculate ho gaya — yeh dekhain.",
    "batchwiz.miniLabel": "Live",
    "batchwiz.skipStep": "Yeh step skip karein",
    "batchwiz.openInQuickCost": "Quick Cost mein kholein",
    "batchwiz.print": "Print / PDF save karein",
    "batchwiz.startOver": "Nayi batch shuru karein",
    "batchwiz.save": "Costing save karein",
    "batchwiz.snapshotName": "Costing ka naam",
    "batchwiz.snapshotNamePlaceholder": "jaise June ki production",
    "batchwiz.confirmClear": "Nayi batch shuru karein? Abhi ka unsaved kaam mit jayega.",
    "batchwiz.confirmClearYes": "Haan, nayi shuru karein",
    "batchwiz.confirmClearNo": "Kaam jari rakhein",
    "batchwiz.electricity": "Bijli",
    "batchwiz.rent": "Kiraya",
    "tpl.button": "Save kiye Costings",
    "tpl.save": "Costing save karein",
    "tpl.saveNew": "Naya save karein",
    "tpl.update": "Yeh costing update karein",
    "tpl.duplicate": "Copy banayein",
    "tpl.load": "Pichli costing kholein",
    "tpl.loadEmpty": "Abhi koi costing save nahi. Is costing ko save karein taake baad mein kholein.",
    "tpl.searchPlaceholder": "Costings search karein…",
    "tpl.nameLabel": "Costing ka naam",
    "tpl.namePlaceholder": "jaise Cotton T-shirt — June 2025",
    "tpl.modalSaveTitle": "Is costing ko save karein",
    "tpl.modalSaveHint": "Ek permanent record save hoga. Baad mein wapas khol sakte hain, price adjust kar sakte hain ya copy bana sakte hain.",
    "tpl.modalLoadTitle": "Save kiye Costings",
    "tpl.modalLoadHint": "Koi costing chunein — dubara kholein ya copy banayein.",
    "tpl.chooseTitle": "Yeh costing kaise kholna chahte hain?",
    "tpl.chooseEdit": "Original kholein",
    "tpl.chooseEditHint": "Isi costing mein changes karein. Save record update ho jayega.",
    "tpl.choosePrefill": "Duplicate karein & edit karein",
    "tpl.choosePrefillHint": "Is costing ki copy banayein. Original waisa hi rahega.",
    "tpl.cancel": "Cancel",
    "tpl.confirm": "Confirm",
    "tpl.delete": "Delete",
    "tpl.deleteConfirm": "Yeh saved costing delete karein?",
    "tpl.banner.editing": "Saved costing edit ho rahi hai",
    "tpl.banner.prefilled": "Saved costing se copy",
    "tpl.banner.exit": "Hata dein",
    "tpl.savedJustNow": "Save ho gaya",
    "tpl.updated": "Update ho gaya",
    "tpl.duplicated": "Copy ban gayi",
    "monthly.title": "Yeh mahina",
    "monthly.subtitle": "Sirf teen number — itna kaafi hai.",
    "monthly.totalSales": "Total sale",
    "monthly.totalExpenses": "Total kharchay",
    "monthly.unitsProduced": "Banaye gaye units",
    "monthly.netProfit": "Is mahanay ka net profit",
    "monthly.netLoss": "Is mahanay ka net loss",
    "monthly.marginSuffix": "margin",
    "monthly.avgCost": "Per unit average cost",
    "monthly.breakEven": "Break-even (units)",
  },

  ur: {
    "app.tagline": "اپنی پروڈکٹ کی صحیح قیمت لگانے کا سب سے آسان طریقہ۔",
    "cat.materials": "میٹریل",
    "cat.labor": "لیبر",
    "cat.packaging": "پیکجنگ",
    "cat.electricity": "بجلی",
    "cat.rent": "کرایہ",
    "cat.other": "دیگر",
    "cat.machines": "مشینیں",
    "tab.quickCost": "فوری لاگت",
    "tab.batch": "بیچ",
    "tab.monthly": "ماہانہ",
    "header.tryDemo": "ڈیمو دیکھیں",
    "quick.headerTitle": "آپ کے اخراجات",
    "quick.headerSubtitle": "بس بتائیں کیا استعمال ہوا اور کیا خریدا۔ حساب ہم کریں گے۔",
    "quick.modeSimple": "آسان",
    "quick.modeAdvanced": "تفصیلی",
    "quick.modeSimpleHint": "صرف میٹریل، لیبر، اور قیمت۔",
    "quick.modeAdvancedHint": "پوری تفصیل — کرایہ، بجلی، مشینیں، اسکیل۔",
    "quick.productName": "پروڈکٹ کا نام",
    "quick.productNamePlaceholder": "جیسے کاٹن ٹی شرٹ",
    "quick.unitsProduced": "کتنے یونٹ بنائے",
    "materials.title": "آپ نے کونسا خام مال استعمال کیا؟",
    "materials.addLabel": "میٹریل شامل کریں",
    "materials.empty": "ابھی کوئی میٹریل شامل نہیں کیا۔",
    "materials.columnName": "میٹریل",
    "materials.columnQty": "اصل میں کتنا استعمال ہوا",
    "materials.columnUnit": "یونٹ",
    "materials.columnPurchased": "خریدا گیا",
    "materials.columnCost": "قیمت",
    "labor.title": "اس پروڈکشن پر کون کام کرتا تھا؟",
    "labor.addLabel": "بندہ شامل کریں",
    "labor.empty": "پروڈکشن میں شامل لوگوں کو شامل کریں۔",
    "labor.columnRole": "کردار",
    "labor.columnHours": "گھنٹے استعمال ہوئے",
    "labor.columnMonthly": "ماہانہ",
    "labor.columnSalary": "تنخواہ",
    "electricity.title": "کتنی بجلی استعمال ہوئی؟",
    "electricity.hint": "بل کا حصہ",
    "electricity.unitsUsed": "یونٹ استعمال ہوئے",
    "electricity.billUnits": "بل کے کل یونٹ",
    "electricity.billAmount": "بل کی رقم",
    "electricity.warningUnitsExceed": "استعمال ہوئے یونٹ بل کے کل یونٹ سے زیادہ ہیں۔",
    "rent.title": "پروڈکشن کے لیے کتنا کرایہ ہے؟",
    "rent.hint": "صرف فیکٹری والا حصہ",
    "rent.monthlyRent": "ماہانہ کرایہ",
    "rent.factoryPct": "فیکٹری ٪",
    "rent.warehousePct": "گودام ٪",
    "rent.officePct": "آفس ٪",
    "rent.daysUsed": "کتنے دن استعمال ہوا",
    "rent.includeWarehouse": "گودام شامل کریں",
    "packaging.title": "کونسی پیکجنگ استعمال کی؟",
    "packaging.addLabel": "پیکجنگ شامل کریں",
    "packaging.empty": "اگر پیکجنگ ہے تو شامل کریں۔",
    "other.title": "کوئی اور اخراجات؟",
    "other.addLabel": "خرچہ شامل کریں",
    "machines.title": "مشین کی گھسائی شامل کریں؟",
    "machines.description": "اختیاری: مشین کے گھسائی کا خرچہ بھی شامل کریں۔",
    "machines.on": "آن",
    "machines.off": "آف",
    "pricing.title": "کتنا منافع چاہیے؟",
    "pricing.modeMargin": "مارجن ٪",
    "pricing.modeMarkup": "مارک اپ ٪",
    "pricing.modeTarget": "فی پیس منافع",
    "whatif.title": "اگر زیادہ بنائیں تو کیا ہوگا؟",
    "whatif.now": "ابھی",
    "whatif.if": "اگر",
    "whatif.columnProduction": "پروڈکشن",
    "whatif.columnCostPerUnit": "فی یونٹ لاگت",
    "whatif.columnSellAt": "سیل پرائس",
    "whatif.columnProfit": "منافع",
    "whatif.columnMargin": "مارجن",
    "whatif.addScenario": "منظر نامہ شامل کریں",
    "summary.live": "لائیو سمری",
    "summary.suggestedPrice": "تجویز کردہ سیل پرائس",
    "summary.perUnit": "فی یونٹ",
    "summary.margin": "مارجن",
    "summary.costPerUnit": "فی یونٹ لاگت",
    "summary.profitPerUnit": "فی یونٹ منافع",
    "summary.totalProfit": "کل منافع",
    "summary.totalCost": "کل لاگت",
    "summary.costBreakdown": "لاگت کی تفصیل",
    "summary.groupDirect": "براہ راست اخراجات",
    "summary.groupIndirect": "بالواسطہ اخراجات",
    "summary.groupOptional": "اختیاری",
    "summary.insights": "بصیرت",
    "summary.sellAt": "بیچیں",
    "status.healthy": "اچھا مارجن",
    "status.low": "کم مارجن",
    "status.loss": "نقصان کا خطرہ",
    "actions.save": "محفوظ",
    "actions.share": "شیئر",
    "actions.copied": "کاپی ہوگیا",
    "explainer.label": "یہ کیسے حساب ہوا؟",
    "warning.usedExceedsPurchased": "استعمال شدہ مقدار خریدی گئی مقدار سے زیادہ ہے۔",
    "ui.selectLanguage": "زبان",
    "ui.selectCurrency": "کرنسی منتخب کریں",
    "ui.searchCurrency": "کرنسی یا کوڈ تلاش کریں…",
    "ui.quickAdd": "فوری شامل",
    "report.titleCosting": "لاگت کا خلاصہ",
    "report.titleBreakdown": "لاگت کی تفصیل",
    "report.titleMaterials": "خام مال",
    "report.titleLabor": "لیبر",
    "report.titleMachine": "مشین لاگت",
    "report.titleWhatIf": "اگر زیادہ بنائیں",
    "report.totalCost": "کل لاگت",
    "landing.badge": "چھوٹے کارخانوں اور ورکشاپس کے لیے",
    "landing.heroTitleA": "اپنے پروڈکٹ کی لاگت جانیں",
    "landing.heroTitleB": "منٹوں میں۔",
    "landing.heroSubtitle": "کارخانوں اور مینوفیکچررز کے لیے آسان کاسٹنگ کیلکولیٹر۔ جو خریدا اور استعمال کیا درج کریں — حساب ہم کریں گے۔",
    "landing.cta": "حساب شروع کریں",
    "landing.stepExpenses": "اخراجات",
    "landing.stepExpensesSub": "جو خرچ ہوتا ہے",
    "landing.stepCalculate": "حساب",
    "landing.stepCalculateSub": "فوری",
    "landing.stepProfit": "منافع",
    "landing.stepProfitSub": "جو آپ کماتے ہیں",
    "batch.back": "واپس",
    "batch.continue": "آگے",
    "batch.calculate": "حساب کریں",
    "batch.q1Title": "اس بیچ میں کتنے پیس ہیں؟",
    "batch.q1Hint": "کل کتنے پیس بنانے ہیں۔",
    "batch.q1Label": "بیچ میں پیس",
    "batch.q2Title": "کتنا میٹریل استعمال ہوا؟",
    "batch.q2Hint": "اس بیچ کا کل خام مال کا خرچ۔",
    "batch.q2Label": "میٹریل لاگت",
    "batch.q3Title": "کتنے لیبر گھنٹے لگے؟",
    "batch.q3Hint": "گھنٹے اور فی گھنٹہ ریٹ۔",
    "batch.q3LabelHours": "گھنٹے",
    "batch.q3LabelRate": "فی گھنٹہ ریٹ",
    "batch.q4Title": "کوئی اور اخراجات؟",
    "batch.q4Hint": "پیکجنگ، بجلی، ٹرانسپورٹ۔",
    "batch.q4LabelExtra": "اضافی اخراجات",
    "batch.q4LabelMargin": "منافع مارجن",
    "batch.sellEachAt": "ہر پیس اس قیمت پر بیچیں",
    "batch.totalCost": "بیچ کی لاگت",
    "batch.costPerPiece": "فی پیس لاگت",
    "batch.items": "پیس",
    "batch.startNew": "نئی بیچ شروع کریں",
    "monthly.title": "یہ مہینہ",
    "monthly.subtitle": "صرف تین نمبر — اتنا کافی ہے۔",
    "monthly.totalSales": "کل فروخت",
    "monthly.totalExpenses": "کل اخراجات",
    "monthly.unitsProduced": "بنائے گئے یونٹ",
    "monthly.netProfit": "اس مہینے کا خالص منافع",
    "monthly.netLoss": "اس مہینے کا خالص نقصان",
    "monthly.marginSuffix": "مارجن",
    "monthly.avgCost": "فی یونٹ اوسط لاگت",
    "monthly.breakEven": "بریک ایون (یونٹ)",
  },

  hi: {
    "app.tagline": "अपने प्रोडक्ट की सही कीमत तय करने का सबसे आसान तरीका।",
    "cat.materials": "मटीरियल",
    "cat.labor": "लेबर",
    "cat.packaging": "पैकेजिंग",
    "cat.electricity": "बिजली",
    "cat.rent": "किराया",
    "cat.other": "अन्य",
    "cat.machines": "मशीनें",
    "tab.quickCost": "त्वरित लागत",
    "header.tryDemo": "डेमो देखें",
    "quick.headerTitle": "आपके खर्चे",
    "quick.headerSubtitle": "बस बताएं क्या इस्तेमाल हुआ और क्या खरीदा। हिसाब हम करेंगे।",
    "quick.modeSimple": "सरल",
    "quick.modeAdvanced": "विस्तृत",
    "quick.modeSimpleHint": "सिर्फ मटीरियल, लेबर, और कीमत।",
    "quick.modeAdvancedHint": "पूरी जानकारी — किराया, बिजली, मशीनें, स्केल।",
    "quick.productName": "प्रोडक्ट का नाम",
    "quick.productNamePlaceholder": "जैसे कॉटन टी-शर्ट",
    "quick.unitsProduced": "कितने यूनिट बनाए",
    "materials.title": "आपने कौन-सा कच्चा माल इस्तेमाल किया?",
    "materials.addLabel": "मटीरियल जोड़ें",
    "materials.empty": "अभी कोई मटीरियल नहीं जोड़ा गया।",
    "materials.columnName": "मटीरियल",
    "materials.columnQty": "वास्तव में कितना इस्तेमाल हुआ",
    "materials.columnUnit": "यूनिट",
    "materials.columnPurchased": "खरीदा गया",
    "materials.columnCost": "कीमत",
    "labor.title": "इस प्रोडक्शन पर कौन काम करता था?",
    "labor.addLabel": "व्यक्ति जोड़ें",
    "labor.empty": "प्रोडक्शन में शामिल लोगों को जोड़ें।",
    "labor.columnRole": "भूमिका",
    "labor.columnHours": "घंटे लगे",
    "labor.columnMonthly": "मासिक",
    "labor.columnSalary": "वेतन",
    "electricity.title": "कितनी बिजली इस्तेमाल हुई?",
    "rent.title": "प्रोडक्शन के लिए कितना किराया है?",
    "rent.monthlyRent": "मासिक किराया",
    "packaging.title": "कौन-सी पैकेजिंग इस्तेमाल हुई?",
    "packaging.addLabel": "पैकेजिंग जोड़ें",
    "packaging.empty": "अगर पैकेजिंग है तो जोड़ें।",
    "other.title": "कोई और खर्चे?",
    "other.addLabel": "खर्च जोड़ें",
    "machines.title": "मशीन की घिसाई शामिल करें?",
    "pricing.title": "कितना मुनाफा चाहिए?",
    "pricing.modeMargin": "मार्जिन %",
    "pricing.modeMarkup": "मार्कअप %",
    "pricing.modeTarget": "प्रति पीस मुनाफा",
    "whatif.title": "अगर ज़्यादा बनाएं तो क्या होगा?",
    "whatif.now": "अभी",
    "whatif.if": "अगर",
    "whatif.columnProduction": "प्रोडक्शन",
    "whatif.columnCostPerUnit": "प्रति यूनिट लागत",
    "whatif.columnSellAt": "बिक्री कीमत",
    "whatif.columnProfit": "मुनाफा",
    "whatif.columnMargin": "मार्जिन",
    "whatif.addScenario": "परिदृश्य जोड़ें",
    "summary.live": "लाइव सारांश",
    "summary.suggestedPrice": "सुझाई गई बिक्री कीमत",
    "summary.perUnit": "प्रति यूनिट",
    "summary.costPerUnit": "प्रति यूनिट लागत",
    "summary.profitPerUnit": "प्रति यूनिट मुनाफा",
    "summary.totalProfit": "कुल मुनाफा",
    "summary.totalCost": "कुल लागत",
    "summary.costBreakdown": "लागत का विवरण",
    "summary.groupDirect": "प्रत्यक्ष खर्चे",
    "summary.groupIndirect": "अप्रत्यक्ष खर्चे",
    "summary.groupOptional": "वैकल्पिक",
    "summary.insights": "अंतर्दृष्टि",
    "summary.sellAt": "बेचें",
    "status.healthy": "अच्छा मार्जिन",
    "status.low": "कम मार्जिन",
    "status.loss": "नुकसान का जोखिम",
    "actions.save": "सहेजें",
    "actions.share": "साझा",
    "actions.copied": "कॉपी हो गया",
    "explainer.label": "यह कैसे गणना हुई?",
    "warning.usedExceedsPurchased": "इस्तेमाल की गई मात्रा खरीदी गई मात्रा से अधिक है।",
    "ui.selectLanguage": "भाषा",
    "ui.selectCurrency": "मुद्रा चुनें",
    "ui.searchCurrency": "मुद्रा या कोड खोजें…",
    "ui.quickAdd": "त्वरित जोड़",
    "report.titleCosting": "लागत सारांश",
    "report.titleBreakdown": "लागत का विवरण",
    "report.titleMaterials": "कच्चा माल",
    "report.titleLabor": "लेबर",
    "report.titleMachine": "मशीन लागत",
    "report.titleWhatIf": "अगर ज़्यादा बनाएं",
    "report.totalCost": "कुल लागत",
    "landing.badge": "छोटे कारखानों और वर्कशॉप के लिए",
    "landing.heroTitleA": "अपने प्रोडक्ट की लागत जानें",
    "landing.heroTitleB": "मिनटों में।",
    "landing.heroSubtitle": "कारखानों और निर्माताओं के लिए सरल कॉस्टिंग कैलकुलेटर। जो खरीदा और इस्तेमाल किया दर्ज करें — गणना हम करेंगे।",
    "landing.cta": "गणना शुरू करें",
    "landing.stepExpenses": "खर्चे",
    "landing.stepExpensesSub": "जो लगता है",
    "landing.stepCalculate": "गणना",
    "landing.stepCalculateSub": "तुरंत",
    "landing.stepProfit": "मुनाफा",
    "landing.stepProfitSub": "जो आप कमाते हैं",
    "batch.back": "वापस",
    "batch.continue": "आगे",
    "batch.calculate": "हिसाब करें",
    "batch.q1Title": "इस बैच में कितने पीस हैं?",
    "batch.q1Hint": "कुल कितने पीस बनाने हैं।",
    "batch.q1Label": "बैच में पीस",
    "batch.q2Title": "कितना मटीरियल इस्तेमाल हुआ?",
    "batch.q2Hint": "इस बैच का कुल कच्चा माल खर्च।",
    "batch.q2Label": "मटीरियल लागत",
    "batch.q3Title": "कितने लेबर घंटे लगे?",
    "batch.q3Hint": "घंटे और प्रति घंटा रेट।",
    "batch.q3LabelHours": "घंटे",
    "batch.q3LabelRate": "प्रति घंटा रेट",
    "batch.q4Title": "कोई और खर्चे?",
    "batch.q4Hint": "पैकेजिंग, बिजली, परिवहन।",
    "batch.q4LabelExtra": "अतिरिक्त खर्चे",
    "batch.q4LabelMargin": "मुनाफा मार्जिन",
    "batch.sellEachAt": "हर पीस इस दाम पर बेचें",
    "batch.totalCost": "बैच की लागत",
    "batch.costPerPiece": "प्रति पीस लागत",
    "batch.items": "पीस",
    "batch.startNew": "नया बैच शुरू करें",
    "monthly.title": "यह महीना",
    "monthly.subtitle": "सिर्फ तीन नंबर — इतना काफी है।",
    "monthly.totalSales": "कुल बिक्री",
    "monthly.totalExpenses": "कुल खर्चे",
    "monthly.unitsProduced": "बनाए गए यूनिट",
    "monthly.netProfit": "इस महीने का शुद्ध मुनाफा",
    "monthly.netLoss": "इस महीने का शुद्ध नुकसान",
    "monthly.marginSuffix": "मार्जिन",
    "monthly.avgCost": "प्रति यूनिट औसत लागत",
    "monthly.breakEven": "ब्रेक-ईवन (यूनिट)",
  },

  bn: {
    "app.tagline": "আপনার পণ্যের সঠিক দাম ঠিক করার সবচেয়ে সহজ উপায়।",
    "cat.materials": "মেটেরিয়াল",
    "cat.labor": "শ্রম",
    "cat.packaging": "প্যাকেজিং",
    "cat.electricity": "বিদ্যুৎ",
    "cat.rent": "ভাড়া",
    "cat.other": "অন্যান্য",
    "cat.machines": "মেশিন",
    "tab.quickCost": "দ্রুত খরচ",
    "header.tryDemo": "ডেমো দেখুন",
    "quick.headerTitle": "আপনার খরচ",
    "quick.headerSubtitle": "শুধু বলুন কী ব্যবহার হয়েছে এবং কী কেনা হয়েছে। হিসাব আমরা করব।",
    "quick.modeSimple": "সহজ",
    "quick.modeAdvanced": "বিস্তারিত",
    "quick.productName": "পণ্যের নাম",
    "quick.unitsProduced": "কত ইউনিট তৈরি হয়েছে",
    "materials.title": "কোন কাঁচামাল ব্যবহার করেছেন?",
    "materials.addLabel": "মেটেরিয়াল যোগ করুন",
    "materials.empty": "এখনও কোনো মেটেরিয়াল যোগ করা হয়নি।",
    "materials.columnName": "মেটেরিয়াল",
    "materials.columnQty": "বাস্তবে কত ব্যবহৃত হয়েছে",
    "materials.columnUnit": "ইউনিট",
    "materials.columnPurchased": "কেনা হয়েছে",
    "materials.columnCost": "মূল্য",
    "labor.title": "এই উৎপাদনে কে কাজ করেছে?",
    "labor.addLabel": "ব্যক্তি যোগ করুন",
    "labor.empty": "উৎপাদনে যুক্ত মানুষদের যোগ করুন।",
    "labor.columnRole": "ভূমিকা",
    "labor.columnHours": "ঘণ্টা ব্যবহৃত",
    "labor.columnMonthly": "মাসিক",
    "labor.columnSalary": "বেতন",
    "electricity.title": "কত বিদ্যুৎ ব্যবহৃত হয়েছে?",
    "rent.title": "উৎপাদনের জন্য কত ভাড়া?",
    "packaging.title": "কোন প্যাকেজিং ব্যবহার করেছেন?",
    "packaging.addLabel": "প্যাকেজিং যোগ করুন",
    "other.title": "অন্য কোনো খরচ?",
    "other.addLabel": "খরচ যোগ করুন",
    "machines.title": "মেশিনের ক্ষয় অন্তর্ভুক্ত করবেন?",
    "pricing.title": "কত মুনাফা চান?",
    "pricing.modeMargin": "মার্জিন %",
    "pricing.modeMarkup": "মার্কআপ %",
    "pricing.modeTarget": "লক্ষ্য মুনাফা",
    "whatif.title": "যদি বেশি তৈরি করেন তাহলে কী হবে?",
    "whatif.now": "এখন",
    "whatif.if": "যদি",
    "whatif.columnProduction": "উৎপাদন",
    "whatif.columnCostPerUnit": "প্রতি ইউনিট খরচ",
    "whatif.columnSellAt": "বিক্রয় মূল্য",
    "whatif.columnProfit": "মুনাফা",
    "whatif.columnMargin": "মার্জিন",
    "whatif.addScenario": "পরিস্থিতি যোগ করুন",
    "summary.live": "লাইভ সারসংক্ষেপ",
    "summary.suggestedPrice": "প্রস্তাবিত বিক্রয় মূল্য",
    "summary.perUnit": "প্রতি ইউনিট",
    "summary.costPerUnit": "ইউনিট প্রতি খরচ",
    "summary.profitPerUnit": "ইউনিট প্রতি মুনাফা",
    "summary.totalProfit": "মোট মুনাফা",
    "summary.totalCost": "মোট খরচ",
    "summary.costBreakdown": "খরচের বিবরণ",
    "summary.groupDirect": "প্রত্যক্ষ খরচ",
    "summary.groupIndirect": "পরোক্ষ খরচ",
    "summary.groupOptional": "ঐচ্ছিক",
    "summary.insights": "অন্তর্দৃষ্টি",
    "summary.sellAt": "বিক্রয় মূল্য",
    "status.healthy": "ভালো মার্জিন",
    "status.low": "কম মার্জিন",
    "status.loss": "ক্ষতির ঝুঁকি",
    "actions.save": "সংরক্ষণ",
    "actions.share": "শেয়ার",
    "actions.copied": "কপি হয়েছে",
    "explainer.label": "এটি কীভাবে গণনা হলো?",
    "warning.usedExceedsPurchased": "ব্যবহৃত পরিমাণ কেনা পরিমাণের চেয়ে বেশি।",
    "ui.selectLanguage": "ভাষা",
    "ui.selectCurrency": "মুদ্রা নির্বাচন",
    "ui.searchCurrency": "মুদ্রা বা কোড অনুসন্ধান…",
    "ui.quickAdd": "দ্রুত যোগ",
    "report.titleCosting": "খরচের সারসংক্ষেপ",
    "report.titleBreakdown": "খরচের বিবরণ",
    "report.titleMaterials": "কাঁচামাল",
    "report.titleLabor": "শ্রম",
    "report.titleMachine": "মেশিন খরচ",
    "report.titleWhatIf": "যদি বেশি উৎপাদন",
    "report.totalCost": "মোট খরচ",
    "landing.badge": "ছোট ফ্যাক্টরি ও ওয়ার্কশপের জন্য",
    "landing.heroTitleA": "আপনার পণ্যের খরচ জানুন",
    "landing.heroTitleB": "মিনিটেই।",
    "landing.heroSubtitle": "ফ্যাক্টরি ও প্রস্তুতকারকদের জন্য সহজ কস্টিং ক্যালকুলেটর। যা কিনেছেন এবং ব্যবহার করেছেন তা লিখুন — হিসাব আমরা করব।",
    "landing.cta": "হিসাব শুরু করুন",
    "landing.stepExpenses": "খরচ",
    "landing.stepExpensesSub": "যা খরচ হয়",
    "landing.stepCalculate": "হিসাব",
    "landing.stepCalculateSub": "তাৎক্ষণিক",
    "landing.stepProfit": "মুনাফা",
    "landing.stepProfitSub": "যা আপনি উপার্জন করেন",
    "batch.back": "ফিরে",
    "batch.continue": "এগিয়ে",
    "batch.calculate": "হিসাব",
    "batch.q1Title": "এই ব্যাচে কতগুলো পিস?",
    "batch.q1Hint": "মোট কত পিস তৈরি করবেন।",
    "batch.q1Label": "ব্যাচে পিস",
    "batch.q2Title": "কত মেটেরিয়াল ব্যবহার হয়েছে?",
    "batch.q2Hint": "এই ব্যাচের মোট কাঁচামালের খরচ।",
    "batch.q2Label": "মেটেরিয়াল খরচ",
    "batch.q3Title": "কত শ্রম-ঘন্টা লেগেছে?",
    "batch.q3Hint": "ঘন্টা এবং প্রতি ঘন্টার রেট।",
    "batch.q3LabelHours": "ঘন্টা",
    "batch.q3LabelRate": "প্রতি ঘন্টায় রেট",
    "batch.q4Title": "অন্য কোনো খরচ?",
    "batch.q4Hint": "প্যাকেজিং, বিদ্যুৎ, পরিবহন।",
    "batch.q4LabelExtra": "অতিরিক্ত খরচ",
    "batch.q4LabelMargin": "মুনাফা মার্জিন",
    "batch.sellEachAt": "প্রতি পিস এই দামে বিক্রি করুন",
    "batch.totalCost": "ব্যাচের খরচ",
    "batch.costPerPiece": "প্রতি পিস খরচ",
    "batch.items": "পিস",
    "batch.startNew": "নতুন ব্যাচ শুরু করুন",
    "monthly.title": "এই মাস",
    "monthly.subtitle": "মাত্র তিনটি সংখ্যা — এটাই যথেষ্ট।",
    "monthly.totalSales": "মোট বিক্রি",
    "monthly.totalExpenses": "মোট খরচ",
    "monthly.unitsProduced": "তৈরি ইউনিট",
    "monthly.netProfit": "এই মাসের নিট মুনাফা",
    "monthly.netLoss": "এই মাসের নিট ক্ষতি",
    "monthly.marginSuffix": "মার্জিন",
    "monthly.avgCost": "প্রতি ইউনিট গড় খরচ",
    "monthly.breakEven": "ব্রেক-ইভেন (ইউনিট)",
  },

  ar: {
    // ── Core
    "app.name": "Costix",
    "app.tagline": "أبسط طريقة لتسعير ما تصنعه.",
    // ── Categories
    "cat.materials": "المواد",
    "cat.labor": "العمالة",
    "cat.packaging": "التغليف",
    "cat.electricity": "الكهرباء",
    "cat.rent": "الإيجار",
    "cat.other": "أخرى",
    "cat.machines": "الماكينات",
    // ── Tabs
    "tab.quickCost": "التسعير السريع",
    "tab.batch": "الدفعة",
    "tab.monthly": "الشهري",
    "tab.saved": "محفوظة",
    "sc.emptyHint": "احفظ تكلفة من التسعير السريع أو الدفعة لتظهر هنا.",
    "sc.openAt": "فتح في:",
    "sc.unit": "وحدة",
    "header.tryDemo": "جرّب العرض التوضيحي",
    // ── Quick Cost
    "quick.headerTitle": "نفقاتك",
    "quick.headerSubtitle": "أدخل ما استخدمته وما اشتريته — نحن نتولى الحساب.",
    "quick.modeSimple": "بسيط",
    "quick.modeAdvanced": "تفصيلي",
    "quick.modeSimpleHint": "المواد والعمالة والسعر فقط.",
    "quick.modeAdvancedHint": "تفصيل كامل — إيجار، كهرباء، ماكينات، توسع.",
    "quick.productName": "اسم المنتج",
    "quick.productNamePlaceholder": "مثال: قميص قطني",
    "quick.unitsProduced": "الوحدات المنتجة",
    // ── Materials
    "materials.title": "ما المواد الخام التي استخدمتها؟",
    "materials.hint": "قماش، دقيق، زيت — كل ما استخدمته",
    "materials.addLabel": "إضافة مادة",
    "materials.empty": "لم تتم إضافة أي مواد بعد.",
    "materials.columnName": "المادة",
    "materials.columnQty": "الكمية المستهلكة",
    "materials.columnUnit": "الوحدة",
    "materials.columnPurchased": "الكمية المشتراة",
    "materials.columnCost": "التكلفة",
    "materials.columnAuto": "تلقائي",
    // ── Material costing
    "mat.sourceLocal": "محلي",
    "mat.sourceImported": "مستورد",
    "mat.delivery": "توصيل",
    "mat.materialPrice": "سعر المادة",
    "mat.freight": "الشحن",
    "mat.duty": "الجمارك",
    "mat.taxes": "الضرائب",
    "mat.taxAmount": "مبلغ الضريبة",
    "mat.taxRecoverable": "يمكن استرداد الضريبة",
    "mat.taxRecoverableYes": "نعم — مستثناة",
    "mat.taxRecoverableNo": "لا — مشمولة في التكلفة",
    "mat.recoverableTaxNote": "غير مشمولة في تكلفة المنتج",
    "mat.taxInLandedCost": "الضريبة مشمولة في تكلفة المنتج",
    "mat.taxColNonRecov": "ضريبة (غير قابلة للاسترداد)",
    "mat.taxColRecov": "ضريبة (قابلة للاسترداد — مستثناة)",
    "mat.clearing": "التخليص / أخرى",
    "mat.landedCost": "التكلفة الكاملة للاستيراد",
    "mat.localHelper": "تكلفة المحلي تشمل سعر الشراء والتوصيل.",
    "mat.importedHelper": "تكلفة المستورد تشمل الشحن والجمارك والضرائب والتخليص.",
    "mat.warningImportedBlank": "اخترت مستورد لكن لم تُدخل تكاليف الاستيراد بعد.",
    "mat.warningZeroLanded": "التكلفة الكاملة صفر — أدخل سعر المادة أولاً.",
    "mat.purchaseCostTotal": "إجمالي تكلفة الشراء",
    "mat.consumed": "المستهلك",
    "mat.purchaseCost": "تكلفة الشراء",
    "mat.autoCost": "التكلفة التلقائية",
    // ── Labor
    "labor.title": "من عمل في هذا الإنتاج؟",
    "labor.hint": "الساعات المستخدمة مقابل إجمالي الساعات الشهرية",
    "labor.addLabel": "إضافة شخص",
    "labor.empty": "أضف العمالة المشاركة في الإنتاج.",
    "labor.columnRole": "الدور",
    "labor.columnHours": "الساعات المستخدمة",
    "labor.columnMonthly": "الشهري",
    "labor.columnSalary": "الراتب",
    // ── Electricity
    "electricity.title": "كم استُهلك من الكهرباء؟",
    "electricity.hint": "حصة الفاتورة",
    "electricity.unitsUsed": "الوحدات المستهلكة",
    "electricity.billUnits": "إجمالي وحدات الفاتورة",
    "electricity.billAmount": "مبلغ الفاتورة",
    "electricity.warningUnitsExceed": "الوحدات المستهلكة تتجاوز إجمالي وحدات الفاتورة.",
    // ── Rent
    "rent.title": "ما مقدار الإيجار المخصص للإنتاج؟",
    "rent.hint": "حصة المصنع فقط",
    "rent.tooltip": "إيجار المكتب والإدارة لا يدخل في تكلفة التصنيع عادةً.",
    "rent.monthlyRent": "الإيجار الشهري",
    "rent.factoryPct": "نسبة المصنع %",
    "rent.warehousePct": "نسبة المستودع %",
    "rent.officePct": "نسبة المكتب %",
    "rent.daysUsed": "الأيام المستخدمة",
    "rent.daysInMonth": "أيام الشهر",
    "rent.includeWarehouse": "تضمين المستودع",
    "rent.warningPct": "النسب لا تساوي 100%",
    // ── Packaging
    "packaging.title": "ما التغليف المستخدم؟",
    "packaging.hint": "صناديق، أكياس، ملصقات",
    "packaging.addLabel": "إضافة تغليف",
    "packaging.empty": "أضف التغليف إن وجد.",
    // ── Other
    "other.title": "أي مصاريف أخرى؟",
    "other.hint": "نقل، إصلاحات، أي شيء آخر",
    "other.addLabel": "إضافة مصروف",
    "other.columnItem": "البند",
    "other.columnCost": "التكلفة",
    // ── Machines
    "machines.title": "تضمين تآكل الماكينات؟",
    "machines.hint": "اختياري",
    "machines.description": "اختياري: تضمين تكلفة تآكل الماكينات في تسعير المنتج.",
    "machines.on": "تفعيل",
    "machines.off": "تعطيل",
    "machines.methodTime": "قائم على الوقت",
    "machines.methodProduction": "قائم على الإنتاج",
    "machines.columnMachine": "الماكينة",
    "machines.columnCost": "التكلفة",
    "machines.columnLife": "العمر (سنوات)",
    "machines.columnDaysUsed": "الأيام المستخدمة",
    "machines.columnDaysYear": "أيام / السنة",
    "machines.columnCapacity": "الطاقة الإجمالية",
    "machines.columnBatch": "وحدات الدفعة",
    "machines.columnAllocated": "المخصص",
    "machines.explainerTime": "الاستهلاك السنوي = التكلفة ÷ العمر. ثم يُوزَّع حسب الأيام المستخدمة.",
    "machines.explainerProduction": "التكلفة لكل وحدة = تكلفة الماكينة ÷ الطاقة الإجمالية. تُضرب في الوحدات المنتجة.",
    // ── Pricing
    "pricing.title": "كم ربحاً تريد؟",
    "pricing.modeMargin": "هامش %",
    "pricing.modeMarkup": "إضافة %",
    "pricing.modeTarget": "ربح مستهدف",
    "pricing.marginField": "الهامش المطلوب (الربح كنسبة من السعر)",
    "pricing.markupField": "الإضافة المطلوبة (الربح كنسبة من التكلفة)",
    "pricing.targetField": "الربح المستهدف لكل وحدة",
    "pricing.marginHint": "الهامش: الربح كحصة من سعر البيع. هامش 30% = 30 ربح على مبيعات 100.",
    "pricing.markupHint": "الإضافة: الربح كحصة من التكلفة. إضافة 40% على تكلفة 100 = سعر بيع 140.",
    "pricing.targetHint": "حدد ربحاً ثابتاً لكل وحدة. السعر = تكلفة الوحدة + ربحك المستهدف.",
    // ── What-if
    "whatif.title": "ماذا لو أنتجت أكثر؟",
    "whatif.hint": "اكتشف كيف تنخفض تكلفة الوحدة مع الحجم",
    "whatif.empty": "أدخل تكاليفك ووحداتك أولاً لمحاكاة إنتاج أكبر.",
    "whatif.intro": "التكاليف الثابتة (إيجار، كهرباء، عمالة، ماكينات) تبقى ثابتة. التكاليف المتغيرة (مواد، تغليف) تزيد مع الإنتاج.",
    "whatif.columnProduction": "الإنتاج",
    "whatif.columnCostPerUnit": "التكلفة / وحدة",
    "whatif.columnSellAt": "سعر البيع",
    "whatif.columnProfit": "الربح",
    "whatif.columnMargin": "الهامش",
    "whatif.now": "الآن",
    "whatif.if": "لو",
    "whatif.unitsLabel": "وحدة",
    "whatif.addScenario": "إضافة سيناريو",
    "whatif.whyTitle": "لماذا يهم ذلك:",
    "whatif.whyBody": "تكاليفك الثابتة البالغة {amount} توزَّع على كل وحدة تنتجها. كلما أنتجت أكثر، انخفضت حصة كل وحدة من التكلفة الثابتة — هذا هو اقتصاد الحجم.",
    // ── Summary
    "summary.live": "ملخص مباشر",
    "summary.suggestedPrice": "سعر البيع المقترح",
    "summary.perUnit": "لكل وحدة",
    "summary.margin": "هامش",
    "summary.costPerUnit": "التكلفة / وحدة",
    "summary.profitPerUnit": "الربح / وحدة",
    "summary.totalProfit": "إجمالي الربح",
    "summary.totalCost": "إجمالي التكلفة",
    "summary.costBreakdown": "تفصيل التكلفة",
    "summary.groupCosts": "التكاليف",
    "summary.groupDirect": "التكاليف المباشرة",
    "summary.groupIndirect": "التكاليف غير المباشرة",
    "summary.groupOptional": "اختيارية",
    "summary.insights": "ملاحظات",
    "summary.savedSnapshots": "اللقطات المحفوظة",
    "summary.sellAt": "بيع بـ",
    "summary.enterData": "أدخل البيانات",
    // ── Status
    "status.healthy": "هامش جيد",
    "status.low": "هامش منخفض",
    "status.loss": "خطر خسارة",
    // ── Actions
    "actions.save": "حفظ",
    "actions.pdf": "PDF",
    "actions.excel": "Excel",
    "actions.share": "مشاركة",
    "actions.copied": "تم النسخ",
    // ── Misc UI
    "explainer.label": "كيف تم الحساب؟",
    "warning.usedExceedsPurchased": "الكمية المستخدمة تتجاوز الكمية المشتراة.",
    "warning.unitMismatch": "وحدات غير متوافقة",
    "warning.rowsHaveWarnings": "بعض الصفوف تحتوي على تحذيرات",
    "row.incomplete": "غير مكتمل · غير محسوب",
    // ── Insights
    "insight.lossSelling": "تبيع بأقل من التكلفة — كل وحدة تخسر مالاً.",
    "insight.marginLow": "الهامش {margin}% — أقل من النطاق الموصى به للتصنيع.",
    "insight.marginHealthy": "هامش {margin}% ممتاز — مريح للخصومات والمفاجآت.",
    "insight.biggestLever": "تكلفة {name} تمثل {pct}% من الإجمالي — أكبر رافعة لديك.",
    "insight.largestCost": "{name} أكبر تكلفة بنسبة {pct}%.",
    "insight.laborHigh": "تكلفة العمالة مرتفعة — راجع الساعات المستخدمة مقابل الطاقة الشهرية.",
    "insight.electricityMinimal": "تأثير الكهرباء هنا ضئيل.",
    "insight.packagingHigh": "التغليف يأكل من الربح. فكر في الشراء بالجملة أو البدائل.",
    // ── UI
    "ui.quickAdd": "إضافة سريعة",
    "ui.selectCurrency": "اختر العملة",
    "ui.selectLanguage": "اللغة",
    "ui.searchCurrency": "ابحث عن عملة أو رمز…",
    "ui.noCurrencyMatch": "لا توجد عملة مطابقة",
    "ui.enterUnitsHint": "أدخل الوحدات المنتجة للحساب",
    // ── Currency warning
    "currency.warnTitle": "العملة لم تُحوَّل",
    "currency.warnBody": "تغيير العملة يغير الرمز فقط — المبالغ الموجودة لا تُحوَّل. ستُعامَل أرقامك بالعملة الجديدة.",
    "currency.warnSwitch": "تغيير على أي حال",
    "currency.warnCancel": "الإبقاء على الحالية",
    // ── Mobile
    "mobile.sellAt": "سعر البيع",
    // ── Reports
    "report.brand": "Costix · تقرير تسعير المنتج",
    "report.titleCosting": "ملخص التكلفة",
    "report.titleBreakdown": "تفصيل التكلفة",
    "report.titleMaterials": "المواد الخام",
    "report.titleLabor": "العمالة",
    "report.titleMachine": "تكلفة الماكينات",
    "report.titleWhatIf": "تحليل الإنتاج الافتراضي",
    "report.metric": "المؤشر",
    "report.value": "القيمة",
    "report.category": "الفئة",
    "report.group": "المجموعة",
    "report.amount": "المبلغ",
    "report.shareOfTotal": "نسبة من الإجمالي",
    "report.totalCost": "إجمالي التكلفة",
    "report.totalMaterials": "إجمالي المواد",
    "report.totalLabor": "إجمالي العمالة",
    "report.totalMachineCost": "إجمالي تكلفة الماكينات",
    "report.note": "ملاحظة: التكاليف الثابتة البالغة {amount} توزَّع على كل وحدة منتجة.",
    "report.scaleNote": "كلما زاد حجم الإنتاج، انخفضت حصة كل وحدة من التكلفة الثابتة.",
    "report.footer": "أُنشئ بواسطة Costix",
    // ── Landing
    "landing.heroTitle": "اعرف تكلفتك الحقيقية.",
    "landing.heroSubtitle": "أذكى من الجداول. أبسط من أنظمة ERP. أخبرنا بما اشتريت واستخدمت — Costix يتولى الباقي.",
    "landing.cta": "ابدأ الحساب",
    "landing.badge": "تسعير حديث للتصنيع الحديث",
    "landing.heroTitleA": "اعرف تكلفتك الحقيقية.",
    "landing.heroTitleB": "في دقائق.",
    "landing.stepExpenses": "المصاريف",
    "landing.stepExpensesSub": "ما تنفقه",
    "landing.stepCalculate": "احسب",
    "landing.stepCalculateSub": "حساب فوري",
    "landing.stepProfit": "الربح",
    "landing.stepProfitSub": "ما تكسبه",
    // ── Batch (legacy quick-wizard keys)
    "batch.stepLabel": "خطوة",
    "batch.stepOf": "من",
    "batch.resultLabel": "النتيجة",
    "batch.back": "رجوع",
    "batch.continue": "متابعة",
    "batch.calculate": "احسب",
    "batch.q1Title": "كم قطعة في هذه الدفعة؟",
    "batch.q1Hint": "إجمالي القطع التي ستُنتجها.",
    "batch.q1Label": "قطع الدفعة",
    "batch.q2Title": "كم من المواد استُخدم؟",
    "batch.q2Hint": "إجمالي تكلفة المواد الخام للدفعة.",
    "batch.q2Label": "تكلفة المواد",
    "batch.q3Title": "كم ساعة عمل؟",
    "batch.q3Hint": "الساعات والأجرة بالساعة.",
    "batch.q3LabelHours": "الساعات",
    "batch.q3LabelRate": "الأجرة / ساعة",
    "batch.q4Title": "أي مصاريف إضافية؟",
    "batch.q4Hint": "التغليف، الكهرباء، النقل.",
    "batch.q4LabelExtra": "مصاريف إضافية",
    "batch.q4LabelMargin": "هامش الربح",
    "batch.sellEachAt": "بيع كل قطعة بـ",
    "batch.totalCost": "تكلفة الدفعة",
    "batch.costPerPiece": "تكلفة القطعة",
    "batch.items": "قطع",
    "batch.startNew": "بدء دفعة جديدة",
    // ── Batch wizard (8-step)
    "batchwiz.step1Title": "أخبرنا عن هذا الإنتاج",
    "batchwiz.step1Hint": "الأساسيات فقط — الاسم وعدد الوحدات.",
    "batchwiz.step2Title": "ما المواد الخام التي استخدمتها؟",
    "batchwiz.step2Hint": "أضف ما استهلكته. سنحسب التكلفة.",
    "batchwiz.step3Title": "من عمل في هذا الإنتاج؟",
    "batchwiz.step3Hint": "أضف ساعات العمل. الرواتب تكمل الحساب.",
    "batchwiz.step4Title": "الكهرباء والإيجار",
    "batchwiz.step4Hint": "اختياري. تجاهل إن لم يكن مناسباً لهذه الدفعة.",
    "batchwiz.step5Title": "ما التغليف المستخدم؟",
    "batchwiz.step5Hint": "صناديق، أكياس، ملصقات — نفس المنطق.",
    "batchwiz.step6Title": "تضمين تآكل الماكينات؟",
    "batchwiz.step6Hint": "اختياري. قائم على الوقت أو الإنتاج.",
    "batchwiz.step7Title": "كم ربحاً تريد؟",
    "batchwiz.step7Hint": "اختر هامشاً أو إضافة أو ربحاً ثابتاً لكل وحدة.",
    "batchwiz.step8Title": "تم تسعير دفعتك",
    "batchwiz.step8Hint": "إليك كل شيء محسوباً تلقائياً.",
    "batchwiz.miniLabel": "مباشر",
    "batchwiz.skipStep": "تخطي هذه الخطوة",
    "batchwiz.openInQuickCost": "فتح في التسعير السريع",
    "batchwiz.print": "طباعة / حفظ PDF",
    "batchwiz.startOver": "بدء دفعة جديدة",
    "batchwiz.save": "حفظ التكلفة",
    "batchwiz.snapshotName": "اسم التكلفة",
    "batchwiz.snapshotNamePlaceholder": "مثال: تشغيلة يونيو",
    "batchwiz.confirmClear": "بدء دفعة جديدة؟ سيُمسح التقدم الحالي غير المحفوظ.",
    "batchwiz.confirmClearYes": "نعم، ابدأ من جديد",
    "batchwiz.confirmClearNo": "استمر في العمل",
    "batchwiz.electricity": "الكهرباء",
    "batchwiz.rent": "الإيجار",
    // ── Templates
    "tpl.button": "التكاليف المحفوظة",
    "tpl.save": "حفظ التكلفة",
    "tpl.saveNew": "حفظ كسجل جديد",
    "tpl.update": "تحديث هذا السجل",
    "tpl.duplicate": "تكرار",
    "tpl.load": "فتح تكلفة محفوظة",
    "tpl.loadEmpty": "لا توجد تكاليف محفوظة بعد. احفظ هذه التكلفة لإعادة فتحها لاحقاً.",
    "tpl.searchPlaceholder": "ابحث في التكاليف المحفوظة…",
    "tpl.nameLabel": "اسم التكلفة",
    "tpl.namePlaceholder": "مثال: قميص قطني — يونيو 2025",
    "tpl.modalSaveTitle": "حفظ هذه التكلفة",
    "tpl.modalSaveHint": "يحفظ سجلاً دائماً يمكنك إعادة فتحه وتعديل الأسعار أو تكراره عند تغير التكاليف.",
    "tpl.modalLoadTitle": "التكاليف المحفوظة",
    "tpl.modalLoadHint": "اختر تكلفة لإعادة فتحها أو إنشاء نسخة منها.",
    "tpl.chooseTitle": "كيف تريد فتح هذا السجل؟",
    "tpl.chooseEdit": "فتح الأصل",
    "tpl.chooseEditHint": "استمر في تعديل هذا السجل. التغييرات تحدّث السجل المحفوظ.",
    "tpl.choosePrefill": "تكرار وتعديل",
    "tpl.choosePrefillHint": "إنشاء تكلفة جديدة من هذا السجل. الأصل يبقى كما هو.",
    "tpl.cancel": "إلغاء",
    "tpl.confirm": "تأكيد",
    "tpl.delete": "حذف",
    "tpl.deleteConfirm": "حذف هذا السجل المحفوظ؟",
    "tpl.banner.editing": "تعديل سجل التكلفة المحفوظ",
    "tpl.banner.prefilled": "نسخة من سجل محفوظ",
    "tpl.banner.exit": "مسح",
    "tpl.savedJustNow": "تم الحفظ",
    "tpl.updated": "تم التحديث",
    "tpl.duplicated": "تم التكرار",
    // ── Monthly
    "monthly.title": "هذا الشهر",
    "monthly.subtitle": "ثلاثة أرقام فقط — هذا كل ما نحتاجه.",
    "monthly.totalSales": "إجمالي المبيعات",
    "monthly.totalExpenses": "إجمالي المصاريف",
    "monthly.unitsProduced": "الوحدات المنتجة",
    "monthly.netProfit": "صافي الربح هذا الشهر",
    "monthly.netLoss": "صافي الخسارة هذا الشهر",
    "monthly.marginSuffix": "هامش",
    "monthly.avgCost": "متوسط التكلفة لكل وحدة",
    "monthly.breakEven": "نقطة التعادل (وحدات)",
  },

  zh: {
    "app.tagline": "为您的产品定价的最简单方式。",
    "cat.materials": "材料",
    "cat.labor": "人工",
    "cat.packaging": "包装",
    "cat.electricity": "电力",
    "cat.rent": "租金",
    "cat.other": "其他",
    "cat.machines": "机器",
    "tab.quickCost": "快速成本",
    "header.tryDemo": "试用演示",
    "quick.headerTitle": "您的支出",
    "quick.headerSubtitle": "只需告诉我们用了什么、买了什么。计算交给我们。",
    "quick.modeSimple": "简单",
    "quick.modeAdvanced": "详细",
    "quick.productName": "产品名称",
    "quick.unitsProduced": "生产数量",
    "materials.title": "您使用了哪些原材料?",
    "materials.addLabel": "添加材料",
    "materials.empty": "尚未添加任何材料。",
    "materials.columnName": "材料",
    "materials.columnQty": "实际消耗量",
    "materials.columnUnit": "单位",
    "materials.columnPurchased": "购买量",
    "materials.columnCost": "成本",
    "labor.title": "谁参与了这次生产?",
    "labor.addLabel": "添加人员",
    "labor.empty": "添加参与此生产的人员。",
    "labor.columnRole": "角色",
    "labor.columnHours": "使用小时",
    "labor.columnMonthly": "月度",
    "labor.columnSalary": "工资",
    "electricity.title": "用了多少电?",
    "rent.title": "生产需要多少租金?",
    "rent.monthlyRent": "月租",
    "packaging.title": "使用了什么包装?",
    "packaging.addLabel": "添加包装",
    "other.title": "其他费用?",
    "other.addLabel": "添加费用",
    "machines.title": "包含机器损耗吗?",
    "pricing.title": "想要多少利润?",
    "pricing.modeMargin": "毛利率 %",
    "pricing.modeMarkup": "加价率 %",
    "pricing.modeTarget": "目标利润",
    "whatif.title": "如果生产更多会怎样?",
    "whatif.now": "现在",
    "whatif.if": "如果",
    "whatif.columnProduction": "产量",
    "whatif.columnCostPerUnit": "单位成本",
    "whatif.columnSellAt": "售价",
    "whatif.columnProfit": "利润",
    "whatif.columnMargin": "毛利率",
    "whatif.addScenario": "添加场景",
    "summary.live": "实时概要",
    "summary.suggestedPrice": "建议售价",
    "summary.perUnit": "每单位",
    "summary.costPerUnit": "单位成本",
    "summary.profitPerUnit": "单位利润",
    "summary.totalProfit": "总利润",
    "summary.totalCost": "总成本",
    "summary.costBreakdown": "成本明细",
    "summary.groupDirect": "直接成本",
    "summary.groupIndirect": "间接成本",
    "summary.groupOptional": "可选",
    "summary.insights": "洞察",
    "summary.sellAt": "售价为",
    "status.healthy": "毛利率良好",
    "status.low": "毛利率偏低",
    "status.loss": "亏损风险",
    "actions.save": "保存",
    "actions.share": "分享",
    "actions.copied": "已复制",
    "explainer.label": "这是怎么算的?",
    "warning.usedExceedsPurchased": "使用量超过了购买量。",
    "ui.selectLanguage": "语言",
    "ui.selectCurrency": "选择货币",
    "ui.searchCurrency": "搜索货币或代码…",
    "ui.quickAdd": "快速添加",
    "report.titleCosting": "成本摘要",
    "report.titleBreakdown": "成本明细",
    "report.titleMaterials": "原材料",
    "report.titleLabor": "人工",
    "report.titleMachine": "机器成本",
    "report.titleWhatIf": "如果生产更多",
    "report.totalCost": "总成本",
    "landing.badge": "为小型工厂和车间打造",
    "landing.heroTitleA": "了解产品成本",
    "landing.heroTitleB": "几分钟搞定。",
    "landing.heroSubtitle": "为工厂和制造商打造的简单成本计算器。输入您购买和使用的内容 — 计算我们来做。",
    "landing.cta": "开始计算",
    "landing.stepExpenses": "支出",
    "landing.stepExpensesSub": "您花了什么",
    "landing.stepCalculate": "计算",
    "landing.stepCalculateSub": "即时运算",
    "landing.stepProfit": "利润",
    "landing.stepProfitSub": "您赚了什么",
    "batch.back": "返回",
    "batch.continue": "继续",
    "batch.calculate": "计算",
    "batch.q1Title": "这批多少件?",
    "batch.q1Hint": "您要生产的总件数。",
    "batch.q1Label": "批次件数",
    "batch.q2Title": "用了多少材料?",
    "batch.q2Hint": "此批次的原材料总成本。",
    "batch.q2Label": "材料成本",
    "batch.q3Title": "用了多少工时?",
    "batch.q3Hint": "工时和每小时费率。",
    "batch.q3LabelHours": "小时",
    "batch.q3LabelRate": "每小时费率",
    "batch.q4Title": "其他开支?",
    "batch.q4Hint": "包装、电费、运输。",
    "batch.q4LabelExtra": "额外开支",
    "batch.q4LabelMargin": "利润率",
    "batch.sellEachAt": "每件售价",
    "batch.totalCost": "批次成本",
    "batch.costPerPiece": "每件成本",
    "batch.items": "件数",
    "batch.startNew": "开始新批次",
    "monthly.title": "本月",
    "monthly.subtitle": "三个数字 — 够了。",
    "monthly.totalSales": "总销售额",
    "monthly.totalExpenses": "总支出",
    "monthly.unitsProduced": "生产数量",
    "monthly.netProfit": "本月净利润",
    "monthly.netLoss": "本月净亏损",
    "monthly.marginSuffix": "毛利率",
    "monthly.avgCost": "单位平均成本",
    "monthly.breakEven": "盈亏平衡点 (件)",
  },

  es: {
    "app.tagline": "La forma más simple de poner precio a lo que fabricas.",
    "cat.materials": "Materiales",
    "cat.labor": "Mano de obra",
    "cat.packaging": "Embalaje",
    "cat.electricity": "Electricidad",
    "cat.rent": "Alquiler",
    "cat.other": "Otros",
    "cat.machines": "Máquinas",
    "tab.quickCost": "Costo Rápido",
    "header.tryDemo": "Probar demo",
    "quick.headerTitle": "Tus gastos",
    "quick.headerSubtitle": "Solo ingresa qué usaste y qué compraste. Nosotros calculamos.",
    "quick.modeSimple": "Simple",
    "quick.modeAdvanced": "Avanzado",
    "quick.productName": "Nombre del producto",
    "quick.unitsProduced": "Unidades producidas",
    "materials.title": "¿Qué materias primas usaste?",
    "materials.addLabel": "Agregar material",
    "materials.empty": "Aún no hay materiales agregados.",
    "materials.columnName": "Material",
    "materials.columnQty": "Cantidad consumida",
    "materials.columnUnit": "Unidad",
    "materials.columnPurchased": "Comprado",
    "materials.columnCost": "Costo",
    "labor.title": "¿Quién trabajó en esta producción?",
    "labor.addLabel": "Agregar persona",
    "labor.empty": "Agrega la mano de obra involucrada.",
    "labor.columnRole": "Rol",
    "labor.columnHours": "Horas usadas",
    "labor.columnMonthly": "Mensual",
    "labor.columnSalary": "Salario",
    "electricity.title": "¿Cuánta electricidad se usó?",
    "rent.title": "¿Cuánto alquiler corresponde a producción?",
    "rent.monthlyRent": "Alquiler mensual",
    "packaging.title": "¿Qué embalaje se usó?",
    "packaging.addLabel": "Agregar embalaje",
    "other.title": "¿Otros gastos?",
    "other.addLabel": "Agregar gasto",
    "machines.title": "¿Incluir desgaste de máquinas?",
    "pricing.title": "¿Cuánto beneficio quieres?",
    "pricing.modeMargin": "Margen %",
    "pricing.modeMarkup": "Recargo %",
    "pricing.modeTarget": "Beneficio objetivo",
    "whatif.title": "¿Qué pasa si produces más?",
    "whatif.now": "Ahora",
    "whatif.if": "Si",
    "whatif.columnProduction": "Producción",
    "whatif.columnCostPerUnit": "Costo / unidad",
    "whatif.columnSellAt": "Vender a",
    "whatif.columnProfit": "Ganancia",
    "whatif.columnMargin": "Margen",
    "whatif.addScenario": "Agregar escenario",
    "summary.live": "Resumen en vivo",
    "summary.suggestedPrice": "Precio de venta sugerido",
    "summary.perUnit": "por unidad",
    "summary.costPerUnit": "Costo / unidad",
    "summary.profitPerUnit": "Ganancia / unidad",
    "summary.totalProfit": "Ganancia total",
    "summary.totalCost": "Costo total",
    "summary.costBreakdown": "Desglose de costos",
    "summary.groupDirect": "Costos directos",
    "summary.groupIndirect": "Costos indirectos",
    "summary.groupOptional": "Opcional",
    "summary.insights": "Información",
    "summary.sellAt": "Vender a",
    "status.healthy": "Margen saludable",
    "status.low": "Margen bajo",
    "status.loss": "Riesgo de pérdida",
    "actions.save": "Guardar",
    "actions.share": "Compartir",
    "actions.copied": "Copiado",
    "explainer.label": "¿Cómo se calculó esto?",
    "warning.usedExceedsPurchased": "La cantidad usada excede la comprada.",
    "ui.selectLanguage": "Idioma",
    "ui.selectCurrency": "Seleccionar moneda",
    "ui.searchCurrency": "Buscar moneda o código…",
    "ui.quickAdd": "Añadir rápido",
    "report.titleCosting": "Resumen de costos",
    "report.titleBreakdown": "Desglose de costos",
    "report.titleMaterials": "Materias primas",
    "report.titleLabor": "Mano de obra",
    "report.titleMachine": "Costo de máquina",
    "report.titleWhatIf": "Análisis de escala",
    "report.totalCost": "Costo total",
    "landing.badge": "Hecho para pequeñas fábricas y talleres",
    "landing.heroTitleA": "Conoce el costo de tu producto",
    "landing.heroTitleB": "en minutos.",
    "landing.heroSubtitle": "Una calculadora de costos simple para fábricas y fabricantes. Ingresa lo que compraste y usaste — nosotros calculamos.",
    "landing.cta": "Empezar a calcular",
    "landing.stepExpenses": "Gastos",
    "landing.stepExpensesSub": "lo que gastas",
    "landing.stepCalculate": "Calcular",
    "landing.stepCalculateSub": "cálculo instantáneo",
    "landing.stepProfit": "Ganancia",
    "landing.stepProfitSub": "lo que ganas",
    "batch.back": "Atrás",
    "batch.continue": "Continuar",
    "batch.calculate": "Calcular",
    "batch.q1Title": "¿Cuántas piezas en este lote?",
    "batch.q1Hint": "Total de piezas a producir.",
    "batch.q1Label": "Piezas en el lote",
    "batch.q2Title": "¿Cuánto material se usó?",
    "batch.q2Hint": "Costo total de materia prima del lote.",
    "batch.q2Label": "Costo del material",
    "batch.q3Title": "¿Cuántas horas de mano de obra?",
    "batch.q3Hint": "Horas y tarifa por hora.",
    "batch.q3LabelHours": "Horas",
    "batch.q3LabelRate": "Tarifa por hora",
    "batch.q4Title": "¿Otros gastos?",
    "batch.q4Hint": "Embalaje, electricidad, transporte.",
    "batch.q4LabelExtra": "Gastos adicionales",
    "batch.q4LabelMargin": "Margen de ganancia",
    "batch.sellEachAt": "Vender cada pieza a",
    "batch.totalCost": "Costo del lote",
    "batch.costPerPiece": "Costo por pieza",
    "batch.items": "Piezas",
    "batch.startNew": "Empezar un nuevo lote",
    "monthly.title": "Este mes",
    "monthly.subtitle": "Tres números — eso es todo.",
    "monthly.totalSales": "Ventas totales",
    "monthly.totalExpenses": "Gastos totales",
    "monthly.unitsProduced": "Unidades producidas",
    "monthly.netProfit": "Ganancia neta del mes",
    "monthly.netLoss": "Pérdida neta del mes",
    "monthly.marginSuffix": "margen",
    "monthly.avgCost": "Costo promedio por unidad",
    "monthly.breakEven": "Punto de equilibrio (unidades)",
  },

  fr: {
    "app.tagline": "La façon la plus simple de fixer le prix de ce que vous fabriquez.",
    "cat.materials": "Matières",
    "cat.labor": "Main-d'œuvre",
    "cat.packaging": "Emballage",
    "cat.electricity": "Électricité",
    "cat.rent": "Loyer",
    "cat.other": "Autres",
    "cat.machines": "Machines",
    "tab.quickCost": "Coût Rapide",
    "header.tryDemo": "Essayer la démo",
    "quick.headerTitle": "Vos dépenses",
    "quick.headerSubtitle": "Indiquez ce que vous avez utilisé et acheté. Nous calculons.",
    "quick.modeSimple": "Simple",
    "quick.modeAdvanced": "Avancé",
    "quick.productName": "Nom du produit",
    "quick.unitsProduced": "Unités produites",
    "materials.title": "Quelles matières premières avez-vous utilisées ?",
    "materials.addLabel": "Ajouter matière",
    "materials.empty": "Aucune matière ajoutée pour l'instant.",
    "materials.columnName": "Matière",
    "materials.columnQty": "Quantité consommée",
    "materials.columnUnit": "Unité",
    "materials.columnPurchased": "Acheté",
    "materials.columnCost": "Coût",
    "labor.title": "Qui a travaillé sur cette production ?",
    "labor.addLabel": "Ajouter personne",
    "labor.empty": "Ajoutez la main-d'œuvre impliquée.",
    "labor.columnRole": "Rôle",
    "labor.columnHours": "Heures utilisées",
    "labor.columnMonthly": "Mensuel",
    "labor.columnSalary": "Salaire",
    "electricity.title": "Combien d'électricité a été utilisée ?",
    "rent.title": "Quelle part de loyer pour la production ?",
    "rent.monthlyRent": "Loyer mensuel",
    "packaging.title": "Quel emballage a été utilisé ?",
    "packaging.addLabel": "Ajouter emballage",
    "other.title": "Autres dépenses ?",
    "other.addLabel": "Ajouter dépense",
    "machines.title": "Inclure l'usure des machines ?",
    "pricing.title": "Quel bénéfice voulez-vous ?",
    "pricing.modeMargin": "Marge %",
    "pricing.modeMarkup": "Majoration %",
    "pricing.modeTarget": "Bénéfice cible",
    "whatif.title": "Et si vous produisiez plus ?",
    "whatif.now": "Maintenant",
    "whatif.if": "Si",
    "whatif.columnProduction": "Production",
    "whatif.columnCostPerUnit": "Coût / unité",
    "whatif.columnSellAt": "Vendre à",
    "whatif.columnProfit": "Bénéfice",
    "whatif.columnMargin": "Marge",
    "whatif.addScenario": "Ajouter scénario",
    "summary.live": "Résumé en direct",
    "summary.suggestedPrice": "Prix de vente suggéré",
    "summary.perUnit": "par unité",
    "summary.costPerUnit": "Coût / unité",
    "summary.profitPerUnit": "Bénéfice / unité",
    "summary.totalProfit": "Bénéfice total",
    "summary.totalCost": "Coût total",
    "summary.costBreakdown": "Détail des coûts",
    "summary.groupDirect": "Coûts directs",
    "summary.groupIndirect": "Coûts indirects",
    "summary.groupOptional": "Optionnel",
    "summary.insights": "Aperçus",
    "summary.sellAt": "Vendre à",
    "status.healthy": "Marge saine",
    "status.low": "Marge faible",
    "status.loss": "Risque de perte",
    "actions.save": "Enregistrer",
    "actions.share": "Partager",
    "actions.copied": "Copié",
    "explainer.label": "Comment cela a-t-il été calculé ?",
    "warning.usedExceedsPurchased": "La quantité utilisée dépasse celle achetée.",
    "ui.selectLanguage": "Langue",
    "ui.selectCurrency": "Choisir la devise",
    "ui.searchCurrency": "Rechercher devise ou code…",
    "ui.quickAdd": "Ajout rapide",
    "report.titleCosting": "Résumé des coûts",
    "report.titleBreakdown": "Détail des coûts",
    "report.titleMaterials": "Matières premières",
    "report.titleLabor": "Main-d'œuvre",
    "report.titleMachine": "Coût machine",
    "report.titleWhatIf": "Analyse d'échelle",
    "report.totalCost": "Coût total",
    "landing.badge": "Conçu pour les petites usines et ateliers",
    "landing.heroTitleA": "Connaissez le coût de votre produit",
    "landing.heroTitleB": "en quelques minutes.",
    "landing.heroSubtitle": "Un calculateur de coûts simple pour usines et fabricants. Saisissez ce que vous avez acheté et utilisé — nous calculons.",
    "landing.cta": "Commencer à calculer",
    "landing.stepExpenses": "Dépenses",
    "landing.stepExpensesSub": "ce que vous dépensez",
    "landing.stepCalculate": "Calculer",
    "landing.stepCalculateSub": "calcul instantané",
    "landing.stepProfit": "Bénéfice",
    "landing.stepProfitSub": "ce que vous gagnez",
    "batch.back": "Retour",
    "batch.continue": "Continuer",
    "batch.calculate": "Calculer",
    "batch.q1Title": "Combien d'articles dans ce lot ?",
    "batch.q1Hint": "Nombre total de pièces à produire.",
    "batch.q1Label": "Pièces dans le lot",
    "batch.q2Title": "Combien de matière a été utilisée ?",
    "batch.q2Hint": "Coût total des matières premières du lot.",
    "batch.q2Label": "Coût des matières",
    "batch.q3Title": "Combien d'heures de main-d'œuvre ?",
    "batch.q3Hint": "Heures et tarif horaire.",
    "batch.q3LabelHours": "Heures",
    "batch.q3LabelRate": "Tarif horaire",
    "batch.q4Title": "Autres dépenses ?",
    "batch.q4Hint": "Emballage, électricité, transport.",
    "batch.q4LabelExtra": "Dépenses supplémentaires",
    "batch.q4LabelMargin": "Marge bénéficiaire",
    "batch.sellEachAt": "Vendre chaque pièce à",
    "batch.totalCost": "Coût du lot",
    "batch.costPerPiece": "Coût par pièce",
    "batch.items": "Pièces",
    "batch.startNew": "Commencer un nouveau lot",
    "monthly.title": "Ce mois-ci",
    "monthly.subtitle": "Trois chiffres — c'est tout.",
    "monthly.totalSales": "Ventes totales",
    "monthly.totalExpenses": "Dépenses totales",
    "monthly.unitsProduced": "Unités produites",
    "monthly.netProfit": "Bénéfice net du mois",
    "monthly.netLoss": "Perte nette du mois",
    "monthly.marginSuffix": "marge",
    "monthly.avgCost": "Coût moyen par unité",
    "monthly.breakEven": "Seuil de rentabilité (unités)",
  },

  pt: {
    "app.tagline": "A maneira mais simples de precificar o que você fabrica.",
    "cat.materials": "Materiais",
    "cat.labor": "Mão de obra",
    "cat.packaging": "Embalagem",
    "cat.electricity": "Eletricidade",
    "cat.rent": "Aluguel",
    "cat.other": "Outros",
    "cat.machines": "Máquinas",
    "tab.quickCost": "Custo Rápido",
    "header.tryDemo": "Experimentar demo",
    "quick.headerTitle": "Suas despesas",
    "quick.headerSubtitle": "Apenas informe o que usou e comprou. Nós calculamos.",
    "quick.modeSimple": "Simples",
    "quick.modeAdvanced": "Avançado",
    "quick.productName": "Nome do produto",
    "quick.unitsProduced": "Unidades produzidas",
    "materials.title": "Que matérias-primas você usou?",
    "materials.addLabel": "Adicionar material",
    "materials.empty": "Nenhum material adicionado ainda.",
    "materials.columnName": "Material",
    "materials.columnQty": "Quantidade consumida",
    "materials.columnUnit": "Unidade",
    "materials.columnPurchased": "Comprado",
    "materials.columnCost": "Custo",
    "labor.title": "Quem trabalhou nesta produção?",
    "labor.addLabel": "Adicionar pessoa",
    "labor.empty": "Adicione a mão de obra envolvida.",
    "labor.columnRole": "Função",
    "labor.columnHours": "Horas usadas",
    "labor.columnMonthly": "Mensal",
    "labor.columnSalary": "Salário",
    "electricity.title": "Quanta eletricidade foi usada?",
    "rent.title": "Quanto aluguel se aplica à produção?",
    "rent.monthlyRent": "Aluguel mensal",
    "packaging.title": "Que embalagem foi usada?",
    "packaging.addLabel": "Adicionar embalagem",
    "other.title": "Outras despesas?",
    "other.addLabel": "Adicionar despesa",
    "machines.title": "Incluir desgaste de máquinas?",
    "pricing.title": "Quanto lucro você quer?",
    "pricing.modeMargin": "Margem %",
    "pricing.modeMarkup": "Markup %",
    "pricing.modeTarget": "Lucro alvo",
    "whatif.title": "E se você produzir mais?",
    "whatif.now": "Agora",
    "whatif.if": "Se",
    "whatif.columnProduction": "Produção",
    "whatif.columnCostPerUnit": "Custo / unidade",
    "whatif.columnSellAt": "Vender a",
    "whatif.columnProfit": "Lucro",
    "whatif.columnMargin": "Margem",
    "whatif.addScenario": "Adicionar cenário",
    "summary.live": "Resumo ao vivo",
    "summary.suggestedPrice": "Preço de venda sugerido",
    "summary.perUnit": "por unidade",
    "summary.costPerUnit": "Custo / unidade",
    "summary.profitPerUnit": "Lucro / unidade",
    "summary.totalProfit": "Lucro total",
    "summary.totalCost": "Custo total",
    "summary.costBreakdown": "Detalhamento de custos",
    "summary.groupDirect": "Custos diretos",
    "summary.groupIndirect": "Custos indiretos",
    "summary.groupOptional": "Opcional",
    "summary.insights": "Insights",
    "summary.sellAt": "Vender a",
    "status.healthy": "Margem saudável",
    "status.low": "Margem baixa",
    "status.loss": "Risco de prejuízo",
    "actions.save": "Salvar",
    "actions.share": "Compartilhar",
    "actions.copied": "Copiado",
    "explainer.label": "Como isto foi calculado?",
    "warning.usedExceedsPurchased": "A quantidade usada excede a comprada.",
    "ui.selectLanguage": "Idioma",
    "ui.selectCurrency": "Selecionar moeda",
    "ui.searchCurrency": "Buscar moeda ou código…",
    "ui.quickAdd": "Adicionar rápido",
    "report.titleCosting": "Resumo de custos",
    "report.titleBreakdown": "Detalhamento de custos",
    "report.titleMaterials": "Matérias-primas",
    "report.titleLabor": "Mão de obra",
    "report.titleMachine": "Custo de máquina",
    "report.titleWhatIf": "Análise de escala",
    "report.totalCost": "Custo total",
    "landing.badge": "Feito para pequenas fábricas e oficinas",
    "landing.heroTitleA": "Conheça o custo do seu produto",
    "landing.heroTitleB": "em minutos.",
    "landing.heroSubtitle": "Uma calculadora de custos simples para fábricas e fabricantes. Informe o que comprou e usou — nós calculamos.",
    "landing.cta": "Começar a calcular",
    "landing.stepExpenses": "Despesas",
    "landing.stepExpensesSub": "o que você gasta",
    "landing.stepCalculate": "Calcular",
    "landing.stepCalculateSub": "cálculo instantâneo",
    "landing.stepProfit": "Lucro",
    "landing.stepProfitSub": "o que você ganha",
    "batch.back": "Voltar",
    "batch.continue": "Continuar",
    "batch.calculate": "Calcular",
    "batch.q1Title": "Quantas peças neste lote?",
    "batch.q1Hint": "Total de peças a produzir.",
    "batch.q1Label": "Peças no lote",
    "batch.q2Title": "Quanto material foi usado?",
    "batch.q2Hint": "Custo total de matéria-prima do lote.",
    "batch.q2Label": "Custo de material",
    "batch.q3Title": "Quantas horas de mão de obra?",
    "batch.q3Hint": "Horas e taxa por hora.",
    "batch.q3LabelHours": "Horas",
    "batch.q3LabelRate": "Taxa por hora",
    "batch.q4Title": "Outras despesas?",
    "batch.q4Hint": "Embalagem, eletricidade, transporte.",
    "batch.q4LabelExtra": "Despesas extras",
    "batch.q4LabelMargin": "Margem de lucro",
    "batch.sellEachAt": "Vender cada peça por",
    "batch.totalCost": "Custo do lote",
    "batch.costPerPiece": "Custo por peça",
    "batch.items": "Peças",
    "batch.startNew": "Iniciar novo lote",
    "monthly.title": "Este mês",
    "monthly.subtitle": "Três números — é tudo.",
    "monthly.totalSales": "Vendas totais",
    "monthly.totalExpenses": "Despesas totais",
    "monthly.unitsProduced": "Unidades produzidas",
    "monthly.netProfit": "Lucro líquido do mês",
    "monthly.netLoss": "Prejuízo do mês",
    "monthly.marginSuffix": "margem",
    "monthly.avgCost": "Custo médio por unidade",
    "monthly.breakEven": "Ponto de equilíbrio (unidades)",
  },

  ru: {
    "app.tagline": "Самый простой способ установить цену на то, что вы производите.",
    "cat.materials": "Сырьё",
    "cat.labor": "Труд",
    "cat.packaging": "Упаковка",
    "cat.electricity": "Электричество",
    "cat.rent": "Аренда",
    "cat.other": "Прочее",
    "cat.machines": "Станки",
    "tab.quickCost": "Быстрый расчёт",
    "header.tryDemo": "Попробовать демо",
    "quick.headerTitle": "Ваши расходы",
    "quick.headerSubtitle": "Просто укажите, что использовали и купили. Мы посчитаем.",
    "quick.modeSimple": "Простой",
    "quick.modeAdvanced": "Подробный",
    "quick.productName": "Название продукта",
    "quick.unitsProduced": "Произведено единиц",
    "materials.title": "Какое сырьё вы использовали?",
    "materials.addLabel": "Добавить материал",
    "materials.empty": "Материалы ещё не добавлены.",
    "materials.columnName": "Материал",
    "materials.columnQty": "Расход",
    "materials.columnUnit": "Ед.",
    "materials.columnPurchased": "Закуплено",
    "materials.columnCost": "Стоимость",
    "labor.title": "Кто работал над этим производством?",
    "labor.addLabel": "Добавить человека",
    "labor.empty": "Добавьте занятых работников.",
    "labor.columnRole": "Роль",
    "labor.columnHours": "Часов",
    "labor.columnMonthly": "В месяц",
    "labor.columnSalary": "Зарплата",
    "electricity.title": "Сколько электричества использовано?",
    "rent.title": "Сколько аренды относится к производству?",
    "rent.monthlyRent": "Месячная аренда",
    "packaging.title": "Какая упаковка использовалась?",
    "packaging.addLabel": "Добавить упаковку",
    "other.title": "Другие расходы?",
    "other.addLabel": "Добавить расход",
    "machines.title": "Включить износ станков?",
    "pricing.title": "Сколько прибыли вы хотите?",
    "pricing.modeMargin": "Маржа %",
    "pricing.modeMarkup": "Наценка %",
    "pricing.modeTarget": "Целевая прибыль",
    "whatif.title": "Что если произвести больше?",
    "whatif.now": "Сейчас",
    "whatif.if": "Если",
    "whatif.columnProduction": "Объём",
    "whatif.columnCostPerUnit": "Стоимость / шт.",
    "whatif.columnSellAt": "Продавать по",
    "whatif.columnProfit": "Прибыль",
    "whatif.columnMargin": "Маржа",
    "whatif.addScenario": "Добавить сценарий",
    "summary.live": "Живая сводка",
    "summary.suggestedPrice": "Рекомендуемая цена продажи",
    "summary.perUnit": "за единицу",
    "summary.costPerUnit": "Стоимость / шт.",
    "summary.profitPerUnit": "Прибыль / шт.",
    "summary.totalProfit": "Общая прибыль",
    "summary.totalCost": "Общая стоимость",
    "summary.costBreakdown": "Структура затрат",
    "summary.groupDirect": "Прямые затраты",
    "summary.groupIndirect": "Косвенные затраты",
    "summary.groupOptional": "Опционально",
    "summary.insights": "Аналитика",
    "summary.sellAt": "Продавать по",
    "status.healthy": "Хорошая маржа",
    "status.low": "Низкая маржа",
    "status.loss": "Риск убытка",
    "actions.save": "Сохранить",
    "actions.share": "Поделиться",
    "actions.copied": "Скопировано",
    "explainer.label": "Как это рассчитано?",
    "warning.usedExceedsPurchased": "Использованное количество превышает закупленное.",
    "ui.selectLanguage": "Язык",
    "ui.selectCurrency": "Выберите валюту",
    "ui.searchCurrency": "Поиск валюты или кода…",
    "ui.quickAdd": "Быстро добавить",
    "report.titleCosting": "Сводка стоимости",
    "report.titleBreakdown": "Структура затрат",
    "report.titleMaterials": "Сырьё",
    "report.titleLabor": "Труд",
    "report.titleMachine": "Стоимость станков",
    "report.titleWhatIf": "Анализ масштаба",
    "report.totalCost": "Общая стоимость",
    "landing.badge": "Создано для небольших фабрик и мастерских",
    "landing.heroTitleA": "Узнайте себестоимость продукта",
    "landing.heroTitleB": "за минуты.",
    "landing.heroSubtitle": "Простой калькулятор затрат для фабрик и производителей. Введите, что купили и использовали — мы посчитаем.",
    "landing.cta": "Начать расчёт",
    "landing.stepExpenses": "Расходы",
    "landing.stepExpensesSub": "ваши траты",
    "landing.stepCalculate": "Расчёт",
    "landing.stepCalculateSub": "мгновенно",
    "landing.stepProfit": "Прибыль",
    "landing.stepProfitSub": "ваш заработок",
    "batch.back": "Назад",
    "batch.continue": "Далее",
    "batch.calculate": "Рассчитать",
    "batch.q1Title": "Сколько изделий в этой партии?",
    "batch.q1Hint": "Общее количество изделий для производства.",
    "batch.q1Label": "Изделий в партии",
    "batch.q2Title": "Сколько материала использовано?",
    "batch.q2Hint": "Общая стоимость сырья для партии.",
    "batch.q2Label": "Стоимость материала",
    "batch.q3Title": "Сколько человеко-часов?",
    "batch.q3Hint": "Часы и ставка за час.",
    "batch.q3LabelHours": "Часы",
    "batch.q3LabelRate": "Ставка / час",
    "batch.q4Title": "Другие расходы?",
    "batch.q4Hint": "Упаковка, электричество, транспорт.",
    "batch.q4LabelExtra": "Дополнительные расходы",
    "batch.q4LabelMargin": "Маржа прибыли",
    "batch.sellEachAt": "Продавать каждое изделие по",
    "batch.totalCost": "Стоимость партии",
    "batch.costPerPiece": "Стоимость одного изделия",
    "batch.items": "Изделий",
    "batch.startNew": "Начать новую партию",
    "monthly.title": "Этот месяц",
    "monthly.subtitle": "Три числа — это всё.",
    "monthly.totalSales": "Общая выручка",
    "monthly.totalExpenses": "Общие расходы",
    "monthly.unitsProduced": "Произведено единиц",
    "monthly.netProfit": "Чистая прибыль за месяц",
    "monthly.netLoss": "Чистый убыток за месяц",
    "monthly.marginSuffix": "маржа",
    "monthly.avgCost": "Средняя стоимость единицы",
    "monthly.breakEven": "Точка безубыточности (ед.)",
  },
};

// React context for language selection
const LangContext = React.createContext({ lang: "en", setLang: () => {} });

// Translation function with English fallback and {placeholder} support
function makeTranslator(lang) {
  return (key, vars) => {
    const dict = LOCALES[lang] || {};
    const enDict = LOCALES.en;
    let s = dict[key];
    if (s === undefined) s = enDict[key];
    if (s === undefined) return key;
    if (vars) {
      for (const k of Object.keys(vars)) {
        s = s.replace(new RegExp("\\{" + k + "\\}", "g"), String(vars[k]));
      }
    }
    return s;
  };
}

function useT() {
  const { lang } = React.useContext(LangContext);
  return useMemo(() => makeTranslator(lang), [lang]);
}

// Language selector — twin of CurrencySelector
function LanguageSelector() {
  const { lang, setLang } = React.useContext(LangContext);
  const t = makeTranslator(lang);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 pl-2.5 pr-2 py-2 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/30 shadow-sm transition text-[13px] font-medium text-slate-800"
        title={t("ui.selectLanguage")}
      >
        <Languages size={13} className="text-teal-700" strokeWidth={2.2} />
        <span className="tracking-tight">{current.nativeName}</span>
        <ChevronDown size={12} className={"text-slate-400 transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"
          >
            <div className="px-3 pt-3 pb-2 flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">
              <Languages size={11} /> {t("ui.selectLanguage")}
            </div>
            <div className="max-h-80 overflow-y-auto pb-1">
              {LANGUAGES.map((l) => {
                const active = l.code === current.code;
                return (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setOpen(false);
                    }}
                    className={"w-full flex items-center gap-3 px-3 py-2 text-left transition " + (active ? "bg-teal-50/70" : "hover:bg-slate-50")}
                  >
                    <span className="text-[18px] leading-none">{l.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-1.5">
                        <span className={"text-[13.5px] font-semibold " + (active ? "text-teal-800" : "text-slate-900")}>
                          {l.nativeName}
                        </span>
                        {l.nativeName !== l.name && (
                          <span className="text-[11.5px] text-slate-400 truncate">{l.name}</span>
                        )}
                      </div>
                    </div>
                    {active && <Check size={13} className="text-teal-700" strokeWidth={2.6} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Theme
// ─────────────────────────────────────────────────────────────
const accent = "#0F766E";
const accentDark = "#115E59";

// ─────────────────────────────────────────────────────────────
// CURRENCY SYSTEM — fully global. Intl.NumberFormat drives every number.
// ─────────────────────────────────────────────────────────────

// Comprehensive ISO 4217 list with names and likely region locales.
// Locale is used as a *formatting* hint (grouping, numerals) — not a conversion source.
// Symbol is derived from Intl.NumberFormat at runtime so it stays correct everywhere.
const ALL_CURRENCIES_RAW = [
  ["USD", "US Dollar", "en-US", "🇺🇸"],
  ["EUR", "Euro", "en-IE", "🇪🇺"],
  ["GBP", "British Pound", "en-GB", "🇬🇧"],
  ["JPY", "Japanese Yen", "ja-JP", "🇯🇵"],
  ["CNY", "Chinese Yuan", "zh-CN", "🇨🇳"],
  ["INR", "Indian Rupee", "en-IN", "🇮🇳"],
  ["PKR", "Pakistani Rupee", "en-PK", "🇵🇰"],
  ["BDT", "Bangladeshi Taka", "bn-BD", "🇧🇩"],
  ["AED", "UAE Dirham", "ar-AE", "🇦🇪"],
  ["SAR", "Saudi Riyal", "ar-SA", "🇸🇦"],
  ["QAR", "Qatari Riyal", "ar-QA", "🇶🇦"],
  ["KWD", "Kuwaiti Dinar", "ar-KW", "🇰🇼"],
  ["OMR", "Omani Rial", "ar-OM", "🇴🇲"],
  ["BHD", "Bahraini Dinar", "ar-BH", "🇧🇭"],
  ["TRY", "Turkish Lira", "tr-TR", "🇹🇷"],
  ["EGP", "Egyptian Pound", "ar-EG", "🇪🇬"],
  ["ZAR", "South African Rand", "en-ZA", "🇿🇦"],
  ["NGN", "Nigerian Naira", "en-NG", "🇳🇬"],
  ["KES", "Kenyan Shilling", "en-KE", "🇰🇪"],
  ["GHS", "Ghanaian Cedi", "en-GH", "🇬🇭"],
  ["MAD", "Moroccan Dirham", "ar-MA", "🇲🇦"],
  ["LKR", "Sri Lankan Rupee", "si-LK", "🇱🇰"],
  ["NPR", "Nepalese Rupee", "ne-NP", "🇳🇵"],
  ["MYR", "Malaysian Ringgit", "ms-MY", "🇲🇾"],
  ["IDR", "Indonesian Rupiah", "id-ID", "🇮🇩"],
  ["PHP", "Philippine Peso", "en-PH", "🇵🇭"],
  ["VND", "Vietnamese Dong", "vi-VN", "🇻🇳"],
  ["THB", "Thai Baht", "th-TH", "🇹🇭"],
  ["SGD", "Singapore Dollar", "en-SG", "🇸🇬"],
  ["HKD", "Hong Kong Dollar", "en-HK", "🇭🇰"],
  ["KRW", "South Korean Won", "ko-KR", "🇰🇷"],
  ["TWD", "Taiwan Dollar", "zh-TW", "🇹🇼"],
  ["AUD", "Australian Dollar", "en-AU", "🇦🇺"],
  ["NZD", "New Zealand Dollar", "en-NZ", "🇳🇿"],
  ["CAD", "Canadian Dollar", "en-CA", "🇨🇦"],
  ["MXN", "Mexican Peso", "es-MX", "🇲🇽"],
  ["BRL", "Brazilian Real", "pt-BR", "🇧🇷"],
  ["ARS", "Argentine Peso", "es-AR", "🇦🇷"],
  ["CLP", "Chilean Peso", "es-CL", "🇨🇱"],
  ["COP", "Colombian Peso", "es-CO", "🇨🇴"],
  ["PEN", "Peruvian Sol", "es-PE", "🇵🇪"],
  ["RUB", "Russian Ruble", "ru-RU", "🇷🇺"],
  ["UAH", "Ukrainian Hryvnia", "uk-UA", "🇺🇦"],
  ["PLN", "Polish Złoty", "pl-PL", "🇵🇱"],
  ["CHF", "Swiss Franc", "de-CH", "🇨🇭"],
  ["SEK", "Swedish Krona", "sv-SE", "🇸🇪"],
  ["NOK", "Norwegian Krone", "nb-NO", "🇳🇴"],
  ["DKK", "Danish Krone", "da-DK", "🇩🇰"],
  ["CZK", "Czech Koruna", "cs-CZ", "🇨🇿"],
  ["HUF", "Hungarian Forint", "hu-HU", "🇭🇺"],
  ["RON", "Romanian Leu", "ro-RO", "🇷🇴"],
  ["ILS", "Israeli Shekel", "he-IL", "🇮🇱"],
  ["IRR", "Iranian Rial", "fa-IR", "🇮🇷"],
  ["IQD", "Iraqi Dinar", "ar-IQ", "🇮🇶"],
];

// Derive symbol from Intl.NumberFormat — guaranteed correct per code/locale combo.
function deriveSymbol(code, locale) {
  try {
    const parts = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
      currencyDisplay: "narrowSymbol",
    }).formatToParts(0);
    const sym = parts.find((p) => p.type === "currency")?.value;
    return sym || code;
  } catch {
    return code;
  }
}

const CURRENCIES = ALL_CURRENCIES_RAW.map(([code, name, locale, flag]) => ({
  code,
  name,
  locale,
  flag,
  symbol: deriveSymbol(code, locale),
}));

const DEFAULT_CURRENCY = CURRENCIES[0];

// Format a number with the currency's locale (no symbol — symbol is rendered separately so
// we can keep the same compact "$1,234" rendering everywhere even for RTL currencies).
function formatNumber(n, locale, decimals = 2) {
  if (!isFinite(n)) n = 0;
  try {
    return n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  } catch {
    return n.toFixed(decimals);
  }
}

// Smart formatter: auto-increases decimal precision for very small values
// so "0.00" never appears for a non-zero cost-per-unit.
// Values < 0.0001 show as "< 0.0001" to be explicit about the collapse.
function formatSmart(n, locale, defaultDecimals = 2) {
  if (!isFinite(n)) return "0.00";
  const abs = Math.abs(n);
  if (abs === 0) return formatNumber(0, locale, defaultDecimals);
  let decimals = defaultDecimals;
  if (abs < 0.0001) {
    const threshold = (0.0001).toLocaleString(locale, { minimumFractionDigits: 4, maximumFractionDigits: 4 });
    return `< ${threshold}`;
  }
  if (abs < 0.01) decimals = 4;
  else if (abs < 0.1) decimals = 3;
  return formatNumber(n, locale, decimals);
}

// HTML-escape helper for PDF report rendering
function escapeHTML(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Render a single grouped breakdown block for the PDF report
function renderBreakdownGroup(label, items, total, topName, fmt, locale) {
  const visible = items.filter((i) => i.v > 0);
  if (visible.length === 0) return "";
  return `<div class="group-label">${escapeHTML(label)}</div>` +
    visible.map((item) => {
      const pct = total > 0 ? (item.v / total) * 100 : 0;
      const isTop = topName === item.name;
      return `<div class="breakdown-row${isTop ? " top" : ""}">
        <span>${escapeHTML(item.name)}${pct >= 1 ? `<span class="pct">${pct.toFixed(0)}%</span>` : ""}</span>
        <span>${fmt(item.v)}</span>
      </div>`;
    }).join("");
}

// ─────────────────────────────────────────────────────────────
// XLSX styling helpers — applied via cell .s (style) which SheetJS
// passes through when the workbook is written. Basic styling
// (number format, bold) works in the default community build via
// the cell .z (numFmt) and .v properties.
// ─────────────────────────────────────────────────────────────
function setCell(ws, addr, props) {
  if (!ws[addr]) ws[addr] = { t: "s", v: "" };
  Object.assign(ws[addr], props);
}

function styleHeader(ws, addr) {
  setCell(ws, addr, { s: { font: { bold: true, sz: 14, color: { rgb: "0F766E" } } } });
}

function styleColumnHeader(ws, addrs) {
  for (const a of addrs) {
    setCell(ws, a, {
      s: {
        font: { bold: true, sz: 10, color: { rgb: "6B7280" } },
        fill: { fgColor: { rgb: "F9FAFB" }, patternType: "solid" },
        alignment: { vertical: "center" },
      },
    });
  }
}

function styleTotalRow(ws, addrs) {
  for (const a of addrs) {
    setCell(ws, a, {
      s: {
        font: { bold: true, sz: 11, color: { rgb: "111827" } },
        fill: { fgColor: { rgb: "ECFDF5" }, patternType: "solid" },
        border: { top: { style: "thin", color: { rgb: "0F766E" } } },
      },
    });
  }
}

function formatCurrencyCells(ws, addrs, sym) {
  // Build a number format string with the symbol baked in.
  // Excel custom format: e.g. "$#,##0.00" or "₨#,##0.00"
  const safe = sym.replace(/"/g, '""');
  const numFmt = `"${safe}"#,##0.00`;
  for (const a of addrs) {
    if (ws[a]) {
      ws[a].t = "n";
      ws[a].z = numFmt;
    }
  }
}

function formatPercentCell(ws, addr) {
  if (ws[addr]) {
    ws[addr].t = "n";
    ws[addr].z = "0.0%";
  }
}

// Compact, elegant dropdown — used in the header
function CurrencyWarningModal({ from, to, onConfirm, onCancel }) {
  const t = useT();
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onCancel} />
      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
        {/* Icon + title */}
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mt-0.5">
            <AlertTriangle size={17} className="text-amber-500" strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900 leading-snug">
              {t("currency.warnTitle")}
            </h2>
            <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">
              {t("currency.warnBody")}
            </p>
          </div>
        </div>
        {/* Currency change preview */}
        <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 text-[13px] font-medium text-slate-700">
          <span>{from.flag} {from.code} {from.symbol}</span>
          <span className="text-slate-400 mx-1">→</span>
          <span>{to.flag} {to.code} {to.symbol}</span>
        </div>
        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            {t("currency.warnCancel")}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[13px] font-semibold transition"
          >
            {t("currency.warnSwitch")}
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrencySelector({ value, onChange }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 pl-2.5 pr-2 py-2 rounded-xl border border-slate-200 bg-white hover:border-teal-300 hover:bg-teal-50/30 shadow-sm transition text-[13px] font-medium text-slate-800"
        title={t("ui.selectCurrency")}
      >
        <span className="text-[15px] leading-none">{value.flag}</span>
        <span className="tracking-tight">{value.code}</span>
        <span className="text-teal-700 font-semibold tabular-nums">{value.symbol}</span>
        <ChevronDown size={12} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"
          >
            <div className="px-3 pt-3 pb-2">
              <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                <Globe size={11} />
                {t("ui.selectCurrency")}
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("ui.searchCurrency")}
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,118,110,0.08)] transition"
              />
            </div>
            <div className="max-h-72 overflow-y-auto pb-1">
              {filtered.length === 0 ? (
                <div className="px-3 py-6 text-center text-[12px] text-slate-400">
                  {t("ui.noCurrencyMatch")} "{query}"
                </div>
              ) : (
                filtered.map((c) => {
                  const active = c.code === value.code;
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        onChange(c);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                        active ? "bg-teal-50/70" : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="text-[18px] leading-none">{c.flag}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-[13.5px] font-semibold ${active ? "text-teal-800" : "text-slate-900"}`}>
                            {c.code}
                          </span>
                          <span className="text-[12px] text-slate-400 truncate">{c.name}</span>
                        </div>
                      </div>
                      <span className={`text-[13.5px] font-medium tabular-nums ${active ? "text-teal-800" : "text-slate-500"}`}>
                        {c.symbol}
                      </span>
                      {active && <Check size={13} className="text-teal-700" strokeWidth={2.6} />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Format a number with the currency's locale + symbol
function formatMoney(n, currency, decimals = 2) {
  if (!isFinite(n)) n = 0;
  try {
    const formatted = n.toLocaleString(currency.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    return `${currency.symbol}${formatted}`;
  } catch {
    return `${currency.symbol}${n.toFixed(decimals)}`;
  }
}

// ─────────────────────────────────────────────────────────────
// Quick-add chips for labor — globally common manufacturing roles
// (Materials are too industry-specific; future versions can pull
//  recents from saved snapshots.)
// ─────────────────────────────────────────────────────────────
const LABOR_ROLES = [
  "Worker",
  "Machine Operator",
  "Packer",
  "Helper",
  "Supervisor",
  "QC Inspector",
  "Technician",
];

// ─────────────────────────────────────────────────────────────
// Collapse — animated height container used by every section
// ─────────────────────────────────────────────────────────────
function Collapse({ open, children }) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="collapse-body"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Reusable section header — title, optional total chip, chevron, open/close
function SectionHeader({ icon: Icon, title, hint, open, onToggle, total, currency, badge, warning, units, complete }) {
  return (
    <button
      onClick={onToggle}
      aria-expanded={open}
      className="w-full flex items-center gap-2 py-3 text-left group"
    >
      <Icon size={13} className="text-teal-700 shrink-0" strokeWidth={2.2} />
      <h3 className="text-[13.5px] font-semibold text-slate-800 tracking-tight">{title}</h3>
      {warning && (
        <span title={warning} className="flex items-center text-amber-500">
          <AlertTriangle size={11} strokeWidth={2.4} />
        </span>
      )}
      <div className="flex-1" />
      {total !== undefined && total > 0 && (
        <span className="flex items-baseline gap-1 shrink-0">
          <span className="text-[12.5px] tabular-nums font-semibold text-slate-700">
            <AnimatedNumber value={total} prefix={currency.symbol} decimals={2} currency={currency} />
          </span>
          <PerUnitPill value={total} units={units} currency={currency} />
        </span>
      )}
      <ChevronDown
        size={15}
        strokeWidth={2.2}
        className={`text-slate-400 transition-transform group-hover:text-slate-600 ${open ? "rotate-180" : ""}`}
      />
    </button>
  );
}

// Quick-add chip row — feather-light suggestions

// ─────────────────────────────────────────────────────────────
// AI INSIGHTS PANEL — "quietly intelligent" cost observations
// All insights are computed from real numbers. No fake data.
// ─────────────────────────────────────────────────────────────
function AIInsightsPanel({ insights }) {
  const t = useT();
  if (!insights || insights.length === 0) return null;
  const iconMap = {
    red:     <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    amber:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    green:   <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    neutral: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  };
  const bgMap = {
    red:     "bg-red-50 border-red-100",
    amber:   "bg-amber-50 border-amber-100",
    green:   "bg-emerald-50 border-emerald-100",
    neutral: "bg-teal-50/60 border-teal-100",
  };
  const textMap = {
    red:     "text-red-700",
    amber:   "text-amber-700",
    green:   "text-emerald-700",
    neutral: "text-teal-800",
  };
  return (
    <div>
      <div className="text-[10.5px] font-semibold tracking-wider text-slate-400 uppercase mb-2.5 px-1">
        {t("summary.insights")}
      </div>
      <div className="space-y-1.5">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] leading-snug ${bgMap[ins.tone] || bgMap.neutral}`}
          >
            {iconMap[ins.tone] || iconMap.neutral}
            <span className={`${textMap[ins.tone] || textMap.neutral}`}>{resolveInsightText(ins, t)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AI OPTIMIZATION PANEL — actionable suggestions computed from data
// Collapsible. Shows 2-4 smart recommendations.
// ─────────────────────────────────────────────────────────────

function ChipRow({ items, onPick }) {
  const t = useT();
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-2 pt-0.5 pl-0.5">
      {items.map((label) => (
        <button
          key={label}
          onClick={() => onPick(label)}
          className="text-[11.5px] px-2.5 py-1 rounded-full border border-slate-200/60 bg-white text-slate-500 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition"
        >
          + {label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profit status — traffic-light reading of margin %
// ─────────────────────────────────────────────────────────────
// Resolves an insight object { key, params } → translated string.
// Category params contain catKey (English key) which is translated at call time.
// Using this helper keeps insights useMemo free of `t` as a dependency,
// so language switches never cause a calculation/display desync.
function resolveInsightText(ins, t) {
  if (!ins || !ins.key) return ins?.text || "";
  const catKeys = {
    Materials: "cat.materials", Labor: "cat.labor",
    Electricity: "cat.electricity", Packaging: "cat.packaging",
    Rent: "cat.rent", Machines: "cat.machines", Other: "cat.other",
  };
  const params = ins.params?.catKey
    ? { ...ins.params, name: t(catKeys[ins.params.catKey] || ins.params.catKey) }
    : (ins.params || {});
  return t(ins.key, params);
}

// price/cpu are optional — when passed, status is suppressed if the unit
// price would display as 0.00 (precision collapse makes "Healthy" misleading).
function profitStatus(margin, total, t, { price = null, cpu = null } = {}) {
  const tr = t || ((k) => ({ "status.loss": "Loss risk", "status.low": "Low margin", "status.healthy": "Healthy margin" }[k] || k));
  if (!total || total <= 0) return null;
  // Suppress status badge if per-unit price has collapsed below display threshold
  if (price !== null && price > 0 && price < 0.005) return null;
  if (cpu !== null && cpu > 0 && cpu < 0.005) return null;
  if (margin < 0) return { label: tr("status.loss"), tone: "red", dot: "🔴", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
  if (margin < 10) return { label: tr("status.loss"), tone: "red", dot: "🔴", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
  if (margin < 25) return { label: tr("status.low"), tone: "amber", dot: "🟡", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" };
  return { label: tr("status.healthy"), tone: "green", dot: "🟢", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };
}

// Small "Rs 2.11/unit" pill — rendered beside any section total
function PerUnitPill({ value, units, currency }) {
  if (!units || units <= 0 || !value || value <= 0) return null;
  const perUnit = value / units;
  return (
    <span className="text-[11px] text-slate-400 font-normal tabular-nums ml-1 shrink-0">
      <AnimatedNumber value={perUnit} prefix={currency.symbol} decimals={2} currency={currency} />
      /unit
    </span>
  );
}

// Expandable "How was this calculated?" footer
function Explainer({ lines }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  if (!lines || lines.length === 0) return null;
  return (
    <div className="pt-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 text-[11.5px] text-slate-400 hover:text-teal-700 transition"
      >
        <span className={`inline-block transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
        {t("explainer.label")}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="explainer-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 pl-3 border-l-2 border-slate-100 space-y-1">
              {lines.map((l, i) => (
                <div key={i} className="text-[11.5px] text-slate-500 leading-relaxed tabular-nums">
                  {l}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Cost group — section of the breakdown showing related line items
function CostGroup({ label, currency, items, highlightKey, total }) {
  const visible = items.filter((i) => i.value > 0);
  if (visible.length === 0) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="text-[10px] text-slate-400/60 font-medium mb-1 pl-1">
        {label}
      </div>
      {visible.map((item) => {
        const pct = total > 0 ? (item.value / total) * 100 : 0;
        const isTop = highlightKey === item.name;
        return (
          <div
            key={item.name}
            className={`flex items-center gap-2 py-1.5 ${isTop ? "bg-teal-50/40 -mx-2 px-2 rounded-md" : ""}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className={`text-[13px] ${isTop ? "text-teal-800 font-medium" : "text-slate-600"}`}>
                {item.name}
              </span>
              {pct >= 1 && (
                <span className={`text-[10.5px] tabular-nums ${isTop ? "text-teal-600" : "text-slate-400"}`}>
                  {pct.toFixed(0)}%
                </span>
              )}
            </div>
            <span className={`tabular-nums font-medium text-[14px] ${isTop ? "text-teal-900" : "text-slate-800"}`}>
              <AnimatedNumber value={item.value} prefix={currency.symbol} decimals={2} currency={currency} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Action bar — Save, PDF, CSV, Share
function ActionBar({ onSnapshot, onExportPDF, onExportXLSX, onShare, savedCount, canExport }) {
  const t = useT();
  const [shareCopied, setShareCopied] = useState(false);
  const handleShare = () => {
    onShare();
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 1800);
  };
  const exportBtnClass = (enabled) =>
    `flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium transition ${
      enabled
        ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        : "text-slate-300 cursor-not-allowed"
    }`;
  return (
    <div className="flex items-center gap-0.5 bg-slate-50 rounded-xl p-1 print:hidden">
      <button
        onClick={onSnapshot}
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        title={t("actions.save")}
      >
        <Save size={12} strokeWidth={2.2} />
        {t("actions.save")}
      </button>
      <div className="w-px h-4 bg-slate-200" />
      <button
        onClick={canExport ? onExportPDF : undefined}
        disabled={!canExport}
        className={exportBtnClass(canExport)}
        title={canExport ? t("actions.pdf") : "Enter costs and units first"}
      >
        <FileText size={12} strokeWidth={2.2} />
        {t("actions.pdf")}
      </button>
      <div className="w-px h-4 bg-slate-200" />
      <button
        onClick={canExport ? onExportXLSX : undefined}
        disabled={!canExport}
        className={exportBtnClass(canExport)}
        title={canExport ? t("actions.excel") : "Enter costs and units first"}
      >
        <FileSpreadsheet size={12} strokeWidth={2.2} />
        {t("actions.excel")}
      </button>
      <div className="w-px h-4 bg-slate-200" />
      <button
        onClick={handleShare}
        className="flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
        title={t("actions.share")}
      >
        {shareCopied ? <Check size={12} strokeWidth={2.6} className="text-teal-700" /> : <Share2 size={12} strokeWidth={2.2} />}
        {shareCopied ? t("actions.copied") : t("actions.share")}
      </button>
    </div>
  );
}

// Empty-state block shown when a section is open but has no real data yet
function EmptyHint({ children, icon }) {
  return (
    <div className="flex items-center gap-2.5 py-4 px-1 text-slate-400">
      {icon && (
        <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
        </div>
      )}
      <span className="text-[12.5px] leading-snug">{children}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// UNIT CONVERSION SYSTEM
// Every unit converts to a base within its family.
// Cost is calculated by: (usedQty in base ÷ purchasedQty in base) × purchasedCost
// ─────────────────────────────────────────────────────────────
const UNIT_GROUPS = {
  liquid: {
    base: "ML",
    units: { ML: 1, Litre: 1000, Gallon: 3785.41 },
  },
  solid: {
    base: "Gram",
    units: { Gram: 1, KG: 1000, Ton: 1_000_000, Pound: 453.592 },
  },
  length: {
    base: "MM",
    units: { MM: 1, CM: 10, Meter: 1000, Inch: 25.4, Feet: 304.8, Yard: 914.4 },
  },
  count: {
    base: "Piece",
    units: { Piece: 1, Unit: 1, Box: 1, Roll: 1, Bag: 1, Packet: 1, Carton: 1 },
  },
  area: {
    base: "Sqm",
    units: { Sqm: 1, Sqft: 0.092903 },
  },
  time: {
    base: "Minute",
    units: { Minute: 1, Hour: 60, Day: 1440 },
  },
};

// Lookup: unit → group key
const UNIT_TO_GROUP = {};
Object.entries(UNIT_GROUPS).forEach(([group, def]) => {
  Object.keys(def.units).forEach((u) => {
    UNIT_TO_GROUP[u] = group;
  });
});

function unitsInSameGroup(a, b) {
  return UNIT_TO_GROUP[a] && UNIT_TO_GROUP[a] === UNIT_TO_GROUP[b];
}

function unitsForGroup(group) {
  return Object.keys(UNIT_GROUPS[group]?.units || {});
}

// Convert quantity from `from` unit to `to` unit (must be same group)
function convert(qty, from, to) {
  if (from === to) return qty;
  if (!unitsInSameGroup(from, to)) return null;
  const group = UNIT_GROUPS[UNIT_TO_GROUP[from]];
  const inBase = qty * group.units[from];
  return inBase / group.units[to];
}

// Calculate auto cost for a row given used qty/unit, purchased qty/unit, purchase cost
// Calculate the cost contribution of a single cost row.
// Backward compatible: rows without `source`/`delivery`/`freight`/etc.
// behave exactly as before. Materials rows can now pass extra fields
// for landed cost — those are summed into `landed` then the same
// proportional formula applies.
function calcRowCost({
  usedQty, usedUnit, purchasedQty, purchasedUnit, purchasedCost,
  source, delivery, freight, duty, taxes, clearing,
  taxRecoverable = true,   // true = VAT/GST recoverable, excluded from product cost
}) {
  const u = parseFloat(usedQty) || 0;
  const p = parseFloat(purchasedQty) || 0;
  const c = parseFloat(purchasedCost) || 0;
  const d = parseFloat(delivery) || 0;
  const f = parseFloat(freight) || 0;
  const dt = parseFloat(duty) || 0;
  const tx = parseFloat(taxes) || 0;
  const cl = parseFloat(clearing) || 0;

  // Recoverable taxes (VAT/GST/Input Tax) are excluded from product cost.
  // Non-recoverable taxes (irrecoverable import levies) are included.
  const recoverableTax = (source === "imported" && taxRecoverable) ? tx : 0;
  const nonRecoverableTax = (source === "imported" && !taxRecoverable) ? tx : 0;

  // Landed cost = only costs that actually sit in inventory / product cost.
  let landed;
  if (source === "imported") {
    landed = c + f + dt + nonRecoverableTax + cl;
  } else {
    landed = c + d;
  }

  if (u <= 0 || p <= 0 || landed <= 0) {
    return { cost: 0, valid: false, mismatch: false, landed, recoverableTax };
  }
  if (!unitsInSameGroup(usedUnit, purchasedUnit)) {
    return { cost: 0, valid: false, mismatch: true, landed, recoverableTax };
  }
  const usedInPurchasedUnit = convert(u, usedUnit, purchasedUnit);
  if (usedInPurchasedUnit === null) return { cost: 0, valid: false, mismatch: true, landed, recoverableTax };
  return {
    cost: (usedInPurchasedUnit / p) * landed,
    valid: true,
    mismatch: false,
    landed,
    recoverableTax,
  };
}

// ─────────────────────────────────────────────────────────────
// Animated number counter
// `prefix` can be a string (legacy) or omitted; `currency` if passed uses its locale.
// ─────────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = "", decimals = 0, currency }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const from = prev.current;
    const to = Number(value) || 0;
    const duration = 420;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const locale = currency?.locale;
  // Use smart formatting for monetary 2-decimal displays so very small
  // per-unit values (e.g. 0.003) never silently show as 0.00.
  const formatted = decimals === 2
    ? formatSmart(display, locale, 2)
    : formatNumber(display, locale, decimals);
  return (
    <span>
      {prefix}
      {formatted}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Bare inline input — no borders, transparent, sits in a row
// ─────────────────────────────────────────────────────────────
// CellInput uses type="text" + inputMode="decimal" for all numeric fields.
// type="number" is avoided because browsers render large values in scientific
// notation (e.g. 1e+6) which creates a display/calculation mismatch that
// destroys trust. type="text" always displays exactly what the user typed.
function CellInput({ value, onChange, placeholder, type = "number", align = "left", prefix, allowNegative = false }) {
  const isNum = type === "number";
  const handleChange = (e) => {
    let v = e.target.value;
    if (isNum) {
      // Allow: digits, one decimal point, optional leading minus if allowed
      const allowed = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;
      if (v !== "" && !allowed.test(v)) return;
      if (!allowNegative && v !== "" && parseFloat(v) < 0) return;
    }
    onChange(v);
  };
  return (
    <div className="flex items-center w-full group/cell">
      {prefix && (
        <span className="text-[13.5px] text-slate-400 select-none mr-0.5">{prefix}</span>
      )}
      <input
        type={isNum ? "text" : type}
        inputMode={isNum ? "decimal" : undefined}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`w-full bg-transparent outline-none text-[14px] text-slate-900 placeholder:text-slate-300 py-1.5 rounded-md px-1.5 -mx-1.5 hover:bg-slate-50 focus:bg-teal-50/40 focus:shadow-[inset_0_0_0_1.5px_rgba(15,118,110,0.25)] transition tabular-nums ${
          align === "right" ? "text-right" : ""
        }`}
      />
    </div>
  );
}

// All units, grouped via <optgroup> so users see the categories
const ALL_UNITS_GROUPED = [
  { label: "Solid", units: ["Gram", "KG", "Ton", "Pound"] },
  { label: "Liquid", units: ["ML", "Litre", "Gallon"] },
  { label: "Length", units: ["MM", "CM", "Meter", "Inch", "Feet", "Yard"] },
  { label: "Area", units: ["Sqm", "Sqft"] },
  { label: "Count", units: ["Piece", "Unit", "Box", "Roll", "Bag", "Packet", "Carton"] },
  { label: "Time", units: ["Minute", "Hour", "Day"] },
];

// Category-specific unit lists — keep dropdowns clean and relevant
const MATERIAL_UNITS = ["Gram", "KG", "Ton", "ML", "Litre", "Meter", "Feet", "Piece", "Roll", "Box", "Bag"];
const LABOR_UNITS    = ["Hour", "Day", "Shift"];

// Compact unit dropdown — no chrome, looks like text. The whole control is the select.
function UnitPicker({ value, onChange, options }) {
  // If caller passes specific options, use those (flat). Otherwise show full grouped list.
  const useGrouped = !options || options.length === 0;

  return (
    <div className="relative inline-flex items-center w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full bg-transparent text-[13px] text-slate-600 font-medium pr-5 pl-1.5 py-1.5 rounded-md hover:bg-slate-50 focus:bg-teal-50/40 focus:text-teal-800 focus:outline-none cursor-pointer transition"
      >
        {useGrouped
          ? ALL_UNITS_GROUPED.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </optgroup>
            ))
          : options.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
      </select>
      <ChevronDown
        size={11}
        className="absolute right-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  );
}

// Floating-label field (used in standalone single-value spots only)
function Field({ label, value, onChange, type = "number", prefix, suffix, placeholder, allowNegative = false, errorMsg }) {
  const [focused, setFocused] = useState(false);
  const filled = value !== "" && value !== null && value !== undefined;
  const lifted = focused || filled;
  const isNum = type === "number";
  const handleChange = (e) => {
    const v = e.target.value;
    if (isNum && !allowNegative && v !== "" && parseFloat(v) < 0) return;
    onChange(v);
  };
  const hasError = !!errorMsg;
  return (
    <div className="relative">
      <div
        className={`relative rounded-2xl border transition-all duration-200 bg-white ${
          hasError
            ? "border-red-400 shadow-[0_0_0_4px_rgba(239,68,68,0.08)]"
            : focused
            ? "border-teal-700 shadow-[0_0_0_4px_rgba(15,118,110,0.08)]"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <label
          className={`absolute left-4 pointer-events-none transition-all duration-200 ${
            lifted
              ? `top-2 text-[11px] font-medium ${hasError ? "text-red-500" : "text-teal-700"}`
              : "top-1/2 -translate-y-1/2 text-[15px] text-slate-400"
          }`}
        >
          {label}
        </label>
        <div className="flex items-center">
          {prefix && lifted && (
            <span className="pl-4 pt-5 pb-2 text-[15px] text-slate-400">{prefix}</span>
          )}
          <input
            type={type}
            inputMode={isNum ? "decimal" : undefined}
            min={isNum && !allowNegative ? "0" : undefined}
            value={value}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            className={`w-full bg-transparent outline-none text-[15px] text-slate-900 px-4 pb-2 ${
              lifted ? "pt-5" : "pt-4"
            } ${prefix && lifted ? "pl-1" : ""}`}
          />
          {suffix && lifted && (
            <span className="pr-4 pt-5 pb-2 text-[15px] text-slate-400">{suffix}</span>
          )}
        </div>
      </div>
      {hasError && (
        <p className="mt-1 ml-1 text-[11.5px] text-red-500 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CostRow — the universal inline row used by EVERY cost category
//
// Columns: [Name] [Used] [UsedUnit] [Purchased] [PurchasedUnit] [Cost] [Auto] [×]
//
// `unitGroup` constrains which units appear in the dropdowns.
// `singleUnit` = true hides the unit dropdowns (for fixed-unit categories like count/time).
// ─────────────────────────────────────────────────────────────
function CostRow({
  row,
  onChange,
  onRemove,
  canRemove,
  currency,
  namePlaceholder,
  usedLabel,
  purchasedLabel,
  costLabel,
  unitGroup,
  unitOptions,      // flat array — constrains unit dropdowns to category-relevant units
  fixedUnit,
  hideUnits,
  isPrefilled,
  supportsSource,   // when true, row shows Local/Imported toggle and landed-cost fields
}) {
  const t = useT();
  const update = (patch) => onChange({ ...row, ...patch });
  const result = useMemo(
    () =>
      calcRowCost({
        usedQty: row.usedQty,
        usedUnit: row.usedUnit || fixedUnit,
        purchasedQty: row.purchasedQty,
        purchasedUnit: row.purchasedUnit || fixedUnit,
        purchasedCost: row.purchasedCost,
        source: row.source,
        delivery: row.delivery,
        freight: row.freight,
        duty: row.duty,
        taxes: row.taxes,
        taxRecoverable: row.taxRecoverable ?? true,
        clearing: row.clearing,
      }),
    [row, fixedUnit]
  );

  // Soft validation: used qty (converted) exceeds purchased qty
  const overUsed = useMemo(() => {
    const u = parseFloat(row.usedQty) || 0;
    const p = parseFloat(row.purchasedQty) || 0;
    if (u <= 0 || p <= 0) return false;
    const usedUnit = row.usedUnit || fixedUnit;
    const purchasedUnit = row.purchasedUnit || fixedUnit;
    if (!unitsInSameGroup(usedUnit, purchasedUnit)) return false;
    const converted = convert(u, usedUnit, purchasedUnit);
    return converted !== null && converted > p;
  }, [row, fixedUnit]);

  // Soft validation specific to imported materials: source is "imported"
  // but none of the import-cost fields have a value yet.
  const importedBlank = useMemo(() => {
    if (!supportsSource || row.source !== "imported") return false;
    const anyFilled =
      parseFloat(row.freight) > 0 ||
      parseFloat(row.duty) > 0 ||
      parseFloat(row.taxes) > 0 ||
      parseFloat(row.clearing) > 0;
    return !anyFilled && parseFloat(row.purchasedCost) > 0;
  }, [row, supportsSource]);

  // A row is "partial" when the user has started entering data but the
  // calculation is still invalid — so it silently contributes 0 to the total.
  // We surface this explicitly rather than letting it pass through as 0.
  const isPartial = !result.valid && !result.mismatch && (
    parseFloat(row.usedQty) > 0 ||
    parseFloat(row.purchasedQty) > 0 ||
    parseFloat(row.purchasedCost) > 0
  );

  // Helper to update source and clear unused fields cleanly
  const setSource = (s) => {
    if (s === "local") {
      update({ source: "local", freight: "", duty: "", taxes: "", clearing: "" });
    } else {
      update({ source: "imported", delivery: "" });
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18 }}
      className={`group ${isPrefilled ? "relative -mx-2 px-2 rounded-lg bg-teal-50/40 ring-1 ring-teal-200/50" : ""}`}
    >
      {/* Desktop / tablet: single line */}
      <div className="hidden sm:grid items-center gap-1.5 py-2.5 border-b border-slate-100/50" style={{
        gridTemplateColumns: hideUnits
          ? "minmax(0,1.6fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,1fr) minmax(0,1fr) 28px"
          : "minmax(0,1.5fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.9fr) minmax(0,0.9fr) 28px"
      }}>
        {/* Name */}
        <CellInput
          type="text"
          value={row.name}
          onChange={(v) => update({ name: v })}
          placeholder={namePlaceholder}
        />
        {/* Used qty */}
        <CellInput
          value={row.usedQty}
          onChange={(v) => update({ usedQty: v })}
          placeholder={usedLabel}
          align="right"
        />
        {/* Used unit */}
        {!hideUnits && (
          <UnitPicker
            value={row.usedUnit}
            onChange={(v) => update({ usedUnit: v })}
            options={unitOptions}
          />
        )}
        {/* Purchased qty */}
        <CellInput
          value={row.purchasedQty}
          onChange={(v) => update({ purchasedQty: v })}
          placeholder={purchasedLabel}
          align="right"
        />
        {/* Purchased unit */}
        {!hideUnits && (
          <UnitPicker
            value={row.purchasedUnit}
            onChange={(v) => update({ purchasedUnit: v })}
            options={unitOptions}
          />
        )}
        {/* Purchase cost */}
        <CellInput
          value={row.purchasedCost}
          onChange={(v) => update({ purchasedCost: v })}
          placeholder={costLabel}
          align="right"
          prefix={currency.symbol}
        />
        {/* Auto cost */}
        <div className="text-right pr-1.5 text-[14px] font-semibold tabular-nums text-slate-900">
          {result.mismatch ? (
            <span className="text-[11px] font-normal text-amber-600">{t("warning.unitMismatch")}</span>
          ) : (
            <AnimatedNumber value={result.cost} prefix={currency.symbol} decimals={2} currency={currency} />
          )}
        </div>
        {/* Remove */}
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 disabled:cursor-not-allowed sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition"
          title="Remove"
        >
          <X size={14} />
        </button>
      </div>

      {/* Mobile: proper stacked card — no cramped grids, generous touch targets */}
      <div className="sm:hidden py-4 border-b border-slate-100/80 space-y-3">
        {/* Name + remove */}
        <div className="flex items-center gap-2">
          <CellInput
            type="text"
            value={row.name}
            onChange={(v) => update({ name: v })}
            placeholder={namePlaceholder}
          />
          <button
            onClick={onRemove}
            disabled={!canRemove}
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 transition"
          >
            <X size={15} />
          </button>
        </div>

        {/* Consumed — full-width row */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t("mat.consumed")}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <CellInput
                value={row.usedQty}
                onChange={(v) => update({ usedQty: v })}
                placeholder={usedLabel}
              />
            </div>
            {!hideUnits && (
              <UnitPicker
                value={row.usedUnit}
                onChange={(v) => update({ usedUnit: v })}
                options={unitOptions}
              />
            )}
          </div>
        </div>

        {/* Purchased — full-width row */}
        <div className="space-y-1">
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t("materials.columnPurchased")}</div>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <CellInput
                value={row.purchasedQty}
                onChange={(v) => update({ purchasedQty: v })}
                placeholder={purchasedLabel}
              />
            </div>
            {!hideUnits && (
              <UnitPicker
                value={row.purchasedUnit}
                onChange={(v) => update({ purchasedUnit: v })}
                options={unitOptions}
              />
            )}
          </div>
        </div>

        {/* Cost input + auto-cost display side by side */}
        <div className="flex items-end gap-3">
          <div className="flex-1 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{t("mat.purchaseCost")}</div>
            <CellInput
              value={row.purchasedCost}
              onChange={(v) => update({ purchasedCost: v })}
              placeholder={costLabel}
              prefix={currency.symbol}
            />
          </div>
          <div className="text-right shrink-0 pb-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1">{t("mat.autoCost")}</div>
            <div className="text-[17px] font-semibold tabular-nums num-ltr text-slate-900 leading-none">
              {result.mismatch ? (
                <span className="text-[11px] font-normal text-amber-600">{t("warning.unitMismatch")}</span>
              ) : (
                <AnimatedNumber value={result.cost} prefix={currency.symbol} decimals={2} currency={currency} />
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ─── Local / Imported toggle + landed cost sub-row ─── */}
      {/* Only renders for material rows (supportsSource=true). Toggle is a
          small two-segment pill; the expanded fields appear beneath. */}
      {supportsSource && (
        <div className="px-1 pt-1 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Two-segment pill */}
            <div className="inline-flex bg-slate-100/70 rounded-full p-0.5 gap-0.5">
              {[
                { id: "local", label: t("mat.sourceLocal") },
                { id: "imported", label: t("mat.sourceImported") },
              ].map((opt) => {
                const active = (row.source || "local") === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSource(opt.id)}
                    className={`text-[10.5px] font-medium px-2.5 py-1 rounded-full transition ${
                      active
                        ? "bg-white text-teal-800 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
            {/* Landed cost pill — single clean display */}
            {result.landed > 0 && (row.source === "imported" || parseFloat(row.delivery) > 0) && (
              <div className="ml-auto flex flex-col items-end gap-0.5">
                <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium tabular-nums num-ltr">
                  {t("mat.landedCost")}: {currency.symbol}{(result.landed || 0).toLocaleString(currency.locale, { maximumFractionDigits: 2 })}
                </span>
                {parseFloat(row.taxes) > 0 && (
                  <span className="text-[9.5px] text-slate-400 pr-1">
                    {(row.taxRecoverable ?? true) ? t("mat.recoverableTaxNote") : t("mat.taxInLandedCost")}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Local: single Delivery field, only show if needed (keeps row clean by default) */}
          {(row.source || "local") === "local" && (
            <AnimatePresence initial={false}>
              {(parseFloat(row.delivery) > 0 || (row.name && parseFloat(row.purchasedCost) > 0)) && (
                <motion.div
                  key="local-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.18 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("mat.delivery")}</div>
                      <CellInput
                        value={row.delivery}
                        onChange={(v) => update({ delivery: v })}
                        placeholder="0"
                        prefix={currency.symbol}
                        align="right"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Imported: 4 expanded fields. Tax field has an inline Recoverable checkbox. */}
          <AnimatePresence initial={false}>
            {row.source === "imported" && (
              <motion.div
                key="imported-fields"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden"
              >
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("mat.freight")}</div>
                    <CellInput value={row.freight} onChange={(v) => update({ freight: v })} placeholder="0" prefix={currency.symbol} align="right" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("mat.duty")}</div>
                    <CellInput value={row.duty} onChange={(v) => update({ duty: v })} placeholder="0" prefix={currency.symbol} align="right" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("mat.taxAmount")}</div>
                    <CellInput value={row.taxes} onChange={(v) => update({ taxes: v })} placeholder="0" prefix={currency.symbol} align="right" />
                    {parseFloat(row.taxes) > 0 && (
                      <label className="flex items-center gap-1 mt-1 pl-1 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={row.taxRecoverable ?? true}
                          onChange={(e) => update({ taxRecoverable: e.target.checked })}
                          className="w-3 h-3 accent-teal-600"
                        />
                        <span className="text-[10px] text-slate-400">{t("mat.taxRecoverable")}</span>
                      </label>
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("mat.clearing")}</div>
                    <CellInput value={row.clearing} onChange={(v) => update({ clearing: v })} placeholder="0" prefix={currency.symbol} align="right" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {overUsed && (
        <div className="flex items-center gap-1.5 text-[11.5px] text-amber-600 pl-1.5 pb-2 -mt-1">
          <AlertTriangle size={11} strokeWidth={2.4} />
          {t("warning.usedExceedsPurchased")}
        </div>
      )}
      {importedBlank && (
        <div className="flex items-center gap-1.5 text-[11.5px] text-amber-600 pl-1.5 pb-2 -mt-1">
          <AlertTriangle size={11} strokeWidth={2.4} />
          {t("mat.warningImportedBlank")}
        </div>
      )}
      {isPartial && (
        <div className="flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 mt-1 mb-1 self-start">
          <AlertTriangle size={11} strokeWidth={2.4} className="shrink-0" />
          {t("row.incomplete")}
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// CostSection — wraps a list of rows with header, total, add button
// ─────────────────────────────────────────────────────────────
function CostSection({
  icon: Icon,
  title,
  hint,
  rows,
  setRows,
  newRow,
  total,
  currency,
  columns,
  namePlaceholders,
  rowProps,
  addLabel,
  open,
  onToggle,
  chips,
  hasWarning,
  units,
  emptyHint,
  prefilledRowIds,        // Set<string> — row IDs to render as prefilled
  clearPrefilledRowId,    // (id) => void — called when a row is edited
}) {
  const update = (id, next) => {
    if (clearPrefilledRowId) clearPrefilledRowId(id);
    setRows(rows.map((r) => (r.id === id ? next : r)));
  };
  const remove = (id) => setRows(rows.filter((r) => r.id !== id));
  const add = () => setRows([...rows, newRow()]);
  const addNamed = (name) => setRows([...rows, { ...newRow(), name }]);

  // Scroll the newly added row into view when row count grows
  const sentinelRef = useRef(null);
  const lastCountRef = useRef(rows.length);
  useEffect(() => {
    if (rows.length > lastCountRef.current && sentinelRef.current) {
      sentinelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
    lastCountRef.current = rows.length;
  }, [rows.length]);

  const filledCount = rows.filter(
    (r) => r.name || r.usedQty || r.purchasedQty || r.purchasedCost
  ).length;

  // Build explainer lines for filled rows. For imported materials we show
  // a multi-piece landed-cost breakdown; for local rows with delivery, we
  // surface the delivery line; for everything else it's the simple formula.
  const explainerLines = useMemo(() => {
    return rows
      .map((row) => {
        const result = calcRowCost({
          usedQty: row.usedQty,
          usedUnit: row.usedUnit,
          purchasedQty: row.purchasedQty,
          purchasedUnit: row.purchasedUnit,
          purchasedCost: row.purchasedCost,
          source: row.source,
          delivery: row.delivery,
          freight: row.freight,
          duty: row.duty,
          taxes: row.taxes,
          clearing: row.clearing,
        });
        if (!result.valid) return null;
        const name = row.name || "Item";
        const u = parseFloat(row.usedQty) || 0;
        const p = parseFloat(row.purchasedQty) || 0;
        const sym = currency.symbol;
        const fmt = (n) => `${sym}${(parseFloat(n) || 0).toLocaleString(currency.locale)}`;
        const landed = result.landed || 0;
        if (row.source === "imported") {
          // Build breakdown pieces only if any imported cost is filled
          const parts = [];
          parts.push(`Material ${fmt(row.purchasedCost)}`);
          if (parseFloat(row.freight) > 0) parts.push(`Freight ${fmt(row.freight)}`);
          if (parseFloat(row.duty) > 0) parts.push(`Duty ${fmt(row.duty)}`);
          if (parseFloat(row.taxes) > 0) parts.push(`Taxes ${fmt(row.taxes)}`);
          if (parseFloat(row.clearing) > 0) parts.push(`Clearing ${fmt(row.clearing)}`);
          return `${name} (imported): ${parts.join(" + ")} = landed ${sym}${landed.toLocaleString(currency.locale)}. ${u} ${row.usedUnit} ÷ ${p} ${row.purchasedUnit} × ${sym}${landed.toLocaleString(currency.locale)} = ${sym}${result.cost.toFixed(2)}`;
        }
        if (parseFloat(row.delivery) > 0) {
          return `${name}: ${fmt(row.purchasedCost)} + delivery ${fmt(row.delivery)} = landed ${sym}${landed.toLocaleString(currency.locale)}. ${u} ${row.usedUnit} ÷ ${p} ${row.purchasedUnit} × ${sym}${landed.toLocaleString(currency.locale)} = ${sym}${result.cost.toFixed(2)}`;
        }
        return `${name}: ${u} ${row.usedUnit} ÷ ${p} ${row.purchasedUnit} × ${fmt(row.purchasedCost)} = ${sym}${result.cost.toFixed(2)}`;
      })
      .filter(Boolean);
  }, [rows, currency]);

  return (
    <section className={`border-b border-slate-100/60 last:border-0`}>
      <SectionHeader
        icon={Icon}
        title={title}
        hint={hint}
        open={open}
        onToggle={onToggle}
        total={total}
        currency={currency}
        badge={filledCount > 0 ? `${filledCount}` : null}
        warning={hasWarning ? "Some rows have warnings" : null}
        units={units}
        complete={filledCount > 0 && total > 0}
      />
      <Collapse open={open}>
        <div className="pb-3 pt-1">
          <ChipRow items={chips} onPick={addNamed} />

          {/* Column headers (desktop only) */}
          <div
            className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium"
            style={{
              gridTemplateColumns: rowProps.hideUnits
                ? "minmax(0,1.6fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,1fr) minmax(0,1fr) 28px"
                : "minmax(0,1.5fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.9fr) minmax(0,0.9fr) 28px",
            }}
          >
            {columns.map((c, i) => (
              <div key={i} className={c.align === "right" ? "text-right pr-1.5" : "pl-1.5"}>
                {c.label}
              </div>
            ))}
            <div />
          </div>

          <AnimatePresence initial={false}>
            {rows.map((row, i) => (
              <CostRow
                key={row.id}
                row={row}
                currency={currency}
                namePlaceholder={namePlaceholders[i % namePlaceholders.length]}
                onChange={(next) => update(row.id, next)}
                onRemove={() => remove(row.id)}
                canRemove={rows.length > 1}
                isPrefilled={prefilledRowIds ? prefilledRowIds.has(row.id) : false}
                {...rowProps}
              />
            ))}
          </AnimatePresence>

          <div ref={sentinelRef} aria-hidden="true" />

          {filledCount === 0 && emptyHint && (
            <EmptyHint icon={<Icon size={13} className="text-slate-300" strokeWidth={2} />}>
              {emptyHint}
            </EmptyHint>
          )}

          <button
            onClick={add}
            className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-teal-700 px-2 py-2 -ml-2 rounded-lg hover:bg-teal-50/50 transition min-h-[40px]"
          >
            <Plus size={13} strokeWidth={2.4} />
            {addLabel}
          </button>

          <Explainer lines={explainerLines} />
        </div>
      </Collapse>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────
// Row factories
// ─────────────────────────────────────────────────────────────
const id = () => Math.random().toString(36).slice(2, 9);

// ─────────────────────────────────────────────────────────────
// Template storage service — uses localStorage for persistence.
// Templates save the FULL state structure, not just totals.
// Keys are namespaced "costix:tpl:{mode}" — each mode stores its
// own JSON array so quick/batch/monthly don't collide.
// ─────────────────────────────────────────────────────────────
const TPL_KEY_PREFIX = "costix:tpl";

function _lsKey(mode) { return `${TPL_KEY_PREFIX}:${mode}`; }

function _lsRead(mode) {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(_lsKey(mode)) || "[]"); }
  catch { return []; }
}

function _lsWrite(mode, items) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(_lsKey(mode), JSON.stringify(items)); }
  catch {}
}

async function tplList(mode) {
  const items = _lsRead(mode);
  items.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  return items;
}

async function tplSave(mode, tpl) {
  const record = {
    ...tpl,
    id: tpl.id || id(),
    mode,
    updatedAt: Date.now(),
    createdAt: tpl.createdAt || Date.now(),
  };
  try {
    const items = _lsRead(mode).filter(t => t.id !== record.id);
    items.push(record);
    _lsWrite(mode, items);
    return record;
  } catch {
    return null;
  }
}

async function tplDelete(mode, templateId) {
  try {
    const items = _lsRead(mode).filter(t => t.id !== templateId);
    _lsWrite(mode, items);
    return true;
  } catch {
    return false;
  }
}

// Format a timestamp as a short, readable string.
function formatTimestamp(ts, locale) {
  if (!ts) return "";
  try {
    return new Date(ts).toLocaleString(locale, {
      year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return new Date(ts).toLocaleString();
  }
}

const newMaterial = () => ({
  id: id(),
  name: "",
  usedQty: "",
  usedUnit: "KG",
  purchasedQty: "",
  purchasedUnit: "KG",
  purchasedCost: "",
  // Local / Imported costing fields (default = local, all extra fields empty)
  source: "local",
  delivery: "",
  freight: "",
  duty: "",
  taxes: "",
  taxRecoverable: true,   // VAT/GST recoverable by default — excluded from product cost
  clearing: "",
});

const newLabor = () => ({
  id: id(),
  name: "",
  usedQty: "",
  usedUnit: "Hour",
  purchasedQty: "",
  purchasedUnit: "Hour",
  purchasedCost: "",
});

const newPackaging = () => ({
  id: id(),
  name: "",
  usedQty: "",
  usedUnit: "Piece",
  purchasedQty: "",
  purchasedUnit: "Piece",
  purchasedCost: "",
});

// ─────────────────────────────────────────────────────────────
// Result row (sidebar)
// ─────────────────────────────────────────────────────────────
function ResultRow({ label, value, decimals = 0, prefix = "", muted, currency }) {
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-slate-100 last:border-0">
      <span className="text-[13.5px] text-slate-500">{label}</span>
      <span
        className={`tabular-nums font-medium ${
          muted ? "text-slate-700 text-[15px]" : "text-slate-900 text-[17px]"
        }`}
      >
        <AnimatedNumber value={value} prefix={prefix} decimals={decimals} currency={currency} />
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar
// ─────────────────────────────────────────────────────────────
function TabBar({ tab, setTab }) {
  const t = useT();
  const tabs = [
    { id: "quick", label: t("tab.quickCost"), icon: Calculator },
    { id: "batch", label: t("tab.batch"), icon: Layers },
    { id: "saved", label: t("tab.saved"), icon: Bookmark },
    // Monthly hidden from MVP — financially misleading until rebuilt properly
    // { id: "monthly", label: t("tab.monthly"), icon: TrendingUp },
  ];
  return (
    <div className="flex justify-center px-4">
      <div className="inline-flex bg-slate-100/80 backdrop-blur rounded-2xl p-1 gap-1">
        {tabs.map((tb) => {
          const active = tab === tb.id;
          const Icon = tb.icon;
          return (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              className="relative px-3 sm:px-5 py-2.5 rounded-xl text-[13px] sm:text-[14px] font-medium transition-colors"
            >
              {active && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative flex items-center gap-1.5 ${
                  active ? "text-teal-800" : "text-slate-500"
                }`}
              >
                <Icon size={15} strokeWidth={2.2} />
                {tb.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SMART SAVE & PREFILL — Template modals
// Used by Quick Cost, Batch, and Monthly. Templates persist via the
// localStorage so the user's products survive page reloads.
// ─────────────────────────────────────────────────────────────

// Compact pill button used in action bars to open the templates UI.
// Opens a small menu with "Save" and "Load" actions.
function TemplatesButton({ onSave, onLoad, loadedTemplate, mode }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-800 px-2.5 py-2 rounded-xl transition border border-slate-200 bg-white"
        title={t("tpl.button")}
      >
        <FolderOpen size={13} strokeWidth={2.2} />
        {t("tpl.button")}
        {loadedTemplate && (
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-600 ml-0.5" />
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.08)] overflow-hidden z-50"
          >
            <button
              onClick={() => { setOpen(false); onSave(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-slate-800 hover:bg-teal-50 transition"
            >
              <BookmarkPlus size={14} className="text-teal-700" strokeWidth={2.2} />
              <div className="flex-1">
                <div className="font-medium">{loadedTemplate ? t("tpl.update") : t("tpl.save")}</div>
                {loadedTemplate && (
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">{loadedTemplate.name}</div>
                )}
              </div>
            </button>
            {loadedTemplate && (
              <button
                onClick={() => { setOpen(false); onSave("duplicate"); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-slate-800 hover:bg-teal-50 transition border-t border-slate-100"
              >
                <Copy size={14} className="text-teal-700" strokeWidth={2.2} />
                <span className="font-medium">{t("tpl.duplicate")}</span>
              </button>
            )}
            <button
              onClick={() => { setOpen(false); onLoad(); }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] text-slate-800 hover:bg-teal-50 transition border-t border-slate-100"
            >
              <FolderOpen size={14} className="text-teal-700" strokeWidth={2.2} />
              <span className="font-medium">{t("tpl.load")}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generic modal shell
function Modal({ open, onClose, children, maxWidth = "max-w-md" }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 print:hidden"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} bg-white rounded-t-3xl sm:rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.18)] overflow-hidden`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────
// SAVED COSTINGS VIEW
// Unified history panel showing all Quick Cost + Batch records,
// sorted newest-first. Each card expands to show Open / Duplicate actions.
// ─────────────────────────────────────────────────────────────
function SavedCostingsView({ onOpen }) {
  const t = useT();
  const { lang } = React.useContext(LangContext);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);

  const reload = () => {
    setLoading(true);
    Promise.all([tplList("quick"), tplList("batch")]).then(([quick, batch]) => {
      const all = [
        ...quick.map((r) => ({ ...r, calcMode: r.calcMode || "quick" })),
        ...batch.map((r) => ({ ...r, calcMode: r.calcMode || "batch" })),
      ].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setRecords(all);
      setLoading(false);
    });
  };

  useEffect(() => { reload(); }, []);

  const doDelete = async (record) => {
    if (typeof window !== "undefined" && !window.confirm(t("tpl.deleteConfirm"))) return;
    const storageMode = record.calcMode === "batch" ? "batch" : "quick";
    await tplDelete(storageMode, record.id);
    setRecords((prev) => prev.filter((r) => r.id !== record.id));
    if (selectedId === record.id) setSelectedId(null);
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 text-[14px]">…</div>;
  }

  if (records.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={24} className="text-slate-300" strokeWidth={1.8} />
        </div>
        <h2 className="text-[16px] font-semibold text-slate-900 mb-1.5">{t("tpl.button")}</h2>
        <p className="text-[13.5px] text-slate-500 leading-relaxed max-w-xs mx-auto">{t("sc.emptyHint")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-[20px] font-bold text-slate-900 tracking-tight">{t("tpl.button")}</h1>
        <p className="text-[13px] text-slate-500 mt-1">{t("tpl.modalLoadHint")}</p>
      </div>

      <div className="space-y-2">
        {records.map((record) => {
          const isSelected = selectedId === record.id;
          const isQuick = record.calcMode !== "batch";
          const currSymbol = CURRENCIES.find((c) => c.code === record.currencyCode)?.symbol || "";

          return (
            <div
              key={record.id}
              className={`bg-white rounded-2xl border transition-all ${isSelected ? "border-teal-300 ring-1 ring-teal-200/60 shadow-sm" : "border-slate-100 hover:border-slate-200"}`}
            >
              {/* Summary row — always visible */}
              <button
                onClick={() => setSelectedId(isSelected ? null : record.id)}
                className="w-full text-left px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  {/* Mode badge */}
                  <div className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider ${isQuick ? "bg-teal-50 text-teal-700" : "bg-indigo-50 text-indigo-700"}`}>
                    {isQuick ? t("tab.quickCost") : t("tab.batch")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[14.5px] font-semibold text-slate-900 truncate leading-snug">
                      {record.name || "—"}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">{formatTimestamp(record.updatedAt, lang)}</span>
                      {record.unitCost > 0 && (
                        <>
                          <span className="text-slate-300 text-[10px]">·</span>
                          <span className="text-[11.5px] text-slate-600 font-medium tabular-nums num-ltr">
                            {currSymbol}{formatSmart(record.unitCost, lang, 2)}/{t("sc.unit")}
                          </span>
                        </>
                      )}
                      {record.margin != null && record.totalCost > 0 && (
                        <>
                          <span className="text-slate-300 text-[10px]">·</span>
                          <span className="text-[11.5px] text-slate-500 tabular-nums num-ltr">
                            {formatNumber(record.margin, lang, 1)}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Delete */}
                    <button
                      onClick={(e) => { e.stopPropagation(); doDelete(record); }}
                      className="w-7 h-7 flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                      title={t("tpl.delete")}
                    >
                      <Trash2 size={13} />
                    </button>
                    {/* Expand chevron */}
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isSelected ? "rotate-180" : ""}`} />
                  </div>
                </div>
              </button>

              {/* Expanded actions */}
              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div
                    key="actions"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-slate-100">
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold mb-2 pl-0.5">
                        {t("tpl.chooseTitle")}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {/* Open Original */}
                        <button
                          onClick={() => { onOpen(record, "edit"); setSelectedId(null); }}
                          className="text-left p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition"
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Pencil size={12} className="text-teal-700" strokeWidth={2.3} />
                            <span className="text-[13px] font-semibold text-slate-900">{t("tpl.chooseEdit")}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 leading-snug">{t("tpl.chooseEditHint")}</div>
                        </button>

                        {/* Duplicate & Edit */}
                        <button
                          onClick={() => { onOpen(record, "prefill"); setSelectedId(null); }}
                          className="text-left p-3 rounded-xl text-white"
                          style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}
                        >
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <Copy size={12} className="text-white/90" strokeWidth={2.3} />
                            <span className="text-[13px] font-semibold">{t("tpl.choosePrefill")}</span>
                          </div>
                          <div className="text-[11px] text-teal-100 leading-snug">{t("tpl.choosePrefillHint")}</div>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Save modal — asks for a template name, persists the snapshot.
// mode: "quick" | "batch" | "monthly"
// buildSnapshot: () => object of full state
// loadedTemplate: when set, "update existing" radio is the default
// onSaved(template, action): callback when saved successfully
function TemplateSaveModal({ open, onClose, mode, buildSnapshot, loadedTemplate, forceDuplicate, onSaved }) {
  const t = useT();
  const [name, setName] = useState("");
  const [action, setAction] = useState(loadedTemplate && !forceDuplicate ? "update" : "new");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      // Reset to a sensible default each time the modal opens
      if (loadedTemplate && !forceDuplicate) {
        setName(loadedTemplate.name);
        setAction("update");
      } else {
        // For duplicates pre-fill "Copy of X"
        if (forceDuplicate && loadedTemplate) {
          setName(`${loadedTemplate.name} (copy)`);
        } else {
          setName("");
        }
        setAction("new");
      }
    }
  }, [open, loadedTemplate, forceDuplicate]);

  const canSave = name.trim().length > 0 && !saving;

  const doSave = async () => {
    if (!canSave) return;
    setSaving(true);
    const snapshot = buildSnapshot();
    const tplBase = {
      ...snapshot,
      name: name.trim(),
    };
    let record;
    if (action === "update" && loadedTemplate && !forceDuplicate) {
      record = await tplSave(mode, { ...tplBase, id: loadedTemplate.id, createdAt: loadedTemplate.createdAt });
      if (record) onSaved(record, "updated");
    } else {
      // New (or duplicate) — generate a fresh id
      record = await tplSave(mode, { ...tplBase, id: id() });
      if (record) onSaved(record, forceDuplicate ? "duplicated" : "saved");
    }
    setSaving(false);
    if (record) onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-5 sm:px-6 pt-5 pb-1">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">{t("tpl.modalSaveTitle")}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
            <X size={16} />
          </button>
        </div>
        <p className="text-[13px] text-slate-500 mt-1.5 leading-snug">{t("tpl.modalSaveHint")}</p>
      </div>
      <div className="px-5 sm:px-6 py-4 space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5">{t("tpl.nameLabel")}</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("tpl.namePlaceholder")}
            autoFocus
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,118,110,0.10)] transition"
            onKeyDown={(e) => { if (e.key === "Enter" && canSave) doSave(); }}
          />
        </div>
        {loadedTemplate && !forceDuplicate && (
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: "update", label: t("tpl.update") },
              { id: "new", label: t("tpl.saveNew") },
            ].map((opt) => {
              const active = action === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setAction(opt.id)}
                  className={`text-[12.5px] font-medium px-3 py-2.5 rounded-xl border transition ${
                    active
                      ? "bg-teal-50 border-teal-300 text-teal-800"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
      <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 justify-end">
        <button onClick={onClose} className="text-[13px] font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition">
          {t("tpl.cancel")}
        </button>
        <button
          onClick={doSave}
          disabled={!canSave}
          className="text-[13px] font-semibold text-white px-4 py-2 rounded-xl transition hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}
        >
          {forceDuplicate ? t("tpl.duplicate") : action === "update" ? t("tpl.update") : t("tpl.save")}
        </button>
      </div>
    </Modal>
  );
}

// Load modal — lists saved templates, lets user search, pick one,
// and choose: "Edit original" or "Use as prefilled values".
function TemplateLoadModal({ open, onClose, mode, onPick }) {
  const t = useT();
  const { lang } = React.useContext(LangContext);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSelected(null);
    setQuery("");
    tplList(mode).then((list) => {
      setTemplates(list);
      setLoading(false);
    });
  }, [open, mode]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return templates;
    return templates.filter((tpl) => (tpl.name || "").toLowerCase().includes(q));
  }, [templates, query]);

  const doDelete = async (tpl) => {
    if (typeof window !== "undefined" && !window.confirm(t("tpl.deleteConfirm"))) return;
    const ok = await tplDelete(mode, tpl.id);
    if (ok) setTemplates((arr) => arr.filter((x) => x.id !== tpl.id));
  };

  const choose = (intent) => {
    if (!selected) return;
    onPick(selected, intent);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      <div className="px-5 sm:px-6 pt-5 pb-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[17px] font-semibold text-slate-900 tracking-tight">{t("tpl.modalLoadTitle")}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition">
            <X size={16} />
          </button>
        </div>
        <p className="text-[13px] text-slate-500 mt-1.5 leading-snug">{t("tpl.modalLoadHint")}</p>
      </div>

      {/* Search */}
      <div className="px-5 sm:px-6 pb-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={2.2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("tpl.searchPlaceholder")}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-[13.5px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-teal-600 focus:bg-white focus:shadow-[0_0_0_3px_rgba(15,118,110,0.08)] transition"
          />
        </div>
      </div>

      {/* Template list */}
      <div className="max-h-[50vh] overflow-y-auto px-3 sm:px-4 pb-2">
        {loading ? (
          <div className="text-center text-[13px] text-slate-400 py-10">…</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[13px] text-slate-400 py-10 px-4 leading-relaxed">
            {templates.length === 0 ? t("tpl.loadEmpty") : `— "${query}"`}
          </div>
        ) : (
          <div className="space-y-1.5">
            {filtered.map((tpl) => {
              const active = selected?.id === tpl.id;
              return (
                <button
                  key={tpl.id}
                  onClick={() => setSelected(tpl)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                    active ? "bg-teal-50/80 ring-1 ring-teal-300" : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                    <Bookmark size={14} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-[14px] font-medium truncate ${active ? "text-teal-900" : "text-slate-900"}`}>
                      {tpl.name || "—"}
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-slate-400">{formatTimestamp(tpl.updatedAt, lang)}</span>
                      {tpl.unitCost > 0 && (
                        <span className="text-[10.5px] text-teal-700 bg-teal-50 px-1.5 py-0 rounded font-medium tabular-nums num-ltr">
                          {tpl.currencyCode ? (CURRENCIES.find(c => c.code === tpl.currencyCode)?.symbol || "") : ""}{formatNumber(tpl.unitCost, lang, 2)}/unit
                        </span>
                      )}
                      {tpl.margin != null && tpl.totalCost > 0 && (
                        <span className="text-[10.5px] text-slate-400 tabular-nums num-ltr">
                          {formatNumber(tpl.margin, lang, 1)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); doDelete(tpl); }}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                    title={t("tpl.delete")}
                  >
                    <Trash2 size={13} />
                  </button>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Action row — appears once a template is selected */}
      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100"
          >
            <div className="px-5 sm:px-6 py-4 bg-slate-50/60">
              <div className="text-[11.5px] uppercase tracking-wider text-slate-500 font-semibold mb-2">
                {t("tpl.chooseTitle")}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => choose("edit")}
                  className="text-left p-3 bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 rounded-xl transition"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Pencil size={13} className="text-teal-700" strokeWidth={2.3} />
                    <span className="text-[13px] font-semibold text-slate-900">{t("tpl.chooseEdit")}</span>
                  </div>
                  <div className="text-[11.5px] text-slate-500 leading-snug">{t("tpl.chooseEditHint")}</div>
                </button>
                <button
                  onClick={() => choose("prefill")}
                  className="text-left p-3 rounded-xl transition text-white"
                  style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={13} className="text-white/90" strokeWidth={2.3} />
                    <span className="text-[13px] font-semibold">{t("tpl.choosePrefill")}</span>
                  </div>
                  <div className="text-[11.5px] text-teal-50/90 leading-snug">{t("tpl.choosePrefillHint")}</div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

// Small banner that appears at the top of a mode when a template is
// loaded — shows whether we're editing the original or prefilled.
function TemplateBanner({ loadedTemplate, prefilled, onClear }) {
  const t = useT();
  if (!loadedTemplate) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className={`mb-4 flex items-center gap-2.5 rounded-xl px-3.5 py-2 border ${
        prefilled
          ? "bg-teal-50/60 border-teal-200/80"
          : "bg-amber-50/60 border-amber-200/70"
      }`}
    >
      <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${prefilled ? "bg-teal-600 text-white" : "bg-amber-500 text-white"}`}>
        {prefilled ? <Sparkles size={12} strokeWidth={2.4} /> : <Pencil size={12} strokeWidth={2.4} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-[12px] font-semibold tracking-tight truncate ${prefilled ? "text-teal-900" : "text-amber-900"}`}>
          {prefilled ? t("tpl.banner.prefilled") : t("tpl.banner.editing")}
        </div>
        <div className={`text-[11.5px] truncate ${prefilled ? "text-teal-700/80" : "text-amber-700/80"}`}>
          {loadedTemplate.name}
        </div>
      </div>
      <button
        onClick={onClear}
        className="shrink-0 text-[11.5px] font-medium text-slate-500 hover:text-slate-900 px-2 py-1 rounded-md hover:bg-white/60 transition"
      >
        {t("tpl.banner.exit")}
      </button>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// QUICK COST CALCULATOR — all sections share the same row style
// ─────────────────────────────────────────────────────────────
function QuickCost({ currency }) {
  const t = useT();
  const { lang } = React.useContext(LangContext);
  // Category label helper — short noun forms used in the cost breakdown sidebar
  const catLabel = (k) => {
    const map = {
      Materials: t("cat.materials"),
      Labor: t("cat.labor"),
      Packaging: t("cat.packaging"),
      Electricity: t("cat.electricity"),
      Rent: t("cat.rent"),
      Other: t("cat.other"),
      Machines: t("cat.machines"),
    };
    return map[k] || k;
  };
  // ── Autosave helpers ────────────────────────────────────────
  const QC_SAVE_KEY = "costix:quick:autosave";
  const _saved = React.useMemo(() => lsGet(QC_SAVE_KEY, null), []);

  const [form, setForm] = useState(_saved?.form ?? {
    name: "",
    units: "",
    pricingMode: "margin",
    margin: "30",
    markup: "40",
    targetProfit: "",
  });

  // Each cost category is a list of rows
  const [materials, setMaterials] = useState(_saved?.materials ?? [newMaterial()]);
  const [labor, setLabor] = useState(_saved?.labor ?? [newLabor()]);
  const [packaging, setPackaging] = useState(_saved?.packaging ?? [newPackaging()]);

  // Electricity: special — single proportional calc
  const [electricity, setElectricity] = useState(_saved?.electricity ?? { unitsUsed: "", billUnits: "", billAmount: "" });

  // Rent: smart allocation — only the production portion contributes to product cost
  const [rent, setRent] = useState(_saved?.rent ?? {
    monthlyRent: "",
    factoryPct: "50",
    warehousePct: "30",
    officePct: "20",
    daysUsed: "",
    daysInMonth: "30",
    includeWarehouse: false,
  });

  // Other: free-form one-off line items
  const [otherRows, setOtherRows] = useState(_saved?.otherRows ?? [{ id: id(), name: "", amount: "" }]);

  // Machine depreciation (optional)
  const [machinesEnabled, setMachinesEnabled] = useState(_saved?.machinesEnabled ?? false);
  const [machineMethod, setMachineMethod] = useState(_saved?.machineMethod ?? "time");
  const [timeMachines, setTimeMachines] = useState(_saved?.timeMachines ?? [
    { id: id(), name: "", cost: "", life: "", daysUsed: "", daysInYear: "365" },
  ]);
  const [unitMachines, setUnitMachines] = useState(_saved?.unitMachines ?? [
    { id: id(), name: "", cost: "", capacity: "", batchUnits: "" },
  ]);

  // Which sections are open. Materials is open by default; the rest closed.
  const [openSections, setOpenSections] = useState({
    materials: true,
    labor: false,
    electricity: false,
    rent: false,
    packaging: false,
    other: false,
    machines: false,
    whatif: false,
  });
  const toggle = (key) =>
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));

  // Mobile summary sheet expanded state
  const [mobileSummaryOpen, setMobileSummaryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState([]);

  // Simple vs Advanced mode. Default to Simple — first-experience is critical.
  const [mode, setMode] = useState(_saved?.mode ?? "simple");
  const isSimple = mode === "simple";

  // What-If scenarios — only relevant in Advanced mode
  const [whatIfScenarios, setWhatIfScenarios] = useState([]);

  // ─── Template / save-prefill state ─────────────────────────
  // loadedTemplate: the template record currently in the calculator (or null)
  // intent: "edit" or "prefill" — controls whether saving updates the original
  // prefilledKeys: Set of field keys that were loaded from a template; cleared on edit
  const [loadedTemplate, setLoadedTemplate] = useState(null);
  const [templateIntent, setTemplateIntent] = useState(null); // "edit" | "prefill" | null
  const [prefilledKeys, setPrefilledKeys] = useState(() => new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [duplicateMode, setDuplicateMode] = useState(false);
  const [savedToast, setSavedToast] = useState(null); // { label, ts }

  // Remove keys from the prefilled set when the user edits them
  const clearPrefilledKey = (key) => {
    setPrefilledKeys((s) => {
      if (!s.has(key)) return s;
      const next = new Set(s);
      next.delete(key);
      return next;
    });
  };
  // Bulk-clear all row IDs of a category (used when the whole row array is rebuilt)
  const clearPrefilledByPrefix = (prefix) => {
    setPrefilledKeys((s) => {
      const next = new Set();
      for (const k of s) if (!k.startsWith(prefix)) next.add(k);
      return next;
    });
  };

  // Silent autosave indicator — flashes "✓ Saved" for 1.5s after each write
  const [autoSaved, setAutoSaved] = useState(false);
  const _autoSavedTimer = useRef(null);

  // Debounced autosave — 800ms after last change, silently write to localStorage
  const _autosaveTimer = useRef(null);
  useEffect(() => {
    if (_autosaveTimer.current) clearTimeout(_autosaveTimer.current);
    _autosaveTimer.current = setTimeout(() => {
      lsSet(QC_SAVE_KEY, {
        form, materials, labor, packaging, electricity, rent, otherRows,
        machinesEnabled, machineMethod, timeMachines, unitMachines, mode,
      });
      // Flash the saved indicator
      setAutoSaved(true);
      if (_autoSavedTimer.current) clearTimeout(_autoSavedTimer.current);
      _autoSavedTimer.current = setTimeout(() => setAutoSaved(false), 1500);
    }, 800);
    return () => clearTimeout(_autosaveTimer.current);
  }, [form, materials, labor, packaging, electricity, rent, otherRows,
      machinesEnabled, machineMethod, timeMachines, unitMachines, mode]);

  const n = (v) => parseFloat(v) || 0;
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  // Auto-expand sections when they get meaningful data
  useEffect(() => {
    const hasData = (rows) =>
      rows.some((r) => r.name || r.usedQty || r.purchasedQty || r.purchasedCost);
    setOpenSections((s) => ({
      ...s,
      labor: s.labor || hasData(labor),
      packaging: s.packaging || hasData(packaging),
      electricity:
        s.electricity || !!(electricity.unitsUsed || electricity.billUnits || electricity.billAmount),
      rent: s.rent || !!(rent.monthlyRent || rent.daysUsed),
      other: s.other || otherRows.some((r) => r.name || r.amount),
      machines: s.machines || machinesEnabled,
    }));
  }, [labor, packaging, electricity, rent, otherRows, machinesEnabled]);

  // Quick-add chips: labor only (materials/packaging are too industry-specific)
  // ─── Smart context-aware chip suggestions ───────────────────
  // Read material names already entered and suggest related items.
  // Groups are keyed by keyword fragments in material names.
  const MATERIAL_SUGGESTIONS = {
    cotton:    ["Thread", "Buttons", "Label", "Zipper"],
    fabric:    ["Thread", "Needle", "Label", "Lining"],
    flour:     ["Yeast", "Salt", "Sugar", "Packaging bag"],
    wheat:     ["Yeast", "Salt", "Oil", "Packaging bag"],
    plastic:   ["Color additive", "Packaging", "Machine operator"],
    granule:   ["Color additive", "Mold release", "Machine operator"],
    wood:      ["Glue", "Sandpaper", "Varnish", "Screws"],
    leather:   ["Thread", "Buckle", "Lining", "Glue"],
    steel:     ["Welding rod", "Paint", "Machine operator"],
    iron:      ["Welding rod", "Paint", "Grinder disc"],
    foam:      ["Cover fabric", "Glue", "Zipper"],
    paper:     ["Ink", "Binding glue", "Packaging"],
    sugar:     ["Packaging bag", "Flavoring", "Color"],
    milk:      ["Packaging", "Preservative", "Label"],
    rubber:    ["Adhesive", "Color additive", "Machine operator"],
    glass:     ["Adhesive", "Packaging foam", "Label"],
    ceramic:   ["Glaze", "Kiln fuel", "Packaging foam"],
  };

  const smartMaterialChips = useMemo(() => {
    const entered = materials.map(m => (m.name || "").toLowerCase());
    if (entered.every(n => !n)) return ["Cotton fabric", "Plastic granules", "Flour", "Leather", "Steel"];
    const suggestions = new Set();
    entered.forEach(name => {
      Object.entries(MATERIAL_SUGGESTIONS).forEach(([keyword, items]) => {
        if (name.includes(keyword)) {
          items.forEach(item => {
            if (!entered.some(n => n === item.toLowerCase())) suggestions.add(item);
          });
        }
      });
    });
    return suggestions.size > 0 ? [...suggestions].slice(0, 6) : [];
  }, [materials]);

  const chips = {
    materials: smartMaterialChips,
    labor: LABOR_ROLES,
    packaging: ["Poly bag", "Carton box", "Label sticker", "Bubble wrap", "Hang tag"],
  };

  // ─── Template snapshot/apply helpers ───────────────────────
  // Build a serializable snapshot of the full calculator state.
  // Costing metadata (unitCost, margin, price, totalCost) is stored alongside
  // inputs so the Saved Costings list can display results without recalculating.
  const buildSnapshot = () => ({
    name: form.name || "Untitled",
    form: { ...form },
    materials: materials.map((r) => ({ ...r })),
    labor: labor.map((r) => ({ ...r })),
    packaging: packaging.map((r) => ({ ...r })),
    electricity: { ...electricity },
    rent: { ...rent },
    otherRows: otherRows.map((r) => ({ ...r })),
    machinesEnabled,
    machineMethod,
    timeMachines: timeMachines.map((r) => ({ ...r })),
    unitMachines: unitMachines.map((r) => ({ ...r })),
    mode,
    whatIfScenarios: [...whatIfScenarios],
    currencyCode: currency.code,
    // Costing results at time of save — for display in the saved list
    unitCost: r.cpu,
    price: r.price,
    margin: r.realizedMargin,
    totalCost: r.total,
    calcMode: "quick",
  });

  // Apply a template to the calculator state.
  // intent: "edit" → straightforward load, original will be updated on Save
  // intent: "prefill" → load, but mark every field as prefilled so the UI tints them
  const applyTemplate = (tpl, intent) => {
    if (!tpl) return;
    // Regenerate row IDs so future row changes don't accidentally collide.
    // Track the new IDs as prefilled keys so each row glows until edited.
    const reIdRow = (r) => ({ ...r, id: id() });
    const newMats = (tpl.materials || []).map(reIdRow);
    const newLab = (tpl.labor || []).map(reIdRow);
    const newPack = (tpl.packaging || []).map(reIdRow);
    const newOther = (tpl.otherRows || []).map(reIdRow);
    const newTime = (tpl.timeMachines || []).map(reIdRow);
    const newUnit = (tpl.unitMachines || []).map(reIdRow);

    setForm({ ...(tpl.form || {}) });
    setMaterials(newMats.length ? newMats : [newMaterial()]);
    setLabor(newLab.length ? newLab : [newLabor()]);
    setPackaging(newPack.length ? newPack : [newPackaging()]);
    setElectricity({ ...(tpl.electricity || { unitsUsed: "", billUnits: "", billAmount: "" }) });
    setRent({ ...(tpl.rent || { monthlyRent: "", factoryPct: "50", warehousePct: "30", officePct: "20", daysUsed: "", daysInMonth: "30", includeWarehouse: false }) });
    setOtherRows(newOther.length ? newOther : [{ id: id(), name: "", amount: "" }]);
    setMachinesEnabled(!!tpl.machinesEnabled);
    setMachineMethod(tpl.machineMethod || "time");
    setTimeMachines(newTime.length ? newTime : [{ id: id(), name: "", cost: "", life: "", daysUsed: "", daysInYear: "365" }]);
    setUnitMachines(newUnit.length ? newUnit : [{ id: id(), name: "", cost: "", capacity: "", batchUnits: "" }]);
    setMode(tpl.mode || "simple");
    setWhatIfScenarios(tpl.whatIfScenarios || []);

    // Track which fields are prefilled (only in prefill intent)
    if (intent === "prefill") {
      const keys = new Set();
      // Form fields
      ["name", "units", "margin", "markup", "targetProfit"].forEach((k) => keys.add(`form.${k}`));
      keys.add("electricity");
      keys.add("rent");
      newMats.forEach((r) => keys.add(`mat:${r.id}`));
      newLab.forEach((r) => keys.add(`lab:${r.id}`));
      newPack.forEach((r) => keys.add(`pack:${r.id}`));
      newOther.forEach((r) => keys.add(`other:${r.id}`));
      newTime.forEach((r) => keys.add(`tm:${r.id}`));
      newUnit.forEach((r) => keys.add(`um:${r.id}`));
      setPrefilledKeys(keys);
    } else {
      setPrefilledKeys(new Set());
    }
    setLoadedTemplate(tpl);
    setTemplateIntent(intent);
  };

  const clearLoadedTemplate = () => {
    setLoadedTemplate(null);
    setTemplateIntent(null);
    setPrefilledKeys(new Set());
  };

  const onTemplateSaved = (record, label) => {
    setLoadedTemplate(record);
    setTemplateIntent("edit");
    setPrefilledKeys(new Set()); // saving clears the prefilled signal
    const labelMap = { saved: t("tpl.savedJustNow"), updated: t("tpl.updated"), duplicated: t("tpl.duplicated") };
    setSavedToast({ label: labelMap[label] || labelMap.saved, ts: Date.now() });
    setTimeout(() => setSavedToast(null), 2000);
  };

  const sumRows = (rows) =>
    rows.reduce(
      (s, r) =>
        s +
        calcRowCost({
          usedQty: r.usedQty,
          usedUnit: r.usedUnit,
          purchasedQty: r.purchasedQty,
          purchasedUnit: r.purchasedUnit,
          purchasedCost: r.purchasedCost,
          // Landed-cost fields — materials only; labor/packaging rows
          // don't have these so they default to 0 and behave unchanged.
          source: r.source,
          delivery: r.delivery,
          freight: r.freight,
          duty: r.duty,
          taxes: r.taxes,
          taxRecoverable: r.taxRecoverable ?? true,
          clearing: r.clearing,
        }).cost,
      0
    );

  const materialTotal = useMemo(() => sumRows(materials), [materials]);
  const laborTotal = useMemo(() => sumRows(labor), [labor]);
  const packagingTotal = useMemo(() => sumRows(packaging), [packaging]);

  const electricityTotal = useMemo(() => {
    const u = n(electricity.unitsUsed);
    const tu = n(electricity.billUnits);
    const a = n(electricity.billAmount);
    if (u <= 0 || tu <= 0 || a <= 0) return 0;
    return (u / tu) * a;
  }, [electricity]);

  const rentTotal = useMemo(() => {
    const m = n(rent.monthlyRent);
    const d = n(rent.daysUsed);
    const dim = n(rent.daysInMonth) || 30;
    if (m <= 0 || d <= 0) return 0;
    const fp = n(rent.factoryPct);
    const wp = n(rent.warehousePct);
    const op = n(rent.officePct);
    const productionPct = fp + (rent.includeWarehouse ? wp : 0);
    // Block if active allocation exceeds 100% — mathematically impossible
    const totalAllocated = productionPct + op;
    if (totalAllocated > 100) return 0;
    return (d / dim) * m * (productionPct / 100);
  }, [rent]);

  // Pre-computed rent helpers (used in UI helper line & allocation bar)
  const rentMath = useMemo(() => {
    const fp = n(rent.factoryPct);
    const wp = n(rent.warehousePct);
    const op = n(rent.officePct);
    const productionPct = fp + (rent.includeWarehouse ? wp : 0);
    // Active total: only fields relevant to the current toggle state
    const total = productionPct + op;
    const overLimit = total > 100;  // mathematically impossible — hard invalid
    const allocated = !overLimit ? n(rent.monthlyRent) * (productionPct / 100) : 0;
    return { fp, wp, op, total, productionPct, allocated, overLimit };
  }, [rent]);

  const otherTotal = useMemo(
    () => otherRows.reduce((s, r) => s + n(r.amount), 0),
    [otherRows]
  );

  // Machine depreciation total — only counts if enabled, and only for the active method
  const machineTotal = useMemo(() => {
    if (!machinesEnabled) return 0;
    if (machineMethod === "time") {
      return timeMachines.reduce((s, m) => {
        const cost = n(m.cost);
        const life = n(m.life);
        const days = n(m.daysUsed);
        const diy = n(m.daysInYear) || 365;
        if (cost <= 0 || life <= 0 || days <= 0) return s;
        const annual = cost / life;
        return s + (days / diy) * annual;
      }, 0);
    }
    return unitMachines.reduce((s, m) => {
      const cost = n(m.cost);
      const cap = n(m.capacity);
      const units = n(m.batchUnits);
      if (cost <= 0 || cap <= 0 || units <= 0) return s;
      return s + (cost / cap) * units;
    }, 0);
  }, [machinesEnabled, machineMethod, timeMachines, unitMachines]);

  const r = useMemo(() => {
    const total =
      materialTotal +
      laborTotal +
      electricityTotal +
      rentTotal +
      packagingTotal +
      otherTotal +
      machineTotal;

    const units = n(form.units);

    // Cost per unit
    const cpu = units > 0 ? total / units : 0;

    // Pricing modes
    let price = 0;
    if (form.pricingMode === "markup") {
      const mk = n(form.markup);
      price = cpu * (1 + mk / 100);
    } else if (form.pricingMode === "target") {
      const tp = n(form.targetProfit);
      price = cpu + tp;
    } else {
      // margin mode
      const margin = n(form.margin);
      // margin = (price - cpu) / price → price = cpu / (1 - margin/100)
      const denom = 1 - margin / 100;
      price = denom > 0 ? cpu / denom : cpu;
    }

    const revenue = price * units;
    const profit = revenue - total;
    const realizedMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const markupPct = cpu > 0 ? ((price - cpu) / cpu) * 100 : 0;
    const profitPerUnit = price - cpu;

    // isValid: units entered and > 0 — required before any result is meaningful
    // canExport: also requires cost data and valid rent allocation (not over 100%)
    const isValid = units > 0;
    const canExport = units > 0 && total > 0 && !rentMath.overLimit;

    return {
      total,
      cpu,
      price,
      profit,
      realizedMargin,
      markupPct,
      profitPerUnit,
      units,
      isValid,
      canExport,
    };
  }, [materialTotal, laborTotal, electricityTotal, rentTotal, packagingTotal, otherTotal, machineTotal, form]);

  // Smart insights — returns {tone, key, params} objects.
  // Translation happens at render time via resolveInsightText() so `t` is NOT
  // a dependency here. Language switches therefore never cause a totals desync.
  const insights = useMemo(() => {
    const out = [];
    if (r.total <= 0) return out;
    const share = (v) => (r.total > 0 ? (v / r.total) * 100 : 0);
    const m = share(materialTotal);
    const l = share(laborTotal);
    const e = share(electricityTotal);
    const p = share(packagingTotal);
    const rt = share(rentTotal);

    if (r.realizedMargin < 0) {
      out.push({ tone: "red", key: "insight.lossSelling", params: {} });
    } else if (r.realizedMargin < 10) {
      out.push({ tone: "amber", key: "insight.marginLow", params: { margin: r.realizedMargin.toFixed(1) } });
    } else if (r.realizedMargin >= 35) {
      out.push({ tone: "green", key: "insight.marginHealthy", params: { margin: r.realizedMargin.toFixed(0) } });
    }

    const cats = [
      { catKey: "Materials", v: m }, { catKey: "Labor", v: l },
      { catKey: "Electricity", v: e }, { catKey: "Packaging", v: p },
      { catKey: "Rent", v: rt },
    ];
    cats.sort((a, b) => b.v - a.v);
    if (cats[0].v >= 50) {
      out.push({ tone: "neutral", key: "insight.biggestLever", params: { catKey: cats[0].catKey, pct: cats[0].v.toFixed(0) } });
    } else if (cats[0].v >= 35) {
      out.push({ tone: "neutral", key: "insight.largestCost", params: { catKey: cats[0].catKey, pct: cats[0].v.toFixed(0) } });
    }

    if (l >= 40) out.push({ tone: "amber", key: "insight.laborHigh", params: {} });
    if (p >= 15) out.push({ tone: "amber", key: "insight.packagingHigh", params: {} });

    return out.slice(0, 3);
  // t intentionally excluded — resolveInsightText translates at render time
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [r, materialTotal, laborTotal, electricityTotal, packagingTotal, rentTotal, machineTotal, otherTotal]);

  // AI Suggestions removed — the Insights panel covers what matters simply and clearly.

  // ─────────────────────────────────────────────────────────────
  // WHAT-IF: classify costs as variable (scale with units) vs fixed
  // (constant regardless of production volume within capacity).
  //
  // Variable:  materials, packaging  — direct material consumption
  // Fixed:     electricity, rent, machines, other, labor
  //            (in small factories labor is paid monthly; the same
  //            workforce can produce more units, so labor cost
  //            doesn't scale 1:1 with output)
  // ─────────────────────────────────────────────────────────────
  const costSplit = useMemo(() => {
    const variable = materialTotal + packagingTotal;
    const fixed = laborTotal + electricityTotal + rentTotal + otherTotal + machineTotal;
    return { variable, fixed };
  }, [materialTotal, packagingTotal, laborTotal, electricityTotal, rentTotal, otherTotal, machineTotal]);

  // Simulate the costing for a different production quantity, holding all other
  // inputs constant. Returns the same shape as `r`.
  const simulateProduction = (newUnits) => {
    const units = parseFloat(newUnits) || 0;
    if (units <= 0) return null;
    const baseUnits = r.units;
    // Variable costs scale linearly with units; fixed costs stay the same
    const variable = baseUnits > 0 ? (costSplit.variable / baseUnits) * units : 0;
    const total = variable + costSplit.fixed;
    const cpu = total / units;
    let price = 0;
    if (form.pricingMode === "markup") {
      price = cpu * (1 + n(form.markup) / 100);
    } else if (form.pricingMode === "target") {
      price = cpu + n(form.targetProfit);
    } else {
      const denom = 1 - n(form.margin) / 100;
      price = denom > 0 ? cpu / denom : cpu;
    }
    const revenue = price * units;
    const profit = revenue - total;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    return { units, total, cpu, price, profit, margin };
  };

  // Default what-if scenarios when the user first opens the section:
  // current × 2, × 5, × 10
  const ensureScenarios = () => {
    if (whatIfScenarios.length === 0 && r.units > 0) {
      setWhatIfScenarios([
        String(Math.round(r.units * 2)),
        String(Math.round(r.units * 5)),
        String(Math.round(r.units * 10)),
      ]);
    }
  };

  // Identify the biggest cost contributor (for highlighting in the breakdown)
  const topCostCategory = useMemo(() => {
    if (r.total <= 0) return null;
    const cats = [
      { name: "Materials", value: materialTotal },
      { name: "Labor", value: laborTotal },
      { name: "Electricity", value: electricityTotal },
      { name: "Rent", value: rentTotal },
      { name: "Packaging", value: packagingTotal },
      { name: "Other", value: otherTotal },
      ...(machinesEnabled ? [{ name: "Machines", value: machineTotal }] : []),
    ].filter((c) => c.value > 0);
    if (cats.length === 0) return null;
    cats.sort((a, b) => b.value - a.value);
    const top = cats[0];
    const pct = (top.value / r.total) * 100;
    // Only highlight if there's a meaningful winner (>30% and more than one category)
    if (pct < 30 || cats.length === 1) return null;
    return { name: top.name, pct, value: top.value };
  }, [r.total, materialTotal, laborTotal, electricityTotal, rentTotal, packagingTotal, otherTotal, machineTotal, machinesEnabled]);

  // Save a snapshot of the current calculation
  const saveSnapshot = () => {
    if (r.total <= 0) return;
    setSnapshots((prev) => [
      ...prev,
      {
        id: id(),
        name: form.name || `Snapshot ${prev.length + 1}`,
        price: r.price,
        cpu: r.cpu,
        profit: r.profit,
        margin: r.realizedMargin,
        savedAt: new Date(),
      },
    ]);
  };

  const removeSnapshot = (sid) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== sid));
  };

  // ─────────────────────────────────────────────────────────────
  // PROFESSIONAL PDF EXPORT
  // Renders a standalone HTML report into a hidden iframe and prints it.
  // The report has its own styling — independent of the app's UI.
  // ─────────────────────────────────────────────────────────────
  const exportPDF = () => {
    if (typeof window === "undefined") return;
    const sym = currency.symbol;
    const fmt = (n, d = 2) => `${sym}${formatNumber(n || 0, currency.locale, d)}`;
    const now = new Date();
    const today = now.toLocaleDateString(currency.locale, { year: "numeric", month: "long", day: "numeric" });
    const timestamp = now.toLocaleString(currency.locale, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    const productName = form.name || "Untitled Product";

    // Row inclusion: exclude truly blank default rows (no name + no qty + no cost).
    // Rows with partial data are kept and flagged with an incomplete warning.
    const rowHasData = (m) =>
      m.name ||
      parseFloat(m.usedQty) > 0 ||
      parseFloat(m.purchasedQty) > 0 ||
      parseFloat(m.purchasedCost) > 0;

    const materialRows = materials
      .filter(rowHasData)
      .map((m) => {
        const result = calcRowCost(m);
        const isImported = m.source === "imported";
        const incomplete = !result.valid && !result.mismatch && (parseFloat(m.purchasedCost) > 0 || parseFloat(m.usedQty) > 0);
        const hasAddon = (isImported && (parseFloat(m.freight) > 0 || parseFloat(m.duty) > 0 || parseFloat(m.taxes) > 0 || parseFloat(m.clearing) > 0)) || parseFloat(m.delivery) > 0;
        const taxRecov = isImported ? (m.taxRecoverable ?? true) : false;
        return {
          name: m.name || "—",
          source: isImported ? t("mat.sourceImported") : t("mat.sourceLocal"),
          used: `${m.usedQty || 0} ${m.usedUnit}`,
          purchased: `${m.purchasedQty || 0} ${m.purchasedUnit}`,
          purchaseCost: fmt(parseFloat(m.purchasedCost) || 0),
          freight: isImported ? fmt(parseFloat(m.freight) || 0) : "—",
          duty: isImported ? fmt(parseFloat(m.duty) || 0) : "—",
          taxes: isImported ? fmt(parseFloat(m.taxes) || 0) : "—",
          taxRecoverable: taxRecov,
          recoverableTax: result.recoverableTax > 0 ? fmt(result.recoverableTax) : null,
          clearing: isImported ? fmt(parseFloat(m.clearing) || 0) : "—",
          delivery: !isImported && parseFloat(m.delivery) > 0 ? fmt(parseFloat(m.delivery)) : "—",
          landed: fmt(result.landed || 0),
          landedLabel: hasAddon ? t("mat.landedCost") : t("mat.purchaseCostTotal"),
          cost: result.valid ? fmt(result.cost) : "—",
          isImported,
          hasExtra: isImported || parseFloat(m.delivery) > 0,
          incomplete,
          mismatch: result.mismatch,
        };
      });
    const laborRows = labor
      .filter(rowHasData)
      .map((m) => {
        const result = calcRowCost(m);
        const incomplete = !result.valid && (parseFloat(m.purchasedCost) > 0 || parseFloat(m.usedQty) > 0);
        return { name: m.name || "—", used: `${m.usedQty || 0} ${m.usedUnit}`, monthly: `${m.purchasedQty || 0} ${m.purchasedUnit}`, salary: fmt(parseFloat(m.purchasedCost) || 0), cost: result.valid ? fmt(result.cost) : "—", incomplete };
      });
    const packagingRows = packaging
      .filter(rowHasData)
      .map((m) => {
        const result = calcRowCost(m);
        const incomplete = !result.valid && (parseFloat(m.purchasedCost) > 0 || parseFloat(m.usedQty) > 0);
        return { name: m.name || "—", used: `${m.usedQty || 0} ${m.usedUnit}`, purchased: `${m.purchasedQty || 0} ${m.purchasedUnit}`, purchaseCost: fmt(parseFloat(m.purchasedCost) || 0), cost: result.valid ? fmt(result.cost) : "—", incomplete };
      });
    const otherFilled = otherRows.filter((o) => o.name || parseFloat(o.amount) > 0);

    const machineRows = machinesEnabled
      ? (machineMethod === "time" ? timeMachines : unitMachines)
          .filter((m) => m.name || m.cost)
          .map((m) => {
            if (machineMethod === "time") {
              const c = parseFloat(m.cost) || 0, life = parseFloat(m.life) || 0, days = parseFloat(m.daysUsed) || 0, diy = parseFloat(m.daysInYear) || 365;
              const annual = life > 0 ? c / life : 0;
              const rowCost = c > 0 && life > 0 && days > 0 ? (days / diy) * annual : 0;
              return { name: m.name || "—", cost: fmt(c), life: `${life} yr`, used: `${days}/${diy} days`, rowCost: fmt(rowCost) };
            }
            const c = parseFloat(m.cost) || 0, cap = parseFloat(m.capacity) || 0, units = parseFloat(m.batchUnits) || 0;
            const per = cap > 0 ? c / cap : 0;
            const rowCost = c > 0 && cap > 0 && units > 0 ? per * units : 0;
            return { name: m.name || "—", cost: fmt(c), life: `${cap.toLocaleString(currency.locale)} units cap`, used: `${units.toLocaleString(currency.locale)} units`, rowCost: fmt(rowCost) };
          })
      : [];

    const status = profitStatus(r.realizedMargin, r.total, t, { price: r.price, cpu: r.cpu });

    const html = `<!doctype html><html lang="${lang}" dir="${LANGUAGES.find(l=>l.code===lang)?.rtl?'rtl':'ltr'}"><head><meta charset="utf-8"><title>${escapeHTML(productName)} — ${escapeHTML(t("report.titleCosting"))} · Costix</title>
<style>
  @page { size: A4; margin: 20mm 18mm; @bottom-center { content: "Page " counter(page) " of " counter(pages); font-size: 9px; color: #9CA3AF; } }
  * { box-sizing: border-box; }
  html, body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #111827; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-size: 11.5px; line-height: 1.5; }
  .report { max-width: 740px; margin: 0 auto; }
  /* ── Brand header ── */
  .brand { display: flex; align-items: center; justify-content: space-between; padding-bottom: 14px; border-bottom: 2px solid #0F766E; margin-bottom: 20px; }
  .brand-left { display: flex; align-items: center; gap: 10px; }
  .logo { width: 32px; height: 32px; border-radius: 9px; background: linear-gradient(135deg, #10847A, #0A5E57); display: flex; align-items: center; justify-content: center; }
  .brand-name { font-weight: 700; font-size: 16px; letter-spacing: -0.03em; color: #0F172A; }
  .brand-tag { font-size: 10px; color: #6B7280; letter-spacing: 0.01em; }
  .brand-date { font-size: 10px; color: #9CA3AF; text-align: right; line-height: 1.4; }
  /* ── Doc header ── */
  .doc-title { font-size: 24px; font-weight: 700; letter-spacing: -0.025em; color: #0F172A; margin-bottom: 4px; }
  .doc-meta { display: flex; gap: 20px; font-size: 10.5px; color: #6B7280; margin-bottom: 20px; flex-wrap: wrap; }
  .doc-meta b { color: #374151; font-weight: 600; }
  /* ── Hero summary card ── */
  .hero { padding: 20px 24px; border-radius: 14px; background: linear-gradient(135deg, #0F766E 0%, #0A5E57 100%); color: white; margin-bottom: 24px; page-break-inside: avoid; }
  .hero-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.09em; opacity: 0.8; font-weight: 700; margin-bottom: 6px; }
  .hero-price { font-size: 36px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: plaintext; }
  .hero-sub { margin-top: 5px; font-size: 11.5px; opacity: 0.8; }
  .hero-status { display: inline-block; padding: 2px 9px; background: rgba(255,255,255,0.2); border-radius: 999px; font-size: 10px; margin-left: 10px; vertical-align: middle; font-weight: 600; }
  .metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2); }
  .metric-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.09em; opacity: 0.75; font-weight: 600; }
  .metric-value { font-size: 16px; font-weight: 700; margin-top: 3px; font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: plaintext; }
  /* ── Section headings ── */
  h2 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #9CA3AF; margin: 28px 0 10px 0; font-weight: 700; border-bottom: 1px solid #F3F4F6; padding-bottom: 6px; }
  /* ── Tables ── */
  table { width: 100%; border-collapse: collapse; page-break-inside: auto; }
  thead { display: table-header-group; }
  tr { page-break-inside: avoid; }
  th, td { padding: 8px 10px; text-align: left; font-size: 10.5px; border-bottom: 1px solid #F3F4F6; }
  th { background: #F9FAFB; color: #6B7280; font-weight: 700; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 2px solid #E5E7EB; border-top: 1px solid #E5E7EB; }
  td.r, th.r { text-align: right; font-variant-numeric: tabular-nums; direction: ltr; unicode-bidi: plaintext; }
  tr:nth-child(even) td { background: #FAFAFA; }
  tr.totalrow td { font-weight: 700; background: #F3F4F6; border-top: 1px solid #E5E7EB; border-bottom: 2px solid #E5E7EB; font-size: 11px; }
  tr.incomplete-row td { background: #FFFBEB; color: #92400E; }
  .warn-badge { display: inline-block; font-size: 9px; padding: 1px 5px; border-radius: 4px; background: #FEF3C7; color: #B45309; border: 1px solid #FCD34D; margin-left: 5px; font-weight: 600; }
  /* ── Breakdown card ── */
  .breakdown-card { border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; page-break-inside: avoid; }
  .group-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.09em; color: #9CA3AF; font-weight: 700; padding: 10px 14px 5px; background: #FAFAFA; }
  .breakdown-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 14px; font-size: 11px; border-bottom: 1px solid #F9FAFB; }
  .breakdown-row:last-child { border-bottom: none; }
  .breakdown-row.top { background: #ECFDF5; color: #065F46; font-weight: 600; }
  .breakdown-row span:last-child { font-variant-numeric: tabular-nums; font-weight: 600; direction: ltr; unicode-bidi: plaintext; }
  .pct { color: #9CA3AF; margin-left: 7px; font-size: 10px; font-weight: 400; }
  .breakdown-total { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; font-size: 12px; font-weight: 700; color: #111827; border-top: 2px solid #E5E7EB; }
  /* ── Insights ── */
  .insights { background: #F9FAFB; border: 1px solid #F3F4F6; border-radius: 10px; padding: 12px 16px; page-break-inside: avoid; }
  .insight { display: flex; gap: 9px; padding: 5px 0; font-size: 11px; border-bottom: 1px solid #F3F4F6; }
  .insight:last-child { border-bottom: none; }
  .dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 7px; flex-shrink: 0; }
  .dot.red { background: #EF4444; } .dot.amber { background: #F59E0B; } .dot.green { background: #10B981; } .dot.neutral { background: #D1D5DB; }
  /* ── Footer ── */
  .footer { margin-top: 36px; padding-top: 12px; border-top: 1px solid #E5E7EB; font-size: 10px; color: #9CA3AF; display: flex; justify-content: space-between; align-items: center; }
  .footer-brand { font-weight: 600; color: #6B7280; }
</style></head>
<body>
<div class="report">
  <!-- Brand header -->
  <div class="brand">
    <div class="brand-left">
      <div class="logo">
        <svg width="20" height="20" viewBox="0 0 36 36" fill="none">
          <rect x="5.5" y="5.5" width="22" height="5" rx="2.5" fill="white"/>
          <rect x="5.5" y="13" width="8.5" height="5" rx="2.5" fill="white" fill-opacity="0.55"/>
          <rect x="5.5" y="20" width="8.5" height="5" rx="2.5" fill="white" fill-opacity="0.75"/>
          <rect x="5.5" y="26.5" width="22" height="5" rx="2.5" fill="white"/>
        </svg>
      </div>
      <div>
        <div class="brand-name">Costix</div>
        <div class="brand-tag">${escapeHTML(t("app.tagline"))}</div>
      </div>
    </div>
    <div class="brand-date">
      <div>${today}</div>
      <div>${timestamp}</div>
    </div>
  </div>

  <!-- Document title -->
  <div class="doc-title">${escapeHTML(productName)}</div>
  <div class="doc-meta">
    <span><b>${escapeHTML(t("report.titleCosting"))}</b></span>
    <span>${currency.code} · ${currency.symbol}</span>
    <span>${formatNumber(r.units, currency.locale, 0)} ${escapeHTML(t("whatif.unitsLabel"))}</span>
    ${status ? `<span style="color:${status.tone === "green" ? "#059669" : status.tone === "amber" ? "#D97706" : "#DC2626"};font-weight:600;">${escapeHTML(status.label)}</span>` : ""}
  </div>

  <!-- Hero summary -->
  <div class="hero">
    <div class="hero-label">${escapeHTML(t("summary.suggestedPrice"))}</div>
    <div class="hero-price">${fmt(r.price)}</div>
    <div class="hero-sub">${escapeHTML(t("summary.perUnit"))} &nbsp;·&nbsp; ${formatNumber(r.realizedMargin, currency.locale, 1)}% ${escapeHTML(t("summary.margin"))}</div>
    <div class="metric-grid">
      <div><div class="metric-label">${escapeHTML(t("summary.costPerUnit"))}</div><div class="metric-value">${fmt(r.cpu)}</div></div>
      <div><div class="metric-label">${escapeHTML(t("summary.profitPerUnit"))}</div><div class="metric-value">${fmt(r.profitPerUnit)}</div></div>
      <div><div class="metric-label">${escapeHTML(t("summary.totalProfit"))}</div><div class="metric-value">${fmt(r.profit, 0)}</div></div>
      <div><div class="metric-label">${escapeHTML(t("summary.totalCost"))}</div><div class="metric-value">${fmt(r.total, 0)}</div></div>
    </div>
  </div>

  <h2>${escapeHTML(t("summary.costBreakdown"))}</h2>
  <div class="breakdown-card">
    ${renderBreakdownGroup(t("summary.groupDirect"), [
      { name: catLabel("Materials"), v: materialTotal, key: "Materials" },
      { name: catLabel("Labor"), v: laborTotal, key: "Labor" },
      { name: catLabel("Packaging"), v: packagingTotal, key: "Packaging" },
    ], r.total, topCostCategory?.name, fmt, currency.locale)}
    ${renderBreakdownGroup(t("summary.groupIndirect"), [
      { name: catLabel("Electricity"), v: electricityTotal, key: "Electricity" },
      { name: catLabel("Rent"), v: rentTotal, key: "Rent" },
      { name: catLabel("Other"), v: otherTotal, key: "Other" },
    ], r.total, topCostCategory?.name, fmt, currency.locale)}
    ${machinesEnabled ? renderBreakdownGroup(t("summary.groupOptional"), [{ name: catLabel("Machines"), v: machineTotal, key: "Machines" }], r.total, topCostCategory?.name, fmt, currency.locale) : ""}
    <div class="breakdown-total">
      <span>${escapeHTML(t("summary.totalCost"))}</span><span>${fmt(r.total)}</span>
    </div>
  </div>

  ${materialRows.length ? `
  <h2>${escapeHTML(t("report.titleMaterials"))}</h2>
  <table>
    <thead><tr>
      <th>${escapeHTML(t("materials.columnName"))}</th>
      <th>${escapeHTML(t("mat.sourceLocal"))}/${escapeHTML(t("mat.sourceImported"))}</th>
      <th>${escapeHTML(t("materials.columnQty"))}</th>
      <th>${escapeHTML(t("materials.columnPurchased"))}</th>
      <th class="r">${escapeHTML(t("mat.purchaseCostTotal"))} / ${escapeHTML(t("mat.landedCost"))}</th>
      <th class="r">${escapeHTML(t("materials.columnAuto"))}</th>
    </tr></thead>
    <tbody>
      ${materialRows.map((r) => {
        const sourcePill = `<span style="display:inline-block;font-size:9px;padding:1px 6px;border-radius:6px;background:${r.isImported ? '#0F766E' : '#F3F4F6'};color:${r.isImported ? 'white' : '#6B7280'};font-weight:500;">${escapeHTML(r.source)}</span>`;
        const warnBadge = (r.incomplete || r.mismatch) ? `<span class="warn-badge">${r.mismatch ? escapeHTML(t("warning.unitMismatch")) : "⚠ Incomplete"}</span>` : "";
        const rowClass = (r.incomplete || r.mismatch) ? ' class="incomplete-row"' : '';
        const mainRow = `<tr${rowClass}>
          <td>${escapeHTML(r.name)}${warnBadge}</td>
          <td>${sourcePill}</td>
          <td>${escapeHTML(r.used)}</td>
          <td>${escapeHTML(r.purchased)}</td>
          <td class="r">${r.landed}</td>
          <td class="r">${r.cost}</td>
        </tr>`;
        // Sub-row showing the breakdown for imported (or local with delivery)
        if (!r.hasExtra) return mainRow;
        const pieces = r.isImported
          ? (() => {
              const parts = [
                `${escapeHTML(t("mat.materialPrice"))} ${r.purchaseCost}`,
                r.freight !== "—" ? `${escapeHTML(t("mat.freight"))} ${r.freight}` : null,
                r.duty !== "—" ? `${escapeHTML(t("mat.duty"))} ${r.duty}` : null,
                r.clearing !== "—" ? `${escapeHTML(t("mat.clearing"))} ${r.clearing}` : null,
              ].filter(Boolean);
              // Non-zero tax: separate recoverable from included
              const taxAmt = parseFloat(r.taxes) > 0 ? r.taxes : null;
              if (taxAmt) {
                if (r.taxRecoverable) {
                  parts.push(`<span style="color:#059669;font-weight:600;">${escapeHTML(t("mat.recoverableTaxNote"))}: ${r.taxes}</span>`);
                } else {
                  parts.push(`${escapeHTML(t("mat.taxAmount"))} ${r.taxes} (${escapeHTML(t("mat.taxRecoverableNo"))})`);
                }
              }
              return parts.join(" &nbsp;+&nbsp; ");
            })()
          : `${escapeHTML(t("materials.columnCost"))} ${r.purchaseCost} · ${escapeHTML(t("mat.delivery"))} ${r.delivery}`;
        const subRow = `<tr><td colspan="6" style="font-size:10px;color:#6B7280;padding:2px 10px 6px;background:#FAFAFA;border-bottom:1px solid #F3F4F6;">${pieces}</td></tr>`;
        return mainRow + subRow;
      }).join("")}
      <tr class="totalrow"><td colspan="5">${escapeHTML(t("report.totalMaterials"))}</td><td class="r">${fmt(materialTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${laborRows.length ? `
  <h2>${escapeHTML(t("report.titleLabor"))}</h2>
  <table>
    <thead><tr><th>${escapeHTML(t("labor.columnRole"))}</th><th>${escapeHTML(t("labor.columnHours"))}</th><th>${escapeHTML(t("labor.columnMonthly"))}</th><th class="r">${escapeHTML(t("labor.columnSalary"))}</th><th class="r">${escapeHTML(t("materials.columnCost"))}</th></tr></thead>
    <tbody>
      ${laborRows.map((r) => {
        const warnBadge = r.incomplete ? `<span class="warn-badge">⚠ Incomplete</span>` : "";
        const rowClass = r.incomplete ? ' class="incomplete-row"' : '';
        return `<tr${rowClass}><td>${escapeHTML(r.name)}${warnBadge}</td><td>${escapeHTML(r.used)}</td><td>${escapeHTML(r.monthly)}</td><td class="r">${r.salary}</td><td class="r">${r.cost}</td></tr>`;
      }).join("")}
      <tr class="totalrow"><td colspan="4">${escapeHTML(t("report.totalLabor"))}</td><td class="r">${fmt(laborTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${electricityTotal > 0 ? `
  <h2>${escapeHTML(catLabel("Electricity"))}</h2>
  <table>
    <tbody>
      <tr><td>${escapeHTML(t("electricity.unitsUsed"))}</td><td class="r">${escapeHTML(electricity.unitsUsed || "0")}</td></tr>
      <tr><td>${escapeHTML(t("electricity.billUnits"))}</td><td class="r">${escapeHTML(electricity.billUnits || "0")}</td></tr>
      <tr><td>${escapeHTML(t("electricity.billAmount"))}</td><td class="r">${fmt(parseFloat(electricity.billAmount) || 0)}</td></tr>
      <tr class="totalrow"><td>${escapeHTML(catLabel("Electricity"))}</td><td class="r">${fmt(electricityTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${rentTotal > 0 ? `
  <h2>${escapeHTML(catLabel("Rent"))}</h2>
  <table>
    <tbody>
      <tr><td>${escapeHTML(t("rent.monthlyRent"))}</td><td class="r">${fmt(parseFloat(rent.monthlyRent) || 0)}</td></tr>
      <tr><td>${escapeHTML(t("rent.factoryPct"))}</td><td class="r">${rentMath.fp}%${rent.includeWarehouse ? ` + ${rentMath.wp}%` : ""}</td></tr>
      <tr><td>${escapeHTML(t("rent.daysUsed"))}</td><td class="r">${rent.daysUsed}/${rent.daysInMonth}</td></tr>
      <tr class="totalrow"><td>${escapeHTML(catLabel("Rent"))}</td><td class="r">${fmt(rentTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${packagingRows.length ? `
  <h2>${escapeHTML(catLabel("Packaging"))}</h2>
  <table>
    <thead><tr><th>${escapeHTML(t("other.columnItem"))}</th><th>${escapeHTML(t("materials.columnQty"))}</th><th>${escapeHTML(t("materials.columnPurchased"))}</th><th class="r">${escapeHTML(t("materials.columnCost"))}</th><th class="r">${escapeHTML(t("materials.columnCost"))}</th></tr></thead>
    <tbody>
      ${packagingRows.map((r) => {
        const warnBadge = r.incomplete ? `<span class="warn-badge">⚠ Incomplete</span>` : "";
        const rowClass = r.incomplete ? ' class="incomplete-row"' : '';
        return `<tr${rowClass}><td>${escapeHTML(r.name)}${warnBadge}</td><td>${escapeHTML(r.used)}</td><td>${escapeHTML(r.purchased)}</td><td class="r">${r.purchaseCost}</td><td class="r">${r.cost}</td></tr>`;
      }).join("")}
      <tr class="totalrow"><td colspan="4">${escapeHTML(catLabel("Packaging"))}</td><td class="r">${fmt(packagingTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${otherFilled.length ? `
  <h2>${escapeHTML(t("other.title"))}</h2>
  <table>
    <thead><tr><th>${escapeHTML(t("other.columnItem"))}</th><th class="r">${escapeHTML(t("other.columnCost"))}</th></tr></thead>
    <tbody>
      ${otherFilled.map((o) => `<tr><td>${escapeHTML(o.name || "—")}</td><td class="r">${fmt(parseFloat(o.amount) || 0)}</td></tr>`).join("")}
      <tr class="totalrow"><td>${escapeHTML(catLabel("Other"))}</td><td class="r">${fmt(otherTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${machinesEnabled && machineRows.length ? `
  <h2>${escapeHTML(t("report.titleMachine"))} · ${escapeHTML(machineMethod === "time" ? t("machines.methodTime") : t("machines.methodProduction"))}</h2>
  <table>
    <thead><tr><th>${escapeHTML(t("machines.columnMachine"))}</th><th class="r">${escapeHTML(t("machines.columnCost"))}</th><th class="r">${escapeHTML(machineMethod === "time" ? t("machines.columnLife") : t("machines.columnCapacity"))}</th><th class="r">${escapeHTML(machineMethod === "time" ? t("machines.columnDaysUsed") : t("machines.columnBatch"))}</th><th class="r">${escapeHTML(t("machines.columnAllocated"))}</th></tr></thead>
    <tbody>
      ${machineRows.map((r) => `<tr><td>${escapeHTML(r.name)}</td><td class="r">${r.cost}</td><td class="r">${escapeHTML(r.life)}</td><td class="r">${escapeHTML(r.used)}</td><td class="r">${r.rowCost}</td></tr>`).join("")}
      <tr class="totalrow"><td colspan="4">${escapeHTML(t("report.totalMachineCost"))}</td><td class="r">${fmt(machineTotal)}</td></tr>
    </tbody>
  </table>` : ""}

  ${insights.length ? `
  <h2>${escapeHTML(t("summary.insights"))}</h2>
  <div class="insights">
    ${insights.map((i) => `<div class="insight"><span class="dot ${i.tone || "neutral"}"></span><span>${escapeHTML(resolveInsightText(i, t))}</span></div>`).join("")}
  </div>` : ""}

  ${!isSimple && whatIfScenarios.length > 0 && r.units > 0 ? `
  <h2>${escapeHTML(t("whatif.title"))}</h2>
  <table>
    <thead><tr><th>${escapeHTML(t("whatif.columnProduction"))}</th><th class="r">${escapeHTML(t("whatif.columnCostPerUnit"))}</th><th class="r">${escapeHTML(t("whatif.columnSellAt"))}</th><th class="r">${escapeHTML(t("whatif.columnProfit"))}</th><th class="r">${escapeHTML(t("whatif.columnMargin"))}</th></tr></thead>
    <tbody>
      <tr style="background: #F9FAFB;">
        <td><b>${escapeHTML(t("whatif.now"))}</b> · ${formatNumber(r.units, currency.locale, 0)} ${escapeHTML(t("whatif.unitsLabel"))}</td>
        <td class="r">${fmt(r.cpu)}</td>
        <td class="r">${fmt(r.price)}</td>
        <td class="r">${fmt(r.profit, 0)}</td>
        <td class="r">${formatNumber(r.realizedMargin, currency.locale, 1)}%</td>
      </tr>
      ${whatIfScenarios.map((q) => {
        const sim = simulateProduction(q);
        if (!sim) return "";
        const delta = r.cpu > 0 ? ((sim.cpu - r.cpu) / r.cpu) * 100 : 0;
        return `<tr>
          <td>${formatNumber(sim.units, currency.locale, 0)} ${escapeHTML(t("whatif.unitsLabel"))}</td>
          <td class="r">${fmt(sim.cpu)}${delta < 0 ? ` <span style="color:#065F46;font-size:9px;">${delta.toFixed(0)}%</span>` : ""}</td>
          <td class="r">${fmt(sim.price)}</td>
          <td class="r">${fmt(sim.profit, 0)}</td>
          <td class="r">${formatNumber(sim.margin, currency.locale, 1)}%</td>
        </tr>`;
      }).join("")}
    </tbody>
  </table>
  <div style="font-size: 10px; color: #6B7280; margin-top: 6px; line-height: 1.5;">
    ${escapeHTML(t("report.note", { amount: fmt(costSplit.fixed, 0) }))} ${escapeHTML(t("report.scaleNote"))}
  </div>` : ""}

  <div class="footer">
    <span class="footer-brand">${escapeHTML(t("report.footer"))}</span>
    <span>${currency.code} ${currency.symbol} · ${timestamp}</span>
  </div>
</div>
<script>window.onload = function(){ /* parent triggers print */ };</script>
</body></html>`;

    // Open in a new window so the browser's "Save as PDF" works reliably.
    // (Iframes inside the app can be blocked from triggering print in some environments.)
    const win = window.open("", "_blank", "noopener,noreferrer,width=900,height=1100");
    if (!win) {
      // Popup blocked — fall back to an in-page overlay with a Print button
      openInPagePdfPreview(html);
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();

    // Wait for fonts/images to settle, then trigger print
    const triggerPrint = () => {
      try {
        win.focus();
        win.print();
      } catch (e) {
        console.error("Print failed:", e);
      }
    };
    if (win.document.readyState === "complete") {
      setTimeout(triggerPrint, 250);
    } else {
      win.addEventListener("load", () => setTimeout(triggerPrint, 250));
    }
  };

  // Fallback: render the report inside an in-page iframe overlay with a Print button.
  // Triggered only if popups are blocked.
  const openInPagePdfPreview = (html) => {
    const overlay = document.createElement("div");
    overlay.style.cssText =
      "position:fixed;inset:0;z-index:9999;background:rgba(15,23,42,0.55);backdrop-filter:blur(4px);display:flex;flex-direction:column;align-items:center;padding:24px;";

    const bar = document.createElement("div");
    bar.style.cssText =
      "width:100%;max-width:820px;background:white;border-radius:12px 12px 0 0;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);";
    bar.innerHTML =
      '<div style="font:600 14px -apple-system,system-ui;color:#111827;">Report preview</div>' +
      '<div style="display:flex;gap:8px;">' +
      '<button id="cl-print" style="background:#0F766E;color:white;border:0;padding:8px 16px;border-radius:8px;font:500 13px -apple-system,system-ui;cursor:pointer;">Print / Save as PDF</button>' +
      '<button id="cl-close" style="background:#F3F4F6;color:#374151;border:0;padding:8px 14px;border-radius:8px;font:500 13px -apple-system,system-ui;cursor:pointer;">Close</button>' +
      "</div>";

    const iframe = document.createElement("iframe");
    iframe.style.cssText =
      "width:100%;max-width:820px;flex:1;border:0;background:white;border-radius:0 0 12px 12px;box-shadow:0 8px 32px rgba(0,0,0,0.15);";

    overlay.appendChild(bar);
    overlay.appendChild(iframe);
    document.body.appendChild(overlay);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();

    bar.querySelector("#cl-print").onclick = () => {
      try {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } catch (e) {
        console.error(e);
      }
    };
    bar.querySelector("#cl-close").onclick = () => {
      document.body.removeChild(overlay);
    };
  };

  // ─────────────────────────────────────────────────────────────
  // PROFESSIONAL XLSX EXPORT (multi-sheet via SheetJS)
  // Community SheetJS doesn't write font/fill/border styles, so we
  // achieve a polished feel through structure: column widths, row
  // heights, merged title bands, locale-aware number formats, and
  // intentional spacer rows between sections.
  // ─────────────────────────────────────────────────────────────
  const exportXLSX = () => {
    const sym = currency.symbol;
    const productName = form.name || "Untitled Product";
    const today = new Date().toLocaleDateString(currency.locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const wb = XLSX.utils.book_new();

    // Number formats — symbol baked into the format string so Excel renders
    // the right currency natively. Quotes escape any character.
    const safeSym = sym.replace(/"/g, '""');
    const FMT_MONEY = `"${safeSym}"#,##0.00`;
    const FMT_MONEY_INT = `"${safeSym}"#,##0`;
    const FMT_PCT = "0.0%";
    const FMT_INT = "#,##0";

    // Builds one sheet with a consistent header band:
    //   row 1: "Costix" brand (small)
    //   row 2: Document title (big)
    //   row 3: meta line (product / currency / date)
    //   row 4: blank
    //   row 5+: caller's content
    const buildSheetWithHeader = (title, contentRows, columnWidths) => {
      const colCount = columnWidths.length;
      const header = [
        [`Costix · ${t("report.titleCosting")}`],
        [title],
        [`${productName}  ·  ${currency.code} ${sym}  ·  ${today}`],
        [],
        ...contentRows,
      ];
      const ws = XLSX.utils.aoa_to_sheet(header);
      ws["!cols"] = columnWidths;
      // Merge the three header rows across all data columns
      const lastColLetter = (n) => {
        let s = "";
        n = n - 1;
        while (n >= 0) {
          s = String.fromCharCode(65 + (n % 26)) + s;
          n = Math.floor(n / 26) - 1;
        }
        return s;
      };
      const last = lastColLetter(colCount);
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: colCount - 1 } },
      ];
      // Row heights — taller title row creates breathing room
      ws["!rows"] = [
        { hpt: 16 }, // brand
        { hpt: 26 }, // title
        { hpt: 16 }, // meta
        { hpt: 8 },  // spacer
      ];
      return ws;
    };

    // Helper to apply a number format to a range of cell addresses
    const applyFormat = (ws, addrs, fmt) => {
      for (const a of addrs) {
        if (ws[a]) {
          ws[a].t = "n";
          ws[a].z = fmt;
        }
      }
    };

    // ─── SHEET 1: SUMMARY ──────────────────────────────────────
    {
      const rows = [
        [t("report.metric"), t("report.value")],
        [t("quick.unitsProduced"), r.units],
        [],
        [t("summary.suggestedPrice"), r.price],
        [t("summary.costPerUnit"), r.cpu],
        [t("summary.profitPerUnit"), r.profitPerUnit],
        [],
        [t("summary.totalCost"), r.total],
        [t("summary.totalProfit"), r.profit],
        [t("summary.margin"), r.realizedMargin / 100],
      ];
      const ws = buildSheetWithHeader(t("report.titleCosting"), rows, [{ wch: 30 }, { wch: 22 }]);
      // Column header row is at row index 5 (1-based) → A5 / B5
      applyFormat(ws, ["B6"], FMT_INT); // units
      applyFormat(ws, ["B8", "B9", "B10"], FMT_MONEY); // selling price, cpu, profit/unit
      applyFormat(ws, ["B12", "B13"], FMT_MONEY); // total cost, total profit
      applyFormat(ws, ["B14"], FMT_PCT);
      // Row heights for summary metric rows
      ws["!rows"] = [
        ...ws["!rows"],
        { hpt: 18 }, // header
        { hpt: 16 }, // units
        { hpt: 8 },  // spacer
        { hpt: 18 }, { hpt: 16 }, { hpt: 16 },
        { hpt: 8 },
        { hpt: 18 }, { hpt: 16 }, { hpt: 16 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Summary");
    }

    // ─── SHEET 2: COST BREAKDOWN ───────────────────────────────
    {
      const items = [
        [catLabel("Materials"), materialTotal, t("summary.groupDirect")],
        [catLabel("Labor"), laborTotal, t("summary.groupDirect")],
        [catLabel("Packaging"), packagingTotal, t("summary.groupDirect")],
        [catLabel("Electricity"), electricityTotal, t("summary.groupIndirect")],
        [catLabel("Rent"), rentTotal, t("summary.groupIndirect")],
        [catLabel("Other"), otherTotal, t("summary.groupIndirect")],
        ...(machinesEnabled ? [[catLabel("Machines"), machineTotal, t("summary.groupOptional")]] : []),
      ].filter(([, v]) => v > 0);

      const rows = [
        [t("report.category"), t("report.group"), t("report.amount"), t("report.shareOfTotal")],
        ...items.map(([name, value, group]) => [
          name,
          group,
          value,
          r.total > 0 ? value / r.total : 0,
        ]),
        [],
        [t("report.totalCost"), "", r.total, 1],
      ];
      const ws = buildSheetWithHeader(t("report.titleBreakdown"), rows, [
        { wch: 22 },
        { wch: 14 },
        { wch: 18 },
        { wch: 18 },
      ]);
      // Format the amount and share columns for every item row
      const firstDataRow = 6; // header at row 5, items start at row 6
      const lastDataRow = firstDataRow + items.length - 1;
      for (let i = firstDataRow; i <= lastDataRow; i++) {
        applyFormat(ws, [`C${i}`], FMT_MONEY);
        applyFormat(ws, [`D${i}`], FMT_PCT);
      }
      // Total row
      const totalRow = lastDataRow + 2;
      applyFormat(ws, [`C${totalRow}`], FMT_MONEY);
      applyFormat(ws, [`D${totalRow}`], FMT_PCT);
      // Row heights for item list — slightly taller for readability
      const rowHeights = [...ws["!rows"], { hpt: 20 }]; // column header
      for (let i = 0; i < items.length; i++) rowHeights.push({ hpt: 18 });
      rowHeights.push({ hpt: 10 }); // spacer
      rowHeights.push({ hpt: 20 }); // total
      ws["!rows"] = rowHeights;
      XLSX.utils.book_append_sheet(wb, ws, "Cost Breakdown");
    }

    // ─── SHEET 3: RAW MATERIALS ────────────────────────────────
    const materialFilled = materials.filter((m) => m.name || m.usedQty);
    if (materialFilled.length > 0) {
      const rows = [
        [
          t("materials.columnName"),
          `${t("mat.sourceLocal")}/${t("mat.sourceImported")}`,
          t("materials.columnQty"),
          t("materials.columnUnit"),
          t("materials.columnPurchased"),
          t("materials.columnUnit"),
          t("mat.materialPrice"),
          t("mat.delivery"),
          t("mat.freight"),
          t("mat.duty"),
          t("mat.taxColNonRecov"),
          t("mat.taxColRecov"),
          t("mat.clearing"),
          t("mat.landedCost"),
          t("machines.columnAllocated"),
        ],
        ...materialFilled.map((m) => {
          const result = calcRowCost(m);
          const isImported = m.source === "imported";
          const taxRecov = isImported ? (m.taxRecoverable ?? true) : false;
          const taxAmt = isImported ? (parseFloat(m.taxes) || 0) : 0;
          return [
            m.name || "—",
            isImported ? t("mat.sourceImported") : t("mat.sourceLocal"),
            parseFloat(m.usedQty) || 0,
            m.usedUnit,
            parseFloat(m.purchasedQty) || 0,
            m.purchasedUnit,
            parseFloat(m.purchasedCost) || 0,
            isImported ? 0 : (parseFloat(m.delivery) || 0),
            isImported ? (parseFloat(m.freight) || 0) : 0,
            isImported ? (parseFloat(m.duty) || 0) : 0,
            taxRecov ? 0 : taxAmt,           // non-recoverable tax (in cost)
            taxRecov ? taxAmt : 0,           // recoverable tax (excluded)
            isImported ? (parseFloat(m.clearing) || 0) : 0,
            result.landed || 0,
            result.cost,
          ];
        }),
        [],
        [t("report.totalMaterials"), "", "", "", "", "", "", "", "", "", "", "", "", "", materialTotal],
      ];
      const ws = buildSheetWithHeader(t("report.titleMaterials"), rows, [
        { wch: 22 }, // Name
        { wch: 11 }, // Source
        { wch: 12 }, // Qty consumed
        { wch: 8 },  // Unit
        { wch: 13 }, // Purchased
        { wch: 8 },  // Unit
        { wch: 14 }, // Material price
        { wch: 11 }, // Delivery
        { wch: 11 }, // Freight
        { wch: 11 }, // Duty
        { wch: 18 }, // Tax (non-recoverable)
        { wch: 18 }, // Tax (recoverable)
        { wch: 14 }, // Clearing
        { wch: 14 }, // Landed
        { wch: 14 }, // Allocated
      ]);
      const firstDataRow = 6;
      const lastDataRow = firstDataRow + materialFilled.length - 1;
      // C,E = quantities (integer); G..O = money (added recoverable tax col → 15 cols total)
      for (let i = firstDataRow; i <= lastDataRow; i++) {
        applyFormat(ws, [`C${i}`, `E${i}`], FMT_INT);
        applyFormat(ws, [`G${i}`, `H${i}`, `I${i}`, `J${i}`, `K${i}`, `L${i}`, `M${i}`, `N${i}`, `O${i}`], FMT_MONEY);
      }
      const totalRow = lastDataRow + 2;
      applyFormat(ws, [`O${totalRow}`], FMT_MONEY);
      const rowHeights = [...ws["!rows"], { hpt: 20 }];
      for (let i = 0; i < materialFilled.length; i++) rowHeights.push({ hpt: 18 });
      rowHeights.push({ hpt: 10 });
      rowHeights.push({ hpt: 20 });
      ws["!rows"] = rowHeights;
      XLSX.utils.book_append_sheet(wb, ws, "Raw Materials");
    }

    // ─── SHEET 4: LABOR ────────────────────────────────────────
    const laborFilled = labor.filter((m) => m.name || m.usedQty);
    if (laborFilled.length > 0) {
      const rows = [
        [t("labor.columnRole"), t("labor.columnHours"), t("materials.columnUnit"), t("labor.columnMonthly"), t("materials.columnUnit"), t("labor.columnSalary"), t("machines.columnAllocated")],
        ...laborFilled.map((m) => {
          const c = calcRowCost(m).cost;
          return [
            m.name || "—",
            parseFloat(m.usedQty) || 0,
            m.usedUnit,
            parseFloat(m.purchasedQty) || 0,
            m.purchasedUnit,
            parseFloat(m.purchasedCost) || 0,
            c,
          ];
        }),
        [],
        [t("report.totalLabor"), "", "", "", "", "", laborTotal],
      ];
      const ws = buildSheetWithHeader(t("report.titleLabor"), rows, [
        { wch: 26 },
        { wch: 14 },
        { wch: 10 },
        { wch: 16 },
        { wch: 10 },
        { wch: 16 },
        { wch: 18 },
      ]);
      const firstDataRow = 6;
      const lastDataRow = firstDataRow + laborFilled.length - 1;
      for (let i = firstDataRow; i <= lastDataRow; i++) {
        applyFormat(ws, [`B${i}`, `D${i}`], FMT_INT);
        applyFormat(ws, [`F${i}`, `G${i}`], FMT_MONEY);
      }
      const totalRow = lastDataRow + 2;
      applyFormat(ws, [`G${totalRow}`], FMT_MONEY);
      const rowHeights = [...ws["!rows"], { hpt: 20 }];
      for (let i = 0; i < laborFilled.length; i++) rowHeights.push({ hpt: 18 });
      rowHeights.push({ hpt: 10 });
      rowHeights.push({ hpt: 20 });
      ws["!rows"] = rowHeights;
      XLSX.utils.book_append_sheet(wb, ws, "Labor");
    }

    // ─── SHEET 5: MACHINE COST (if enabled) ────────────────────
    if (machinesEnabled) {
      const machines = machineMethod === "time" ? timeMachines : unitMachines;
      const machinesFilled = machines.filter((m) => m.name || m.cost);
      if (machinesFilled.length > 0) {
        const isTime = machineMethod === "time";
        const headerRow = isTime
          ? [t("machines.columnMachine"), t("machines.columnCost"), t("machines.columnLife"), t("machines.columnDaysUsed"), t("machines.columnDaysYear"), t("machines.columnAllocated")]
          : [t("machines.columnMachine"), t("machines.columnCost"), t("machines.columnCapacity"), t("machines.columnBatch"), t("machines.columnAllocated")];
        const widths = isTime
          ? [{ wch: 28 }, { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 18 }]
          : [{ wch: 28 }, { wch: 16 }, { wch: 20 }, { wch: 16 }, { wch: 18 }];
        const dataRows = machinesFilled.map((m) => {
          if (isTime) {
            const c = parseFloat(m.cost) || 0,
              life = parseFloat(m.life) || 0,
              days = parseFloat(m.daysUsed) || 0,
              diy = parseFloat(m.daysInYear) || 365;
            const annual = life > 0 ? c / life : 0;
            const rowCost = c > 0 && life > 0 && days > 0 ? (days / diy) * annual : 0;
            return [m.name || "—", c, life, days, diy, rowCost];
          }
          const c = parseFloat(m.cost) || 0,
            cap = parseFloat(m.capacity) || 0,
            units = parseFloat(m.batchUnits) || 0;
          const per = cap > 0 ? c / cap : 0;
          const rowCost = c > 0 && cap > 0 && units > 0 ? per * units : 0;
          return [m.name || "—", c, cap, units, rowCost];
        });
        const totalRow = isTime
          ? [t("report.totalMachineCost"), "", "", "", "", machineTotal]
          : [t("report.totalMachineCost"), "", "", "", machineTotal];
        const rows = [headerRow, ...dataRows, [], totalRow];
        const title = `${t("report.titleMachine")}  ·  ${isTime ? t("machines.methodTime") : t("machines.methodProduction")}`;
        const ws = buildSheetWithHeader(title, rows, widths);

        const firstDataRow = 6;
        const lastDataRow = firstDataRow + dataRows.length - 1;
        const lastCol = String.fromCharCode(65 + headerRow.length - 1); // last col letter
        for (let i = firstDataRow; i <= lastDataRow; i++) {
          applyFormat(ws, [`B${i}`], FMT_MONEY);
          if (isTime) {
            applyFormat(ws, [`C${i}`, `D${i}`, `E${i}`], FMT_INT);
          } else {
            applyFormat(ws, [`C${i}`, `D${i}`], FMT_INT);
          }
          applyFormat(ws, [`${lastCol}${i}`], FMT_MONEY);
        }
        const totalRowNum = lastDataRow + 2;
        applyFormat(ws, [`${lastCol}${totalRowNum}`], FMT_MONEY);

        const rowHeights = [...ws["!rows"], { hpt: 20 }];
        for (let i = 0; i < dataRows.length; i++) rowHeights.push({ hpt: 18 });
        rowHeights.push({ hpt: 10 });
        rowHeights.push({ hpt: 20 });
        ws["!rows"] = rowHeights;
        XLSX.utils.book_append_sheet(wb, ws, "Machine Cost");
      }
    }

    // ─── SHEET 6: WHAT-IF ANALYSIS (advanced + scenarios) ──────
    if (!isSimple && whatIfScenarios.length > 0 && r.units > 0) {
      const dataRows = [
        [r.units, r.cpu, r.price, r.profit, r.realizedMargin / 100],
        ...whatIfScenarios
          .map((q) => {
            const sim = simulateProduction(q);
            if (!sim) return null;
            return [sim.units, sim.cpu, sim.price, sim.profit, sim.margin / 100];
          })
          .filter(Boolean),
      ];
      const rows = [
        [t("whatif.columnProduction"), t("whatif.columnCostPerUnit"), t("whatif.columnSellAt"), t("whatif.columnProfit"), t("whatif.columnMargin")],
        ...dataRows,
        [],
        [t("report.note", { amount: `${sym}${formatNumber(costSplit.fixed, currency.locale, 0)}` })],
        [t("report.scaleNote")],
      ];
      const ws = buildSheetWithHeader(t("report.titleWhatIf"), rows, [
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 18 },
        { wch: 12 },
      ]);
      const firstDataRow = 6;
      const lastDataRow = firstDataRow + dataRows.length - 1;
      for (let i = firstDataRow; i <= lastDataRow; i++) {
        applyFormat(ws, [`A${i}`], FMT_INT);
        applyFormat(ws, [`B${i}`, `C${i}`, `D${i}`], FMT_MONEY);
        applyFormat(ws, [`E${i}`], FMT_PCT);
      }
      // Merge the two note lines across the full width
      const noteRow1 = lastDataRow + 2;
      const noteRow2 = lastDataRow + 3;
      ws["!merges"] = [
        ...(ws["!merges"] || []),
        { s: { r: noteRow1 - 1, c: 0 }, e: { r: noteRow1 - 1, c: 4 } },
        { s: { r: noteRow2 - 1, c: 0 }, e: { r: noteRow2 - 1, c: 4 } },
      ];

      const rowHeights = [...ws["!rows"], { hpt: 20 }]; // header
      rowHeights.push({ hpt: 22 }); // "Now" baseline — slightly taller
      for (let i = 1; i < dataRows.length; i++) rowHeights.push({ hpt: 18 });
      rowHeights.push({ hpt: 12 });
      rowHeights.push({ hpt: 18 });
      rowHeights.push({ hpt: 18 });
      ws["!rows"] = rowHeights;
      XLSX.utils.book_append_sheet(wb, ws, "What-If Analysis");
    }

    // Write file
    const filename = `${(form.name || "costing").replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // Share — copies a compact summary to clipboard
  const shareLink = () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    const text = `${form.name || "Costing"}: Sell at ${currency.symbol}${r.price.toFixed(2)}/unit (cost ${currency.symbol}${r.cpu.toFixed(2)}, ${r.realizedMargin.toFixed(1)}% margin)`;
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const loadDemo = () => {
    setMode("advanced"); // Demo showcases the full feature set
    setForm({
      name: "Cotton T-shirt",
      units: "500",
      pricingMode: "margin",
      margin: "35",
      markup: "40",
      targetProfit: "",
    });
    setMaterials([
      { id: id(), name: "Cotton fabric", usedQty: "120", usedUnit: "Meter", purchasedQty: "500", purchasedUnit: "Meter", purchasedCost: "25000" },
      { id: id(), name: "Thread", usedQty: "8", usedUnit: "Roll", purchasedQty: "20", purchasedUnit: "Roll", purchasedCost: "2000" },
    ]);
    setLabor([
      { id: id(), name: "Tailor", usedQty: "60", usedUnit: "Hour", purchasedQty: "240", purchasedUnit: "Hour", purchasedCost: "600" },
      { id: id(), name: "Finisher", usedQty: "20", usedUnit: "Hour", purchasedQty: "200", purchasedUnit: "Hour", purchasedCost: "500" },
    ]);
    setPackaging([
      { id: id(), name: "Poly bag", usedQty: "500", usedUnit: "Piece", purchasedQty: "1000", purchasedUnit: "Piece", purchasedCost: "1200" },
    ]);
    setElectricity({ unitsUsed: "350", billUnits: "2400", billAmount: "3200" });
    setRent({
      monthlyRent: "15000",
      factoryPct: "50",
      warehousePct: "30",
      officePct: "20",
      daysUsed: "12",
      daysInMonth: "30",
      includeWarehouse: false,
    });
    setOtherRows([{ id: id(), name: "Transport", amount: "800" }]);
    setMachinesEnabled(true);
    setMachineMethod("time");
    setTimeMachines([
      { id: id(), name: "Sewing machine", cost: "80000", life: "8", daysUsed: "12", daysInYear: "300" },
      { id: id(), name: "Cutting table", cost: "25000", life: "10", daysUsed: "5", daysInYear: "300" },
    ]);
  };

  return (
    <div className="grid md:grid-cols-5 gap-5 md:gap-8">
      {/* LEFT — inputs */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="md:col-span-3"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div>
            <h2 className="text-[22px] sm:text-[24px] font-bold text-slate-900 tracking-tight">
              {t("quick.headerTitle")}
            </h2>
            <p className="text-[13px] text-slate-500 mt-1">
              {t("quick.headerSubtitle")}
            </p>
          </div>
          <button
            onClick={loadDemo}
            className="text-[12.5px] font-medium text-teal-700 hover:text-teal-900 flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition shrink-0"
          >
            <Sparkles size={13} />
            {t("header.tryDemo")}
          </button>
        </div>

        {/* Mode toggle */}
        <div className="mb-6 flex items-center gap-3">
          <div className="inline-flex bg-slate-100/80 rounded-xl p-1 gap-1">
            {[
              { id: "simple", label: t("quick.modeSimple") },
              { id: "advanced", label: t("quick.modeAdvanced") },
            ].map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className="relative px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors"
                >
                  {active && (
                    <motion.div
                      layoutId="mode-bg"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className={`relative flex items-center gap-1.5 ${
                      active ? "text-teal-800" : "text-slate-500"
                    }`}
                  >
                    {m.id === "advanced" && <Settings2 size={12} strokeWidth={2.2} />}
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11.5px] text-slate-400 leading-snug flex-1">
            {isSimple ? t("quick.modeSimpleHint") : t("quick.modeAdvancedHint")}
          </p>
        </div>

        {/* Product basics */}
        <div className="mb-6">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label={t("quick.productName")} type="text" value={form.name} onChange={set("name")} placeholder={t("quick.productNamePlaceholder")} />
            <Field
              label={t("quick.unitsProduced")}
              value={form.units}
              onChange={set("units")}
              placeholder="500"
              errorMsg={form.units !== "" && (parseFloat(form.units) <= 0 || isNaN(parseFloat(form.units))) ? "Units must be greater than zero" : undefined}
            />
          </div>
        </div>

        {/* ── COST SECTIONS — unified workspace container ── */}
        <div className="rounded-2xl border border-slate-100 overflow-hidden mb-2">

        {/* RAW MATERIALS */}
        <div className="px-4">
          <CostSection
            icon={Package}
            title={t("materials.title")}
            hint={t("materials.hint")}
            rows={materials}
            setRows={setMaterials}
            newRow={newMaterial}
            total={materialTotal}
            currency={currency}
            namePlaceholders={["Flour", "Cotton fabric", "Plastic granules", "Wood", "Oil"]}
            addLabel={t("materials.addLabel")}
            emptyHint={t("materials.empty")}
            open={openSections.materials}
            onToggle={() => toggle("materials")}
            units={r.units}
            chips={chips.materials}
            prefilledRowIds={new Set([...prefilledKeys].filter((k) => k.startsWith("mat:")).map((k) => k.slice(4)))}
            clearPrefilledRowId={(rid) => clearPrefilledKey(`mat:${rid}`)}
            columns={[
              { label: t("materials.columnName") },
              { label: t("materials.columnQty"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("materials.columnPurchased"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("materials.columnCost"), align: "right" },
              { label: t("materials.columnAuto"), align: "right" },
            ]}
            rowProps={{
              usedLabel: "12",
              purchasedLabel: "100",
              costLabel: "0",
              hideUnits: false,
              supportsSource: true,
              unitOptions: MATERIAL_UNITS,
            }}
          />
        </div>

        {/* LABOR */}
        <div className="px-4">
          <CostSection
            icon={Users}
            title={t("labor.title")}
            hint={t("labor.hint")}
            rows={labor}
            setRows={setLabor}
            newRow={newLabor}
            total={laborTotal}
            currency={currency}
            namePlaceholders={["Tailor", "Worker A", "Electrician", "Finisher"]}
            addLabel={t("labor.addLabel")}
            emptyHint={t("labor.empty")}
            open={openSections.labor}
            onToggle={() => toggle("labor")}
            units={r.units}
            chips={chips.labor}
            prefilledRowIds={new Set([...prefilledKeys].filter((k) => k.startsWith("lab:")).map((k) => k.slice(4)))}
            clearPrefilledRowId={(rid) => clearPrefilledKey(`lab:${rid}`)}
            columns={[
              { label: t("labor.columnRole") },
              { label: t("labor.columnHours"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("labor.columnMonthly"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("labor.columnSalary"), align: "right" },
              { label: t("materials.columnAuto"), align: "right" },
            ]}
            rowProps={{
              usedLabel: "20",
              purchasedLabel: "240",
              costLabel: "600",
              hideUnits: false,
              unitOptions: LABOR_UNITS,
            }}
          />
        </div>

        {/* Advanced-only sections */}
        <AnimatePresence initial={false}>
          {!isSimple && (
            <motion.div
              key="advanced-block"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >

        {/* ELECTRICITY — proportional bill */}
        <section className="border-b border-slate-100/60 px-4">
          <SectionHeader
            icon={Zap}
            title={t("electricity.title")}
            hint={t("electricity.hint")}
            open={openSections.electricity}
            onToggle={() => toggle("electricity")}
            units={r.units}
            total={electricityTotal}
            currency={currency}
          />
          <Collapse open={openSections.electricity}>
            <div className="pb-3 pt-1">
              <div className="grid grid-cols-3 gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium">
                <div className="pl-1.5">{t("electricity.unitsUsed")}</div>
                <div className="pl-1.5">{t("electricity.billUnits")}</div>
                <div className="pl-1.5">{t("electricity.billAmount")}</div>
              </div>
              <div className="grid grid-cols-3 gap-1 py-2.5 border-b border-slate-100">
                <CellInput value={electricity.unitsUsed} onChange={(v) => setElectricity({ ...electricity, unitsUsed: v })} placeholder="500" />
                <CellInput value={electricity.billUnits} onChange={(v) => setElectricity({ ...electricity, billUnits: v })} placeholder="3000" />
                <CellInput value={electricity.billAmount} onChange={(v) => setElectricity({ ...electricity, billAmount: v })} placeholder="400" prefix={currency.symbol} />
              </div>
              {electricityTotal > 0 && (
                <div className="text-[12px] text-slate-500 mt-2 pl-1.5">
                  <span className="tabular-nums num-ltr">{electricity.unitsUsed}</span> /{" "}
                  <span className="tabular-nums num-ltr">{electricity.billUnits}</span> ·{" "}
                  <span className="text-teal-700 font-medium tabular-nums num-ltr">
                    {((n(electricity.unitsUsed) / n(electricity.billUnits)) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              {n(electricity.unitsUsed) > n(electricity.billUnits) && n(electricity.billUnits) > 0 && (
                <div className="flex items-center gap-1.5 text-[11.5px] text-amber-600 pl-1.5 mt-2">
                  <AlertTriangle size={11} strokeWidth={2.4} />
                  {t("electricity.warningUnitsExceed")}
                </div>
              )}
              <Explainer
                lines={
                  electricityTotal > 0
                    ? [
                        `${electricity.unitsUsed} ÷ ${electricity.billUnits} × ${currency.symbol}${n(electricity.billAmount).toLocaleString(currency.locale)} = ${currency.symbol}${electricityTotal.toFixed(2)}`,
                      ]
                    : []
                }
              />
            </div>
          </Collapse>
        </section>

        {/* RENT — smart allocation: only production portion enters product cost */}
        <section className="border-b border-slate-100/60 px-4">
          <div className="flex items-center">
            <SectionHeader
              icon={Home}
              title={t("rent.title")}
              hint={t("rent.hint")}
              open={openSections.rent}
              onToggle={() => toggle("rent")}
              units={r.units}
              total={rentTotal}
              currency={currency}
              warning={rentMath.overLimit ? t("rent.warningPct") : null}
            />
          </div>
          <Collapse open={openSections.rent}>
            <div className="pb-3 pt-1">
              <div className="flex items-center gap-1.5 mb-2 pl-1">
                <Info size={12} className="text-slate-400" />
                <span className="text-[11.5px] text-slate-500">
                  {t("rent.tooltip")}
                </span>
              </div>

              {/* Desktop: grid row — warehouse col conditional on toggle */}
              <motion.div
                className="hidden sm:block"
                animate={rentMath.overLimit ? { x: [0, -5, 5, -3, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                <div
                  className="grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium"
                  style={{ gridTemplateColumns: rent.includeWarehouse
                    ? "minmax(0,1.1fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.85fr) minmax(0,0.85fr)"
                    : "minmax(0,1.1fr) minmax(0,0.75fr) minmax(0,0.75fr) minmax(0,0.85fr) minmax(0,0.85fr)"
                  }}
                >
                  <div className="pl-1.5">{t("rent.monthlyRent")}</div>
                  <div className="pl-1.5">{t("rent.factoryPct")}</div>
                  {rent.includeWarehouse && <div className="pl-1.5">{t("rent.warehousePct")}</div>}
                  <div className="pl-1.5">{t("rent.officePct")}</div>
                  <div className="pl-1.5">{t("rent.daysUsed")}</div>
                  <div className="pl-1.5">{t("rent.daysInMonth")}</div>
                </div>
                <div
                  className={`grid items-center gap-1 py-2 border-b rounded transition-colors ${
                    rentMath.overLimit
                      ? "border-red-300 bg-red-50/40"
                      : "border-slate-100/50"
                  }`}
                  style={{ gridTemplateColumns: rent.includeWarehouse
                    ? "minmax(0,1.1fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.85fr) minmax(0,0.85fr)"
                    : "minmax(0,1.1fr) minmax(0,0.75fr) minmax(0,0.75fr) minmax(0,0.85fr) minmax(0,0.85fr)"
                  }}
                >
                  <CellInput value={rent.monthlyRent} onChange={(v) => setRent({ ...rent, monthlyRent: v })} placeholder="15000" prefix={currency.symbol} />
                  <CellInput value={rent.factoryPct} onChange={(v) => setRent({ ...rent, factoryPct: v })} placeholder="50" />
                  {rent.includeWarehouse && <CellInput value={rent.warehousePct} onChange={(v) => setRent({ ...rent, warehousePct: v })} placeholder="30" />}
                  <CellInput value={rent.officePct} onChange={(v) => setRent({ ...rent, officePct: v })} placeholder="20" />
                  <CellInput value={rent.daysUsed} onChange={(v) => setRent({ ...rent, daysUsed: v })} placeholder="12" />
                  <CellInput value={rent.daysInMonth} onChange={(v) => setRent({ ...rent, daysInMonth: v })} placeholder="30" />
                </div>
                {rentMath.overLimit && (
                  <p className="mt-1.5 pl-1 text-[11.5px] font-medium text-red-600">
                    Total allocation cannot exceed 100%
                  </p>
                )}
              </motion.div>

              {/* Mobile: stacked — warehouse field conditional */}
              <motion.div
                className="sm:hidden space-y-3 py-2"
                animate={rentMath.overLimit ? { x: [0, -5, 5, -3, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.32, ease: "easeOut" }}
              >
                <div>
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.monthlyRent")}</div>
                  <CellInput value={rent.monthlyRent} onChange={(v) => setRent({ ...rent, monthlyRent: v })} placeholder="15000" prefix={currency.symbol} />
                </div>
                <div className={`${rentMath.overLimit ? "rounded-lg border border-red-300 bg-red-50/40 p-2" : ""}`}>
                  {rent.includeWarehouse ? (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.factoryPct")}</div>
                        <CellInput value={rent.factoryPct} onChange={(v) => setRent({ ...rent, factoryPct: v })} placeholder="50" />
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.warehousePct")}</div>
                        <CellInput value={rent.warehousePct} onChange={(v) => setRent({ ...rent, warehousePct: v })} placeholder="30" />
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.officePct")}</div>
                        <CellInput value={rent.officePct} onChange={(v) => setRent({ ...rent, officePct: v })} placeholder="20" />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.factoryPct")}</div>
                        <CellInput value={rent.factoryPct} onChange={(v) => setRent({ ...rent, factoryPct: v })} placeholder="60" />
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.officePct")}</div>
                        <CellInput value={rent.officePct} onChange={(v) => setRent({ ...rent, officePct: v })} placeholder="20" />
                      </div>
                    </div>
                  )}
                  {rentMath.overLimit && (
                    <p className="mt-1.5 pl-1 text-[11.5px] font-medium text-red-600">
                      Total allocation cannot exceed 100%
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.daysUsed")}</div>
                    <CellInput value={rent.daysUsed} onChange={(v) => setRent({ ...rent, daysUsed: v })} placeholder="12" />
                  </div>
                  <div>
                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5 pl-1.5">{t("rent.daysInMonth")}</div>
                    <CellInput value={rent.daysInMonth} onChange={(v) => setRent({ ...rent, daysInMonth: v })} placeholder="30" />
                  </div>
                </div>
              </motion.div>

          {/* Allocation bar — only when warehouse is included and allocation is valid */}
          {n(rent.monthlyRent) > 0 && rent.includeWarehouse && !rentMath.overLimit && (
            <div className="mt-3 px-1.5">
              <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100">
                <motion.div
                  className="bg-teal-700"
                  animate={{ width: `${Math.min(100, rentMath.fp)}%` }}
                  transition={{ duration: 0.3 }}
                  title={`Factory ${rentMath.fp}%`}
                />
                <motion.div
                  className="bg-teal-400"
                  animate={{ width: `${Math.min(100, rentMath.wp)}%` }}
                  transition={{ duration: 0.3 }}
                  title={`Warehouse ${rentMath.wp}%`}
                />
                <motion.div
                  className="bg-slate-200"
                  animate={{ width: `${Math.min(100, rentMath.op)}%` }}
                  transition={{ duration: 0.3 }}
                  title={`Office ${rentMath.op}%`}
                />
              </div>
              <div className="flex items-center gap-3 mt-2 text-[11.5px] text-slate-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-teal-700" /> {t("rent.factoryPct")} {rentMath.fp || 0}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-teal-400" /> {t("rent.warehousePct")} {rentMath.wp || 0}%
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-sm bg-slate-200" /> {t("rent.officePct")} {rentMath.op || 0}%
                </span>
                <span className="ml-auto text-[11px] tabular-nums text-slate-400">
                  {100 - rentMath.total}% unused
                </span>
              </div>
            </div>
          )}

          {/* Footer: warehouse toggle + helper text */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1.5">
            <p className="text-[12px] text-slate-500 leading-snug max-w-md">
              Only production-related rent is included in costing.
              {!rentMath.overLimit && rentMath.allocated > 0 && rent.daysUsed && (
                <>
                  {" "}
                  <span className="text-slate-700">
                    {rentMath.productionPct}% × {currency.symbol}
                    {n(rent.monthlyRent).toLocaleString(currency.locale)} ={" "}
                    <span className="text-teal-700 font-medium tabular-nums">
                      {currency.symbol}
                      {rentMath.allocated.toLocaleString(currency.locale, { maximumFractionDigits: 0 })}
                    </span>{" "}
                    allocated, {rent.daysUsed}/{rent.daysInMonth} days used.
                  </span>
                </>
              )}
            </p>

            <button
              onClick={() => setRent({ ...rent, includeWarehouse: !rent.includeWarehouse })}
              className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-600 hover:text-teal-800 transition"
            >
              <span
                className={`relative w-7 h-4 rounded-full transition-colors ${
                  rent.includeWarehouse ? "bg-teal-700" : "bg-slate-300"
                }`}
              >
                <motion.span
                  className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                  animate={{ left: rent.includeWarehouse ? 14 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </span>
              {t("rent.includeWarehouse")}
            </button>
          </div>
          <Explainer
            lines={
              rentTotal > 0
                ? [
                    `${rent.daysUsed} days ÷ ${rent.daysInMonth} days × (${rentMath.productionPct}% of ${currency.symbol}${n(rent.monthlyRent).toLocaleString(currency.locale)}) = ${currency.symbol}${rentTotal.toFixed(2)}`,
                  ]
                : []
            }
          />
            </div>
          </Collapse>
        </section>

        {/* PACKAGING */}
        <div>
          <CostSection
            icon={Box}
            title={t("packaging.title")}
            hint={t("packaging.hint")}
            rows={packaging}
            setRows={setPackaging}
            newRow={newPackaging}
            total={packagingTotal}
            currency={currency}
            namePlaceholders={["Poly bag", "Carton", "Label", "Sticker"]}
            addLabel={t("packaging.addLabel")}
            emptyHint={t("packaging.empty")}
            open={openSections.packaging}
            onToggle={() => toggle("packaging")}
            units={r.units}
            chips={chips.packaging}
            prefilledRowIds={new Set([...prefilledKeys].filter((k) => k.startsWith("pack:")).map((k) => k.slice(5)))}
            clearPrefilledRowId={(rid) => clearPrefilledKey(`pack:${rid}`)}
            columns={[
              { label: t("other.columnItem") },
              { label: t("materials.columnQty"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("materials.columnPurchased"), align: "right" },
              { label: t("materials.columnUnit") },
              { label: t("materials.columnCost"), align: "right" },
              { label: t("materials.columnAuto"), align: "right" },
            ]}
            rowProps={{
              usedLabel: "500",
              purchasedLabel: "1000",
              costLabel: "0",
              hideUnits: false,
            }}
          />
        </div>

        {/* OTHER — free-form line items */}
        <section className="border-b border-slate-100/60 px-4">
          <SectionHeader
            icon={MoreHorizontal}
            title={t("other.title")}
            hint={t("other.hint")}
            open={openSections.other}
            onToggle={() => toggle("other")}
            units={r.units}
            total={otherTotal}
            currency={currency}
          />
          <Collapse open={openSections.other}>
            <div className="pb-3 pt-1">
              <div className="grid grid-cols-[1fr_minmax(0,0.6fr)_28px] gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium">
                <div className="pl-1.5">{t("other.columnItem")}</div>
                <div className="pl-1.5 text-right pr-1.5">{t("other.columnCost")}</div>
                <div />
              </div>
              <AnimatePresence initial={false}>
                {otherRows.map((row, i) => (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="grid grid-cols-[1fr_minmax(0,0.6fr)_28px] gap-1 py-2.5 border-b border-slate-100 group"
                  >
                    <CellInput
                      type="text"
                      value={row.name}
                      onChange={(v) =>
                        setOtherRows(otherRows.map((r) => (r.id === row.id ? { ...r, name: v } : r)))
                      }
                      placeholder={["Transport", "Repairs", "Marketing"][i % 3]}
                    />
                    <CellInput
                      value={row.amount}
                      onChange={(v) =>
                        setOtherRows(otherRows.map((r) => (r.id === row.id ? { ...r, amount: v } : r)))
                      }
                      placeholder="0"
                      align="right"
                      prefix={currency.symbol}
                    />
                    <button
                      onClick={() => setOtherRows(otherRows.filter((r) => r.id !== row.id))}
                      disabled={otherRows.length === 1}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button
                onClick={() => setOtherRows([...otherRows, { id: id(), name: "", amount: "" }])}
                className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-teal-700 px-2 py-2 -ml-2 rounded-lg hover:bg-teal-50/50 transition min-h-[40px]"
              >
                <Plus size={13} strokeWidth={2.4} />
                {t("other.addLabel")}
              </button>
            </div>
          </Collapse>
        </section>

        {/* MACHINE DEPRECIATION — optional, collapsible */}
        <section className="border-b border-slate-100/60 px-4">
          <SectionHeader
            icon={Wrench}
            title={t("machines.title")}
            hint={t("machines.hint")}
            open={openSections.machines}
            onToggle={() => toggle("machines")}
            units={r.units}
            total={machinesEnabled ? machineTotal : undefined}
            currency={currency}
            badge={machinesEnabled ? t("machines.on") : null}
          />
          <Collapse open={openSections.machines}>
            <div className="pb-3 pt-1">
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="text-[12px] text-slate-500 leading-snug">
                  {t("machines.description")}
                </p>
                <button
                  onClick={() => setMachinesEnabled(!machinesEnabled)}
                  className="inline-flex items-center gap-2 text-[12px] font-medium text-slate-600 hover:text-teal-800 transition shrink-0"
                  aria-pressed={machinesEnabled}
                >
                  <span
                    className={`relative w-7 h-4 rounded-full transition-colors ${
                      machinesEnabled ? "bg-teal-700" : "bg-slate-300"
                    }`}
                  >
                    <motion.span
                      className="absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm"
                      animate={{ left: machinesEnabled ? 14 : 2 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </span>
                  {machinesEnabled ? t("machines.on") : t("machines.off")}
                </button>
              </div>

              <AnimatePresence initial={false}>
                {machinesEnabled && (
                  <motion.div
                    key="machines-body"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                {/* Method tabs */}
                <div className="inline-flex bg-slate-100/80 rounded-xl p-1 gap-1 mb-3">
                  {[
                    { id: "time", label: t("machines.methodTime") },
                    { id: "production", label: t("machines.methodProduction") },
                  ].map((m) => {
                    const active = machineMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setMachineMethod(m.id)}
                        className="relative px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                      >
                        {active && (
                          <motion.div
                            layoutId="machine-method-bg"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className={`relative ${active ? "text-teal-800" : "text-slate-500"}`}>
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {machineMethod === "time" ? (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Time-based headers */}
                      <div
                        className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium"
                        style={{
                          gridTemplateColumns:
                            "minmax(0,1.4fr) minmax(0,0.9fr) minmax(0,0.8fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.9fr) 28px",
                        }}
                      >
                        <div className="pl-1.5">{t("machines.columnMachine")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnCost")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnLife")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnDaysUsed")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnDaysYear")}</div>
                        <div className="text-right pr-1.5">{t("materials.columnAuto")}</div>
                        <div />
                      </div>

                      <AnimatePresence initial={false}>
                        {timeMachines.map((m, i) => {
                          const cost = n(m.cost);
                          const life = n(m.life);
                          const days = n(m.daysUsed);
                          const diy = n(m.daysInYear) || 365;
                          const annual = life > 0 ? cost / life : 0;
                          const rowCost =
                            cost > 0 && life > 0 && days > 0 ? (days / diy) * annual : 0;
                          const update = (patch) =>
                            setTimeMachines(
                              timeMachines.map((x) => (x.id === m.id ? { ...x, ...patch } : x))
                            );
                          return (
                            <motion.div
                              key={m.id}
                              layout
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="group"
                            >
                              {/* Desktop row */}
                              <div
                                className="hidden sm:grid items-center gap-1 py-2 border-b border-slate-100/50"
                                style={{
                                  gridTemplateColumns:
                                    "minmax(0,1.4fr) minmax(0,0.9fr) minmax(0,0.8fr) minmax(0,0.7fr) minmax(0,0.7fr) minmax(0,0.9fr) 28px",
                                }}
                              >
                                <CellInput
                                  type="text"
                                  value={m.name}
                                  onChange={(v) => update({ name: v })}
                                  placeholder={["Sewing machine", "CNC mill", "Oven", "Printer"][i % 4]}
                                />
                                <CellInput
                                  value={m.cost}
                                  onChange={(v) => update({ cost: v })}
                                  placeholder="100000"
                                  align="right"
                                  prefix={currency.symbol}
                                />
                                <CellInput
                                  value={m.life}
                                  onChange={(v) => update({ life: v })}
                                  placeholder="10"
                                  align="right"
                                />
                                <CellInput
                                  value={m.daysUsed}
                                  onChange={(v) => update({ daysUsed: v })}
                                  placeholder="5"
                                  align="right"
                                />
                                <CellInput
                                  value={m.daysInYear}
                                  onChange={(v) => update({ daysInYear: v })}
                                  placeholder="365"
                                  align="right"
                                />
                                <div className="text-right pr-1.5 text-[14px] font-semibold tabular-nums text-slate-900">
                                  <AnimatedNumber value={rowCost} prefix={currency.symbol} decimals={2} currency={currency} />
                                </div>
                                <button
                                  onClick={() =>
                                    setTimeMachines(timeMachines.filter((x) => x.id !== m.id))
                                  }
                                  disabled={timeMachines.length === 1}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition"
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              {/* Mobile row */}
                              <div className="sm:hidden py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <CellInput
                                    type="text"
                                    value={m.name}
                                    onChange={(v) => update({ name: v })}
                                    placeholder={["Sewing machine", "CNC mill", "Oven", "Printer"][i % 4]}
                                  />
                                  <button
                                    onClick={() =>
                                      setTimeMachines(timeMachines.filter((x) => x.id !== m.id))
                                    }
                                    disabled={timeMachines.length === 1}
                                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 transition"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pl-1">
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">Cost</div>
                                    <CellInput value={m.cost} onChange={(v) => update({ cost: v })} placeholder="100000" prefix={currency.symbol} />
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">Life (yrs)</div>
                                    <CellInput value={m.life} onChange={(v) => update({ life: v })} placeholder="10" />
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">{t("machines.columnDaysUsed")}</div>
                                    <CellInput value={m.daysUsed} onChange={(v) => update({ daysUsed: v })} placeholder="5" />
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">Days / year</div>
                                    <CellInput value={m.daysInYear} onChange={(v) => update({ daysInYear: v })} placeholder="365" />
                                  </div>
                                  <div className="col-span-2 flex items-baseline justify-between pt-1">
                                    <span className="text-[10.5px] uppercase tracking-wider text-slate-400">{t("machines.columnAllocated")}</span>
                                    <span className="text-[15px] font-semibold tabular-nums text-slate-900">
                                      <AnimatedNumber value={rowCost} prefix={currency.symbol} decimals={2} currency={currency} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      <button
                        onClick={() =>
                          setTimeMachines([
                            ...timeMachines,
                            { id: id(), name: "", cost: "", life: "", daysUsed: "", daysInYear: "365" },
                          ])
                        }
                        className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-teal-700 px-2 py-2 -ml-2 rounded-lg hover:bg-teal-50/50 transition min-h-[40px]"
                      >
                        <Plus size={13} strokeWidth={2.4} />
                        Add machine
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="production"
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Production-based headers */}
                      <div
                        className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium"
                        style={{
                          gridTemplateColumns:
                            "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,0.9fr) 28px",
                        }}
                      >
                        <div className="pl-1.5">{t("machines.columnMachine")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnCost")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnCapacity")}</div>
                        <div className="text-right pr-1.5">{t("machines.columnBatch")}</div>
                        <div className="text-right pr-1.5">{t("materials.columnAuto")}</div>
                        <div />
                      </div>

                      <AnimatePresence initial={false}>
                        {unitMachines.map((m, i) => {
                          const cost = n(m.cost);
                          const cap = n(m.capacity);
                          const units = n(m.batchUnits);
                          const perUnit = cap > 0 ? cost / cap : 0;
                          const rowCost = cost > 0 && cap > 0 && units > 0 ? perUnit * units : 0;
                          const update = (patch) =>
                            setUnitMachines(
                              unitMachines.map((x) => (x.id === m.id ? { ...x, ...patch } : x))
                            );
                          return (
                            <motion.div
                              key={m.id}
                              layout
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.18 }}
                              className="group"
                            >
                              {/* Desktop row */}
                              <div
                                className="hidden sm:grid items-center gap-1 py-2 border-b border-slate-100/50"
                                style={{
                                  gridTemplateColumns:
                                    "minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr) minmax(0,1fr) minmax(0,0.9fr) 28px",
                                }}
                              >
                                <CellInput
                                  type="text"
                                  value={m.name}
                                  onChange={(v) => update({ name: v })}
                                  placeholder={["Injection molder", "Press", "Printer", "Mixer"][i % 4]}
                                />
                                <CellInput
                                  value={m.cost}
                                  onChange={(v) => update({ cost: v })}
                                  placeholder="50000"
                                  align="right"
                                  prefix={currency.symbol}
                                />
                                <CellInput
                                  value={m.capacity}
                                  onChange={(v) => update({ capacity: v })}
                                  placeholder="1000000"
                                  align="right"
                                />
                                <CellInput
                                  value={m.batchUnits}
                                  onChange={(v) => update({ batchUnits: v })}
                                  placeholder="10000"
                                  align="right"
                                />
                                <div className="text-right pr-1.5 text-[14px] font-semibold tabular-nums text-slate-900">
                                  <AnimatedNumber value={rowCost} prefix={currency.symbol} decimals={2} currency={currency} />
                                </div>
                                <button
                                  onClick={() =>
                                    setUnitMachines(unitMachines.filter((x) => x.id !== m.id))
                                  }
                                  disabled={unitMachines.length === 1}
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition"
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              {/* Mobile row */}
                              <div className="sm:hidden py-3 border-b border-slate-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <CellInput
                                    type="text"
                                    value={m.name}
                                    onChange={(v) => update({ name: v })}
                                    placeholder={["Injection molder", "Press", "Printer", "Mixer"][i % 4]}
                                  />
                                  <button
                                    onClick={() =>
                                      setUnitMachines(unitMachines.filter((x) => x.id !== m.id))
                                    }
                                    disabled={unitMachines.length === 1}
                                    className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 disabled:opacity-0 transition"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pl-1">
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">Cost</div>
                                    <CellInput value={m.cost} onChange={(v) => update({ cost: v })} placeholder="50000" prefix={currency.symbol} />
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">{t("machines.columnCapacity")}</div>
                                    <CellInput value={m.capacity} onChange={(v) => update({ capacity: v })} placeholder="1000000" />
                                  </div>
                                  <div>
                                    <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-0.5">{t("machines.columnBatch")}</div>
                                    <CellInput value={m.batchUnits} onChange={(v) => update({ batchUnits: v })} placeholder="10000" />
                                  </div>
                                  <div className="col-span-2 flex items-baseline justify-between pt-1">
                                    <span className="text-[10.5px] uppercase tracking-wider text-slate-400">{t("machines.columnAllocated")}</span>
                                    <span className="text-[15px] font-semibold tabular-nums text-slate-900">
                                      <AnimatedNumber value={rowCost} prefix={currency.symbol} decimals={2} currency={currency} />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>

                      <button
                        onClick={() =>
                          setUnitMachines([
                            ...unitMachines,
                            { id: id(), name: "", cost: "", capacity: "", batchUnits: "" },
                          ])
                        }
                        className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-teal-700 px-2 py-2 -ml-2 rounded-lg hover:bg-teal-50/50 transition min-h-[40px]"
                      >
                        <Plus size={13} strokeWidth={2.4} />
                        Add machine
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="text-[12px] text-slate-400 leading-snug mt-3 px-1.5">
                  {machineMethod === "time"
                    ? "Annual depreciation = cost ÷ life. Then prorated by days used."
                    : "Cost per unit = machine cost ÷ lifetime capacity. Multiplied by units produced."}
                </p>
                <Explainer
                  lines={(machineMethod === "time" ? timeMachines : unitMachines)
                    .map((m) => {
                      if (machineMethod === "time") {
                        const cost = n(m.cost), life = n(m.life), days = n(m.daysUsed), diy = n(m.daysInYear) || 365;
                        if (cost <= 0 || life <= 0 || days <= 0) return null;
                        const annual = cost / life;
                        const c = (days / diy) * annual;
                        return `${m.name || "Machine"}: ${currency.symbol}${cost.toLocaleString(currency.locale)} ÷ ${life} yr = ${currency.symbol}${annual.toFixed(0)}/yr × ${days}/${diy} days = ${currency.symbol}${c.toFixed(2)}`;
                      }
                      const cost = n(m.cost), cap = n(m.capacity), units = n(m.batchUnits);
                      if (cost <= 0 || cap <= 0 || units <= 0) return null;
                      const per = cost / cap;
                      const c = per * units;
                      return `${m.name || "Machine"}: ${currency.symbol}${cost.toLocaleString(currency.locale)} ÷ ${cap.toLocaleString(currency.locale)} units = ${currency.symbol}${per.toFixed(4)}/unit × ${units.toLocaleString(currency.locale)} = ${currency.symbol}${c.toFixed(2)}`;
                    })
                    .filter(Boolean)}
                />
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </Collapse>
        </section>

        {/* WHAT-IF ANALYSIS — Advanced only */}
        <section className="border-b border-slate-100/60 px-4">
          <SectionHeader
            icon={BarChart3}
            title={t("whatif.title")}
            hint={t("whatif.hint")}
            open={openSections.whatif}
            onToggle={() => {
              toggle("whatif");
              if (!openSections.whatif) ensureScenarios();
            }}
          />
          <Collapse open={openSections.whatif}>
            <div className="pb-3 pt-1">
              {r.total <= 0 || r.units <= 0 ? (
                <EmptyHint icon={<BarChart3 size={13} className="text-slate-300" strokeWidth={2} />}>{t("whatif.empty")}</EmptyHint>
              ) : (
                <>
                  <div className="text-[11.5px] text-slate-500 leading-snug mb-3 pl-1">
                    {t("whatif.intro")}
                  </div>

                  {/* Current baseline + simulated scenarios */}
                  <div
                    className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium"
                    style={{ gridTemplateColumns: "minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.7fr) 28px" }}
                  >
                    <div className="pl-1.5">{t("whatif.columnProduction")}</div>
                    <div className="text-right pr-1.5">{t("whatif.columnCostPerUnit")}</div>
                    <div className="text-right pr-1.5">{t("whatif.columnSellAt")}</div>
                    <div className="text-right pr-1.5">{t("whatif.columnProfit")}</div>
                    <div className="text-right pr-1.5">{t("whatif.columnMargin")}</div>
                    <div />
                  </div>

                  {/* Current row (read-only baseline) */}
                  <div
                    className="hidden sm:grid items-center gap-1 py-2.5 border-b border-slate-100 bg-slate-50/50 -mx-2 px-2 rounded-md"
                    style={{ gridTemplateColumns: "minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.7fr) 28px" }}
                  >
                    <div className="flex items-center gap-1.5 pl-1.5">
                      <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">{t("whatif.now")}</span>
                      <span className="text-[13px] tabular-nums num-ltr text-slate-900 font-medium">{formatNumber(r.units, currency.locale, 0)}</span>
                    </div>
                    <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">{currency.symbol}{formatNumber(r.cpu, currency.locale, 2)}</div>
                    <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">{currency.symbol}{formatNumber(r.price, currency.locale, 2)}</div>
                    <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">{currency.symbol}{formatNumber(r.profit, currency.locale, 0)}</div>
                    <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">{formatNumber(r.realizedMargin, currency.locale, 1)}%</div>
                    <div />
                  </div>

                  {/* Mobile current */}
                  <div className="sm:hidden flex items-center justify-between py-2 border-b border-slate-100 bg-slate-50/50 -mx-2 px-2 rounded-md mb-2">
                    <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold">{t("whatif.now")} · <span className="num-ltr">{formatNumber(r.units, currency.locale, 0)}</span></span>
                    <span className="text-[13.5px] tabular-nums num-ltr font-medium text-slate-900">{currency.symbol}{formatNumber(r.cpu, currency.locale, 2)}/{t("summary.perUnit")}</span>
                  </div>

                  {/* Simulated scenarios */}
                  <AnimatePresence initial={false}>
                    {whatIfScenarios.map((q, i) => {
                      const sim = simulateProduction(q);
                      const delta = sim && r.cpu > 0 ? ((sim.cpu - r.cpu) / r.cpu) * 100 : 0;
                      const updateQty = (v) => {
                        const next = [...whatIfScenarios];
                        next[i] = v;
                        setWhatIfScenarios(next);
                      };
                      const removeRow = () => {
                        setWhatIfScenarios(whatIfScenarios.filter((_, idx) => idx !== i));
                      };
                      return (
                        <motion.div
                          key={i}
                          layout
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="group"
                        >
                          <div
                            className="hidden sm:grid items-center gap-1 py-2 border-b border-slate-100/50"
                            style={{ gridTemplateColumns: "minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.9fr) minmax(0,0.7fr) 28px" }}
                          >
                            <CellInput value={q} onChange={updateQty} placeholder={String(Math.round(r.units * 2))} />
                            <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr font-medium text-slate-900">
                              {sim ? `${currency.symbol}${formatNumber(sim.cpu, currency.locale, 2)}` : "—"}
                              {sim && delta < 0 && (
                                <span className="ml-1 text-[10.5px] text-teal-600 font-normal">
                                  {delta.toFixed(0)}%
                                </span>
                              )}
                            </div>
                            <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">
                              {sim ? `${currency.symbol}${formatNumber(sim.price, currency.locale, 2)}` : "—"}
                            </div>
                            <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr">
                              {sim ? `${currency.symbol}${formatNumber(sim.profit, currency.locale, 0)}` : "—"}
                            </div>
                            <div className="text-right pr-1.5 text-[13px] tabular-nums num-ltr text-slate-600">
                              {sim ? `${formatNumber(sim.margin, currency.locale, 1)}%` : "—"}
                            </div>
                            <button
                              onClick={removeRow}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 sm:opacity-0 sm:group-hover:opacity-100 transition"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {/* Mobile scenario */}
                          <div className="sm:hidden py-2 border-b border-slate-100">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold shrink-0">{t("whatif.if")}</span>
                              <CellInput value={q} onChange={updateQty} placeholder={String(Math.round(r.units * 2))} />
                              <span className="text-[10.5px] text-slate-400 shrink-0">{t("whatif.unitsLabel")}</span>
                              <button
                                onClick={removeRow}
                                className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 transition"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            {sim && (
                              <div className="grid grid-cols-2 gap-1 pl-1 text-[12px]">
                                <div>
                                  <span className="text-slate-400">{t("whatif.columnCostPerUnit")} </span>
                                  <span className="tabular-nums num-ltr font-medium text-slate-900">{currency.symbol}{formatNumber(sim.cpu, currency.locale, 2)}</span>
                                  {delta < 0 && <span className="ml-1 text-teal-600 text-[10.5px]">{delta.toFixed(0)}%</span>}
                                </div>
                                <div className="text-right">
                                  <span className="text-slate-400">{t("whatif.columnProfit")} </span>
                                  <span className="tabular-nums num-ltr font-medium text-slate-900">{currency.symbol}{formatNumber(sim.profit, currency.locale, 0)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  <button
                    onClick={() => setWhatIfScenarios([...whatIfScenarios, String(Math.round(r.units * (whatIfScenarios.length + 2)))])}
                    className="mt-2 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-slate-500 hover:text-teal-700 px-2 py-2 -ml-2 rounded-lg hover:bg-teal-50/50 transition min-h-[40px]"
                  >
                    <Plus size={13} strokeWidth={2.4} />
                    {t("whatif.addScenario")}
                  </button>

                  {/* Insight footer */}
                  <div className="mt-3 pt-3 border-t border-dashed border-slate-200 text-[12px] text-slate-500 leading-snug pl-1">
                    <span className="font-medium text-slate-700">{t("whatif.whyTitle")}</span>{" "}
                    {t("whatif.whyBody", { amount: `${currency.symbol}${formatNumber(costSplit.fixed, currency.locale, 0)}` })}
                  </div>
                </>
              )}
            </div>
          </Collapse>
        </section>

            </motion.div>
          )}
        </AnimatePresence>

        {/* PRICING */}
        <section className="px-4 pt-6 pb-6 border-b border-slate-100/60 last:border-0">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={14} className="text-teal-700" strokeWidth={2.3} />
            <h3 className="text-[14px] font-bold text-slate-900 tracking-tight">{t("pricing.title")}</h3>
          </div>

          {/* Mode tabs */}
          <div className="inline-flex bg-slate-100/80 rounded-xl p-1 gap-1 mb-3">
            {[
              { id: "margin", label: t("pricing.modeMargin") },
              { id: "markup", label: t("pricing.modeMarkup") },
              { id: "target", label: t("pricing.modeTarget") },
            ].map((m) => {
              const active = form.pricingMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => set("pricingMode")(m.id)}
                  className="relative px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                >
                  {active && (
                    <motion.div
                      layoutId="pricing-mode-bg"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className={`relative ${active ? "text-teal-800" : "text-slate-500"}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {form.pricingMode === "margin" && (
              <motion.div key="margin" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                <Field label={t("pricing.marginField")} value={form.margin} onChange={set("margin")} suffix="%" placeholder="30" />
              </motion.div>
            )}
            {form.pricingMode === "markup" && (
              <motion.div key="markup" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                <Field label={t("pricing.markupField")} value={form.markup} onChange={set("markup")} suffix="%" placeholder="40" />
              </motion.div>
            )}
            {form.pricingMode === "target" && (
              <motion.div key="target" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                <Field label={t("pricing.targetField")} value={form.targetProfit} onChange={set("targetProfit")} prefix={currency.symbol} placeholder="50" />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-[11.5px] text-slate-400 leading-snug mt-2 pl-1">
            {form.pricingMode === "margin" && t("pricing.marginHint")}
            {form.pricingMode === "markup" && t("pricing.markupHint")}
            {form.pricingMode === "target" && t("pricing.targetHint")}
          </p>
        </section>
        </div>{/* end workspace container */}
      </motion.div>

      {/* RIGHT — sticky results */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="hidden md:block md:col-span-2 space-y-3 md:sticky md:top-20 md:self-start"
      >
        {/* HERO — live summary card */}
        <div
          className="rounded-3xl p-6 text-white relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)` }}
        >
          <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between gap-2">
              <div className="text-[11.5px] uppercase tracking-wider text-teal-100 font-semibold">
                {t("summary.live")}
              </div>
              {(() => {
                const status = profitStatus(r.realizedMargin, r.total, t, { price: r.price, cpu: r.cpu });
                if (!status) return null;
                return (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                    <span className="text-[10px]">{status.dot}</span>
                    {status.label}
                  </span>
                );
              })()}
            </div>

            <div className="mt-3 mb-1 text-[11.5px] text-teal-100">{t("summary.suggestedPrice")}</div>
            <div className="text-[40px] sm:text-[42px] font-semibold tracking-tight tabular-nums num-ltr leading-none">
              {r.isValid
                ? <AnimatedNumber value={r.price} prefix={currency.symbol} decimals={2} currency={currency} />
                : <span className="text-white/60 text-[28px]">—</span>
              }
            </div>
            <div className="text-[11.5px] text-teal-100 mt-1">
              {r.isValid ? t("summary.perUnit") : t("ui.enterUnitsHint")}
            </div>

            {/* Stacked metrics grid */}
            <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-2 gap-x-4 gap-y-3">
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.costPerUnit")}</div>
                <div className="text-[17px] font-semibold tabular-nums num-ltr mt-0.5">
                  {r.isValid ? <AnimatedNumber value={r.cpu} prefix={currency.symbol} decimals={2} currency={currency} /> : <span className="text-white/50">—</span>}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.profitPerUnit")}</div>
                <div className="text-[17px] font-semibold tabular-nums num-ltr mt-0.5">
                  {r.isValid ? <AnimatedNumber value={r.profitPerUnit} prefix={currency.symbol} decimals={2} currency={currency} /> : <span className="text-white/50">—</span>}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.totalProfit")}</div>
                <div className="text-[17px] font-semibold tabular-nums num-ltr mt-0.5">
                  {r.isValid ? <AnimatedNumber value={r.profit} prefix={currency.symbol} decimals={0} currency={currency} /> : <span className="text-white/50">—</span>}
                </div>
              </div>
              <div>
                <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.margin")}</div>
                <div className="text-[17px] font-semibold tabular-nums num-ltr mt-0.5">
                  {r.isValid ? <><AnimatedNumber value={r.realizedMargin} decimals={1} />%</> : <span className="text-white/50">—</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Templates control + autosave indicator */}
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {autoSaved && (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 text-[11.5px] text-teal-600 font-medium"
              >
                <Check size={11} strokeWidth={2.8} />
                Saved
              </motion.div>
            )}
          </AnimatePresence>
          <TemplatesButton
            onSave={(action) => { setDuplicateMode(action === "duplicate"); setShowSaveModal(true); }}
            onLoad={() => setShowLoadModal(true)}
            loadedTemplate={loadedTemplate}
            mode="quick"
          />
        </div>

        {/* Action bar */}
        <ActionBar
          onSnapshot={() => { setDuplicateMode(false); setShowSaveModal(true); }}
          onExportPDF={exportPDF}
          onExportXLSX={exportXLSX}
          onShare={shareLink}
          savedCount={0}
          canExport={r.canExport}
        />

        {/* GROUPED BREAKDOWN */}
        <div className="rounded-2xl p-5 sm:p-6 border border-slate-100/60">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
              {t("summary.costBreakdown")}
            </div>
            {topCostCategory && (
              <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                {topCostCategory.name} {topCostCategory.pct.toFixed(0)}%
              </span>
            )}
          </div>

          {/* Cost breakdown — Simple Mode shows ALL contributing categories in one
              group so breakdown total always equals displayed total (trust integrity).
              Advanced Mode uses Direct / Indirect / Optional grouping. */}
          {isSimple ? (
            <CostGroup
              label={t("summary.groupCosts")}
              currency={currency}
              items={[
                { name: catLabel("Materials"),    value: materialTotal,    key: "Materials" },
                { name: catLabel("Labor"),        value: laborTotal,       key: "Labor" },
                { name: catLabel("Packaging"),    value: packagingTotal,   key: "Packaging" },
                { name: catLabel("Electricity"),  value: electricityTotal, key: "Electricity" },
                { name: catLabel("Rent"),         value: rentTotal,        key: "Rent" },
                { name: catLabel("Other"),        value: otherTotal,       key: "Other" },
                ...(machinesEnabled ? [{ name: catLabel("Machines"), value: machineTotal, key: "Machines" }] : []),
              ]}
              highlightKey={topCostCategory?.name}
              total={r.total}
            />
          ) : (
            <>
              <CostGroup
                label={t("summary.groupDirect")}
                currency={currency}
                items={[
                  { name: catLabel("Materials"),  value: materialTotal,  key: "Materials" },
                  { name: catLabel("Labor"),      value: laborTotal,     key: "Labor" },
                  { name: catLabel("Packaging"),  value: packagingTotal, key: "Packaging" },
                ]}
                highlightKey={topCostCategory?.name}
                total={r.total}
              />
              <CostGroup
                label={t("summary.groupIndirect")}
                currency={currency}
                items={[
                  { name: catLabel("Electricity"), value: electricityTotal, key: "Electricity" },
                  { name: catLabel("Rent"),        value: rentTotal,        key: "Rent" },
                  { name: catLabel("Other"),       value: otherTotal,       key: "Other" },
                ]}
                highlightKey={topCostCategory?.name}
                total={r.total}
              />
              {machinesEnabled && (
                <CostGroup
                  label={t("summary.groupOptional")}
                  currency={currency}
                  items={[{ name: catLabel("Machines"), value: machineTotal, key: "Machines" }]}
                  highlightKey={topCostCategory?.name}
                  total={r.total}
                />
              )}
            </>
          )}

          {/* Totals */}
          <div className="pt-3 mt-2 border-t border-slate-100">
            <ResultRow label={t("summary.totalCost")} value={r.total} prefix={currency.symbol} decimals={2} currency={currency} />
          </div>
        </div>

        {/* Insights */}
        <AIInsightsPanel insights={insights} />


        {/* Saved Costings link — opens the load modal */}
        <button
          onClick={() => setShowLoadModal(true)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-100/60 hover:border-teal-200 hover:bg-teal-50/40 transition text-left group"
        >
          <div className="flex items-center gap-2">
            <FolderOpen size={14} className="text-teal-700 shrink-0" strokeWidth={2.2} />
            <span className="text-[13px] font-medium text-slate-700 group-hover:text-teal-800">
              {t("tpl.button")}
            </span>
          </div>
          <span className="text-[12px] text-slate-400 group-hover:text-teal-700">
            {t("tpl.load")} →
          </span>
        </button>
      </motion.div>

      {/* MOBILE — sticky bottom summary sheet */}
      <div className="md:hidden print:hidden">
        {/* Spacer so content isn't hidden behind the sheet */}
        <div className="h-20" />
        <motion.div
          initial={false}
          animate={{ y: 0 }}
          className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]"
        >
          {/* Collapsed bar — always visible */}
          <button
            onClick={() => setMobileSummaryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-4 py-3 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              {(() => {
                const status = profitStatus(r.realizedMargin, r.total, t, { price: r.price, cpu: r.cpu });
                return (
                  <span
                    className={`inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      status ? `${status.bg} ${status.text}` : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <span className="text-[9px]">{status?.dot || "⚪"}</span>
                    {status?.label || t("summary.enterData")}
                  </span>
                );
              })()}
              <div className="min-w-0">
                <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-medium leading-tight">
                  {t("mobile.sellAt")}
                </div>
                <div className="text-[18px] font-semibold tabular-nums num-ltr text-slate-900 leading-tight truncate">
                  {r.isValid
                    ? <AnimatedNumber value={r.price} prefix={currency.symbol} decimals={2} currency={currency} />
                    : <span className="text-slate-300">—</span>
                  }
                </div>
              </div>
            </div>
            <ChevronUp
              size={16}
              className={`text-slate-400 transition-transform ${mobileSummaryOpen ? "" : "rotate-180"}`}
            />
          </button>

          {/* Expanded drawer */}
          <AnimatePresence initial={false}>
            {mobileSummaryOpen && (
              <motion.div
                key="mobile-drawer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 max-h-[60vh] overflow-y-auto">
                  <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    {t("summary.costBreakdown")}
                  </div>
                  <ResultRow label={catLabel("Materials")} value={materialTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />
                  <ResultRow label={catLabel("Labor")} value={laborTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />
                  {!isSimple && <ResultRow label={catLabel("Electricity")} value={electricityTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />}
                  {!isSimple && <ResultRow label={catLabel("Rent")} value={rentTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />}
                  {!isSimple && <ResultRow label={catLabel("Packaging")} value={packagingTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />}
                  {!isSimple && <ResultRow label={catLabel("Other")} value={otherTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />}
                  {!isSimple && machinesEnabled && (
                    <ResultRow label={catLabel("Machines")} value={machineTotal} prefix={currency.symbol} decimals={2} currency={currency} muted />
                  )}
                  <ResultRow label={t("summary.totalCost")} value={r.total} prefix={currency.symbol} decimals={2} currency={currency} />
                  <ResultRow label={t("summary.costPerUnit")} value={r.cpu} prefix={currency.symbol} decimals={2} currency={currency} />
                  <ResultRow label={t("summary.profitPerUnit")} value={r.profitPerUnit} prefix={currency.symbol} decimals={2} currency={currency} muted />
                  <ResultRow label={t("summary.totalProfit")} value={r.profit} prefix={currency.symbol} decimals={0} currency={currency} />
                  <ResultRow label={t("summary.margin")} value={r.realizedMargin} decimals={1} />

                  {insights.length > 0 && (
                    <div className="pt-3 mt-2 border-t border-slate-100">
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold mb-2">
                        {t("summary.insights")}
                      </div>
                      <div className="space-y-2">
                        {insights.map((ins, i) => {
                          const dot =
                            ins.tone === "red"
                              ? "bg-red-400"
                              : ins.tone === "amber"
                              ? "bg-amber-400"
                              : ins.tone === "green"
                              ? "bg-emerald-400"
                              : "bg-slate-300";
                          return (
                            <div key={i} className="flex items-start gap-2 text-[12px] text-slate-700 leading-snug">
                              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
                              <span>{resolveInsightText(ins, t)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Mobile export actions */}
                  <div className="pt-3 mt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={r.canExport ? exportPDF : undefined}
                      disabled={!r.canExport}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition ${r.canExport ? "border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                    >
                      <FileText size={14} strokeWidth={2.2} />
                      {t("actions.pdf")}
                    </button>
                    <button
                      onClick={r.canExport ? exportXLSX : undefined}
                      disabled={!r.canExport}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[13px] font-medium transition ${r.canExport ? "border-slate-200 text-slate-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800" : "border-slate-100 text-slate-300 cursor-not-allowed"}`}
                    >
                      <FileSpreadsheet size={14} strokeWidth={2.2} />
                      {t("actions.excel")}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BATCH (unchanged simple wizard)
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// BATCH MODE — Intelligent guided wizard
// Same row-based costing engine as Quick Cost, presented one step
// at a time. State preserved across steps. Live mini summary always
// visible. Step 8 reuses the full hero/breakdown/insights look.
// ─────────────────────────────────────────────────────────────
function Batch({ currency, onSendToQuickCost }) {
  const t = useT();
  const n = (v) => parseFloat(v) || 0;

  // ─── Autosave helpers ──────────────────────────────────────
  const BATCH_SAVE_KEY = "costix:batch:autosave";
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _bs = React.useMemo(() => lsGet(BATCH_SAVE_KEY, null), []);

  // Step index (0..7) — restored from autosave, clamped to valid range
  // Guard against corrupted localStorage values (negative, > 7, NaN, non-number)
  const [step, setStep] = useState(() => {
    const saved = Number(_bs?.step ?? 0);
    return isNaN(saved) ? 0 : Math.max(0, Math.min(7, saved));
  });

  // Runtime safety net — if step ever drifts out of bounds, snap back to 0
  useEffect(() => {
    if (step < 0 || step > 7 || !Number.isInteger(step)) setStep(0);
  }, [step]);

  // Identical state shape to QuickCost — same costing engine
  const [form, setForm] = useState(() => _bs?.form ?? {
    name: "",
    units: "",
    snapshotName: "",
    pricingMode: "margin",
    margin: "30",
    markup: "40",
    targetProfit: "",
  });
  const setF = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const [materials, setMaterials] = useState(() => _bs?.materials ?? [newMaterial()]);
  const [labor, setLabor] = useState(() => _bs?.labor ?? [newLabor()]);
  const [packaging, setPackaging] = useState(() => _bs?.packaging ?? [newPackaging()]);
  const [electricity, setElectricity] = useState(() => _bs?.electricity ?? { unitsUsed: "", billUnits: "", billAmount: "" });
  const [rent, setRent] = useState(() => _bs?.rent ?? {
    monthlyRent: "",
    factoryPct: "50",
    warehousePct: "30",
    officePct: "20",
    daysUsed: "",
    daysInMonth: "30",
    includeWarehouse: false,
  });
  const [machinesEnabled, setMachinesEnabled] = useState(() => _bs?.machinesEnabled ?? false);
  const [machineMethod, setMachineMethod] = useState(() => _bs?.machineMethod ?? "time");
  const [timeMachines, setTimeMachines] = useState(() => _bs?.timeMachines ?? [
    { id: id(), name: "", cost: "", life: "", daysUsed: "", daysInYear: "365" },
  ]);
  const [unitMachines, setUnitMachines] = useState(() => _bs?.unitMachines ?? [
    { id: id(), name: "", cost: "", capacity: "", batchUnits: "" },
  ]);

  // Debounced autosave — writes on every meaningful state change
  const _batchAutosaveTimer = useRef(null);
  useEffect(() => {
    if (_batchAutosaveTimer.current) clearTimeout(_batchAutosaveTimer.current);
    _batchAutosaveTimer.current = setTimeout(() => {
      lsSet(BATCH_SAVE_KEY, {
        step, form, materials, labor, packaging,
        electricity, rent, machinesEnabled, machineMethod, timeMachines, unitMachines,
      });
    }, 800);
    return () => clearTimeout(_batchAutosaveTimer.current);
  }, [step, form, materials, labor, packaging, electricity, rent, machinesEnabled, machineMethod, timeMachines, unitMachines]);

  // Auto cost totals — identical math to QuickCost (landed-cost aware)
  const sumRows = (rows) =>
    rows.reduce((s, r) => s + calcRowCost({
      usedQty: r.usedQty, usedUnit: r.usedUnit,
      purchasedQty: r.purchasedQty, purchasedUnit: r.purchasedUnit,
      purchasedCost: r.purchasedCost,
      source: r.source, delivery: r.delivery, freight: r.freight,
      duty: r.duty, taxes: r.taxes, taxRecoverable: r.taxRecoverable ?? true,
      clearing: r.clearing,
    }).cost, 0);

  const materialTotal = useMemo(() => sumRows(materials), [materials]);
  const laborTotal = useMemo(() => sumRows(labor), [labor]);
  const packagingTotal = useMemo(() => sumRows(packaging), [packaging]);
  const electricityTotal = useMemo(() => {
    const u = n(electricity.unitsUsed), tu = n(electricity.billUnits), a = n(electricity.billAmount);
    if (u <= 0 || tu <= 0 || a <= 0) return 0;
    return (u / tu) * a;
  }, [electricity]);
  const rentTotal = useMemo(() => {
    const m = n(rent.monthlyRent), d = n(rent.daysUsed), dim = n(rent.daysInMonth) || 30;
    if (m <= 0 || d <= 0) return 0;
    const fp = n(rent.factoryPct), wp = n(rent.warehousePct), op = n(rent.officePct);
    const productionPct = fp + (rent.includeWarehouse ? wp : 0);
    // Block calculation if space allocation is mathematically impossible (> 100%)
    const totalAllocated = fp + (rent.includeWarehouse ? wp : 0) + op;
    if (totalAllocated > 100) return 0;
    return (d / dim) * m * (productionPct / 100);
  }, [rent]);
  const machineTotal = useMemo(() => {
    if (!machinesEnabled) return 0;
    if (machineMethod === "time") {
      return timeMachines.reduce((s, m) => {
        const c = n(m.cost), life = n(m.life), days = n(m.daysUsed), diy = n(m.daysInYear) || 365;
        if (c <= 0 || life <= 0 || days <= 0) return s;
        return s + (days / diy) * (c / life);
      }, 0);
    }
    return unitMachines.reduce((s, m) => {
      const c = n(m.cost), cap = n(m.capacity), u = n(m.batchUnits);
      if (c <= 0 || cap <= 0 || u <= 0) return s;
      return s + (c / cap) * u;
    }, 0);
  }, [machinesEnabled, machineMethod, timeMachines, unitMachines]);

  // Top-level results — same formula as QuickCost
  const r = useMemo(() => {
    const total = materialTotal + laborTotal + electricityTotal + rentTotal + packagingTotal + machineTotal;
    const units = n(form.units);
    const cpu = units > 0 ? total / units : 0;
    let price = 0;
    if (form.pricingMode === "markup") price = cpu * (1 + n(form.markup) / 100);
    else if (form.pricingMode === "target") price = cpu + n(form.targetProfit);
    else {
      const denom = 1 - n(form.margin) / 100;
      price = denom > 0 ? cpu / denom : cpu;
    }
    const revenue = price * units;
    const profit = revenue - total;
    const realizedMargin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const profitPerUnit = price - cpu;
    return { total, cpu, price, profit, realizedMargin, profitPerUnit, units };
  }, [materialTotal, laborTotal, electricityTotal, rentTotal, packagingTotal, machineTotal, form]);

  // Insights — returns {tone, key, params}; translation via resolveInsightText at render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const insights = useMemo(() => {
    const out = [];
    if (r.total <= 0) return out;
    const share = (v) => (r.total > 0 ? (v / r.total) * 100 : 0);
    if (r.realizedMargin < 0) out.push({ tone: "red", key: "insight.lossSelling", params: {} });
    else if (r.realizedMargin < 10) out.push({ tone: "amber", key: "insight.marginLow", params: { margin: r.realizedMargin.toFixed(1) } });
    else if (r.realizedMargin >= 35) out.push({ tone: "green", key: "insight.marginHealthy", params: { margin: r.realizedMargin.toFixed(0) } });
    const cats = [
      { catKey: "Materials", v: share(materialTotal) },
      { catKey: "Labor", v: share(laborTotal) },
      { catKey: "Electricity", v: share(electricityTotal) },
      { catKey: "Packaging", v: share(packagingTotal) },
      { catKey: "Rent", v: share(rentTotal) },
    ];
    cats.sort((a, b) => b.v - a.v);
    if (cats[0].v >= 50) out.push({ tone: "neutral", key: "insight.biggestLever", params: { catKey: cats[0].catKey, pct: cats[0].v.toFixed(0) } });
    return out.slice(0, 3);
  }, [r, materialTotal, laborTotal, electricityTotal, packagingTotal, rentTotal]);

  const topCostCategory = useMemo(() => {
    const cats = [
      { name: "Materials", value: materialTotal },
      { name: "Labor", value: laborTotal },
      { name: "Electricity", value: electricityTotal },
      { name: "Rent", value: rentTotal },
      { name: "Packaging", value: packagingTotal },
      { name: "Machines", value: machineTotal },
    ].filter((c) => c.value > 0);
    if (cats.length === 0 || r.total === 0) return null;
    const top = cats.reduce((a, b) => (b.value > a.value ? b : a));
    return { name: top.name, pct: (top.value / r.total) * 100 };
  }, [materialTotal, laborTotal, electricityTotal, rentTotal, packagingTotal, machineTotal, r.total]);

  const catLabel = (k) => {
    const map = {
      Materials: t("cat.materials"), Labor: t("cat.labor"), Packaging: t("cat.packaging"),
      Electricity: t("cat.electricity"), Rent: t("cat.rent"), Machines: t("cat.machines"),
    };
    return map[k] || k;
  };

  // Confirmation before "Start New" — prevents accidental loss of 8-step work
  const [confirmClear, setConfirmClear] = useState(false);

  // Persistent save for Batch — stores full wizard state to costix:tpl:batch
  const [batchSaved, setBatchSaved] = useState(null); // "saved" | "error" | null
  const saveBatchCosting = async () => {
    const name = form.snapshotName || form.name || "Batch costing";
    const snapshot = {
      name,
      form: { ...form },
      materials: materials.map((r) => ({ ...r })),
      labor: labor.map((r) => ({ ...r })),
      packaging: packaging.map((r) => ({ ...r })),
      electricity: { ...electricity },
      rent: { ...rent },
      machinesEnabled,
      machineMethod,
      timeMachines: timeMachines.map((r) => ({ ...r })),
      unitMachines: unitMachines.map((r) => ({ ...r })),
      // Costing results for display in the saved list
      unitCost: r.cpu,
      price: r.price,
      margin: r.realizedMargin,
      totalCost: r.total,
      currencyCode: currency.code,
      calcMode: "batch",
    };
    const record = await tplSave("batch", snapshot);
    setBatchSaved(record ? "saved" : "error");
    setTimeout(() => setBatchSaved(null), 2000);
  };

  // ─── Step definitions ────────────────────────────────────
  const TOTAL_STEPS = 8;
  const stepTitles = [
    { title: t("batchwiz.step1Title"), hint: t("batchwiz.step1Hint") },
    { title: t("batchwiz.step2Title"), hint: t("batchwiz.step2Hint") },
    { title: t("batchwiz.step3Title"), hint: t("batchwiz.step3Hint") },
    { title: t("batchwiz.step4Title"), hint: t("batchwiz.step4Hint") },
    { title: t("batchwiz.step5Title"), hint: t("batchwiz.step5Hint") },
    { title: t("batchwiz.step6Title"), hint: t("batchwiz.step6Hint") },
    { title: t("batchwiz.step7Title"), hint: t("batchwiz.step7Hint") },
    { title: t("batchwiz.step8Title"), hint: t("batchwiz.step8Hint") },
  ];

  const isFinal = step === TOTAL_STEPS - 1;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const goNext = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const goBack = () => setStep((s) => Math.max(0, s - 1));

  // Add-row helpers (mirror QuickCost)
  const addMaterial = () => setMaterials((m) => [...m, newMaterial()]);
  const removeMaterial = (i) => setMaterials((m) => m.length > 1 ? m.filter((_, idx) => idx !== i) : m);
  const updateMaterial = (i, row) => setMaterials((m) => m.map((r, idx) => idx === i ? row : r));

  const addLaborRow = () => setLabor((m) => [...m, newLabor()]);
  const removeLaborRow = (i) => setLabor((m) => m.length > 1 ? m.filter((_, idx) => idx !== i) : m);
  const updateLaborRow = (i, row) => setLabor((m) => m.map((r, idx) => idx === i ? row : r));
  const quickAddLabor = (role) => {
    const empty = labor.findIndex((r) => !r.name);
    if (empty >= 0) updateLaborRow(empty, { ...labor[empty], name: role });
    else setLabor((m) => [...m, { ...newLabor(), name: role }]);
  };

  const addPack = () => setPackaging((m) => [...m, newPackaging()]);
  const removePack = (i) => setPackaging((m) => m.length > 1 ? m.filter((_, idx) => idx !== i) : m);
  const updatePack = (i, row) => setPackaging((m) => m.map((r, idx) => idx === i ? row : r));

  const status = profitStatus(r.realizedMargin, r.total, t, { price: r.price, cpu: r.cpu });

  // ─── Render ──────────────────────────────────────────────
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl mx-auto pb-32 md:pb-0">
      {/* Floating live mini summary — top of card, always visible */}
      <div className="sticky top-[100px] md:top-[60px] z-10 mb-4 -mx-4 sm:mx-0">
        <div className="mx-4 sm:mx-0 flex items-center gap-3 bg-white/85 backdrop-blur-xl border border-slate-100 rounded-2xl px-4 py-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <span className="text-[10.5px] uppercase tracking-wider text-slate-400 font-semibold shrink-0">{t("batchwiz.miniLabel")}</span>
          <div className="flex-1 flex items-center gap-4 min-w-0 overflow-hidden">
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">{t("summary.costPerUnit")}</div>
              <div className="text-[14px] font-semibold tabular-nums num-ltr text-slate-900 leading-tight truncate">
                {r.units > 0 && r.cpu > 0 ? `${currency.symbol}${formatNumber(r.cpu, currency.locale, 2)}` : "—"}
              </div>
            </div>
            <div className="w-px h-7 bg-slate-100 shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider leading-tight">{t("summary.margin")}</div>
              <div className="text-[14px] font-semibold tabular-nums num-ltr text-slate-900 leading-tight truncate">
                {r.total > 0 ? `${formatNumber(r.realizedMargin, currency.locale, 1)}%` : "—"}
              </div>
            </div>
          </div>
          {status && (
            <span className={`hidden sm:inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full shrink-0 ${status.bg} ${status.text}`}>
              <span className="text-[9px]">{status.dot}</span>
              {status.label}
            </span>
          )}
        </div>
      </div>

      {/* Main wizard card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100">
        {/* Step header — counter + progress bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-[11.5px] font-semibold tracking-wider text-slate-400 uppercase">
            {t("batch.stepLabel")} {step + 1} {t("batch.stepOf")} {TOTAL_STEPS}
          </div>
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${accent}, ${accentDark})` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 28 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25 }}
          >
            {/* Safe access — stepTitles[step] should always exist after clamping,
                but guard here prevents a blank page if it somehow doesn't */}
            {!stepTitles[step] ? (
              <div className="py-12 text-center text-[13px] text-slate-400">
                <button onClick={() => setStep(0)} className="text-teal-700 underline underline-offset-2">
                  Restart wizard
                </button>
              </div>
            ) : (
            <>
            <h2 className="text-[22px] sm:text-[26px] font-bold text-slate-900 tracking-tight leading-tight">
              {stepTitles[step].title}
            </h2>
            <p className="text-[13.5px] text-slate-500 mt-1.5 mb-6">
              {stepTitles[step].hint}
            </p>

            {/* ─── STEP 1 · BASICS ─────────────────────────── */}
            {step === 0 && (
              <div className="space-y-3">
                <Field label={t("quick.productName")} type="text" value={form.name} onChange={setF("name")} placeholder={t("quick.productNamePlaceholder")} />
                <Field label={t("quick.unitsProduced")} value={form.units} onChange={setF("units")} placeholder="500" />
                <div className="pt-2">
                  <Field label={t("batchwiz.snapshotName")} type="text" value={form.snapshotName} onChange={setF("snapshotName")} placeholder={t("batchwiz.snapshotNamePlaceholder")} />
                </div>
              </div>
            )}

            {/* ─── STEP 2 · MATERIALS ──────────────────────── */}
            {step === 1 && (
              <div>
                <div className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.7fr) 28px" }}>
                  <div className="pl-1.5">{t("materials.columnName")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnQty")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnPurchased")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnCost")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnAuto")}</div>
                  <div />
                </div>
                {materials.map((row, i) => (
                  <CostRow
                    key={row.id}
                    row={row}
                    onChange={(updated) => updateMaterial(i, updated)}
                    onRemove={() => removeMaterial(i)}
                    canRemove={materials.length > 1}
                    currency={currency}
                    namePlaceholder={["Flour", "Cotton fabric", "Plastic granules"][i % 3]}
                    usedLabel="50"
                    purchasedLabel="100"
                    costLabel="0"
                    supportsSource={true}
                    unitOptions={MATERIAL_UNITS}
                  />
                ))}
                <button onClick={addMaterial} className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-teal-700 hover:text-teal-900 px-3 py-1.5 -ml-2 rounded-lg hover:bg-teal-50 transition">
                  <Plus size={13} strokeWidth={2.4} />
                  {t("materials.addLabel")}
                </button>
              </div>
            )}

            {/* ─── STEP 3 · LABOR ──────────────────────────── */}
            {step === 2 && (
              <div>
                <ChipRow items={LABOR_ROLES} onPick={quickAddLabor} />
                <div className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.7fr) 28px" }}>
                  <div className="pl-1.5">{t("labor.columnRole")}</div>
                  <div className="text-right pr-1.5">{t("labor.columnHours")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("labor.columnMonthly")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("labor.columnSalary")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnAuto")}</div>
                  <div />
                </div>
                {labor.map((row, i) => (
                  <CostRow
                    key={row.id}
                    row={row}
                    onChange={(updated) => updateLaborRow(i, updated)}
                    onRemove={() => removeLaborRow(i)}
                    canRemove={labor.length > 1}
                    currency={currency}
                    namePlaceholder="Tailor"
                    usedLabel="20"
                    purchasedLabel="240"
                    costLabel="600"
                    unitOptions={LABOR_UNITS}
                  />
                ))}
                <button onClick={addLaborRow} className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-teal-700 hover:text-teal-900 px-3 py-1.5 -ml-2 rounded-lg hover:bg-teal-50 transition">
                  <Plus size={13} strokeWidth={2.4} />
                  {t("labor.addLabel")}
                </button>
              </div>
            )}

            {/* ─── STEP 4 · ELECTRICITY + RENT ─────────────── */}
            {step === 3 && (
              <div className="space-y-7">
                {/* Electricity sub-block */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap size={14} className="text-teal-700" strokeWidth={2.3} />
                    <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">{t("batchwiz.electricity")}</h3>
                    {electricityTotal > 0 && (
                      <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium tabular-nums num-ltr ml-auto">
                        {currency.symbol}{formatNumber(electricityTotal, currency.locale, 2)}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("electricity.unitsUsed")}</div>
                      <CellInput value={electricity.unitsUsed} onChange={(v) => setElectricity({ ...electricity, unitsUsed: v })} placeholder="500" />
                    </div>
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("electricity.billUnits")}</div>
                      <CellInput value={electricity.billUnits} onChange={(v) => setElectricity({ ...electricity, billUnits: v })} placeholder="3000" />
                    </div>
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("electricity.billAmount")}</div>
                      <CellInput value={electricity.billAmount} onChange={(v) => setElectricity({ ...electricity, billAmount: v })} placeholder="400" prefix={currency.symbol} />
                    </div>
                  </div>
                </div>

                {/* Rent sub-block */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Home size={14} className="text-teal-700" strokeWidth={2.3} />
                    <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">{t("batchwiz.rent")}</h3>
                    {rentTotal > 0 && (
                      <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium tabular-nums num-ltr ml-auto">
                        {currency.symbol}{formatNumber(rentTotal, currency.locale, 2)}
                      </span>
                    )}
                  </div>
                  {/* Shake wrapper — fires once when allocation exceeds 100% */}
                  <motion.div
                    className="space-y-3"
                    animate={(() => {
                      const fp = n(rent.factoryPct), wp = n(rent.warehousePct), op = n(rent.officePct);
                      const total = rent.includeWarehouse ? fp + wp + op : fp + op;
                      return total > 100 ? { x: [0, -5, 5, -3, 2, 0] } : { x: 0 };
                    })()}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                  >
                    {/* Monthly rent */}
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.monthlyRent")}</div>
                      <CellInput value={rent.monthlyRent} onChange={(v) => setRent({ ...rent, monthlyRent: v })} placeholder="15000" prefix={currency.symbol} />
                    </div>

                    {/* Include warehouse toggle — set mode before entering values */}
                    <button
                      onClick={() => setRent({ ...rent, includeWarehouse: !rent.includeWarehouse })}
                      className="inline-flex items-center gap-2 text-[12px] text-slate-600 hover:text-teal-700 transition pl-1"
                    >
                      <span className={`relative inline-block w-7 h-4 rounded-full transition-colors ${rent.includeWarehouse ? "bg-teal-600" : "bg-slate-300"}`}>
                        <motion.span
                          className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow"
                          animate={{ left: rent.includeWarehouse ? 14 : 2 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </span>
                      {t("rent.includeWarehouse")}
                    </button>

                    {/* Space allocation — conditional on warehouse toggle */}
                    {rent.includeWarehouse ? (
                      /* Warehouse ON: factory + warehouse + office */
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.factoryPct")}</div>
                          <CellInput value={rent.factoryPct} onChange={(v) => setRent({ ...rent, factoryPct: v })} placeholder="50" />
                        </div>
                        <div>
                          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.warehousePct")}</div>
                          <CellInput value={rent.warehousePct} onChange={(v) => setRent({ ...rent, warehousePct: v })} placeholder="30" />
                        </div>
                        <div>
                          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.officePct")}</div>
                          <CellInput value={rent.officePct} onChange={(v) => setRent({ ...rent, officePct: v })} placeholder="20" />
                        </div>
                      </div>
                    ) : (
                      /* Warehouse OFF: factory + office only */
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.factoryPct")}</div>
                          <CellInput value={rent.factoryPct} onChange={(v) => setRent({ ...rent, factoryPct: v })} placeholder="60" />
                        </div>
                        <div>
                          <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.officePct")}</div>
                          <CellInput value={rent.officePct} onChange={(v) => setRent({ ...rent, officePct: v })} placeholder="20" />
                        </div>
                      </div>
                    )}

                    {/* Allocation validation + summary */}
                    {(() => {
                      const fp = n(rent.factoryPct), wp = n(rent.warehousePct), op = n(rent.officePct);
                      const total = rent.includeWarehouse ? fp + wp + op : fp + op;
                      const hasInput = rent.includeWarehouse ? (fp > 0 || wp > 0 || op > 0) : (fp > 0 || op > 0);
                      if (!hasInput) return null;
                      if (total > 100) {
                        return (
                          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                            <span className="text-[11.5px] font-semibold text-red-600">Total allocation cannot exceed 100%</span>
                          </div>
                        );
                      }
                      // Only show allocation summary when warehouse is included
                      if (!rent.includeWarehouse) return null;
                      const unused = 100 - total;
                      return (
                        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-slate-50 border border-slate-100">
                          <span className="text-[11px] text-slate-500 tabular-nums">
                            <span className="font-semibold text-slate-700">{total}%</span> allocated
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="text-[11px] text-slate-500 tabular-nums">
                            <span className={unused > 0 ? "font-semibold text-amber-600" : "font-semibold text-slate-700"}>{unused}%</span> unused
                          </span>
                        </div>
                      );
                    })()}

                    {/* Days used */}
                    <div>
                      <div className="text-[10.5px] uppercase tracking-wider text-slate-400 mb-1 pl-1.5">{t("rent.daysUsed")}</div>
                      <CellInput value={rent.daysUsed} onChange={(v) => setRent({ ...rent, daysUsed: v })} placeholder="12" />
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* ─── STEP 5 · PACKAGING ──────────────────────── */}
            {step === 4 && (
              <div>
                <div className="hidden sm:grid items-center gap-1 pb-1.5 text-[10px] uppercase tracking-wider text-slate-400/60 font-medium" style={{ gridTemplateColumns: "minmax(0,1.1fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.55fr) minmax(0,0.7fr) minmax(0,0.7fr) 28px" }}>
                  <div className="pl-1.5">{t("other.columnItem")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnQty")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnPurchased")}</div>
                  <div className="pl-1.5">{t("materials.columnUnit")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnCost")}</div>
                  <div className="text-right pr-1.5">{t("materials.columnAuto")}</div>
                  <div />
                </div>
                {packaging.map((row, i) => (
                  <CostRow
                    key={row.id}
                    row={row}
                    onChange={(updated) => updatePack(i, updated)}
                    onRemove={() => removePack(i)}
                    canRemove={packaging.length > 1}
                    currency={currency}
                    namePlaceholder={["Poly bag", "Carton", "Label"][i % 3]}
                    usedLabel="500"
                    purchasedLabel="1000"
                    costLabel="0"
                  />
                ))}
                <button onClick={addPack} className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-teal-700 hover:text-teal-900 px-3 py-1.5 -ml-2 rounded-lg hover:bg-teal-50 transition">
                  <Plus size={13} strokeWidth={2.4} />
                  {t("packaging.addLabel")}
                </button>
              </div>
            )}

            {/* ─── STEP 6 · MACHINE WEAR (optional) ────────── */}
            {step === 5 && (
              <div>
                <div className="flex items-center justify-between gap-3 mb-3 p-3 bg-slate-50 rounded-xl">
                  <p className="text-[12.5px] text-slate-600 leading-snug">
                    {t("machines.description")}
                  </p>
                  <button
                    onClick={() => setMachinesEnabled((v) => !v)}
                    className={`shrink-0 relative inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg transition ${
                      machinesEnabled ? "bg-teal-600 text-white" : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {machinesEnabled ? t("machines.on") : t("machines.off")}
                  </button>
                </div>

                <AnimatePresence initial={false}>
                  {machinesEnabled && (
                    <motion.div
                      key="machines-body"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="inline-flex bg-slate-100/80 rounded-xl p-1 gap-1 mb-3">
                        {[
                          { id: "time", label: t("machines.methodTime") },
                          { id: "production", label: t("machines.methodProduction") },
                        ].map((m) => {
                          const active = machineMethod === m.id;
                          return (
                            <button
                              key={m.id}
                              onClick={() => setMachineMethod(m.id)}
                              className="relative px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                            >
                              {active && (
                                <motion.div
                                  layoutId="batch-machine-mode-bg"
                                  className="absolute inset-0 bg-white rounded-lg shadow-sm"
                                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                />
                              )}
                              <span className={`relative ${active ? "text-teal-800" : "text-slate-500"}`}>
                                {m.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {machineMethod === "time" ? (
                        timeMachines.map((m, i) => (
                          <div key={m.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-2 border-b border-slate-100 group">
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => setTimeMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                              placeholder="Stitching machine"
                              className="bg-transparent border-none outline-none text-[13.5px] text-slate-900 placeholder:text-slate-400 px-1.5 py-1.5 col-span-2 sm:col-span-1"
                            />
                            <CellInput value={m.cost} onChange={(v) => setTimeMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, cost: v } : x))} placeholder="50000" prefix={currency.symbol} align="right" />
                            <CellInput value={m.life} onChange={(v) => setTimeMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, life: v } : x))} placeholder="5" align="right" />
                            <CellInput value={m.daysUsed} onChange={(v) => setTimeMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, daysUsed: v } : x))} placeholder="12" align="right" />
                            <div className="text-right pr-1.5 text-[13px] font-semibold tabular-nums num-ltr text-slate-900 self-center">
                              {(() => {
                                const c = n(m.cost), life = n(m.life), days = n(m.daysUsed), diy = n(m.daysInYear) || 365;
                                if (c <= 0 || life <= 0 || days <= 0) return "—";
                                return `${currency.symbol}${formatNumber((days / diy) * (c / life), currency.locale, 2)}`;
                              })()}
                            </div>
                          </div>
                        ))
                      ) : (
                        unitMachines.map((m, i) => (
                          <div key={m.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 py-2 border-b border-slate-100 group">
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) => setUnitMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))}
                              placeholder="Stitching machine"
                              className="bg-transparent border-none outline-none text-[13.5px] text-slate-900 placeholder:text-slate-400 px-1.5 py-1.5 col-span-2 sm:col-span-1"
                            />
                            <CellInput value={m.cost} onChange={(v) => setUnitMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, cost: v } : x))} placeholder="50000" prefix={currency.symbol} align="right" />
                            <CellInput value={m.capacity} onChange={(v) => setUnitMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, capacity: v } : x))} placeholder="100000" align="right" />
                            <CellInput value={m.batchUnits} onChange={(v) => setUnitMachines((arr) => arr.map((x, idx) => idx === i ? { ...x, batchUnits: v } : x))} placeholder="500" align="right" />
                            <div className="text-right pr-1.5 text-[13px] font-semibold tabular-nums num-ltr text-slate-900 self-center">
                              {(() => {
                                const c = n(m.cost), cap = n(m.capacity), u = n(m.batchUnits);
                                if (c <= 0 || cap <= 0 || u <= 0) return "—";
                                return `${currency.symbol}${formatNumber((c / cap) * u, currency.locale, 2)}`;
                              })()}
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ─── STEP 7 · PROFIT TARGET ──────────────────── */}
            {step === 6 && (
              <div>
                <div className="inline-flex bg-slate-100/80 rounded-xl p-1 gap-1 mb-4">
                  {[
                    { id: "margin", label: t("pricing.modeMargin") },
                    { id: "markup", label: t("pricing.modeMarkup") },
                    { id: "target", label: t("pricing.modeTarget") },
                  ].map((m) => {
                    const active = form.pricingMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setF("pricingMode")(m.id)}
                        className="relative px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
                      >
                        {active && (
                          <motion.div
                            layoutId="batch-pricing-mode-bg"
                            className="absolute inset-0 bg-white rounded-lg shadow-sm"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                        <span className={`relative ${active ? "text-teal-800" : "text-slate-500"}`}>
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence mode="wait">
                  {form.pricingMode === "margin" && (
                    <motion.div key="margin" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                      <Field label={t("pricing.marginField")} value={form.margin} onChange={setF("margin")} suffix="%" placeholder="30" />
                    </motion.div>
                  )}
                  {form.pricingMode === "markup" && (
                    <motion.div key="markup" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                      <Field label={t("pricing.markupField")} value={form.markup} onChange={setF("markup")} suffix="%" placeholder="40" />
                    </motion.div>
                  )}
                  {form.pricingMode === "target" && (
                    <motion.div key="target" initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }} transition={{ duration: 0.18 }}>
                      <Field label={t("pricing.targetField")} value={form.targetProfit} onChange={setF("targetProfit")} prefix={currency.symbol} placeholder="50" />
                    </motion.div>
                  )}
                </AnimatePresence>
                <p className="text-[11.5px] text-slate-400 leading-snug mt-3 pl-1">
                  {form.pricingMode === "margin" && t("pricing.marginHint")}
                  {form.pricingMode === "markup" && t("pricing.markupHint")}
                  {form.pricingMode === "target" && t("pricing.targetHint")}
                </p>
              </div>
            )}

            {/* ─── STEP 8 · FINAL SUMMARY ──────────────────── */}
            {step === 7 && (
              <div className="space-y-4">
                {/* Hero card */}
                <div className="rounded-2xl p-5 sm:p-6 text-white relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)` }}>
                  <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-[11px] uppercase tracking-wider text-teal-100 font-semibold">{t("summary.suggestedPrice")}</div>
                      {status && (
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium bg-white/15 backdrop-blur-sm text-white px-2 py-0.5 rounded-full">
                          <span className="text-[9px]">{status.dot}</span>
                          {status.label}
                        </span>
                      )}
                    </div>
                    <div className="text-[36px] sm:text-[40px] font-semibold tracking-tight tabular-nums num-ltr leading-none mt-2">
                      <AnimatedNumber value={r.price} prefix={currency.symbol} decimals={2} currency={currency} />
                    </div>
                    <div className="text-[11.5px] text-teal-100 mt-1">{t("summary.perUnit")}</div>
                    <div className="mt-4 pt-4 border-t border-white/15 grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.costPerUnit")}</div>
                        <div className="text-[15px] font-semibold tabular-nums num-ltr mt-0.5"><AnimatedNumber value={r.cpu} prefix={currency.symbol} decimals={2} currency={currency} /></div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.profitPerUnit")}</div>
                        <div className="text-[15px] font-semibold tabular-nums num-ltr mt-0.5"><AnimatedNumber value={r.profitPerUnit} prefix={currency.symbol} decimals={2} currency={currency} /></div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.totalProfit")}</div>
                        <div className="text-[15px] font-semibold tabular-nums num-ltr mt-0.5"><AnimatedNumber value={r.profit} prefix={currency.symbol} decimals={0} currency={currency} /></div>
                      </div>
                      <div>
                        <div className="text-[10.5px] uppercase tracking-wider text-teal-100/80 font-medium">{t("summary.margin")}</div>
                        <div className="text-[15px] font-semibold tabular-nums num-ltr mt-0.5"><AnimatedNumber value={r.realizedMargin} decimals={1} />%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      {t("summary.costBreakdown")}
                    </div>
                    {topCostCategory && (
                      <span className="text-[10.5px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full font-medium">
                        {catLabel(topCostCategory.name)} {topCostCategory.pct.toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <CostGroup
                    label={t("summary.groupDirect")}
                    currency={currency}
                    items={[
                      { name: catLabel("Materials"), value: materialTotal, key: "Materials" },
                      { name: catLabel("Labor"), value: laborTotal, key: "Labor" },
                      { name: catLabel("Packaging"), value: packagingTotal, key: "Packaging" },
                    ]}
                    highlightKey={topCostCategory?.name}
                    total={r.total}
                  />
                  <CostGroup
                    label={t("summary.groupIndirect")}
                    currency={currency}
                    items={[
                      { name: catLabel("Electricity"), value: electricityTotal, key: "Electricity" },
                      { name: catLabel("Rent"), value: rentTotal, key: "Rent" },
                    ]}
                    highlightKey={topCostCategory?.name}
                    total={r.total}
                  />
                  {machinesEnabled && (
                    <CostGroup
                      label={t("summary.groupOptional")}
                      currency={currency}
                      items={[{ name: catLabel("Machines"), value: machineTotal, key: "Machines" }]}
                      highlightKey={topCostCategory?.name}
                      total={r.total}
                    />
                  )}
                  <div className="pt-3 mt-2 border-t border-slate-100">
                    <ResultRow label={t("summary.totalCost")} value={r.total} prefix={currency.symbol} decimals={2} currency={currency} />
                  </div>
                </div>

                {/* Insights */}
                {insights.length > 0 && (
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100">
                    <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-2">
                      {t("summary.insights")}
                    </div>
                    <div className="space-y-2">
                      {insights.map((ins, i) => {
                        const dot = ins.tone === "red" ? "bg-red-400" : ins.tone === "amber" ? "bg-amber-400" : ins.tone === "green" ? "bg-emerald-400" : "bg-slate-300";
                        return (
                          <div key={i} className="flex items-start gap-2.5 text-[12.5px] text-slate-700 leading-snug">
                            <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
                            <span>{resolveInsightText(ins, t)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 8 actions */}
                <div className="space-y-3 pt-1">
                  {/* Primary — send to Quick Cost */}
                  {onSendToQuickCost && (
                    <button
                      onClick={() => {
                        // Pass only values the user actually entered.
                        // Reset rent to blank defaults if monthlyRent was never entered
                        // (prevents Batch defaults for warehouse/office % leaking into QC).
                        // Deep-clone each row array so there are no shared object references.
                        const cleanRent = rent.monthlyRent
                          ? { ...rent }
                          : { monthlyRent: "", factoryPct: "50", warehousePct: "30", officePct: "20", daysUsed: "", daysInMonth: "30", includeWarehouse: false };
                        onSendToQuickCost({
                          form: { ...form, snapshotName: undefined },
                          materials: materials.map((r) => ({ ...r })),
                          labor: labor.map((r) => ({ ...r })),
                          packaging: packaging.map((r) => ({ ...r })),
                          electricity: { ...electricity },
                          rent: cleanRent,
                          otherRows: [],
                          machinesEnabled,
                          machineMethod,
                          timeMachines: timeMachines.map((r) => ({ ...r })),
                          unitMachines: unitMachines.map((r) => ({ ...r })),
                        });
                      }}
                      className="w-full h-12 rounded-xl text-white text-[14px] font-semibold shadow-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)` }}
                    >
                      {t("batchwiz.openInQuickCost")}
                      <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="shrink-0"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  )}

                  {/* Secondary — save costing permanently */}
                  <button
                    onClick={saveBatchCosting}
                    className="w-full h-11 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-700 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-800 transition flex items-center justify-center gap-2"
                  >
                    {batchSaved === "saved" ? (
                      <><Check size={14} className="text-emerald-600" strokeWidth={2.5} />{t("tpl.savedJustNow")}</>
                    ) : (
                      <><Save size={14} strokeWidth={2.2} className="text-slate-400" />{t("batchwiz.save")}</>
                    )}
                  </button>

                  {/* Tertiary — print */}
                  <button
                    onClick={() => window.print()}
                    className="w-full h-11 rounded-xl border border-slate-200 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 transition flex items-center justify-center gap-2"
                  >
                    <svg width="15" height="15" fill="none" viewBox="0 0 16 16" className="shrink-0 text-slate-400"><path d="M4 6V2h8v4M4 12H2V7h12v5h-2M4 10h8v4H4v-4z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    {t("batchwiz.print")}
                  </button>

                  {/* Tertiary — start fresh (guarded with confirmation) */}
                  {confirmClear ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center space-y-2">
                      <p className="text-[12.5px] text-amber-800 font-medium leading-snug">
                        {t("batchwiz.confirmClear")}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setConfirmClear(false)}
                          className="flex-1 py-2 rounded-lg border border-amber-200 text-[12px] font-medium text-amber-700 hover:bg-amber-100 transition"
                        >
                          {t("batchwiz.confirmClearNo")}
                        </button>
                        <button
                          onClick={() => {
                            setConfirmClear(false);
                            lsSet(BATCH_SAVE_KEY, null);
                            setStep(0);
                            setForm({ name: "", units: "", snapshotName: "", pricingMode: "margin", margin: "30", markup: "40", targetProfit: "" });
                            setMaterials([newMaterial()]);
                            setLabor([newLabor()]);
                            setPackaging([newPackaging()]);
                            setElectricity({ unitsUsed: "", billUnits: "", billAmount: "" });
                            setRent({ monthlyRent: "", factoryPct: "50", warehousePct: "30", officePct: "20", daysUsed: "", daysInMonth: "30", includeWarehouse: false });
                            setMachinesEnabled(false);
                            setMachineMethod("time");
                            setTimeMachines([{ id: id(), name: "", cost: "", life: "", daysUsed: "", daysInYear: "365" }]);
                            setUnitMachines([{ id: id(), name: "", cost: "", capacity: "", batchUnits: "" }]);
                          }}
                          className="flex-1 py-2 rounded-lg bg-amber-600 text-white text-[12px] font-semibold hover:bg-amber-700 transition"
                        >
                          {t("batchwiz.confirmClearYes")}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmClear(true)}
                      className="w-full py-2 text-[12.5px] text-slate-400 hover:text-slate-600 transition text-center"
                    >
                      {t("batchwiz.startOver")}
                    </button>
                  )}
                </div>
              </div>
            )}
            </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Desktop nav buttons — inline at bottom of card */}
        {!isFinal && (
          <div className="hidden md:flex items-center justify-between mt-8 pt-5 border-t border-slate-100">
            <button onClick={goBack} disabled={step === 0} className="flex items-center gap-1.5 text-[13.5px] font-medium text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed transition">
              <ArrowLeft size={15} /> {t("batch.back")}
            </button>
            <button onClick={goNext} className="flex items-center gap-2 text-white text-[13.5px] font-medium px-5 py-2.5 rounded-xl transition hover:-translate-y-0.5" style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}>
              {t("batch.continue")} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Mobile sticky nav — always at bottom on small screens */}
      {!isFinal && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 print:hidden">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition active:bg-slate-50"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={goNext}
              className="flex-1 flex items-center justify-center gap-2 text-white text-[14.5px] font-medium py-3 rounded-xl transition active:scale-[0.98]"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accentDark})` }}
            >
              {t("batch.continue")} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MONTHLY
// ─────────────────────────────────────────────────────────────
function Monthly({ currency }) {
  const t = useT();
  const [d, setD] = useState({ sales: "", expenses: "", units: "" });
  const set = (k) => (v) => setD((s) => ({ ...s, [k]: v }));
  const n = (v) => parseFloat(v) || 0;

  const r = useMemo(() => {
    const sales = n(d.sales);
    const expenses = n(d.expenses);
    const units = n(d.units);
    const profit = sales - expenses;
    const margin = sales > 0 ? (profit / sales) * 100 : 0;
    const avgCost = units > 0 ? expenses / units : 0;
    const avgPrice = units > 0 ? sales / units : 0;
    const breakEvenUnits = avgPrice > avgCost && avgPrice > 0 ? expenses / avgPrice : 0;
    return { profit, margin, avgCost, breakEvenUnits, profitable: profit >= 0 };
  }, [d]);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100">
        <h2 className="text-[20px] font-semibold text-slate-900 tracking-tight">{t("monthly.title")}</h2>
        <p className="text-[13.5px] text-slate-500 mt-1 mb-6">{t("monthly.subtitle")}</p>
        <div className="space-y-3">
          <Field label={t("monthly.totalSales")} value={d.sales} onChange={set("sales")} prefix={currency.symbol} placeholder="0" />
          <Field label={t("monthly.totalExpenses")} value={d.expenses} onChange={set("expenses")} prefix={currency.symbol} placeholder="0" />
          <Field label={t("monthly.unitsProduced")} value={d.units} onChange={set("units")} placeholder="0" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="rounded-3xl p-6 text-white relative overflow-hidden" style={{ background: r.profitable ? `linear-gradient(135deg, ${accent} 0%, ${accentDark} 100%)` : "linear-gradient(135deg, #475569 0%, #334155 100%)" }}>
          <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="text-[12.5px] text-teal-100 font-medium">{r.profitable ? t("monthly.netProfit") : t("monthly.netLoss")}</div>
            <div className="mt-2 text-[40px] sm:text-[44px] font-semibold tracking-tight tabular-nums num-ltr leading-none">
              <AnimatedNumber value={Math.abs(r.profit)} prefix={currency.symbol} decimals={0} currency={currency} />
            </div>
            <div className="text-[12.5px] text-teal-100 mt-2">
              <AnimatedNumber value={r.margin} decimals={1} />% {t("monthly.marginSuffix")}
            </div>
          </div>
        </div>
        <div className="rounded-2xl p-5 sm:p-6 border border-slate-100/60">
          <ResultRow label={t("monthly.avgCost")} value={r.avgCost} prefix={currency.symbol} decimals={2} currency={currency} />
          <ResultRow label={t("monthly.breakEven")} value={r.breakEvenUnits} decimals={0} />
        </div>
      </div>
    </motion.div>
  );
}


// ─────────────────────────────────────────────────────────────
// Landing
// ─────────────────────────────────────────────────────────────
function Hero({ onStart, onDemo }) {
  const t = useT();
  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} className="px-5 pt-12 sm:pt-20 pb-10 sm:pb-14 max-w-5xl mx-auto text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 text-teal-800 text-[12.5px] font-medium mb-6">
        <Factory size={13} strokeWidth={2.3} /> {t("landing.badge")}
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }} className="text-[36px] sm:text-[56px] font-semibold tracking-tight text-slate-900 leading-[1.05]">
        {t("landing.heroTitleA")}<br />
        <span className="text-teal-700">{t("landing.heroTitleB")}</span>
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }} className="text-[16px] sm:text-[18px] text-slate-500 mt-5 max-w-xl mx-auto leading-relaxed">
        {t("landing.heroSubtitle")}
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
        <button onClick={onStart} className="w-full sm:w-auto bg-teal-700 hover:bg-teal-800 text-white text-[15px] font-medium px-7 py-3.5 rounded-2xl transition hover:-translate-y-0.5 flex items-center justify-center gap-2">
          {t("landing.cta")} <ArrowRight size={16} />
        </button>
        <button onClick={onDemo} className="w-full sm:w-auto bg-white text-slate-800 text-[15px] font-medium px-7 py-3.5 rounded-2xl border border-slate-200 hover:border-slate-300 transition">
          {t("header.tryDemo")}
        </button>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="mt-14 sm:mt-20 flex items-center justify-center gap-3 sm:gap-5">
        {[
          { label: t("landing.stepExpenses"), sub: t("landing.stepExpensesSub"), color: "bg-slate-50 text-slate-700 border-slate-200" },
          { label: t("landing.stepCalculate"), sub: t("landing.stepCalculateSub"), color: "bg-teal-50 text-teal-800 border-teal-100" },
          { label: t("landing.stepProfit"), sub: t("landing.stepProfitSub"), color: "bg-white text-slate-900 border-slate-200 shadow-md" },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            <div className={`px-4 sm:px-6 py-3 sm:py-4 rounded-2xl border ${s.color} text-center min-w-[88px] sm:min-w-[120px]`}>
              <div className="text-[13px] sm:text-[15px] font-semibold">{s.label}</div>
              <div className="text-[10.5px] sm:text-[11.5px] opacity-60 mt-0.5">{s.sub}</div>
            </div>
            {i < 2 && <ArrowRight size={16} className="text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
      </motion.div>
    </motion.section>
  );
}

// ─────────────────────────────────────────────────────────────
// App shell
// ─────────────────────────────────────────────────────────────
// ─── Persistence helpers ───────────────────────────────────────
function lsGet(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v !== null ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function lsSet(key, value) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function CostixCalculator() {
  const [view, setView] = useState("app");
  // Lazy-init from localStorage so refresh never wipes state
  const [tab, setTab] = useState(() => lsGet("costix:tab", "quick"));
  const [currency, setCurrency] = useState(() => lsGet("costix:currency", DEFAULT_CURRENCY));
  const [lang, setLang] = useState(() => lsGet("costix:lang", "en"));

  // Force-remount keys — increment to reload from autosave
  const [quickCostKey, setQuickCostKey] = useState(0);
  const [batchKey, setBatchKey] = useState(0);

  // Currency guard — shows warning before switching when user has entered data.
  // pendingCurrency holds the candidate until user confirms or cancels.
  const [pendingCurrency, setPendingCurrency] = useState(null);

  function hasUserData() {
    try {
      const qc = lsGet("costix:quick:autosave", null);
      if (qc) {
        if (qc.form?.units || qc.form?.name) return true;
        if (qc.materials?.some((r) => r.cost || r.qty)) return true;
        if (qc.labor?.some((r) => r.cost || r.hours)) return true;
        if (qc.packaging?.some((r) => r.cost)) return true;
        if (qc.electricity?.billAmount) return true;
        if (qc.rent?.monthlyRent) return true;
        if (qc.otherRows?.some((r) => r.amount)) return true;
      }
      const batch = lsGet("costix:batch:autosave", null);
      if (batch?.items?.length > 0) return true;
    } catch {}
    return false;
  }

  function handleCurrencyRequest(newCurrency) {
    if (newCurrency.code === currency.code) return;
    if (hasUserData()) {
      setPendingCurrency(newCurrency);
    } else {
      setCurrency(newCurrency);
    }
  }

  // Open a saved costing from the Saved Costings view.
  // Writes the snapshot to autosave and force-remounts the target calculator.
  // intent "edit"   → open as-is (same record if user resaves)
  // intent "prefill" → duplicate with new row IDs (creates a new record on save)
  const handleOpenSavedCosting = React.useCallback((costing, intent) => {
    const storageMode = costing.calcMode === "batch" ? "batch" : "quick";

    // For duplicate: regenerate all row IDs so rows are independent copies
    const prepared = intent === "prefill" ? (() => {
      const reId = (r) => ({ ...r, id: id() });
      return {
        ...costing,
        id: undefined,  // new record on next save
        name: costing.name || "Untitled",
        materials: (costing.materials || []).map(reId),
        labor: (costing.labor || []).map(reId),
        packaging: (costing.packaging || []).map(reId),
        otherRows: (costing.otherRows || []).map(reId),
        timeMachines: (costing.timeMachines || []).map(reId),
        unitMachines: (costing.unitMachines || []).map(reId),
      };
    })() : costing;

    if (storageMode === "batch") {
      // Batch: restore full wizard state. Use step 7 (summary) for "edit",
      // step 0 (start) for duplicate so user reviews each step with new data.
      lsSet("costix:batch:autosave", { ...prepared, step: intent === "edit" ? 7 : 0 });
      setBatchKey((k) => k + 1);
      setTab("batch");
    } else {
      lsSet("costix:quick:autosave", { ...prepared, mode: prepared.mode || "advanced" });
      setQuickCostKey((k) => k + 1);
      setTab("quick");
    }
  }, []);

  // Called by Batch "Open in Quick Cost" — saves wizard data to autosave
  // then remounts QuickCost (which reads autosave on mount) and switches tab.
  const handleBatchSend = React.useCallback((batchData) => {
    lsSet("costix:quick:autosave", { ...batchData, mode: "advanced" });
    setQuickCostKey((k) => k + 1);
    setTab("quick");
  }, []);

  // Persist shell preferences — don't save "saved" tab as startup default
  // (users should always land on Quick Cost or Batch on refresh)
  useEffect(() => { if (tab !== "saved") lsSet("costix:tab", tab); }, [tab]);
  useEffect(() => { lsSet("costix:currency", currency); }, [currency]);
  useEffect(() => { lsSet("costix:lang", lang); }, [lang]);

  const langMeta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isRTL = !!langMeta.rtl;
  const t = useMemo(() => makeTranslator(lang), [lang]);

  // Load Cairo font when Arabic is active — needed for clean Arabic rendering.
  // Cairo is a high-quality Arabic/Latin dual-script font suitable for manufacturing UX.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const linkId = "costix-arabic-font";
    if (lang === "ar") {
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
      }
    }
  }, [lang]);

  // Sync browser title + favicon with the brand so the tab reads "Costix"
  // and the favicon shows our ascending-layers mark in deep teal.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = `Costix — ${t("app.tagline")}`;
    // Inline SVG favicon — three ascending bars in deep teal on white
    const svg = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#0F766E"/><rect x="5" y="5" width="19.5" height="4.5" rx="2.25" fill="white"/><rect x="5" y="11.5" width="7.5" height="4.5" rx="2.25" fill="white" fill-opacity="0.55"/><rect x="5" y="18" width="7.5" height="4.5" rx="2.25" fill="white" fill-opacity="0.75"/><rect x="5" y="23.5" width="19.5" height="4.5" rx="2.25" fill="white"/></svg>`
    );
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${svg}`;
  }, [t]);

  return (
    <LangContext.Provider value={t}>
      <div dir={isRTL ? "rtl" : "ltr"} className={`min-h-screen bg-white font-sans ${isRTL ? "text-right" : "text-left"} antialiased`}>
        <style>{`
          [dir="rtl"] input,
          [dir="rtl"] textarea,
          [dir="rtl"] select {
            text-align: right;
            unicode-bidi: plaintext;
          }
          /* In RTL, flex rows reverse naturally. Ensure currency symbols stay
             visually attached to their numbers without wrapping oddly. */
          [dir="rtl"] .tabular-nums {
            direction: ltr;
            unicode-bidi: plaintext;
          }
          /* Sticky action bars in RTL: ensure correct edge alignment */
          [dir="rtl"] .sticky { right: 0; left: auto; }
          /* Animated number spans — always LTR for digit readability */
          [dir="rtl"] span.tabular-nums,
          [dir="rtl"] .currency-value { direction: ltr; unicode-bidi: plaintext; }
        `}</style>
        {/* Currency switch warning — shown when user has entered data and tries to switch */}
        {pendingCurrency && (
          <CurrencyWarningModal
            from={currency}
            to={pendingCurrency}
            onConfirm={() => { setCurrency(pendingCurrency); setPendingCurrency(null); }}
            onCancel={() => setPendingCurrency(null)}
          />
        )}

        <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/75 border-b border-slate-100/80 print:hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-5 py-3 flex items-center justify-between gap-3">
            <button onClick={() => { if (typeof window !== "undefined") window.location.href = "/"; }} className="flex items-center gap-2 shrink-0">
              {/* Costix logo mark — 4-bar horizontal C, animated on mount */}
              <motion.svg width="30" height="30" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                whileHover={{ scale: 1.06 }} transition={{ duration: 0.2 }}>
                <defs>
                  <linearGradient id="calcGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10847A" />
                    <stop offset="100%" stopColor="#0A5E57" />
                  </linearGradient>
                </defs>
                <rect width="36" height="36" rx="8.5" fill="url(#calcGrad)" />
                {/* Top arm */}
                <motion.rect x="5.5" y="5.5" height="5" rx="2.5" fill="white"
                  initial={{ width: 0 }} animate={{ width: 22 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0 }} />
                {/* Upper spine */}
                <motion.rect x="5.5" y="13" height="5" rx="2.5" fill="white" fillOpacity="0.55"
                  initial={{ width: 0 }} animate={{ width: 8.5 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.08 }} />
                {/* Lower spine */}
                <motion.rect x="5.5" y="20" height="5" rx="2.5" fill="white" fillOpacity="0.75"
                  initial={{ width: 0 }} animate={{ width: 8.5 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.16 }} />
                {/* Bottom arm */}
                <motion.rect x="5.5" y="26.5" height="5" rx="2.5" fill="white"
                  initial={{ width: 0 }} animate={{ width: 22 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.24 }} />
              </motion.svg>
              <motion.span className="font-bold text-[16px] text-slate-900" style={{ letterSpacing: '-0.04em' }}
                initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}>Costix</motion.span>
            </button>

            {/* Tabs — desktop only, centered */}
            <div className="hidden md:flex flex-1 justify-center min-w-0">
              {view === "app" && <TabBar tab={tab} setTab={setTab} />}
            </div>

            {/* Language + Currency — always visible on the right */}
            <div className="shrink-0 flex items-center gap-2">
              <LanguageSelector />
              <CurrencySelector value={currency} onChange={handleCurrencyRequest} />
            </div>
          </div>

          {/* Tabs — mobile only, full-width second row */}
          {view === "app" && (
            <div className="md:hidden border-t border-slate-100/80 py-2">
              <TabBar tab={tab} setTab={setTab} />
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {view === "landing" ? (
            <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4 }}>
              <Hero onStart={() => setView("app")} onDemo={() => { setView("app"); setTab("quick"); }} />
              <footer className="text-center pb-10 text-[12.5px] text-slate-400">
                {t("tab.quickCost")} · {t("tab.batch")}
              </footer>
            </motion.div>
          ) : (
            <motion.main key="app" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="max-w-6xl mx-auto px-3 sm:px-5 py-4 sm:py-10 pb-28 sm:pb-10">
              <AnimatePresence mode="wait">
                <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}>
                  {tab === "quick" && <QuickCost key={quickCostKey} currency={currency} />}
                  {tab === "batch" && <Batch key={batchKey} currency={currency} onSendToQuickCost={handleBatchSend} />}
                  {tab === "saved" && <SavedCostingsView onOpen={handleOpenSavedCosting} />}
                  {/* Monthly hidden until rebuilt — {tab === "monthly" && <Monthly currency={currency} />} */}
                </motion.div>
              </AnimatePresence>
              <footer className="text-center mt-14 pb-8 text-[12px] text-slate-400">
                Costix · {t("app.tagline")}
              </footer>
            </motion.main>
          )}
        </AnimatePresence>
      </div>
    </LangContext.Provider>
  );
}
