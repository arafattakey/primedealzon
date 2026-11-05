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
  updated: "November 5, 2026",
};

const CATEGORIES = [
  { id: "home-kitchen", name: "Home & Kitchen", blurb: "Countertop workhorses and prep tools that earn their space.", icon: "pot" },
  { id: "coffee", name: "Coffee", blurb: "Reliable brewers for every budget and every morning.", icon: "cup" },
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
