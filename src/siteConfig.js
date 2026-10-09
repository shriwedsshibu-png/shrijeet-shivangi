// ============================================================================
//  Shrijeet & Shivangi — Wedding Website
//  THIS IS THE ONLY FILE YOU NEED TO EDIT FOR TEXT, DATES, LINKS AND NAMES.
//  Change the words between the "quotation marks", save (commit) on GitHub,
//  and the live website updates by itself in about a minute.
//  Be careful not to delete any quotation marks, commas or brackets.
// ============================================================================

const siteConfig = {
  // --------------------------------------------------------------------------
  // 1. GOOGLE BACKEND  (RSVP, Blessings and Photos are saved through this)
  //    After you finish GUIDE-1-GOOGLE-SETUP.md, paste the long "Web app URL" here.
  // --------------------------------------------------------------------------
  backend: {
    scriptUrl: "https://script.google.com/macros/s/AKfycbzzEq-U8TeVI_mUBe7Yo5a7U3fVpWsN4PmD4jHHYi0pK4KVVcSzeUhC45NlAe6d0m7y/exec",
  },

  // --------------------------------------------------------------------------
  // 1b. INVITATION FILM  (the animated invite that opens first)
  //     enabled: false -> the old website opens directly, exactly as before.
  //     firstVisitOnly: true -> plays once for each new visitor on the main link;
  //     the link  yoursite/invite  always plays it. Guests can Skip or Replay.
  //     firstVisitOnly: false -> only the /invite link plays it; the home page is unchanged.
  //     homeButton: true -> shows a "Watch the Invitation" button on the home page.
  // --------------------------------------------------------------------------
  inviteFilm: { enabled: true, firstVisitOnly: false, homeButton: false },

  // --------------------------------------------------------------------------
  // 1c. TWO KINDS OF GUESTS — two invite links, one website
  //     3-day guests get:        yoursite/invite/parivaar
  //     Wedding-day guests get:  yoursite/invite/shubh-vivah
  //     The site remembers which link a guest opened. Anyone who opens the
  //     plain website without a link sees the wedding-day version ("defaultTier").
  //     You can change the words after /invite/ below (letters, numbers, dashes).
  // --------------------------------------------------------------------------
  guestTiers: {
    defaultTier: "wedding",
    full: {
      code: "parivaar",
      label: "3-day",
      events: "all",                       // every function
      dateLine: "30 Nov – 2 Dec 2026",
      hidePages: [],
    },
    wedding: {
      code: "shubh-vivah",
      label: "Wedding day",
      events: ["Varmala & Shaadi"],        // only these functions are shown
      dateLine: "Wednesday, 2 December 2026",
      hidePages: [],                       // pages hidden from the menu for these guests (e.g. ["travel"])
      eventsSubtitle: "Join us by the sea for the Varmala and the sacred pheras.",
    },
  },

  // --------------------------------------------------------------------------
  // 2. SHOW / HIDE PAGES
  //    enabled: true  -> page and its buttons are visible to everyone
  //    enabled: false -> page and every button/link to it disappears
  //    (the text stays safely saved here, so you can switch it on again anytime)
  // --------------------------------------------------------------------------
  features: {
    events:    { enabled: true, label: "Events" },
    rsvp:      { enabled: true, label: "RSVP" },
    photos:    { enabled: true, label: "Photos" },
    blessings: { enabled: true, label: "Blessings" },
    ourStory:  { enabled: false, label: "Our Story" },
    families:  { enabled: true, label: "Our Families" },
    invite:    { enabled: true, label: "Our Invitation" },
    travel:    { enabled: true, label: "Explore Vizag" },
    faq:       { enabled: true, label: "FAQ" },
  },

  // --------------------------------------------------------------------------
  // 3. NAMES, DATE, PLACE
  // --------------------------------------------------------------------------
  couple: {
    name1: "Shrijeet",
    name2: "Shivangi",
    displayName: "Shivangi & Shrijeet", // small name used in the top bar and footer
  },

  wedding: {
    // The countdown runs until this moment (Indian time, +05:30).
    countdownTo: "2026-12-02T21:00:00+05:30",
    dateLine: "30 Nov – 2 Dec 2026",
    city: "Visakhapatnam",
    venueName: "Aarif Seaside Resort",
    mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
  },

  // --------------------------------------------------------------------------
  // 4. HOME PAGE  (one invitation message — the names are shown big)
  // --------------------------------------------------------------------------
  homepage: {
    // "photo" = big full-screen photo behind the invitation.  "arch" = small framed photo.
    heroStyle: "photo",
    heroImage: "/images/our2.jpg",
    invocation: "॥ श्री गणेशाय नमः ॥",
    invitationTop:
      "With the blessings of our families, we joyfully invite you to celebrate the wedding of",
    invitationBottom:
      "Your presence will be our greatest joy and your blessings our greatest gift.",
    welcomeHindi: "आपका हार्दिक स्वागत है",
    // The invitation page of the invite film (traditional card wording)
    inviteCard: {
      groomParents: "Smt. Sujata Mishra & Shri Sushil Kumar Mishra",
      request: "request the pleasure of your company at the wedding of their son",
      brideLine: "daughter of",
      brideParents: "Smt. Anju Kumari & Shri Shailendra Kumar",
    },
    countdownTitle: "Counting down to forever",
    countdownPoem: "Two hearts, two families, one beautiful beginning.",
  },

  // --------------------------------------------------------------------------
  // 5. EVENTS  (time is Indian time)
  // --------------------------------------------------------------------------
  events: {
    title: "Celebrate With Us",
    subtitle: "Every function is at the same lovely place by the sea.",
    events: [
      {
        id: 1,
        name: "Faldaan",
        date: "2026-11-30",
        time: "06:00 PM",
        dressCode: "Semi-formal",
        description: "An evening of blessings as our two families come together.",
      },
      {
        id: 2,
        name: "Mehndi",
        date: "2026-12-01",
        time: "08:30 AM",
        dressCode: "Traditional",
        description: "A morning of henna, colour, laughter and songs.",
      },
      {
        id: 3,
        name: "Engagement & Sangeet",
        date: "2026-12-01",
        time: "06:30 PM",
        dressCode: "Party wear",
        description: "An evening of music, dance and family performances.",
      },
      {
        id: 4,
        name: "Haldi",
        date: "2026-12-02",
        time: "08:30 AM",
        dressCode: "Traditional",
        description: "A joyful morning of haldi, blessings and fun.",
      },
      {
        id: 5,
        name: "Varmala & Shaadi",
        date: "2026-12-02",
        time: "07:30 PM onwards",
        dressCode: "Traditional",
        description: "Two hearts exchange garlands, and the sacred pheras and vows begin our forever.",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 6. RSVP
  // --------------------------------------------------------------------------
  rsvp: {
    title: "Kindly Confirm Your Presence",
    subtitle: "Just a few quick details — how many of you are coming, when you arrive and whether you need a room. You can change your answer anytime with the same mobile number.",
    // shown to wedding-day guests (their form is short: name, number, how many, food)
    weddingSubtitle: "Just a few quick details — how many of you are coming, when you arrive and whether you need a room. You can change your answer anytime with the same mobile number.",
  },

  // --------------------------------------------------------------------------
  // 7. PHOTOS
  // --------------------------------------------------------------------------
  photos: {
    title: "Share & Relive Our Moments",
    subtitle: "Add the photos you click during the celebrations, and enjoy everyone else's too. Find your own pictures with a quick selfie.",
    // Photographer's professional face-search gallery (add link after the wedding)
    photographerGalleryUrl: "",
    // Your own photos shown at the top of the gallery (files are in public/images)
    ourPhotosLabel: "Shrijeet & Shivangi",
    ourPhotos: [
      "/images/our-image.jpg",
      "/images/our2.jpg",
      "/images/shrijeet.jpg",
      "/images/shivangi.jpg",
    ],
  },

  // --------------------------------------------------------------------------
  // 8. DIGITAL BLESSINGS
  // --------------------------------------------------------------------------
  blessings: {
    title: "Digital Blessings",
    subtitle: "Your love and blessings are the most precious gift we can receive.",
    blessingHeading: "Leave a Blessing",
    blessingHint: "Write a few kind words, a prayer or a memory for the couple.",
  },

  shagun: {
    // Set to true to show the Digital Shagun (UPI) section on the Blessings page again.
    enabled: false,
    heading: "Digital Shagun",
    optionalNote: "Completely optional — your presence and blessings mean the most to us.",
    upiId: "7356045315@yescred",
    payeeName: "Shrijeet & Shivangi",
    note: "Shagun",
    // Optional: to show your own QR picture instead of the automatic one,
    // put the picture in public/images and write its name here, e.g. "/images/my-upi-qr.png"
    qrImage: "",
  },

  // --------------------------------------------------------------------------
  // 9. OUR STORY
  // --------------------------------------------------------------------------
  ourStory: {
    title: "Our Story",
    subtitle: "A little of how we found each other.",
    partner1Story: {
      name: "Shrijeet's Story",
      image: "/images/shrijeet.jpg",
      story: `From a Basketball Court to Forever.

I still remember the first time I saw you. You were playing for the CUCEK basketball team, and somehow, amidst everything happening around us, you caught my attention. There was an immediate sense of attraction and awe that I couldn't quite explain then. I was fortunate enough that, despite both of us being rather introverted, we managed to exchange a little wave and eventually a few words.

And then came our wonderfully silly conversations.

Phones weren't allowed, so I found my own little ways of trying to get your attention. Messages in the morning, messages at night, and plenty of messages in between that probably made very little sense — but I would find some excuse, any excuse, to talk to you.

Days became weeks, weeks became months, and somehow, even while being in Kochi, we could barely manage to meet.

I remember one day deciding to cycle all the way to your college. I didn't even have a bike then, but apparently that wasn't enough of a reason to stay away. Somewhere along the way, those outings to cafés and Alleppey beach, the lighthouse, and all those conversations that weren't officially called "dates" became some of the memories I treasure most.

I was always in awe of your beauty. But with time, I realised that it was never just that. I admired the person behind it.

You always seemed wiser and more mature than your years, with your own goals and dreams and a quiet determination to achieve them. Somewhere deep inside, even before I knew how life would unfold, there was a part of me that knew that you were someone I could see myself settling down with.

Then life took us in different directions.

I passed out from Kochi and moved to Vizag and Delhi for studies and work. You moved to Mohali after cracking a wonderful opportunity through campus placement — yet another reminder of how intelligent, determined and capable you have always been.

The distance grew. But somehow, the bond didn't.

Mohali slowly became my second home. And no matter how difficult your own days were, you always made me feel welcome. You held my hand through some of the hardest moments of my life, and I have always tried, in whatever way I could, to be there for you too — as your friend, your companion, and eventually as the person who hopes to walk beside you for the rest of his life.

We've travelled together, and somehow every trip became a little more adventurous than the one before it. You even agreed to our first bike trip — something I still hope and pray becomes the first of many journeys we will take together after we are married.

And along the way, we were fortunate enough to seek blessings at places like Tungnath and Kedarnath.

But if there is one thing about you that I admire more than anything else, it is your refusal to give up. Even when the pain was immense. Even when things were difficult. Even when continuing seemed almost impossible — you kept going. I have seen that strength in you, and it has changed the way I look at you and at life.

There is also something I carry with me very deeply — the knowledge of how much pain and difficulty you have endured, some of it because of me and the circumstances we found ourselves in. I can never undo those moments. I can only spend the rest of my life trying to make sure that the person who has stood beside me through so much feels loved, valued, protected and happy.

I don't know whether I have always been able to give you the life and happiness you deserve. But I know this: I will keep trying.

I will keep trying for as long as I live — to make you smile, to stand beside you when things are difficult, to celebrate with you when life is beautiful, and to be your friend and companion through everything that comes our way.

And now, after all those messages, long distances, missed meetings, journeys, adventures, difficult days and beautiful ones...

On 2 December 2026, I get to stand beside you and call you my wife.

I couldn't have imagined a lifetime when our paths first crossed.

Here's to you, Shibu.
Here's to us.
And here's to all the journeys still waiting for us.`,
    },
    partner2Story: {
      name: "Shivangi's Story",
      image: "/images/shivangi.jpg",
      story: "Hope this is the love which helps us grow and stay happy and jolly together through distances and fights and love always.",
    },
    howWeMet: {
      enabled: true,
      title: "Two lives, one journey",
      story: "Somewhere along the way, two people became a family, and a journey that began with two separate lives slowly became one shared future.",
    },
  },

  // --------------------------------------------------------------------------
  // 10. OUR FAMILIES  (add or remove people freely; keep the same shape)
  // --------------------------------------------------------------------------
  families: {
    title: "Our Families",
    subtitle: "With the love and blessings of our families, we request the pleasure of your presence at our wedding celebrations.",
    shrijeet: [
      {
        name: "Jagtaran Devi",
        relation: "Dadi"
      },
      {
        name: "Sushil Kumar Mishra MAA(Retd)",
        relation: "Papa"
      },
      {
        name: "Sujata Mishra",
        relation: "Mummy"
      },
      {
        name: "Shristi Kumari",
        relation: "Bahena"
      },
      {
        name: "Shiv Chandra Singh",
        relation: "Nana"
      },
      {
        name: "Prabha Devi",
        relation: "Nani"
      },
      {
        name: "Sudhir Kumar Mishra Hon(Lt) (Retd)",
        relation: "Bade Papa"
      },
      {
        name: "Abha",
        relation: "Badi Mummy"
      },
      {
        name: "Shashi Bhushan Mishra CPO(Retd)",
        relation: "Bade Papa"
      },
      {
        name: "Kiran Mishra",
        relation: "Badi Mummy"
      },
      {
        name: "Alok Mishra",
        relation: "Bhaiya"
      },
      {
        name: "Lt Cdr Seema Rani Sharma (Retd)",
        relation: "Bhabhi"
      },
      {
        name: "Cdr Avlok Kumar Mishra",
        relation: "Bhaiya"
      },
      {
        name: "Anuradha",
        relation: "Bhabhi"
      },
      {
        name: "Rani",
        relation: "Didi"
      },
      {
        name: "Pankaj Thakur",
        relation: "Jiju"
      },
      {
        name: "Ruby Mishra",
        relation: "Didi"
      },
      {
        name: "Abhishek Sharma",
        relation: "Jiju"
      }
    ],
    // Shivangi's side — fill this in when ready. Example of one person:
    //   { name: "Full Name", relation: "Papa" },
    // While this list is empty, only Shrijeet's family is shown.
    shivangi: [
      { name: "Shailendra Kumar", relation: "Father" },
      { name: "Anju Kumari", relation: "Mother" },
      { name: "Sourabh", relation: "Brother" },
    ],
  },

  // --------------------------------------------------------------------------
  // 11. EXPLORE VIZAG / WHERE TO STAY
  // --------------------------------------------------------------------------
  travel: {
    title: "Explore Vizag",
    subtitle: "Where to stay, where to shop, and a few lovely places to see while you are in Visakhapatnam.",
    venueName: "Aarif Seaside Resort",
    venueAddress: "Visakhapatnam, Andhra Pradesh, India",
    venueMapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
    venueEmbedUrl: "https://www.google.com/maps?q=Aarif%20Seaside%20Resort%2C%20Visakhapatnam&output=embed",
    stays: [
      {
        name: "Hotel FantaSea",
        note: "Comfortable stay for our guests.",
        mapLink: "https://maps.app.goo.gl/t9wvFRQ3nxergAsVA",
      },
    ],
    nearbyMalls: [
      { name: "CMR Central Mall", mapLink: "https://maps.app.goo.gl/A8icEosB1jrsTcJ9A" },
    ],
    attractions: [
      {
        name: "Incredible India — Visakhapatnam",
        description: "The official tourism guide to beaches, temples, museums and viewpoints around Vizag.",
        website: "https://www.incredibleindia.gov.in/en/andhra-pradesh/visakhapatnam",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // 12. FAQ
  // --------------------------------------------------------------------------
  faq: {
    title: "Good to Know",
    subtitle: "Answers to the questions guests ask us most.",
    questions: [
      // tier: "full" = only 3-day guests see it, tier: "wedding" = only wedding-day guests, no tier = everyone
      { tier: "full", title: "Where will the celebrations happen?", content: "All functions are at Aarif Seaside Resort, Visakhapatnam. The Events page has a map button for each one." },
      { tier: "wedding", title: "Where is the wedding?", content: "At Aarif Seaside Resort, Visakhapatnam, on Wednesday 2 December 2026 from 7:30 PM. The Events page has a map button." },
      { tier: "full", title: "What should I wear?", content: "The dress idea for every function is written on the Events page. Comfortable traditional clothes are perfect." },
      { tier: "wedding", title: "What should I wear?", content: "Traditional Indian wear is perfect for the evening." },
      { tier: "full", title: "How do I confirm that I am coming?", content: "Open the RSVP page and fill in the short form — your name, number, how many of you are coming, when you arrive and whether you need a room." },
      { tier: "wedding", title: "How do I confirm that I am coming?", content: "Open the RSVP page and fill in the short form — your name, number, how many of you are coming, when you arrive and whether you need a room. It takes less than a minute." },
      { title: "I need to change my RSVP. What do I do?", content: "No problem. Fill the RSVP form again with the same mobile number. Your new answer replaces the old one." },
      { title: "How do I share my photos?", content: "Scan the wedding QR code or open the Photos page, choose the celebration, and add your photos. No login and no caption needed." },
      { title: "How can I find photos of myself?", content: "On the Photos page, open the Gallery and tap 'Find my photos'. Take a quick selfie and we will show the photos you are in. Your selfie stays on your phone and is never saved." },
      { title: "How can I send my blessings?", content: "Open the Digital Blessings page and write a few words for us. Your love and good wishes are the only gift we ask for." },
    ],
  },

  footer: {
    tagline: "With love, laughter and the blessings of our families.",
    // The bond line at the bottom, with a hashtag on each side
    bondLeft: "Shivangi",
    bondRight: "Shrijeet",
    hashtagLeft: "#jeetugotshibu",
    hashtagRight: "#u2bethere",
  },

  app: {
    name: "Shrijeet & Shivangi — Wedding",
    description: "The wedding invitation of Shrijeet & Shivangi — Visakhapatnam, 2 December 2026.",
  },
};

export default siteConfig;
