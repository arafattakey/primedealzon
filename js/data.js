/*
 * PrimeDealZon content data.
 *
 * Every ASIN below was verified as a live, in-stock Amazon.com listing on 2026-11-05.
 * Prices are intentionally NOT stored here: the Amazon Associates Operating Agreement
 * only allows showing prices pulled from the Product Advertising API and refreshed
 * regularly. Each card links to Amazon, where the shopper sees the current price.
 *
 * To add a product: copy an entry, change the ASIN/title/brand/blurb, and set `cat`
 * to one of the category ids below.
 */

const SITE = {
  name: "PrimeDealZon",
  tagline: "Best Deals. Best Prices. Every Day.",
  affiliateTag: "primedealzo02-20",
  // Public base URL, used for canonical links and the sitemap. Change once primedealzon.com is live, then run `node tools/build.mjs`.
  url: "https://primedealzon.com/",
  updated: "November 5, 2026",
  // The "Gifts" header link shows on pages built up to this date (the /gifts/ page itself stays live).
  giftNavUntil: "2026-12-31",
};

const CATEGORIES = [
  { id: "coffee", name: "Coffee", blurb: "Grinders, brewers, presses and kettles that make better coffee at home.", icon: "cup" },
  { id: "home-kitchen", name: "Home & Kitchen", blurb: "Countertop workhorses and prep tools that earn their space.", icon: "pot" },
  { id: "bedding", name: "Bedding", blurb: "Soft, breathable sheet sets that wash well and last.", icon: "bed" },
  { id: "cookware", name: "Cookware", blurb: "Pans built to sear, bake and outlive trends.", icon: "pan" },
  { id: "storage", name: "Storage", blurb: "Stackable bins that make garages and closets make sense.", icon: "box" },
  { id: "cleaning", name: "Cleaning", blurb: "The everyday supplies worth keeping stocked.", icon: "spray" },
];

const PRODUCTS = [
  // Coffee
  { asin: "B07S98411N", cat: "coffee", brand: "Ninja", title: "Ninja Fresh Brew 12-Cup Coffee Maker (CE251)", blurb: "Stainless steel drip brewer with a glass carafe and a classic or rich brew strength — a big step up from basic machines without the espresso-maker price.", badge: "Editor's pick", featured: true },
  { asin: "B00MVWGQX0", cat: "coffee", brand: "Cuisinart", title: "Cuisinart PerfecTemp 14-Cup Programmable Coffee Maker", blurb: "Programmable 24 hours ahead with adjustable keep-warm and a 14-cup carafe, so it suits big households and weekend guests.", badge: "Best for families" },
  { asin: "B01GJOMWVA", cat: "coffee", brand: "BLACK+DECKER", title: "BLACK+DECKER 12-Cup Drip Coffee Maker with Vortex Brewing", blurb: "Programmable, simple and one of Amazon's best-selling coffee makers. Vortex showerhead brewing gives an even extraction.", badge: "Best seller" },
  { asin: "B0C8B9V7HR", cat: "coffee", brand: "BLACK+DECKER", title: "BLACK+DECKER 12-Cup Coffee Maker, Easy On/Off", blurb: "No screens, no settings, one switch. A dependable pick for dorms, offices and anyone who just wants coffee.", badge: "Budget pick" },

  // Coffee: grinders
  { asin: "B07CSKGLMM", cat: "coffee", brand: "OXO", title: "OXO Brew Conical Burr Coffee Grinder", blurb: "40 mm stainless conical burrs, 15 settings plus micro-steps, and one-touch grinding that remembers your last setting.", badge: "Editor's pick", featured: true },
  { asin: "B007F183LK", cat: "coffee", brand: "Baratza", title: "Baratza Encore Conical Burr Coffee Grinder", blurb: "Award-winning entry-level grinder from a brand coffee pros trust: 40 settings, 40 mm conical burrs and replaceable parts.", badge: "Coffee nerd pick" },
  { asin: "B00018RRRK", cat: "coffee", brand: "Cuisinart", title: "Cuisinart Supreme Grind Burr Grinder (DBM-8)", blurb: "Flat burrs and 18 grind levels for much less money. Grinds enough for up to 32 cups at once.", badge: "Budget pick" },

  // Coffee: French press
  { asin: "B0FDQJFRYS", cat: "coffee", brand: "Veken", title: "Veken 34 oz French Press", blurb: "Thick borosilicate glass, a 4-layer steel filter and no plastic touching the coffee.", badge: "Best overall" },
  { asin: "B01G2CCWGY", cat: "coffee", brand: "Utopia Kitchen", title: "Utopia Kitchen Stainless Steel French Press, 34 oz", blurb: "Double-walled 304 stainless steel keeps coffee hot longer and can't shatter.", badge: "Won't break" },
  { asin: "B00005LM0R", cat: "coffee", brand: "Bodum", title: "Bodum Chambord French Press, 12 oz", blurb: "The classic design, made in Portugal, sized for one or two cups.", badge: "Best for one" },

  // Coffee: pour-over
  { asin: "B000P4D5HG", cat: "coffee", brand: "Hario", title: "Hario V60 Ceramic Coffee Dripper, Size 02", blurb: "The cone café baristas use. Spiral ridges and one big hole let your pour control the brew.", badge: "Editor's pick" },
  { asin: "B001RBTSMM", cat: "coffee", brand: "Hario", title: "Hario V60 Plastic Coffee Dripper, Size 02", blurb: "Same V60 cone in light, unbreakable plastic. Great for travel and first-timers.", badge: "Budget pick" },
  { asin: "B073S4XTKJ", cat: "coffee", brand: "Hario", title: "Hario V60 Paper Filters, Size 02, 200 ct", blurb: "The matching filters for any size 02 V60. Rinse once before brewing.", badge: "Don't forget" },
  { asin: "B07T1CH2HH", cat: "coffee", brand: "Cosori", title: "Cosori Gooseneck Electric Kettle with Temperature Control", blurb: "Five temperature presets, a 60-minute keep-warm and a slow, steady gooseneck pour.", badge: "Best kettle" },
  { asin: "B0D4617CLP", cat: "coffee", brand: "Chefman", title: "Chefman Gooseneck Electric Kettle, 0.8 L", blurb: "A no-frills gooseneck: one switch, fast boil and boil-dry protection.", badge: "Budget kettle" },

  // Coffee: small gifts (stocking stuffers)
  { asin: "B000BPC5LG", cat: "coffee", brand: "Norpro", title: "Norpro Stainless Steel Coffee Scoop with Bag Clip", blurb: "A long-handled scoop with a spring clip in the handle that seals the bag after you measure.", badge: "Stocking stuffer" },
  { asin: "B07SMMH8G7", cat: "coffee", brand: "Perfect Pod", title: "Perfect Pod Cafe Save Reusable Coffee Pod Filters, 4-Pack", blurb: "Refillable pods that let a Keurig brew any ground coffee. Check the machine model before buying.", badge: "For Keurig owners" },
  { asin: "B00076ZD0O", cat: "coffee", brand: "Bodum", title: "Bodum Pavina Double-Wall Espresso Glasses, 2.5 oz, Set of 2", blurb: "Borosilicate double-wall glasses that keep espresso warm and stay cool to hold.", badge: "Espresso gift" },
  { asin: "B0014J7FUY", cat: "coffee", brand: "Urnex", title: "Urnex Grindz Coffee Grinder Cleaning Tablets, 430 g", blurb: "Food-safe tablets that clean burr grinders without taking them apart.", badge: "Practical pick" },
  { asin: "B0046JG8WA", cat: "coffee", brand: "Coffeevac", title: "Coffeevac Airtight Coffee Container, 1/2 lb", blurb: "A push-button canister that lets air out as it closes. Holds a standard small bag of beans.", badge: "For whole beans" },

  // Coffee: cold brew and iced coffee
  { asin: "B07VJJJ764", cat: "coffee", brand: "County Line Kitchen", title: "County Line Kitchen Cold Brew Coffee Maker, 64 oz Mason Jar", blurb: "A glass mason jar with a stainless mesh filter and a flip-cap pouring lid. Makes a big batch.", badge: "Big batch" },
  { asin: "B00JVSVM36", cat: "coffee", brand: "OXO", title: "OXO Brew Cold Brew Coffee Maker", blurb: "Makes cold brew concentrate and drains it into a 32 oz glass carafe with one switch.", badge: "Concentrate pick" },
  { asin: "B08KHQRL66", cat: "coffee", brand: "Toddy", title: "Toddy Cold Brew System, Staycation Edition", blurb: "The long-running big-batch cold brew system, with a glass decanter, felt filters and paper filter bags.", badge: "Enthusiast pick" },
  { asin: "B08VPTBYM5", cat: "coffee", brand: "Stanley", title: "Stanley IceFlow Flip Straw Tumbler, 20 oz", blurb: "Vacuum-insulated stainless tumbler with a flip-up straw and a handle. Fits most cupholders.", badge: "Iced coffee to go" },
  { asin: "B01M0CLQ72", cat: "coffee", brand: "Tovolo", title: "Tovolo King Cube Silicone Ice Cube Trays, Set of 2", blurb: "Two silicone trays that make 2-inch cubes. Freeze cold brew in them so iced coffee doesn't get watery.", badge: "Coffee ice cubes" },

  // Coffee: espresso
  { asin: "B0B1JPPG2L", cat: "coffee", brand: "Breville", title: "Breville Bambino Espresso Machine (BES450BSS)", blurb: "A compact espresso machine with fast heat-up, digital temperature control and an automatic steam wand. Needs a separate grinder.", badge: "First espresso machine" },
  { asin: "B0797T2FYL", cat: "coffee", brand: "Wacaco", title: "Wacaco Nanopresso Portable Espresso Maker", blurb: "A hand-pumped espresso maker for travel and camping. No battery or power needed.", badge: "For travelers" },
  { asin: "B0016J76CE", cat: "coffee", brand: "Dreamfarm", title: "Dreamfarm Grindenstein Espresso Knock Box", blurb: "A small knock box that sits on the drip tray, with a rubber-sleeved bar that protects the portafilter.", badge: "Tidy counter" },

  // Coffee: gifts and accessories
  { asin: "B0047BIWSK", cat: "coffee", brand: "AeroPress", title: "AeroPress Original Coffee Press", blurb: "A cult-favorite single-cup brewer: about 2 minutes to brew and clean, and tough enough to travel.", badge: "Top gift" },
  { asin: "B0000AN3QI", cat: "coffee", brand: "Bialetti", title: "Bialetti Moka Express Stovetop Espresso Maker, 3 Cup", blurb: "The original Italian moka pot, still made in Italy. Strong, espresso-style coffee on any stovetop.", badge: "Classic" },
  { asin: "B07C36HVWK", cat: "coffee", brand: "Takeya", title: "Takeya Cold Brew Coffee Maker, 2 Quart", blurb: "Airtight Tritan pitcher with a fine-mesh filter that fits in most fridge doors.", badge: "Iced coffee pick" },
  { asin: "B09B4CB7C1", cat: "coffee", brand: "Greater Goods", title: "Greater Goods Coffee Scale with Timer", blurb: "0.1 g precision, a built-in brew timer and a removable silicone cover.", badge: "Upgrade pick" },
  { asin: "B0CYRDDQX7", cat: "coffee", brand: "Contigo", title: "Contigo West Loop 3.0 Insulated Travel Mug, 16 oz", blurb: "Autoseal lid that locks between sips. Keeps coffee hot for hours and fits most cupholders.", badge: "Commuter pick" },
  { asin: "B0CLYV3B94", cat: "coffee", brand: "Zulay Kitchen", title: "Zulay Kitchen Handheld Milk Frother", blurb: "Battery-powered wand for foamy lattes, matcha and hot chocolate in seconds.", badge: "Stocking stuffer" },

  // Home & Kitchen
  { asin: "B00FLYWNYQ", cat: "home-kitchen", brand: "Instant Pot", title: "Instant Pot Duo 7-in-1 Electric Pressure Cooker, 6 Qt", blurb: "Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker and warmer in one. The 6-quart size feeds up to six.", badge: "Editor's pick", featured: true },
  { asin: "B00004OCKR", cat: "home-kitchen", brand: "OXO", title: "OXO Good Grips Salad Spinner, 6.22 Qt", blurb: "One-handed pump, built-in brake and a bowl that doubles for serving. Dries greens and herbs in seconds.", badge: "Cult favorite" },

  // Cookware
  { asin: "B00G2XGC88", cat: "cookware", brand: "Lodge", title: "Lodge Pre-Seasoned 12\" Cast Iron Skillet with Silicone Handle Holder", blurb: "Made in the USA and seasoned out of the box. Sears steaks, bakes cornbread and goes from stovetop to oven to campfire.", badge: "Buy it for life", featured: true },

  // Bedding
  { asin: "B00Q7OARO2", cat: "bedding", brand: "Amazon Basics", title: "Amazon Basics Brushed Microfiber 4-Piece Sheet Set, Queen", blurb: "Lightweight, wrinkle-resistant and fits mattresses up to 14\" deep. Very easy on the wallet.", badge: "Budget pick" },
  { asin: "B01M16WBW1", cat: "bedding", brand: "CGK Unlimited", title: "CGK Unlimited Breathable & Cooling 4-Piece Sheet Set, Queen", blurb: "One of the top-ranked sheet sets on Amazon, with hundreds of color and size options. Smooth, cool feel for hot sleepers.", badge: "Best seller", featured: true },
  { asin: "B00NX0WXQI", cat: "bedding", brand: "Utopia Bedding", title: "Utopia Bedding Hotel Luxury 4-Piece Sheet Set, 16\" Deep Pocket", blurb: "Deep 16\" pockets that stay put on thick mattresses and toppers. Machine washable.", badge: "Best for deep mattresses" },

  // Storage
  { asin: "B00CQGTGXS", cat: "storage", brand: "IRIS USA", title: "IRIS USA 54 Qt Clear Storage Bins with Lids, 6-Pack", blurb: "Clear sides so you can see what's inside, latching lids and stacking that works. A garage and basement classic.", badge: "Editor's pick", featured: true },
  { asin: "B0GPS742LV", cat: "storage", brand: "IRIS USA", title: "IRIS USA 32.5 Qt Clip Box with Latching Lid, 6-Pack", blurb: "Mid-size frosted bins that slide under beds and onto closet shelves. Latches keep dust out.", badge: "Best for closets" },

  // Cleaning
  { asin: "B0BNNVT2VH", cat: "cleaning", brand: "Lysol", title: "Lysol Disinfecting Wipes, 80 ct (4-Pack)", blurb: "Grab-and-go wipes for counters, handles and remotes. One of Amazon's most-bought household items.", badge: "Best seller", featured: true },
  { asin: "B0G3CJ33QG", cat: "cleaning", brand: "Lysol", title: "Lysol All-Purpose Cleaner Spray, 32 oz (4-Pack)", blurb: "Kitchen, bath and everything in between. The 4-pack means one for every room.", badge: "Stock-up pick" },
  { asin: "B00W5D1MDE", cat: "cleaning", brand: "Clorox", title: "Clorox Toilet Bowl Cleaner with Bleach, 24 oz (2-Pack)", blurb: "Thick clinging gel with an angled nozzle that reaches under the rim. A cheap, effective staple.", badge: "Budget pick" },
];

// Posts live in content/posts/*.json. tools/build.mjs generates js/posts-index.js and the guide pages.
