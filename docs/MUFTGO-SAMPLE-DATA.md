# MuftGo Billing — Janata Vasahat clothing sample data

Demo shop: **Style Hub Clothing (demo)** — Shop 12, Janata Vasahat, Parvati,
Pune 411009 · +91 98765 43210 · GSTIN 27ABCDE1234F1Z5 *(placeholder — replace
with the client's real details on the Shop Settings page before going live).*

## What you get

Pick **Clothing & textiles** at install (or Demo Data → change industry) and the
shop is seeded with:

- **7 categories, 49 products** (`api/utils/demoData.js` → `textileDemoData`)
- Pune street-market INR prices with **MRP + cost** (so margin reports work)
- Size runs + **HSN hints** in each description (garments: 6109/6110 knits,
  6203/6204/6205/6207 wovens, 5007 silk, 5208 cotton, 6115 hosiery, 6213/6214
  made-ups; GST typically 5% ≤ Rs.1000, 12% above — confirm with the CA)
- Units the shop actually sells in: `piece`, `set`, `pack`, `meter`
  (auto-created in the Units master; alteration charge is a non-stock service)

## Categories

| Category | Items | Covers |
|---|---|---|
| Men's Wear | 10 | Shirts, tees, jeans, trousers, kurta, vest/brief, lungi |
| Women's Ethnic | 9 | Cotton/silk/nauvari sarees, kurtis, palazzo, leggings, suit sets |
| Women's Daily Wear | 6 | Nighty, tops, petticoat, blouse cloth, jeggings, dupatta |
| Kids Wear | 9 | Boys/girls 2–14 yrs, ethnic sets, school uniform, baby suits |
| Festive & Wedding | 6 | Sherwani set, blazer, lehenga, gown, Banarasi, Indo-western |
| Winter & Essentials | 5 | Hoodies, jackets, track pants, shawls, thermals |
| Accessories & Services | 4 | Belt, socks, hankies, alteration charge |

## Photos

4 products carry real photos from the existing demo manifest
(T-shirt, lungi, cotton saree, silk saree); the rest get coloured name tiles
(design choice upstream: a wrong picture reads as fact, an absent one reads as
absent). To add photos later, drop `.webp` files in
`frontend/static/images/demo/` and extend `credits.json` + `attachImages()`.

## After install (client handover checklist)

1. Shop Settings → replace demo name/address/phone/GSTIN, upload shop logo.
2. Taxes → verify GST rates against the HSN hints (5%/12% split).
3. Barcodes → print and stick; `barcode_id` is blank on seed items.
4. Suppliers → replace demo supplier with real wholesalers (e.g. Raviwar Peth).
5. Opening stock → adjust `available_quantity` to the physical count.
6. Receipt → set 80mm/58mm vs A4 in Hardware Manager; see `MUFTGO-PRINTING.md`.
7. Users → change `admin/admin` password; create cashier login.
