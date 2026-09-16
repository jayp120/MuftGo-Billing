# MuftGo Billing — Janata Vasahat clothing sample data

Demo shop: **Style Hub Clothing (demo)** — Shop 12, Janata Vasahat, Parvati,
Pune 411009 · +91 98765 43210 · GSTIN 27ABCDE1234F1Z5 _(placeholder — replace
with the client's real details on the Shop Settings page before going live)._

## What you get

MuftGo Billing installs **clothing retail only** - the setup screen offers no
other trade, so a shop can never install the wrong catalogue. Pick sample data
at install (or Demo Data → reinstall) and the shop is seeded with:

- **9 categories, 42 products** (`api/utils/demoData.js` → `textileDemoData`)
- Shirts (5), jeans (4 + 2 women's), t-shirts (6 + 2 women's), track pants &
  joggers (4), kurtis & tops (4), kids wear (6), winter & festive (4),
  accessories & services (4) - every type in the sizes it really sells in
- Pune street-market INR prices with **MRP + cost** (so margin reports work)
- Size runs + **HSN hints** in each description (garments: 6109/6110/6111/6112
  knits, 6201/6203/6204/6205/6207 wovens, 5007 silk, 5208 cotton, 6115 hosiery,
  4203 belts, 6214 made-ups; GST typically 5% ≤ Rs.1000, 12% above → confirm
  with the CA)
- Units the shop actually sells in: `piece`, `set`, `pack`
  (auto-created in the Units master; alteration charge is a non-stock service)

## Categories

| Category               | Items | Covers                                                        |
| ---------------------- | ----- | ------------------------------------------------------------- |
| Men's Shirts           | 5     | Formal, striped, checked, linen, denim (S–XXL)                |
| Men's Jeans            | 4     | Slim, regular & baggy denim (waist 28–38)                     |
| Men's T-Shirts         | 6     | Round-neck, polo, graphic, dry-fit (S–XL)                     |
| Track Pants & Joggers  | 4     | Loop-knit, dry-fit, joggers, cargos                           |
| Women's Kurtis & Tops  | 4     | Floral/straight kurtis, tees, western tops (S–XXL)            |
| Women's Jeans & Sarees | 5     | Slim/mom-fit denim, leggings, cotton & silk sarees            |
| Kids Wear              | 6     | Tees, jeans, track pants, frocks, sets, baba suits (0–14 yrs) |
| Winter & Festive       | 4     | Hoodies, jackets, kurtas, shawls                              |
| Accessories & Services | 4     | Lungi, belts, socks, alteration charge                        |

## Photos

**All 42 products carry an image** - 4 real photographs (round-neck tee,
lungi, cotton saree, silk saree) plus 35 original MuftGo garment icons
(one per type-and-colour, generated offline - no licensing strings attached).
Mapping lives in `frontend/static/images/demo/credits.json` and is applied by
`attachImages()` in `api/utils/demoData.js`: an image exists and is used, or
the product keeps its coloured name tile. To swap a photo later, drop a
`.webp` in `frontend/static/images/demo/` and point that product's entry at it.

## After install (client handover checklist)

1. Shop Settings → replace demo name/address/phone/GSTIN, upload shop logo.
2. Taxes → verify GST rates against the HSN hints (5%/12% split).
3. Barcodes → every seeded product already has one (200001+, auto-assigned;
   blank on manual create also auto-numbers). Print tags from Items → label
   (barcode + QR) and stick; never reuse 200001+ numbers as PLU quick-codes.
4. Suppliers → replace demo supplier with real wholesalers (e.g. Raviwar Peth).
5. Opening stock → adjust `available_quantity` to the physical count.
6. Receipt → set 80mm/58mm vs A4 in Hardware Manager; see `MUFTGO-PRINTING.md`.
7. Users → change `admin/admin` password; create cashier login.
