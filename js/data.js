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
  url: "https://arafattakey.github.io/primedealzon/",
  updated: "November 5, 2026",
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

const POSTS = [
  {
    slug: "best-drip-coffee-makers",
    cat: "coffee",
    title: "The Best Drip Coffee Makers on Amazon Right Now",
    excerpt: "Four brewers, four budgets: from a one-switch machine to a programmable 14-cup workhorse.",
    date: "November 5, 2026",
    read: "5 min read",
    body: [
      { p: "A good drip coffee maker should do three things well: get the water hot enough, spread it evenly over the grounds, and keep coffee warm without cooking it. Fancy displays come second. We narrowed Amazon's huge coffee aisle to four machines that do the basics right, each for a different kind of coffee drinker." },
      { h: "Best overall: Ninja Fresh Brew" },
      { p: "The Ninja Fresh Brew CE251 is the one we'd buy for most kitchens. It has a classic and a rich brew setting, a stainless body that looks good on a counter, and a glass carafe that pours cleanly. It costs more than the entry-level machines, but you can taste the difference in the cup." },
      { product: "B07S98411N" },
      { h: "Best for big households: Cuisinart PerfecTemp" },
      { p: "If you go through a full pot before 9 a.m., the 14-cup Cuisinart is built for you. Load it at night, set the 24-hour timer and wake up to coffee. The adjustable warming plate stops the last cup from tasting burnt." },
      { product: "B00MVWGQX0" },
      { h: "Best value: BLACK+DECKER Vortex" },
      { p: "This is one of the best-selling coffee makers on Amazon, and it earns that spot. It's programmable, has a sneak-a-cup pause and uses a showerhead that wets the grounds evenly. It's hard to beat for the price." },
      { product: "B01GJOMWVA" },
      { h: "Simplest: BLACK+DECKER Easy On/Off" },
      { p: "No clock, no programming, just one switch. It's great for an office, a dorm or a parent who doesn't want to learn a new machine." },
      { product: "B0C8B9V7HR" },
      { h: "Quick tips for better drip coffee" },
      { ul: ["Use about 2 tablespoons of ground coffee per 6 oz of water, then adjust to taste.", "Use filtered water. Coffee is 98% water.", "Descale every 1–3 months with a vinegar or descaler cycle.", "Grind just before brewing if you can. It helps more than anything else."] },
      { p: "Want to taste the biggest jump in quality for the least money? Pair any of these machines with a burr grinder. Our guide to the best burr coffee grinders covers three good ones at different budgets." },
      { related: ["best-burr-coffee-grinders", "pour-over-coffee-starter-kit"] },
    ],
  },
  {
    slug: "best-burr-coffee-grinders",
    cat: "coffee",
    title: "The Best Burr Coffee Grinders for Home (2026)",
    excerpt: "Fresh, even grounds are the cheapest upgrade in coffee. Three burr grinders for three budgets, and how to choose.",
    date: "November 5, 2026",
    read: "6 min read",
    body: [
      { p: "If your coffee tastes flat or bitter, the grinder is usually to blame, not the beans or the machine. Ground coffee goes stale within minutes, and a cheap blade grinder smashes beans into a mix of dust and chunks that brew unevenly. A burr grinder crushes beans between two plates set a fixed distance apart, so every particle comes out close to the same size. That one change does more for your cup than almost anything else you can buy." },
      { h: "What to look for" },
      { ul: ["Burrs, not blades. Conical or flat both work well at home.", "Enough grind settings for your brew method. Drip and pour-over need medium, French press needs coarse, espresso needs very fine.", "Easy cleaning. Removable hoppers and burrs make a monthly clean painless.", "Low retention, meaning little old coffee stays trapped inside to mix with today's grounds."] },
      { h: "Best overall: OXO Brew Conical Burr Grinder" },
      { p: "The OXO Brew is the easiest good grinder to live with. It has 40 mm stainless steel conical burrs, 15 main settings with micro-adjustments in between, and a one-touch start button that remembers your last setting, so most mornings you just press and walk away. The 12 oz hopper is tinted to block UV light. It handles drip, pour-over and French press very well. For true espresso you'll want something more specialized, but for everything else it's the one we'd buy." },
      { product: "B07CSKGLMM" },
      { h: "Best for coffee enthusiasts: Baratza Encore" },
      { p: "The Encore is the grinder many coffee professionals point beginners to, and it has won awards from the Specialty Coffee Association. It offers 40 grind settings on 40 mm conical burrs made in Liechtenstein, with a simple on/off switch and a front pulse button. The bigger selling point is longevity: Baratza sells replacement parts and supports its grinders for years, so this can be the last entry-level grinder you buy." },
      { product: "B007F183LK" },
      { h: "Best budget burr grinder: Cuisinart Supreme Grind" },
      { p: "If you're coming from a blade grinder and don't want to spend much, the Cuisinart DBM-8 is the classic step up. It uses flat stainless burrs with 18 settings from fine to extra-coarse, and its grind chamber holds enough for up to 32 cups. It's louder and a little messier than the OXO, but your coffee will still taste noticeably better than with a blade grinder." },
      { product: "B00018RRRK" },
      { h: "Which grind size for which brewer?" },
      { ul: ["French press and cold brew: coarse, like sea salt.", "Drip coffee maker: medium, like sand.", "Pour-over (V60, Chemex): medium-fine.", "Espresso: fine, like powdered sugar. Most budget grinders struggle here."] },
      { h: "Keep it working" },
      { ul: ["Grind only what you need right before brewing.", "Brush out the burrs and chute every few weeks.", "Never wash burrs with water unless the manual says you can. Use a brush or grinder-cleaning tablets.", "Keep beans in an airtight container, not in the hopper for days."] },
      { p: "Brewing with a French press or pour-over? See our picks for the best French presses and our pour-over starter kit." },
      { related: ["best-french-press", "pour-over-coffee-starter-kit", "best-drip-coffee-makers"] },
    ],
  },
  {
    slug: "best-french-press",
    cat: "coffee",
    title: "The Best French Press Coffee Makers on Amazon",
    excerpt: "Glass or steel, big or small: three French presses worth buying, plus the 4-minute method that makes them shine.",
    date: "November 5, 2026",
    read: "5 min read",
    body: [
      { p: "A French press is the simplest way to make rich, full-bodied coffee. There's no paper filter, so more of the coffee's oils end up in your cup. There's also nothing electronic to break. You need coarse grounds, hot water and four minutes. The differences between presses come down to material, filter quality and size." },
      { h: "Best overall: Veken 34 oz French Press" },
      { p: "The Veken is one of the most popular French presses on Amazon, and it gets the details right. The carafe is thick borosilicate glass, and the plunger uses a four-layer stainless steel filter (a spiral plate, a cross plate and two fine mesh screens) to keep sludge out of your cup. No plastic touches the coffee while it brews. It comes apart easily for cleaning, and the 34 oz size makes about four mugs." },
      { product: "B0FDQJFRYS" },
      { h: "Best unbreakable option: Utopia Kitchen Stainless Steel" },
      { p: "Glass presses break. If yours lives near a busy sink or goes camping, the Utopia Kitchen press is made from double-walled 304 stainless steel, which keeps coffee hot noticeably longer and survives drops. It also has a four-layer filter and comes apart fully for washing. The trade-off is that you can't see the brew inside." },
      { product: "B01G2CCWGY" },
      { h: "Best for one: Bodum Chambord, 12 oz" },
      { p: "Bodum's Chambord is the design most people picture when they think of a French press, and it's still made in Portugal. The 12 oz size brews one large mug or two small cups, which is ideal if you're the only coffee drinker at home and don't want leftovers going cold." },
      { product: "B00005LM0R" },
      { h: "How to make great French press coffee" },
      { ul: ["Use a coarse grind, about 1 tablespoon of coffee per 4 oz of water (roughly 1:15).", "Pour water just off the boil (about 200°F) over the grounds and stir gently.", "Put the lid on and wait 4 minutes.", "Press slowly and steadily, then pour everything out right away so it doesn't keep brewing and turn bitter."] },
      { p: "Fine grounds are the number one cause of muddy French press coffee. A burr grinder set to coarse fixes it. See our guide to the best burr coffee grinders." },
      { related: ["best-burr-coffee-grinders", "pour-over-coffee-starter-kit"] },
    ],
  },
  {
    slug: "pour-over-coffee-starter-kit",
    cat: "coffee",
    title: "Pour-Over Coffee Starter Kit: Everything You Need",
    excerpt: "A dripper, filters and a gooseneck kettle: the three pieces you need to start brewing café-style pour-over at home.",
    date: "November 5, 2026",
    read: "6 min read",
    body: [
      { p: "Pour-over coffee is clean, bright and easy to fine-tune, and the gear is cheaper than most coffee makers. You need three things: a dripper, the right paper filters and a kettle that pours slowly. Add a burr grinder and you have the same setup many specialty cafés use." },
      { h: "1. The dripper: Hario V60" },
      { p: "The V60 is the most popular pour-over cone in the world for good reason. Its spiral ridges and single large hole let the speed of your pour control the brew. Pour slowly for a stronger cup or faster for a lighter one. The ceramic version is made in Japan from traditional Arita-yaki porcelain and holds heat well. Size 02 makes one to four cups." },
      { product: "B000P4D5HG" },
      { p: "Just starting out, or want one for travel? The plastic V60 brews the same way, weighs almost nothing and won't break." },
      { product: "B001RBTSMM" },
      { h: "2. The filters" },
      { p: "V60 cones need V60-shaped filters. Regular flat-bottom filters won't fit. Buy the size that matches your dripper (02 for both drippers above), and rinse each filter with hot water before adding coffee so it doesn't add a papery taste." },
      { product: "B073S4XTKJ" },
      { h: "3. The kettle: why a gooseneck matters" },
      { p: "A regular kettle dumps water in a splash. A gooseneck spout lets you pour a thin, steady stream exactly where you want it, which is the whole trick of pour-over. The Cosori is our pick because it adds temperature control, with five presets and a 60-minute keep-warm, so you can hit about 200°F every time." },
      { product: "B07T1CH2HH" },
      { p: "If you just want the gooseneck pour without the extra features, the Chefman is a simple one-switch kettle with fast boiling and boil-dry protection. Let it rest about 30 seconds after boiling before you pour." },
      { product: "B0D4617CLP" },
      { h: "A simple V60 recipe" },
      { ul: ["15 g coffee (about 2.5 tablespoons), ground medium-fine, to 250 g water (about 8.5 oz).", "Rinse the filter, add the coffee and level the bed.", "Bloom: pour about 30 g of water, just enough to wet the grounds, and wait 30–45 seconds.", "Pour the rest in slow circles over 1.5 minutes, avoiding the filter walls.", "Total brew time should be about 3 minutes. Too slow means grind coarser. Too fast means grind finer."] },
      { p: "Grind size makes or breaks pour-over. If you don't own a burr grinder yet, start with our guide to the best burr coffee grinders." },
      { related: ["best-burr-coffee-grinders", "best-french-press"] },
    ],
  },
  {
    slug: "kitchen-essentials-that-last",
    cat: "home-kitchen",
    title: "3 Kitchen Essentials That Earn Their Counter Space",
    excerpt: "An Instant Pot, a cast iron skillet and a salad spinner — the trio we'd buy first for a new kitchen.",
    date: "November 5, 2026",
    read: "4 min read",
    body: [
      { p: "Most kitchen gadgets end up in a drawer. These three get used every week, and with basic care they last for years." },
      { h: "Instant Pot Duo 7-in-1" },
      { p: "It turns dried beans into dinner in under an hour, makes rice without a separate cooker and slow-cooks chili while you're at work. The 6-quart size is right for most families. Start with pressure-cooked chicken thighs or steel-cut oats, and it soon becomes part of your routine." },
      { product: "B00FLYWNYQ" },
      { h: "Lodge 12\" Cast Iron Skillet" },
      { p: "Cast iron holds heat like nothing else, which means a better sear, crispier potatoes and cornbread with real edges. It comes pre-seasoned, and every time you cook with oil the surface gets slicker. The silicone handle holder in this bundle saves your hands." },
      { product: "B00G2XGC88" },
      { h: "OXO Good Grips Salad Spinner" },
      { p: "Wet greens make watery salads and soggy dressings. The OXO's pump-and-brake design dries a whole head of lettuce in seconds, and the bowl is nice enough to serve from." },
      { product: "B00004OCKR" },
      { h: "Caring for cast iron" },
      { ul: ["Rinse with hot water and scrub with a brush. A drop of soap is fine.", "Dry it on the stove over low heat so it can't rust.", "Wipe on a very thin layer of oil while it's still warm."] },
    ],
  },
  {
    slug: "best-budget-sheet-sets",
    cat: "bedding",
    title: "The Best Budget Sheet Sets on Amazon",
    excerpt: "Three best-selling queen sheet sets that feel more expensive than they are.",
    date: "November 5, 2026",
    read: "4 min read",
    body: [
      { p: "Pricey sheets can be lovely, but a well-made microfiber set gets you most of the way there for a fraction of the price. These three are among Amazon's top-ranked bedding, and each solves a different problem." },
      { h: "For hot sleepers: CGK Unlimited" },
      { p: "These sit near the top of Amazon's bedding charts for a reason. They feel smooth and cool, come in a huge range of colors and sizes, and keep their shape through repeated washing." },
      { product: "B01M16WBW1" },
      { h: "For the lowest price: Amazon Basics Microfiber" },
      { p: "These are light, soft and wrinkle-resistant, so they come out of the dryer looking made-up. They fit mattresses up to 14\" deep." },
      { product: "B00Q7OARO2" },
      { h: "For thick mattresses: Utopia Bedding" },
      { p: "If fitted sheets keep popping off the corners of your bed, the 16\" deep pockets on this set will fix it, even with a topper." },
      { product: "B00NX0WXQI" },
      { h: "Making cheap sheets last" },
      { ul: ["Wash in cool or warm water, not hot, to avoid pilling.", "Skip fabric softener on microfiber because it reduces breathability.", "Rotate two sets so each gets a rest between washes."] },
    ],
  },
  {
    slug: "weekend-home-reset",
    cat: "storage",
    title: "The Weekend Home Reset: Storage and Cleaning Supplies",
    excerpt: "Clear bins, latching boxes and the cleaning staples that make a one-weekend declutter actually stick.",
    date: "November 5, 2026",
    read: "5 min read",
    body: [
      { p: "Decluttering fails when stuff has nowhere to go. Here's a simple two-day plan: sort and bin on Saturday, then deep-clean the newly empty surfaces on Sunday." },
      { h: "Saturday: give everything a home" },
      { p: "Pull everything out of one area, like the garage, a closet or under the bed, and sort it into keep, donate and toss. Keepers go into bins you can see into, labeled on the short end so the label shows when they're stacked." },
      { product: "B00CQGTGXS" },
      { p: "For closets and under-bed space, the smaller latching clip boxes are easier to lift and keep out dust." },
      { product: "B0GPS742LV" },
      { h: "Sunday: clean the empty space" },
      { p: "Once shelves and floors are clear, it's the easiest time to clean them. Work top to bottom: wipe high surfaces first, then counters, then floors." },
      { product: "B0G3CJ33QG" },
      { product: "B0BNNVT2VH" },
      { product: "B00W5D1MDE" },
      { h: "Keep it that way" },
      { ul: ["One in, one out: when something new comes home, something old leaves.", "Keep a donate bin by the door and drop it off when it's full.", "Put wipes in every bathroom and the kitchen so quick cleanups actually happen."] },
    ],
  },
];
