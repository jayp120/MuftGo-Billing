// Demo data for different business types

const iceCreamDemoData = {
  categories: [
    { name: 'Ice Cream Flavors', description: 'Various ice cream flavors' },
    { name: 'Toppings', description: 'Ice cream toppings and sauces' },
    { name: 'Cones & Cups', description: 'Serving containers' },
    { name: 'Sundaes', description: 'Special sundae combinations' },
  ],
  products: [
    // Ice Cream Flavors (6 products)
    {
      name: 'Vanilla Ice Cream',
      category: 'Ice Cream Flavors',
      price: 3.5,
      unit: 'scoop',
      stock: 100,
    },
    {
      name: 'Chocolate Ice Cream',
      category: 'Ice Cream Flavors',
      price: 3.5,
      unit: 'scoop',
      stock: 100,
    },
    {
      name: 'Strawberry Ice Cream',
      category: 'Ice Cream Flavors',
      price: 3.75,
      unit: 'scoop',
      stock: 100,
    },
    {
      name: 'Mango Ice Cream',
      category: 'Ice Cream Flavors',
      price: 4.0,
      unit: 'scoop',
      stock: 100,
    },
    {
      name: 'Mint Chocolate Chip',
      category: 'Ice Cream Flavors',
      price: 4.25,
      unit: 'scoop',
      stock: 100,
    },
    {
      name: 'Cookie Dough Ice Cream',
      category: 'Ice Cream Flavors',
      price: 4.5,
      unit: 'scoop',
      stock: 100,
    },

    // Toppings (4 products)
    { name: 'Chocolate Syrup', category: 'Toppings', price: 0.75, unit: 'serving', stock: 200 },
    { name: 'Caramel Sauce', category: 'Toppings', price: 0.75, unit: 'serving', stock: 200 },
    { name: 'Sprinkles', category: 'Toppings', price: 0.5, unit: 'serving', stock: 200 },
    { name: 'Whipped Cream', category: 'Toppings', price: 0.5, unit: 'serving', stock: 200 },

    // Cones & Cups (3 products)
    { name: 'Waffle Cone', category: 'Cones & Cups', price: 1.5, unit: 'piece', stock: 150 },
    { name: 'Sugar Cone', category: 'Cones & Cups', price: 1.0, unit: 'piece', stock: 150 },
    { name: 'Cup (Small)', category: 'Cones & Cups', price: 0.5, unit: 'piece', stock: 200 },

    // Sundaes (2 products)
    { name: 'Banana Split', category: 'Sundaes', price: 8.99, unit: 'serving', stock: 50 },
    { name: 'Hot Fudge Sundae', category: 'Sundaes', price: 6.99, unit: 'serving', stock: 50 },
  ],
};

const cafeDemoData = {
  categories: [
    { name: 'Hot Beverages', description: 'Coffee, tea, and hot drinks' },
    { name: 'Cold Beverages', description: 'Iced drinks and smoothies' },
    { name: 'Snacks', description: 'Quick bites and snacks' },
    { name: 'Groceries', description: 'Daily essentials' },
  ],
  products: [
    // Hot Beverages (5 products)
    { name: 'Espresso', category: 'Hot Beverages', price: 2.5, unit: 'cup', stock: 100 },
    { name: 'Cappuccino', category: 'Hot Beverages', price: 3.5, unit: 'cup', stock: 100 },
    { name: 'Latte', category: 'Hot Beverages', price: 3.75, unit: 'cup', stock: 100 },
    { name: 'Hot Chocolate', category: 'Hot Beverages', price: 3.25, unit: 'cup', stock: 100 },
    { name: 'Green Tea', category: 'Hot Beverages', price: 2.0, unit: 'cup', stock: 100 },

    // Cold Beverages (4 products)
    { name: 'Iced Coffee', category: 'Cold Beverages', price: 3.5, unit: 'cup', stock: 100 },
    { name: 'Iced Latte', category: 'Cold Beverages', price: 4.0, unit: 'cup', stock: 100 },
    { name: 'Mango Smoothie', category: 'Cold Beverages', price: 4.5, unit: 'cup', stock: 100 },
    {
      name: 'Fresh Orange Juice',
      category: 'Cold Beverages',
      price: 3.5,
      unit: 'glass',
      stock: 100,
    },

    // Snacks (3 products)
    { name: 'Croissant', category: 'Snacks', price: 2.5, unit: 'piece', stock: 50 },
    { name: 'Muffin', category: 'Snacks', price: 2.75, unit: 'piece', stock: 50 },
    { name: 'Sandwich', category: 'Snacks', price: 5.5, unit: 'piece', stock: 50 },

    // Groceries (3 products)
    { name: 'Milk (1L)', category: 'Groceries', price: 2.0, unit: 'bottle', stock: 100 },
    { name: 'Bread Loaf', category: 'Groceries', price: 2.5, unit: 'loaf', stock: 80 },
    { name: 'Eggs (12 pack)', category: 'Groceries', price: 3.5, unit: 'pack', stock: 60 },
  ],
};

const bakeryDemoData = {
  categories: [
    { name: 'Bread', description: 'Fresh baked bread' },
    { name: 'Pastries', description: 'Sweet and savory pastries' },
    { name: 'Cakes', description: 'Cakes and celebration items' },
    { name: 'Cookies', description: 'Cookies and biscuits' },
  ],
  products: [
    // Bread (4 products)
    { name: 'White Bread', category: 'Bread', price: 2.5, unit: 'loaf', stock: 100 },
    { name: 'Whole Wheat Bread', category: 'Bread', price: 3.0, unit: 'loaf', stock: 100 },
    { name: 'Baguette', category: 'Bread', price: 2.75, unit: 'piece', stock: 80 },
    { name: 'Sourdough', category: 'Bread', price: 4.5, unit: 'loaf', stock: 60 },

    // Pastries (5 products)
    { name: 'Croissant', category: 'Pastries', price: 2.5, unit: 'piece', stock: 100 },
    { name: 'Danish Pastry', category: 'Pastries', price: 3.0, unit: 'piece', stock: 80 },
    { name: 'Cinnamon Roll', category: 'Pastries', price: 3.25, unit: 'piece', stock: 80 },
    { name: 'Apple Turnover', category: 'Pastries', price: 2.75, unit: 'piece', stock: 80 },
    { name: 'Donut', category: 'Pastries', price: 1.5, unit: 'piece', stock: 120 },

    // Cakes (3 products)
    { name: 'Chocolate Cake Slice', category: 'Cakes', price: 4.5, unit: 'slice', stock: 40 },
    { name: 'Cheesecake Slice', category: 'Cakes', price: 5.0, unit: 'slice', stock: 40 },
    { name: 'Birthday Cake (8")', category: 'Cakes', price: 25.0, unit: 'cake', stock: 10 },

    // Cookies (3 products)
    { name: 'Chocolate Chip Cookies', category: 'Cookies', price: 1.5, unit: 'piece', stock: 150 },
    { name: 'Oatmeal Cookies', category: 'Cookies', price: 1.5, unit: 'piece', stock: 150 },
    { name: 'Sugar Cookies', category: 'Cookies', price: 1.25, unit: 'piece', stock: 150 },
  ],
};

const supermarketDemoData = {
  categories: [
    { name: 'Groceries & Staples', description: 'Rice, flour, dal, oil and daily staples' },
    { name: 'Snacks & Biscuits', description: 'Packaged snacks, biscuits and namkeen' },
    { name: 'Beverages', description: 'Tea, coffee, soft drinks and juices' },
    { name: 'Dairy & Bread', description: 'Milk, curd, butter, paneer and bakery' },
    { name: 'Personal Care', description: 'Soap, shampoo, toothpaste and hygiene' },
    { name: 'Household & Cleaning', description: 'Detergents, cleaners and home needs' },
  ],
  products: [
    // Groceries & Staples
    {
      name: 'Rice (Sona Masoori) 5kg',
      category: 'Groceries & Staples',
      price: 380,
      unit: 'bag',
      stock: 40,
    },
    { name: 'Wheat Atta 5kg', category: 'Groceries & Staples', price: 260, unit: 'bag', stock: 40 },
    { name: 'Toor Dal 1kg', category: 'Groceries & Staples', price: 165, unit: 'kg', stock: 50 },
    { name: 'Sugar 1kg', category: 'Groceries & Staples', price: 46, unit: 'kg', stock: 80 },
    {
      name: 'Iodised Salt 1kg',
      category: 'Groceries & Staples',
      price: 24,
      unit: 'kg',
      stock: 100,
    },
    {
      name: 'Sunflower Oil 1L',
      category: 'Groceries & Staples',
      price: 145,
      unit: 'bottle',
      stock: 60,
    },
    {
      name: 'Tea Powder 250g',
      category: 'Groceries & Staples',
      price: 140,
      unit: 'pack',
      stock: 50,
    },
    // Snacks & Biscuits
    {
      name: 'Glucose Biscuits',
      category: 'Snacks & Biscuits',
      price: 10,
      unit: 'pack',
      stock: 200,
    },
    { name: 'Cream Biscuits', category: 'Snacks & Biscuits', price: 30, unit: 'pack', stock: 120 },
    {
      name: 'Potato Chips 52g',
      category: 'Snacks & Biscuits',
      price: 20,
      unit: 'pack',
      stock: 150,
    },
    {
      name: 'Mixture Namkeen 200g',
      category: 'Snacks & Biscuits',
      price: 55,
      unit: 'pack',
      stock: 80,
    },
    // Beverages
    { name: 'Cola 750ml', category: 'Beverages', price: 40, unit: 'bottle', stock: 96 },
    { name: 'Mango Drink 600ml', category: 'Beverages', price: 35, unit: 'bottle', stock: 96 },
    { name: 'Packaged Water 1L', category: 'Beverages', price: 20, unit: 'bottle', stock: 120 },
    // Dairy & Bread
    { name: 'Milk 500ml', category: 'Dairy & Bread', price: 27, unit: 'packet', stock: 60 },
    { name: 'Curd 400g', category: 'Dairy & Bread', price: 35, unit: 'cup', stock: 40 },
    { name: 'Bread (Sandwich)', category: 'Dairy & Bread', price: 40, unit: 'loaf', stock: 30 },
    { name: 'Butter 100g', category: 'Dairy & Bread', price: 58, unit: 'pack', stock: 30 },
    // Personal Care
    { name: 'Bath Soap 100g', category: 'Personal Care', price: 35, unit: 'piece', stock: 100 },
    { name: 'Shampoo Sachet', category: 'Personal Care', price: 2, unit: 'sachet', stock: 400 },
    { name: 'Toothpaste 100g', category: 'Personal Care', price: 55, unit: 'tube', stock: 80 },
    // Household & Cleaning
    {
      name: 'Detergent Powder 1kg',
      category: 'Household & Cleaning',
      price: 110,
      unit: 'pack',
      stock: 50,
    },
    {
      name: 'Dishwash Bar',
      category: 'Household & Cleaning',
      price: 20,
      unit: 'piece',
      stock: 100,
    },
    {
      name: 'Floor Cleaner 500ml',
      category: 'Household & Cleaning',
      price: 95,
      unit: 'bottle',
      stock: 40,
    },
  ],
};

/*
 * MuftGo Billing clothing catalogue (white-label).
 *
 * A focused family-clothing set for a value-for-money garment shop in Pune
 * (Janata Vasahat, Parvati, 411009) - shirts, jeans, t-shirts, track pants,
 * kurtis, kids wear and winter/festive, in the sizes each type really sells
 * in. Pune street-market price points (INR) with MRP + cost so margin reports
 * work, and an HSN hint per item so the GST rate the shop configures can be
 * checked. Garments: HSN 6109/6110/6111/6112 (knits), 6201/6203/6204/6205/6207
 * (wovens), 5007/5208 (silk/cotton), 6115 (hosiery), 4203 (belts), 6214
 * (made-ups); GST is typically 5% up to Rs.1000 and 12% above - the installer
 * applies the shop's own tax master, these hints just make verification
 * possible. Units the shop actually sells in: piece, set, pack.
 *
 * Pictures: every product maps to an image through credits.json
 * (frontend/static/images/demo/) - four real photographs plus original
 * MuftGo garment icons - so the sale grid and demo day are fully visual.
 */
const textileDemoData = {
  categories: [
    { name: "Men's Shirts", description: 'Formal, casual, linen & denim shirts (S to XXL)' },
    { name: "Men's Jeans", description: 'Slim, regular & baggy denim (waist 28 to 38)' },
    { name: "Men's T-Shirts", description: 'Round-neck, polo, graphic & dry-fit tees (S to XL)' },
    { name: 'Track Pants & Joggers', description: 'Loop-knit, dry-fit, joggers & cargos' },
    { name: "Women's Kurtis & Tops", description: 'Kurtis, tees & western tops (S to XXL)' },
    { name: "Women's Jeans & Sarees", description: 'Denim, leggings & sarees' },
    { name: 'Kids Wear', description: 'Tees, jeans, frocks & sets (0 to 14 years)' },
    { name: 'Winter & Festive', description: 'Hoodies, jackets, kurtas & shawls' },
    { name: 'Accessories & Services', description: 'Lungi, belts, socks & alteration' },
  ],
  products: [
    // ── Men's Shirts (5) ──
    {
      name: 'Men Formal Shirt - White (S-XXL)',
      category: "Men's Shirts",
      price: 649,
      mrp: 799,
      cost_price: 420,
      unit: 'piece',
      stock: 48,
      description: 'Sizes S-XXL. HSN 6205. Office white cotton shirt.',
    },
    {
      name: 'Men Formal Shirt - Sky Stripes (M-XXL)',
      category: "Men's Shirts",
      price: 699,
      mrp: 849,
      cost_price: 450,
      unit: 'piece',
      stock: 44,
      description: 'Sizes M-XXL. HSN 6205. Striped office shirt.',
    },
    {
      name: 'Men Checked Casual Shirt - Maroon (M-XXL)',
      category: "Men's Shirts",
      price: 599,
      mrp: 749,
      cost_price: 380,
      unit: 'piece',
      stock: 42,
      description: 'Sizes M-XXL. HSN 6205. Weekend checked shirt.',
    },
    {
      name: 'Men Linen Shirt - Beige (M-XL)',
      category: "Men's Shirts",
      price: 899,
      mrp: 1149,
      cost_price: 580,
      unit: 'piece',
      stock: 26,
      description: 'Sizes M-XL. HSN 6205. Breathable linen casual.',
    },
    {
      name: 'Men Denim Shirt - Indigo (M-XL)',
      category: "Men's Shirts",
      price: 999,
      mrp: 1299,
      cost_price: 640,
      unit: 'piece',
      stock: 24,
      description: 'Sizes M-XL. HSN 6205. Dark indigo denim shirt.',
    },
    // ── Men's Jeans (4) ──
    {
      name: 'Men Slim Jeans - Dark Blue (28-36)',
      category: "Men's Jeans",
      price: 999,
      mrp: 1299,
      cost_price: 640,
      unit: 'piece',
      stock: 36,
      description: 'Waist 28-36. HSN 6203. Stretch slim denim.',
    },
    {
      name: 'Men Slim Jeans - Black (28-34)',
      category: "Men's Jeans",
      price: 1049,
      mrp: 1349,
      cost_price: 670,
      unit: 'piece',
      stock: 30,
      description: 'Waist 28-34. HSN 6203. Black stretch denim.',
    },
    {
      name: 'Men Regular Jeans - Light Blue (30-38)',
      category: "Men's Jeans",
      price: 949,
      mrp: 1199,
      cost_price: 600,
      unit: 'piece',
      stock: 32,
      description: 'Waist 30-38. HSN 6203. Comfort regular fit.',
    },
    {
      name: 'Men Baggy Jeans - Grey (28-34)',
      category: "Men's Jeans",
      price: 1099,
      mrp: 1399,
      cost_price: 700,
      unit: 'piece',
      stock: 22,
      description: 'Waist 28-34. HSN 6203. Loose street-fit denim.',
    },
    // ── Men's T-Shirts (6) ──
    {
      name: 'Men Round-Neck T-Shirt - Black (S-XL)',
      category: "Men's T-Shirts",
      price: 299,
      mrp: 399,
      cost_price: 170,
      unit: 'piece',
      stock: 80,
      description: 'Sizes S-XL. HSN 6109. 180 GSM cotton tee.',
    },
    {
      name: 'Men Round-Neck T-Shirt - White (S-XL)',
      category: "Men's T-Shirts",
      price: 299,
      mrp: 399,
      cost_price: 170,
      unit: 'piece',
      stock: 72,
      description: 'Sizes S-XL. HSN 6109. Plain white cotton tee.',
    },
    {
      name: 'Men Polo T-Shirt - Navy (M-XL)',
      category: "Men's T-Shirts",
      price: 449,
      mrp: 599,
      cost_price: 260,
      unit: 'piece',
      stock: 54,
      description: 'Sizes M-XL. HSN 6109. Pique knit collar tee.',
    },
    {
      name: 'Men Polo T-Shirt - Olive (M-XL)',
      category: "Men's T-Shirts",
      price: 449,
      mrp: 599,
      cost_price: 260,
      unit: 'piece',
      stock: 48,
      description: 'Sizes M-XL. HSN 6109. Olive pique polo.',
    },
    {
      name: 'Men Graphic T-Shirt - Grey (M-XL)',
      category: "Men's T-Shirts",
      price: 499,
      mrp: 649,
      cost_price: 300,
      unit: 'piece',
      stock: 46,
      description: 'Sizes M-XL. HSN 6109. Oversized printed tee.',
    },
    {
      name: 'Men Dry-Fit Sports T-Shirt - Red (S-XL)',
      category: "Men's T-Shirts",
      price: 399,
      mrp: 549,
      cost_price: 240,
      unit: 'piece',
      stock: 58,
      description: 'Sizes S-XL. HSN 6109. Gym & cricket dry-fit.',
    },
    // ── Track Pants & Joggers (4) ──
    {
      name: 'Men Track Pants - Black (M-XL)',
      category: 'Track Pants & Joggers',
      price: 549,
      mrp: 749,
      cost_price: 330,
      unit: 'piece',
      stock: 44,
      description: 'Sizes M-XL. HSN 6112. Loop-knit lower.',
    },
    {
      name: 'Men Dry-Fit Track Pants - Navy (M-XL)',
      category: 'Track Pants & Joggers',
      price: 649,
      mrp: 849,
      cost_price: 390,
      unit: 'piece',
      stock: 36,
      description: 'Sizes M-XL. HSN 6112. Sports dry-fit lower.',
    },
    {
      name: 'Men Cotton Jogger - Grey (M-XL)',
      category: 'Track Pants & Joggers',
      price: 599,
      mrp: 799,
      cost_price: 360,
      unit: 'piece',
      stock: 38,
      description: 'Sizes M-XL. HSN 6112. Cuffed casual jogger.',
    },
    {
      name: 'Men Cargo Pants - Olive (30-36)',
      category: 'Track Pants & Joggers',
      price: 899,
      mrp: 1149,
      cost_price: 580,
      unit: 'piece',
      stock: 28,
      description: 'Waist 30-36. HSN 6203. Six-pocket cargo.',
    },
    // ── Women's Kurtis & Tops (4) ──
    {
      name: 'Women Floral Kurti (M-XXL)',
      category: "Women's Kurtis & Tops",
      price: 549,
      mrp: 799,
      cost_price: 330,
      unit: 'piece',
      stock: 50,
      description: 'Sizes M-XXL. HSN 6204. Rayon printed kurti.',
    },
    {
      name: 'Women Straight Kurti - Maroon (S-XL)',
      category: "Women's Kurtis & Tops",
      price: 699,
      mrp: 899,
      cost_price: 430,
      unit: 'piece',
      stock: 36,
      description: 'Sizes S-XL. HSN 6204. Solid office kurti.',
    },
    {
      name: 'Women Round-Neck T-Shirt - Pink (S-XL)',
      category: "Women's Kurtis & Tops",
      price: 329,
      mrp: 449,
      cost_price: 190,
      unit: 'piece',
      stock: 52,
      description: 'Sizes S-XL. HSN 6109. Cotton casual tee.',
    },
    {
      name: 'Women Western Top - Black (S-XL)',
      category: "Women's Kurtis & Tops",
      price: 449,
      mrp: 599,
      cost_price: 270,
      unit: 'piece',
      stock: 34,
      description: 'Sizes S-XL. HSN 6109. Casual western top.',
    },
    // ── Women's Jeans & Sarees (5) ──
    {
      name: 'Women Slim Jeans - Dark Blue (28-34)',
      category: "Women's Jeans & Sarees",
      price: 999,
      mrp: 1299,
      cost_price: 640,
      unit: 'piece',
      stock: 30,
      description: 'Waist 28-34. HSN 6203. Stretch slim denim.',
    },
    {
      name: 'Women Mom-Fit Jeans - Ice Blue (28-32)',
      category: "Women's Jeans & Sarees",
      price: 1099,
      mrp: 1399,
      cost_price: 700,
      unit: 'piece',
      stock: 24,
      description: 'Waist 28-32. HSN 6203. High-rise mom fit.',
    },
    {
      name: 'Women Churidar Legging - Black',
      category: "Women's Jeans & Sarees",
      price: 299,
      mrp: 399,
      cost_price: 170,
      unit: 'piece',
      stock: 58,
      description: 'Free size. HSN 6115. Cotton-lycra leggings.',
    },
    {
      name: 'Women Cotton Saree - Daily Wear',
      category: "Women's Jeans & Sarees",
      price: 799,
      mrp: 1099,
      cost_price: 520,
      unit: 'piece',
      stock: 32,
      description: '6.3m with blouse piece. HSN 5208. Mulmul cotton.',
    },
    {
      name: 'Women Silk Saree - Party Wear',
      category: "Women's Jeans & Sarees",
      price: 2499,
      mrp: 3299,
      cost_price: 1650,
      unit: 'piece',
      stock: 14,
      description: 'With blouse. HSN 5007. Wedding-season silk blend.',
    },
    // ── Kids Wear (6) ──
    {
      name: 'Boys Round-Neck T-Shirt (4-12 yrs)',
      category: 'Kids Wear',
      price: 199,
      mrp: 299,
      cost_price: 115,
      unit: 'piece',
      stock: 64,
      description: 'Ages 4-12. HSN 6109. Cartoon/plain tees.',
    },
    {
      name: 'Boys Denim Jeans (4-14 yrs)',
      category: 'Kids Wear',
      price: 499,
      mrp: 699,
      cost_price: 310,
      unit: 'piece',
      stock: 40,
      description: 'Ages 4-14. HSN 6203. Kids denim pant.',
    },
    {
      name: 'Boys Track Pants (6-14 yrs)',
      category: 'Kids Wear',
      price: 349,
      mrp: 499,
      cost_price: 210,
      unit: 'piece',
      stock: 42,
      description: 'Ages 6-14. HSN 6112. School & play lower.',
    },
    {
      name: 'Girls Party Frock (4-12 yrs)',
      category: 'Kids Wear',
      price: 549,
      mrp: 749,
      cost_price: 330,
      unit: 'piece',
      stock: 32,
      description: 'Ages 4-12. HSN 6204. Party & daily frocks.',
    },
    {
      name: 'Girls Top-Capri Set (4-12 yrs)',
      category: 'Kids Wear',
      price: 549,
      mrp: 749,
      cost_price: 330,
      unit: 'set',
      stock: 30,
      description: 'Ages 4-12. HSN 6109. Two-piece girls set.',
    },
    {
      name: 'Baby Baba Suit (0-2 yrs)',
      category: 'Kids Wear',
      price: 349,
      mrp: 449,
      cost_price: 210,
      unit: 'set',
      stock: 28,
      description: '0-24 months. HSN 6111. Soft hosiery baba suit.',
    },
    // ── Winter & Festive (4) ──
    {
      name: 'Men Hoodie - Charcoal (M-XL)',
      category: 'Winter & Festive',
      price: 799,
      mrp: 1099,
      cost_price: 490,
      unit: 'piece',
      stock: 30,
      description: 'Sizes M-XL. HSN 6110. Fleece winter hoodie.',
    },
    {
      name: 'Men Winter Jacket - Navy (M-XL)',
      category: 'Winter & Festive',
      price: 1499,
      mrp: 1999,
      cost_price: 950,
      unit: 'piece',
      stock: 16,
      description: 'Sizes M-XL. HSN 6201. Padded winter jacket.',
    },
    {
      name: 'Men Festive Kurta - Cream (M-XXL)',
      category: 'Winter & Festive',
      price: 749,
      mrp: 999,
      cost_price: 470,
      unit: 'piece',
      stock: 28,
      description: 'Sizes M-XXL. HSN 6207. Diwali/Eid kurta.',
    },
    {
      name: 'Women Wool Shawl - Red',
      category: 'Winter & Festive',
      price: 349,
      mrp: 499,
      cost_price: 210,
      unit: 'piece',
      stock: 34,
      description: '2m. HSN 6214. Wool-blend shawl.',
    },
    // ── Accessories & Services (4) ──
    {
      name: 'Men Cotton Lungi 2m',
      category: 'Accessories & Services',
      price: 250,
      mrp: 329,
      cost_price: 150,
      unit: 'piece',
      stock: 50,
      description: 'Free size 2m. HSN 6207. Daily-wear cotton lungi.',
    },
    {
      name: 'Leather Belt - Brown',
      category: 'Accessories & Services',
      price: 299,
      mrp: 399,
      cost_price: 170,
      unit: 'piece',
      stock: 48,
      description: 'Waist 32-38. HSN 4203. Formal/casual belt.',
    },
    {
      name: 'Cotton Socks Pack of 5',
      category: 'Accessories & Services',
      price: 199,
      mrp: 279,
      cost_price: 115,
      unit: 'pack',
      stock: 70,
      description: 'Free size. HSN 6115. Ankle socks pack.',
    },
    {
      name: 'Stitching / Alteration Charge',
      category: 'Accessories & Services',
      price: 100,
      mrp: 150,
      cost_price: 0,
      unit: 'piece',
      stock: 999,
      description: 'Service item. Alteration/fitting charge. Non-stock.',
    },
  ],
};

const electricalDemoData = {
  categories: [
    { name: 'Wires & Cables', description: 'House wiring and cables' },
    { name: 'Switches & Sockets', description: 'Modular switches, sockets and MCBs' },
    { name: 'Lighting', description: 'Bulbs, tubes and decorative lights' },
    { name: 'Fans & Appliances', description: 'Fans and small appliances' },
  ],
  products: [
    {
      name: 'Copper Wire 1.5sqmm (90m)',
      category: 'Wires & Cables',
      price: 1450,
      unit: 'roll',
      stock: 25,
    },
    {
      name: 'Copper Wire 2.5sqmm (90m)',
      category: 'Wires & Cables',
      price: 2250,
      unit: 'roll',
      stock: 20,
    },
    { name: 'Extension Cord 5m', category: 'Wires & Cables', price: 350, unit: 'piece', stock: 30 },
    {
      name: 'Modular Switch 6A',
      category: 'Switches & Sockets',
      price: 45,
      unit: 'piece',
      stock: 200,
    },
    {
      name: '3-Pin Socket 16A',
      category: 'Switches & Sockets',
      price: 95,
      unit: 'piece',
      stock: 100,
    },
    {
      name: 'MCB 16A Single Pole',
      category: 'Switches & Sockets',
      price: 180,
      unit: 'piece',
      stock: 60,
    },
    {
      name: 'Switch Board Plate (8M)',
      category: 'Switches & Sockets',
      price: 120,
      unit: 'piece',
      stock: 80,
    },
    { name: 'LED Bulb 9W', category: 'Lighting', price: 99, unit: 'piece', stock: 150 },
    { name: 'LED Tube 20W 4ft', category: 'Lighting', price: 220, unit: 'piece', stock: 80 },
    { name: 'LED Panel 15W (Round)', category: 'Lighting', price: 320, unit: 'piece', stock: 50 },
    {
      name: 'Ceiling Fan 1200mm',
      category: 'Fans & Appliances',
      price: 1650,
      unit: 'piece',
      stock: 20,
    },
    {
      name: 'Table Fan 400mm',
      category: 'Fans & Appliances',
      price: 1350,
      unit: 'piece',
      stock: 15,
    },
    {
      name: 'Electric Kettle 1.5L',
      category: 'Fans & Appliances',
      price: 850,
      unit: 'piece',
      stock: 15,
    },
  ],
};

const hardwareDemoData = {
  categories: [
    { name: 'Hand Tools', description: 'Hammers, screwdrivers and tools' },
    { name: 'Fasteners', description: 'Screws, nails, nuts and bolts' },
    { name: 'Plumbing', description: 'Pipes, taps and fittings' },
    { name: 'Paint & Supplies', description: 'Paints, brushes and finishing' },
  ],
  products: [
    { name: 'Claw Hammer 500g', category: 'Hand Tools', price: 280, unit: 'piece', stock: 25 },
    { name: 'Screwdriver Set (6pc)', category: 'Hand Tools', price: 350, unit: 'set', stock: 30 },
    { name: 'Measuring Tape 5m', category: 'Hand Tools', price: 120, unit: 'piece', stock: 40 },
    { name: 'Pliers 8 inch', category: 'Hand Tools', price: 220, unit: 'piece', stock: 30 },
    { name: 'Hacksaw with Blade', category: 'Hand Tools', price: 180, unit: 'piece', stock: 20 },
    { name: 'Wood Screws 1" (100pc)', category: 'Fasteners', price: 90, unit: 'box', stock: 60 },
    { name: 'Wire Nails 2" 1kg', category: 'Fasteners', price: 110, unit: 'kg', stock: 50 },
    {
      name: 'Anchor Fastener 6mm (50pc)',
      category: 'Fasteners',
      price: 150,
      unit: 'box',
      stock: 40,
    },
    { name: 'PVC Pipe 3/4" (3m)', category: 'Plumbing', price: 210, unit: 'piece', stock: 40 },
    { name: 'Bib Tap (Brass)', category: 'Plumbing', price: 380, unit: 'piece', stock: 25 },
    { name: 'Teflon Tape', category: 'Plumbing', price: 15, unit: 'roll', stock: 150 },
    { name: 'PVC Elbow 3/4"', category: 'Plumbing', price: 18, unit: 'piece', stock: 100 },
    {
      name: 'Emulsion Paint 1L (White)',
      category: 'Paint & Supplies',
      price: 320,
      unit: 'tin',
      stock: 30,
    },
    {
      name: 'Paint Brush 4 inch',
      category: 'Paint & Supplies',
      price: 95,
      unit: 'piece',
      stock: 40,
    },
    {
      name: 'Sandpaper Sheet (80 grit)',
      category: 'Paint & Supplies',
      price: 12,
      unit: 'sheet',
      stock: 200,
    },
  ],
};

/*
 * Which pack a shop gets, from whatever word describes it.
 *
 * THE VOCABULARY IS NOT OURS ALONE. The word arrives from the cloud signup,
 * where the list is: retail, supermarket, restaurant, cafe, bakery, pharmacy,
 * hardware, electronics, textile, other. This file was written against a
 * different list, and the two disagreed in a way nothing reported:
 *
 *   - "electronics" matched no case, so the ELECTRICAL pack was unreachable
 *     and an electronics shop was handed groceries
 *   - "icecream" could not be sent at all, so that pack was unreachable too
 *   - "restaurant" fell to the default, so a restaurant was handed groceries
 *     when the cafe pack - prepared food and drink - is what it wanted
 *
 * Two of the seven packs could not be reached by any real signup. The failure
 * was silent because the default returns something plausible: every shop got a
 * supermarket, which looks like a decision rather than a miss.
 *
 * So both vocabularies are accepted, and the input is normalised, because
 * "Cafe" and "ice cream" are the same answers as "cafe" and "icecream" and a
 * switch on a raw string does not think so.
 */
const DEMO_PACK_BY_TYPE = {
  icecream: 'iceCream',
  'ice cream': 'iceCream',

  cafe: 'cafe',
  coffee: 'cafe',
  /* A restaurant sells prepared food and drink, which is what this pack is.
     Closer than groceries, which is where it landed before. */
  restaurant: 'cafe',

  bakery: 'bakery',

  supermarket: 'supermarket',
  kirana: 'supermarket',
  grocery: 'supermarket',
  groceries: 'supermarket',
  retail: 'supermarket',

  textile: 'textile',
  textiles: 'textile',
  apparel: 'textile',
  clothing: 'textile',

  electrical: 'electrical',
  electronics: 'electronics',

  hardware: 'hardware',
};

const DEMO_PACKS = {
  iceCream: iceCreamDemoData,
  cafe: cafeDemoData,
  bakery: bakeryDemoData,
  supermarket: supermarketDemoData,
  textile: textileDemoData,
  electrical: electricalDemoData,
  electronics: electricalDemoData,
  hardware: hardwareDemoData,
};

/*
 * The packs a shop can be offered, in the order a chooser should list them.
 *
 * SEPARATE FROM DEMO_PACK_BY_TYPE on purpose. That map is an INPUT vocabulary -
 * every word a signup form, an onboarding answer or a Gateway payload might use
 * for a trade, and several of them point at the same pack ("kirana", "grocery"
 * and "retail" are all the supermarket set). Showing that map to somebody
 * choosing an industry would offer them the same catalogue five times under
 * five names.
 *
 * This is the OUTPUT list: one entry per distinct catalogue, with the words a
 * shopkeeper would use for their own trade. A pack added to DEMO_PACKS without
 * a line here fails the test rather than quietly never being offered.
 */
const DEMO_PACK_LABELS = {
  supermarket: 'Supermarket, kirana & grocery',
  cafe: 'Cafe & restaurant',
  bakery: 'Bakery',
  iceCream: 'Ice cream parlour',
  textile: 'Clothing & textiles',
  electrical: 'Electronics & electrical',
  hardware: 'Hardware & tools',
};

/*
 * What a chooser needs to draw itself: the key to send back, the words to show,
 * and how much arrives if it is picked.
 *
 * The counts are COUNTED, never written down. A hand-maintained "24 products"
 * is right on the day it is typed and wrong from the next edit onwards, and
 * nothing about a stale number looks wrong.
 */
function listDemoPacks() {
  return Object.keys(DEMO_PACK_LABELS).map((key) => {
    const pack = DEMO_PACKS[key] || { categories: [], products: [] };
    return {
      key,
      label: DEMO_PACK_LABELS[key],
      categories: (pack.categories || []).length,
      products: (pack.products || []).length,
      /* Photographs are attached from the manifest at load, so this says what
         the shop will actually see rather than what the catalogue hoped for. */
      photos: (pack.products || []).filter((p) => p && p.image).length,
    };
  });
}

/*
 * Is this a pack a caller may ask for by name?
 *
 * getDemoDataByType falls back to supermarket for anything it does not know,
 * which is right when the input is a trade somebody typed - but wrong when it
 * is a deliberate choice from a list. Silently installing groceries into a
 * bakery because a key was misspelt is a bad answer delivered confidently.
 */
function isDemoPack(key) {
  if (Object.prototype.hasOwnProperty.call(DEMO_PACK_LABELS, String(key || ''))) return true;
  /* Dataset trades are packs too - the website's per-currency zips. Resolved
     through the same normaliser the installer uses, so the chooser and the
     validator can never disagree about what a key means. */
  // eslint-disable-next-line global-require
  const { datasetKeyFor } = require('../src/services/demo-dataset');
  return datasetKeyFor(key) !== null;
}

function getDemoDataByType(businessType) {
  const key = String(businessType == null ? '' : businessType)
    .trim()
    .toLowerCase();
  const pack = DEMO_PACK_BY_TYPE[key];
  /* Generic retail default: a kirana/supermarket set fits most shops, and is
     the right answer for "retail", "pharmacy" and "other", which have no pack
     of their own yet. */
  return DEMO_PACKS[pack] || supermarketDemoData;
}

/*
 * Attach the photographs, where there is one.
 *
 * DERIVED, NOT WRITTEN IN. The images live in the frontend as static files and
 * their manifest is written by scripts/fetch-demo-images.js. Pasting paths into
 * the product literals would mean a product could name a file that is not
 * there, or a file could sit unused, and neither would say so. Reading the
 * manifest means the two cannot disagree: an image exists and is used, or it
 * does not and the product simply has none.
 *
 * A product without one is a normal, finished state - PosnicPro.autoTile gives
 * it a coloured tile from its own name, which is a real answer on a sale grid.
 * Fifty-five of these products have no photograph because the automated search
 * returned somebody's brand, a photograph of people, or the wrong object
 * entirely, and those were turned down on sight. A wrong picture is read as
 * fact; an absent one is read as an absent one.
 *
 * Best-effort on purpose: a missing or unreadable manifest must never stop a
 * shop being created. It costs the pictures, nothing else.
 */
function attachImages() {
  /* Declared without a value: the catch below returns, so the only way past
     this point is with the manifest assigned. Seeding it with {} first is an
     assignment nothing ever reads, which eslint reports as an error. */
  let credits;
  try {
    // eslint-disable-next-line global-require
    credits = require('../../frontend/static/images/demo/credits.json');
  } catch (e) {
    return;
  }

  const byPack = {};
  for (const entry of Object.values(credits)) {
    if (!entry || !entry.pack || !entry.product || !entry.file) continue;
    (byPack[entry.pack] = byPack[entry.pack] || {})[entry.product] = entry.file;
  }

  const packs = {
    iceCream: iceCreamDemoData,
    cafe: cafeDemoData,
    bakery: bakeryDemoData,
    supermarket: supermarketDemoData,
    textile: textileDemoData,
    electrical: electricalDemoData,
    hardware: hardwareDemoData,
  };

  for (const [name, pack] of Object.entries(packs)) {
    const map = byPack[name];
    if (!map || !pack || !Array.isArray(pack.products)) continue;
    for (const product of pack.products) {
      if (map[product.name]) product.image = map[product.name];
    }
  }
}

attachImages();

module.exports = {
  getDemoDataByType,
  listDemoPacks,
  isDemoPack,
  DEMO_PACK_LABELS,
  attachImages,
  iceCreamDemoData,
  cafeDemoData,
  bakeryDemoData,
  supermarketDemoData,
  textileDemoData,
  electricalDemoData,
  hardwareDemoData,
};
