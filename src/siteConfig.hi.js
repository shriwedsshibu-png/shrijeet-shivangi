// ============================================================================
//  HINDI WORDS for the Hindi invite links (…/hindi). Shown only to guests who
//  opened a Hindi link. Everything not written here stays as in siteConfig.js.
//  Edit the Hindi words between the "quotation marks" the same way as siteConfig.js.
//  Do NOT add English event names, codes or links here; those stay in siteConfig.js.
// ============================================================================

const hi = {
  inviteFamily: {
    groom: {
      heading: "आकांक्षी",
      groups: [
        ["सुधीर कुमार मिश्रा", "शशि भूषण मिश्रा", "आलोक मिश्रा", "अवलोक कुमार मिश्रा", "अद्वैत"],
      ],
      closing: "समस्त मिश्रा परिवार",
    },
    bride: {
      heading: "आकांक्षी",
      groups: [
        ["सत्येन्द्र कुमार", "ज्ञानेन्द्र सौरव", "ऋषभ एवं रियांश"],
      ],
      closing: "समस्त परिवार",
    },
  },

  guestTiers: {
    full: { dateLine: "30 नवंबर – 2 दिसंबर 2026" },
    wedding: {
      dateLine: "बुधवार, 2 दिसंबर 2026",
      eventsSubtitle: "समुद्र किनारे वरमाला और पवित्र फेरों में हमारे साथ शामिल हों।",
    },
  },

  features: {
    events:    { label: "कार्यक्रम" },
    rsvp:      { label: "आने की पुष्टि" },
    photos:    { label: "फ़ोटो" },
    blessings: { label: "आशीर्वाद" },
    ourStory:  { label: "हमारी कहानी" },
    families:  { label: "हमारे परिवार" },
    invite:    { label: "निमंत्रण पत्र" },
    travel:    { label: "विशाखापत्तनम" },
    faq:       { label: "सामान्य प्रश्न" },
  },

  couple: {
    name1: "शिवांगी",
    name2: "श्रीजीत",
    fullName1: "शिवांगी प्रिया",
    fullName2: "श्रीजीत मिश्रा",
    displayName: "शिवांगी एवं श्रीजीत",
  },

  wedding: {
    dateLine: "30 नवंबर – 2 दिसंबर 2026",
    city: "विशाखापत्तनम",
    venueName: "आरिफ़ सीसाइड रिज़ॉर्ट",
  },

  homepage: {
    invitationTop: "पूज्य बड़ों के आशीर्वाद से, हम आपको सादर आमंत्रित करते हैं",
    invitationBottom: "आपकी उपस्थिति हमारा सौभाग्य होगी और आपका आशीर्वाद हमारा सबसे अनमोल उपहार।",
    // The invitation page of the invite (traditional card wording). The sentence runs:
    //   [request] <name> (सुपुत्री …) संग <name> (सुपुत्र …) [closing]
    inviteCard: {
      blessingsLabel: "पूज्य बड़ों के आशीर्वाद से",
      request: "दोनों परिवार सहर्ष आपको",
      brideLine: "सुपुत्री",
      brideParents: "श्रीमती अंजू कुमारी & श्री शैलेन्द्र कुमार",
      groomLine: "सुपुत्र",
      groomParents: "श्रीमती सुजाता मिश्रा & श्री सुशील कुमार मिश्रा",
      closing: "के शुभ विवाह के पावन अवसर पर सादर आमंत्रित करते हैं।",
      // Shrijeet's side: Dadi's invitation
      groomSide: {
        blessingsLabel: "ईश्वर की असीम कृपा एवं आशीर्वाद से",
        request: "श्रीमती जगतारन देवी अपने सबसे छोटे पौत्र",
        closing: "के शुभ विवाह के पावन अवसर पर आपको सादर आमंत्रित करती हैं।",
      },
    },
    countdownPoem: "दो दिल, दो परिवार, एक सुंदर शुरुआत।",
  },

  events: {
    title: "हमारे संग उत्सव मनाइए",
    subtitle: "सभी कार्यक्रम समुद्र किनारे एक ही सुंदर स्थान पर होंगे।",
    // same order as siteConfig.js (Faldaan, Mehndi, Engagement & Sangeet, Haldi, Varmala & Shaadi)
    events: [
      { timeHi: "शाम 6:00 बजे", dressCode: "सेमी-फ़ॉर्मल", description: "आशीर्वाद भरी एक शाम, जब हमारे दोनों परिवार एक होंगे।" },
      { timeHi: "सुबह 8:30 बजे", dressCode: "हरे रंग के परिधान", description: "मेहंदी, रंग, हँसी और गीतों से सजी एक सुबह।" },
      { timeHi: "शाम 6:30 बजे", dressCode: "इंडो-वेस्टर्न", description: "संगीत, नृत्य और पारिवारिक प्रस्तुतियों की एक शाम।" },
      { timeHi: "सुबह 8:30 बजे", dressCode: "नीले और पीले रंग", description: "हल्दी, आशीर्वाद और हँसी-ख़ुशी से भरी एक सुबह।" },
      { timeHi: "शाम 7:30 बजे से", dressCode: "पारंपरिक परिधान", description: "वरमाला, पवित्र फेरे और सात वचन — जीवन भर के साथ की शुरुआत।" },
    ],
  },

  rsvp: {
    title: "कृपया अपने आने की पुष्टि करें",
    subtitle: "बस कुछ आसान जानकारी — आप कितने लोग आ रहे हैं, कब पहुँचेंगे और क्या आपको कमरा चाहिए। इसी मोबाइल नंबर से आप कभी भी अपना उत्तर बदल सकते हैं।",
    weddingSubtitle: "बस कुछ आसान जानकारी — आप कितने लोग आ रहे हैं, कब पहुँचेंगे और क्या आपको कमरा चाहिए। इसी मोबाइल नंबर से आप कभी भी अपना उत्तर बदल सकते हैं।",
  },

  photos: {
    title: "यादें बाँटें, यादें सँजोएँ",
    subtitle: "समारोह की अपनी फ़ोटो यहाँ जोड़ें और सबकी फ़ोटो देखें। एक सेल्फ़ी से अपनी फ़ोटो ढूँढें।",
    ourPhotosLabel: "शिवांगी एवं श्रीजीत",
  },

  blessings: {
    title: "आशीर्वाद",
    subtitle: "आपका स्नेह और आशीर्वाद ही हमारे लिए सबसे अनमोल उपहार है।",
    blessingHeading: "अपना आशीर्वाद लिखें",
    blessingHint: "वर-वधू के लिए कुछ शुभ शब्द, प्रार्थना या कोई याद लिखें।",
  },

  families: {
    title: "हमारे परिवार",
    subtitle: "परिवारजनों के स्नेह और आशीर्वाद के साथ, हम विवाह समारोह में आपकी उपस्थिति की कामना करते हैं।",
    shrijeet: [
      { name: "जगतारन देवी", relation: "दादी" },
      { name: "सुशील कुमार मिश्रा", relation: "पापा" },
      { name: "सुजाता मिश्रा", relation: "मम्मी" },
      { name: "सृष्टि कुमारी", relation: "बहन" },
      { name: "शिव चन्द्र सिंह", relation: "नाना" },
      { name: "प्रभा देवी", relation: "नानी" },
      { name: "सुधीर कुमार मिश्रा", relation: "बड़े पापा" },
      { name: "आभा मिश्रा", relation: "बड़ी मम्मी" },
      { name: "शशि भूषण मिश्रा", relation: "बड़े पापा" },
      { name: "किरण मिश्रा", relation: "बड़ी मम्मी" },
      { name: "आलोक मिश्रा", relation: "भैया" },
      { name: "सीमा रानी शर्मा", relation: "भाभी" },
      { name: "अवलोक कुमार मिश्रा", relation: "भैया" },
      { name: "अनुराधा", relation: "भाभी" },
      { name: "रानी", relation: "दीदी" },
      { name: "पंकज ठाकुर", relation: "जीजू" },
      { name: "रूबी मिश्रा", relation: "दीदी" },
      { name: "अभिषेक शर्मा", relation: "जीजू" },
      { name: "प्रज्ञा ठाकुर", relation: "भांजी" },
      { name: "रावी ठाकुर", relation: "भांजी" },
      { name: "अद्वैत मिश्रा", relation: "भतीजा" },
      { name: "सान्वी मिश्रा", relation: "भतीजी" },
    ],
    shivangi: [
      { name: "शैलेन्द्र कुमार", relation: "पापा" },
      { name: "अंजू कुमारी", relation: "मम्मी" },
      { name: "ज्ञानेन्द्र सौरव", relation: "भाई" },
      { name: "मदन शर्मा", relation: "नाना" },
      { name: "अहिल्या देवी", relation: "नानी" },
      { name: "सत्येन्द्र कुमार", relation: "चाचा" },
      { name: "भारती देवी", relation: "चाची" },
      { name: "संगीता कुमारी", relation: "दीदी" },
      { name: "सुधांशु शेखर", relation: "जीजू" },
      { name: "ऋषभ", relation: "भांजा" },
      { name: "रियांश", relation: "भांजा" },
      { name: "नेहा कुमारी", relation: "बहन" },
      { name: "किशन कुमार", relation: "भाई" },
      { name: "सारिका प्रिया", relation: "बहन" },
    ],
  },

  travel: {
    title: "विशाखापत्तनम घूमें",
    subtitle: "कहाँ ठहरें, कहाँ ख़रीदारी करें, और विशाखापत्तनम में देखने लायक कुछ सुंदर जगहें।",
  },

  faq: {
    title: "ज़रूरी जानकारी",
    subtitle: "मेहमानों के अक्सर पूछे जाने वाले प्रश्नों के उत्तर।",
    questions: [
      { tier: "full", title: "समारोह कहाँ होंगे?", content: "सभी कार्यक्रम आरिफ़ सीसाइड रिज़ॉर्ट, विशाखापत्तनम में होंगे। ‘कार्यक्रम’ पेज पर हर कार्यक्रम के लिए नक्शे का बटन है।" },
      { tier: "wedding", title: "विवाह कहाँ है?", content: "आरिफ़ सीसाइड रिज़ॉर्ट, विशाखापत्तनम में, बुधवार 2 दिसंबर 2026 को शाम 7:30 बजे से। ‘कार्यक्रम’ पेज पर नक्शे का बटन है।" },
      { tier: "full", title: "क्या पहनें?", content: "हर कार्यक्रम का पहनावा ‘कार्यक्रम’ पेज पर लिखा है। आरामदायक पारंपरिक कपड़े सबसे अच्छे रहेंगे।" },
      { tier: "wedding", title: "क्या पहनें?", content: "शाम के लिए पारंपरिक भारतीय परिधान सबसे अच्छा रहेगा।" },
      { tier: "full", title: "अपने आने की पुष्टि कैसे करें?", content: "‘आने की पुष्टि’ पेज खोलें और छोटा-सा फ़ॉर्म भरें — आपका नाम, नंबर, कितने लोग आ रहे हैं, कब पहुँचेंगे और क्या आपको कमरा चाहिए।" },
      { tier: "wedding", title: "अपने आने की पुष्टि कैसे करें?", content: "‘आने की पुष्टि’ पेज खोलें और छोटा-सा फ़ॉर्म भरें — आपका नाम, नंबर, कितने लोग आ रहे हैं, कब पहुँचेंगे और क्या आपको कमरा चाहिए। इसमें एक मिनट से भी कम लगता है।" },
      { title: "उत्तर बदलना है, क्या करें?", content: "कोई बात नहीं। उसी मोबाइल नंबर से फ़ॉर्म फिर से भरें। नया उत्तर पुराने की जगह ले लेगा।" },
      { title: "अपनी फ़ोटो कैसे भेजें?", content: "विवाह का QR कोड स्कैन करें या ‘फ़ोटो’ पेज खोलें, कार्यक्रम चुनें और अपनी फ़ोटो जोड़ें। कोई लॉग-इन नहीं चाहिए।" },
      { title: "अपनी फ़ोटो कैसे ढूँढें?", content: "‘फ़ोटो’ पेज पर गैलरी खोलें और ‘Find my photos’ दबाएँ। एक सेल्फ़ी लें, और जिन फ़ोटो में आप हैं, वे दिख जाएँगी। आपकी सेल्फ़ी आपके फ़ोन में ही रहती है, कहीं सहेजी नहीं जाती।" },
      { title: "अपना आशीर्वाद कैसे भेजें?", content: "‘आशीर्वाद’ पेज खोलें और हमारे लिए कुछ शब्द लिखें। आपका स्नेह और शुभकामनाएँ ही हमारे लिए सबसे बड़ा उपहार हैं।" },
    ],
  },

  footer: {
    tagline: "स्नेह, ख़ुशियों और परिवार के आशीर्वाद के साथ।",
    bondLeft: "शिवांगी",
    bondRight: "श्रीजीत",
  },

  app: {
    name: "शिवांगी एवं श्रीजीत — शुभ विवाह",
  },
};

// Lays the Hindi words over siteConfig (lists of people / questions are replaced whole;
// the events list is matched one by one, so dates, times and names used by the RSVP stay the same).
function merge(base, over) {
  Object.keys(over).forEach((k) => {
    const o = over[k];
    const b = base[k];
    if (Array.isArray(o)) {
      if (k === 'events' && Array.isArray(b)) o.forEach((x, i) => { if (b[i]) Object.assign(b[i], x); });
      else base[k] = o;
    } else if (o && typeof o === 'object') {
      if (!b || typeof b !== 'object') base[k] = {};
      merge(base[k], o);
    } else {
      base[k] = o;
    }
  });
  return base;
}

export function applyHindi(siteConfig) {
  return merge(siteConfig, hi);
}
