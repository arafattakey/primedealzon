#!/usr/bin/env python3
"""Builds the sellable spreadsheet templates for business #4 (Etsy / Gumroad / Payhip).

    python3 side-income/tools/make-templates.py

Writes side-income/products/reseller-profit-tracker.xlsx. Formulas only, no macros, so it
works in Excel, Google Sheets and Numbers. Needs openpyxl (pip install openpyxl).
"""
from pathlib import Path

from openpyxl import Workbook
from openpyxl.formatting.rule import CellIsRule
from openpyxl.styles import Alignment, Font, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUT = Path(__file__).resolve().parent.parent / "products" / "reseller-profit-tracker.xlsx"
ROWS = 500  # data rows prepared with formulas

INK = "1F2A44"
ACCENT = "2F6B4F"
HEAD = PatternFill("solid", fgColor=INK)
INPUT = PatternFill("solid", fgColor="F4F1E8")
WHITE_BOLD = Font(bold=True, color="FFFFFF")
TITLE = Font(bold=True, size=16, color=INK)
MONEY = '"$"#,##0.00'


def header(ws, cols):
    for i, (name, width) in enumerate(cols, 1):
        c = ws.cell(row=1, column=i, value=name)
        c.fill, c.font = HEAD, WHITE_BOLD
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        ws.column_dimensions[get_column_letter(i)].width = width
    ws.row_dimensions[1].height = 32
    ws.freeze_panes = "B2"


def build():
    wb = Workbook()

    # --- How to use -------------------------------------------------------
    info = wb.active
    info.title = "Start here"
    info.column_dimensions["A"].width = 100
    lines = [
        ("Reseller Profit & Inventory Tracker", TITLE),
        ("", None),
        ("1. Inventory tab: add one row per item when you buy it. Fill the cream-coloured cells only.", None),
        ("2. When it sells, fill Sold date, Sold price, Platform fees and Ship out. Profit, ROI and Days to sell calculate themselves.", None),
        ("3. Dashboard tab: type a month (YYYY-MM) in B2 to see that month's sales, profit, ROI and unsold stock.", None),
        ("4. Settings tab: set your tax set-aside percentage and your own platform list.", None),
        ("", None),
        ("Tips", Font(bold=True, color=ACCENT)),
        ("• Record platform fees exactly as shown on your payout, so profit matches your bank.", None),
        ("• Items unsold after 60 days turn red: reprice or move them to another platform.", None),
        ("• Works in Excel, Google Sheets (File → Import) and Numbers. No macros.", None),
        ("", None),
        ("Estimates only, not tax advice. Keep your platform 1099 forms and receipts.", Font(italic=True, color="666666")),
    ]
    for r, (text, font) in enumerate(lines, 1):
        c = info.cell(row=r, column=1, value=text)
        if font:
            c.font = font

    # --- Settings ---------------------------------------------------------
    st = wb.create_sheet("Settings")
    st["A1"], st["B1"] = "Tax set-aside %", 0.25
    st["B1"].number_format = "0%"
    st["B1"].fill = INPUT
    st["A3"] = "Platforms (edit this list)"
    st["A3"].font = Font(bold=True)
    for i, p in enumerate(["eBay", "Mercari", "Facebook Marketplace", "Poshmark", "Etsy", "Local / cash", "Other"], 4):
        st.cell(row=i, column=1, value=p).fill = INPUT
    st.column_dimensions["A"].width = 28

    # --- Inventory --------------------------------------------------------
    inv = wb.create_sheet("Inventory")
    cols = [
        ("Item", 34), ("SKU / bin", 12), ("Source", 16), ("Buy date", 12), ("Buy cost", 11),
        ("Other costs\n(gas, repair)", 13), ("Platform", 18), ("List price", 11), ("Sold date", 12),
        ("Sold price", 11), ("Platform fees", 12), ("Ship out", 10), ("Profit", 11), ("ROI", 9),
        ("Days to sell\n/ in stock", 12), ("Month sold", 11),
    ]
    header(inv, cols)
    dv = DataValidation(type="list", formula1="=Settings!$A$4:$A$20", allow_blank=True)
    inv.add_data_validation(dv)
    for r in range(2, ROWS + 2):
        for col in "ABCDEFGHIJKL":
            inv[f"{col}{r}"].fill = INPUT
        for col in "EFHJKLM":
            inv[f"{col}{r}"].number_format = MONEY
        for col in "DI":
            inv[f"{col}{r}"].number_format = "yyyy-mm-dd"
        dv.add(f"G{r}")
        inv[f"M{r}"] = f'=IF(J{r}="","",J{r}-E{r}-F{r}-K{r}-L{r})'
        inv[f"N{r}"] = f'=IF(OR(M{r}="",E{r}+F{r}=0),"",M{r}/(E{r}+F{r}))'
        inv[f"N{r}"].number_format = "0%"
        inv[f"O{r}"] = f'=IF(D{r}="","",IF(I{r}="",TODAY()-D{r},I{r}-D{r}))'
        inv[f"P{r}"] = f'=IF(I{r}="","",TEXT(I{r},"yyyy-mm"))'
    # Example rows show the user how it works.
    examples = [
        ("DeWalt 20V drill, tool only", "A1", "FB Marketplace", "2026-11-02", 25, 3, "eBay", 95, "2026-11-09", 85, 11.66, 12.4),
        ("Le Creuset 2qt saucepan", "A2", "Goodwill", "2026-11-03", 12, 0, "Mercari", 70, "", "", "", ""),
    ]
    from datetime import date
    for r, row in enumerate(examples, 2):
        for c, v in enumerate(row, 1):
            if isinstance(v, str) and len(v) == 10 and v[4] == "-":
                v = date.fromisoformat(v)
            inv.cell(row=r, column=c, value=v if v != "" else None)
    red = PatternFill("solid", fgColor="F8D7DA")
    inv.conditional_formatting.add(f"O2:O{ROWS + 1}", CellIsRule(operator="greaterThan", formula=["60"], fill=red))
    inv.conditional_formatting.add(f"M2:M{ROWS + 1}", CellIsRule(operator="lessThan", formula=["0"], fill=red))

    # --- Dashboard --------------------------------------------------------
    db = wb.create_sheet("Dashboard", 1)
    db.column_dimensions["A"].width = 30
    db.column_dimensions["B"].width = 16
    db["A1"] = "Dashboard"
    db["A1"].font = TITLE
    db["A2"], db["B2"] = "Month (YYYY-MM)", "2026-11"
    db["B2"].fill = INPUT
    rng = lambda col: f"Inventory!${col}$2:${col}${ROWS + 1}"
    stats = [
        ("Items sold", f'=COUNTIF({rng("P")},B2)', "0"),
        ("Sales", f'=SUMIF({rng("P")},B2,{rng("J")})', MONEY),
        ("Profit", f'=SUMIF({rng("P")},B2,{rng("M")})', MONEY),
        ("Cost of items sold", f'=SUMIF({rng("P")},B2,{rng("E")})+SUMIF({rng("P")},B2,{rng("F")})', MONEY),
        ("ROI", '=IF(B7=0,"",B6/B7)', "0%"),
        ("Avg days to sell", f'=IFERROR(AVERAGEIF({rng("P")},B2,{rng("O")}),"")', "0"),
        ("Set aside for tax", "=MAX(0,B6*Settings!B1)", MONEY),
        ("", None, None),
        ("Unsold items (all time)", f'=COUNTIFS({rng("D")},"<>",{rng("I")},"")', "0"),
        ("Money tied up in unsold stock", f'=SUMIFS({rng("E")},{rng("D")},"<>",{rng("I")},"")', MONEY),
        ("Unsold > 60 days", f'=COUNTIFS({rng("I")},"",{rng("O")},">60")', "0"),
    ]
    for r, (label, formula, fmt) in enumerate(stats, 4):
        db.cell(row=r, column=1, value=label).font = Font(bold=bool(label))
        if formula:
            c = db.cell(row=r, column=2, value=formula)
            c.number_format = fmt

    OUT.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT)
    print(f"wrote {OUT}")


if __name__ == "__main__":
    build()
