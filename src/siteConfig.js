// Shivangi & Shrijeet — Wedding Website Configuration

const siteConfig = {
  weddingType: "hindu",

  features: {
    homepage: { enabled: true, label: "Home" },
    rsvp: { enabled: true, label: "RSVP" },
    ourStory: { enabled: true, label: "Our Story" },
    events: { enabled: true, label: "Events" },
    photoGallery: { enabled: true, label: "Gallery" },
    uploadPhotos: { enabled: true, label: "Share Your Moments" },
    blessings: { enabled: true, label: "Digital Blessings" },
    families: { enabled: true, label: "Our Families" },
    tokenOfLove: { enabled: true, label: "A Token of Love" },
    travel: { enabled: true, label: "Explore Vizag" },
    faq: { enabled: true, label: "FAQ" },
  },

  couple: {
    name1: "Shrijeet",
    name2: "Shivangi",
    displayName: "Shivangi & Shrijeet",
    name1Image: "/images/shrijeet.jpg",
    name2Image: "/images/shivangi.jpg",
  },

  wedding: {
    date: "2026-12-02T21:00:00+05:30",
    location: "Aarif Seaside Resort, Visakhapatnam, India",
    mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
  },

  homepage: {
    title: "Shivangi & Shrijeet",
    subtitle: "With the blessings of our families, we invite you to celebrate, share and be a part of our special moments.",
    ctaButton: "Share Your Moments",
    backgroundImage: "/images/our-image.jpg",
    showCountdown: true,
  },

    ourStory: {
    partner1Story: {
      name: "Shrijeet's Story",
      image: "/images/shrijeet.jpg",
      story: `From a Basketball Court to Forever.

I still remember the first time I saw you. You were playing for the CUCEK basketball team, and somehow, amidst everything happening around us, you caught my attention. There was an immediate sense of attraction and awe that I couldn't quite explain then. I was fortunate enough that, despite both of us being rather introverted, we managed to exchange a little wave and eventually a few words.

And then came our wonderfully silly conversations.

Phones weren't allowed, so I found my own little ways of trying to get your attention. Messages in the morning, messages at night, and plenty of messages in between that probably made very little sense — but I would find some excuse, any excuse, to talk to you.

Days became weeks, weeks became months, and somehow, even while being in Kochi, we could barely manage to meet.

I remember one day deciding to cycle all the way to your college. I didn't even have a bike then, but apparently that wasn't enough of a reason to stay away. Somewhere along the way, those outings to cafés and Alleppey beach, the lighthouse, and all those conversations that weren't officially called \"dates\" became some of the memories I treasure most.

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
      title: "How We Met",
      story: "Somewhere along the way, two people became a family, and a journey that began with two separate lives slowly became one shared future.",
    },
    memories: {
      intro: "A few special moments from our journey together.",
      images: [
        "/images/our-image.jpg",
        "/images/our2.jpg",
        "/images/shrijeet.jpg",
        "/images/shivangi.jpg",
      ],
    },
    milestones: [],
    backgroundImage: "/images/our2.jpg",
  },

  events: {
    title: "Celebrate With Us",
    subtitle: "Five cherished celebrations, leading to our wedding day in Visakhapatnam.",
    mapLinkLabel: "Open location in Google Maps",
    events: [
      {
        id: 1,
        name: "Faldaan",
        date: "2026-11-30",
        time: "06:00 PM",
        venue: "Aarif Seaside Resort, Visakhapatnam, India",
        mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
        dressCode: "Semi-formal",
        description: "Join us for our introduction ceremony.",
        category: "pre-wedding",
      },
      {
        id: 2,
        name: "Mehndi",
        date: "2026-12-01",
        time: "08:30 AM",
        venue: "Aarif Seaside Resort, Visakhapatnam, India",
        mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
        dressCode: "Traditional",
        description: "A morning of henna, colour and celebration.",
        category: "pre-wedding",
      },
      {
        id: 3,
        name: "Engagement & Sangeet",
        date: "2026-12-01",
        time: "06:30 PM",
        venue: "Aarif Seaside Resort, Visakhapatnam, India",
        mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
        dressCode: "Party Wear",
        description: "An evening of music, dance and family performances.",
        category: "wedding",
      },
      {
        id: 4,
        name: "Haldi",
        date: "2026-12-02",
        time: "08:30 AM",
        venue: "Aarif Seaside Resort, Visakhapatnam, India",
        mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
        dressCode: "Traditional",
        description: "A joyful morning of haldi and blessings.",
        category: "wedding",
      },
      {
        id: 5,
        name: "Varmaala & Wedding Ceremony",
        date: "2026-12-02",
        time: "07:30 PM",
        venue: "Aarif Seaside Resort, Visakhapatnam, India",
        mapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
        dressCode: "Traditional",
        description: "Varmaala ceremony followed by the main wedding ceremony.",
        category: "wedding",
      },
    ],
  },

  photoGallery: {
    title: "Wedding Gallery",
    subtitle: "Our photographs together with the moments captured and shared by family and friends.",
    showUploadedPhotos: true,
    staticPhotos: [
      "/images/our-image.jpg",
      "/images/our2.jpg",
      "/images/shrijeet.jpg",
      "/images/shivangi.jpg",
    ],
    enableFiltering: true,
    enableDownload: true,
  },

  uploadPhotos: {
    title: "Share Your Moments",
    subtitle: "Choose the celebration and upload your photographs. No caption, no account — just the moments you want us to remember.",
    backgroundImage: "/images/our2.jpg",
    maxFileSize: 10,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    requireCategory: true,
  },

  blessings: {
    title: "Digital Blessings",
    subtitle: "Your words, wishes and blessings will become a part of the memories we carry with us forever.",
    backgroundImage: "/images/our2.jpg",
    showAllBlessings: false,
    enableSearch: false,
    enableLikes: false,
  },

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
        name: "Sudhir Kumar Mishra Hon(Lt) (Retd)",
        relation: "Bade Papa"
      },
      {
        name: "S",
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
        name: "Rani Sharma",
        relation: "Didi"
      },
      {
        name: "Pankaj Sharma",
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
    shivangi: [
      {
        name: "Father's Name Go Here",
        relation: "Father of the Bride"
      },
      {
        name: "Mother's Name Go Here",
        relation: "Mother of the Bride"
      },
      {
        name: "Sibling or Elder Name (Optional)",
        relation: "Brother / Sister / Elder"
      }
    ],
  },



  tokenOfLove: {
  title: "A Token of Love",
  subtitle: "Your presence and blessings are the greatest gifts we could ask for.",
  message: "If you would still like to bless us with a token of love, you may do so here.",
  upiId: "yourname@upi", // 1. Paste your exact UPI ID string here (e.g. shrijeet@okaxis)
  upiName: "Shivangi & Shrijeet",
  upiQrImage: "/images/upi-qr.jpg", // 2. Place your physical QR image inside public/images/
  amazonGiftCardUrl: "https://amazon.in", // 3. Corrected production link
},


  rsvp: {
    title: "Confirm You Are Coming",
    subtitle: "A few details will help us plan meals, rooms and cabs comfortably for everyone.",
  },

  travel: {
    title: "Explore Vizag",
    subtitle: "A little time around the celebrations? Here are a few places worth exploring.",
    venueName: "Aarif Seaside Resort",
    venueAddress: "Visakhapatnam, Andhra Pradesh, India",
    venueMapLink: "https://maps.app.goo.gl/1HVHEgr3f7jfm7fU7",
    venueEmbedUrl: "https://www.google.com/maps?q=Aarif%20Seaside%20Resort%2C%20Visakhapatnam&output=embed",
    attractions: [
      {
        name: "Incredible India — Visakhapatnam",
        description: "Official tourism guide to beaches, heritage, museums, viewpoints and places around Vizag.",
        website: "https://www.incredibleindia.gov.in/en/andhra-pradesh/visakhapatnam",
      },
    ],
    stays: [
      { name: "Hotel location", mapLink: "" },
      { name: "Bungalow location", mapLink: "" },
    ],
    photographerGalleryUrl: "",
  },

  faq: {
    title: "Frequently Asked Questions",
    subtitle: "A few useful details for the celebrations.",
    questions: [
      {
        title: "Where is the wedding?",
        content: "Our wedding celebrations will take place at Aarif Seaside Resort in Visakhapatnam.",
      },
      {
        title: "What should I wear?",
        content: "Dress codes for each celebration are mentioned on the Events page.",
      },
      {
        title: "How do I RSVP?",
        content: "Use the RSVP section and tell us who is coming, your arrival and departure details, whether accommodation or a cab is required, and any food requirements. This helps us plan your stay and meals.",
      },
      {
        title: "Can I change my RSVP later?",
        content: "Yes. You can submit the RSVP again with your updated details. Please use the same main guest name and WhatsApp number so we can identify the latest response.",
      },
      {
        title: "How do I upload photographs?",
        content: "Use Share Your Moments or scan the wedding QR code, choose the celebration and upload your photographs. No caption or account is required.",
      },
      {
        title: "Will photographs be sorted by celebration?",
        content: "Yes. Please choose the celebration while uploading. This lets us organise the guest gallery by Faldaan, Mehndi, Engagement & Sangeet, Haldi and Varmaala & Wedding Ceremony.",
      },
      {
        title: "How will I find my professional wedding photographs?",
        content: "After the wedding, we plan to add our photographer's face-search gallery here. You will be able to use that separate gallery to find photographs of yourself and download them.",
      },
      {
        title: "Can I share my photographs?",
        content: "Yes! Scan the QR code or use Share Your Moments on the website to upload photographs from the celebrations.",
      },
      {
        title: "How can I send my blessings?",
        content: "Use the Digital Blessings section to leave your wishes for Shivangi & Shrijeet.",
      },
    ],
  },

  navigation: {
    mobileBottom: ["home", "rsvp", "events", "uploadPhotos", "photoGallery"],
  },

  footer: {
    tagline: "With love, laughter and the blessings of our families.",
    socialMedia: {
      instagram: "https://instagram.com/sharmashivangi31",
    },
  },

  app: {
    name: "Shivangi & Shrijeet Wedding",
    shortName: "Shivangi & Shrijeet",
    description: "The digital wedding hub of Shivangi & Shrijeet",
  },
};

export default siteConfig;
