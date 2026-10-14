(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KVSI18n = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var STR = {
    "lang.bn": { "bn-IN": "বাংলা", "en-IN": "বাংলা", "hi-IN": "বাংলা" },
    "lang.en": { "bn-IN": "English", "en-IN": "English", "hi-IN": "English" },
    "lang.hi": { "bn-IN": "हिन्दी", "en-IN": "हिन्दी", "hi-IN": "हिन्दी" },
    "skip": { "bn-IN": "মূল বিষয়ে যান", "en-IN": "Skip to content", "hi-IN": "मुख्य विषय पर जाएँ" },
    "brand.event": { "bn-IN": "কারিগর বিজয়া সম্মিলনী ২০২৬", "en-IN": "Karigar Vijay Sammelan 2026", "hi-IN": "कारीगर विजया सम्मेलन २०२६" },
    "hero.kicker": { "bn-IN": "প্রত্যাবর্তন", "en-IN": "Protyabortan", "hi-IN": "प्रत्यावर्तन" },
    "hero.line1": { "bn-IN": "আপনার হাতে গড়ে উঠেছে প্রত্যাবর্তন।", "en-IN": "Protyabortan was built by your hands.", "hi-IN": "प्रत्यावर्तन आपके हाथों से बना है।" },
    "hero.line2": { "bn-IN": "এবার আপনাদের সম্মানে আমাদের বিজয়া সম্মিলনী।", "en-IN": "This Vijay Sammelan is in your honour.", "hi-IN": "यह विजया सम्मेलन आपके सम्मान में है।" },
    "hero.support": {
      "bn-IN": "প্রত্যাবর্তন দুর্গাপুজোর মণ্ডপ নির্মাণ, সাজসজ্জা, কাঠামো, ফ্যাব্রিকেশন, ফিনিশিং ও আলোকসজ্জার কাজে যুক্ত কারিগরদের জন্য এই বিশেষ আয়োজন। আপনার নাম ও ছবি দিয়ে সহজে রেজিস্ট্রেশন করুন—কথা বলে অথবা লিখে।",
      "en-IN": "This gathering is for the workers who built, fabricated, decorated, finished and lit the Protyabortan pandal. Register with your name and photo — by speaking or by typing.",
      "hi-IN": "यह आयोजन उन कारीगरों के लिए है जिन्होंने प्रत्यावर्तन का मंडप बनाया, सजाया, पूरा किया और रोशन किया। नाम और फोटो के साथ बोलकर या लिखकर पंजीकरण करें।"
    },
    "hero.photoAlt": {
      "bn-IN": "মুনশিভেরিতে বাঁশের কাঠামো বাঁধছেন একজন কারিগর। প্রত্যাবর্তন দুর্গাপুজো ২০২৬।",
      "en-IN": "A worker tying the bamboo frame at Munshi Bheri, Protyabortan Durga Puja 2026.",
      "hi-IN": "मुंशी भेरी में बाँस का ढाँचा बाँधते एक कारीगर। प्रत्यावर्तन दुर्गा पूजा २०२६।"
    },
    "hero.photoCaption": {
      "bn-IN": "মুনশিভেরিতে বাঁশের কাঠামোর কাজ।",
      "en-IN": "Bamboo frame work at Munshi Bheri.",
      "hi-IN": "मुंशी भेरी में बाँस के ढाँचे का काम।"
    },
    "cta.voice": { "bn-IN": "কারিগর সাথীর সঙ্গে কথা বলে রেজিস্ট্রেশন করুন", "en-IN": "Register by speaking with Karigar Saathi", "hi-IN": "कारीगर साथी के साथ बोलकर पंजीकरण करें" },
    "cta.type": { "bn-IN": "লিখে রেজিস্ট্রেশন করুন", "en-IN": "Register by typing", "hi-IN": "लिखकर पंजीकरण करें" },
    "cta.help": { "bn-IN": "রেজিস্ট্রেশন করতে সাহায্য চাই", "en-IN": "I need help to register", "hi-IN": "पंजीकरण में मदद चाहिए" },
    "saathi.name": { "bn-IN": "কারিগর সাথী", "en-IN": "Karigar Saathi", "hi-IN": "कारीगर साथी" },
    "saathi.role": { "bn-IN": "আপনার পাশে থাকা বাংলাভাষী রেজিস্ট্রেশন সহকারী", "en-IN": "The Bengali-speaking registration helper beside you", "hi-IN": "आपके पास रहने वाला बांग्ला बोलने वाला पंजीकरण सहायक" },
    "hero.durgaAlt": { "bn-IN": "প্রত্যাবর্তনের ২০২৫ মহোৎসবে মা দুর্গা ও সঙ্গী দেবদেবী। মুখ ও মূর্তি পুরো দেখা যাচ্ছে।", "en-IN": "Maa Durga and the accompanying deities at the 2025 Protyabortan mahotsav. The faces and figures are shown in full.", "hi-IN": "प्रत्यावर्तन के २०२५ महोत्सव में माँ दुर्गा और साथी देवता। मुख और मूर्ति पूरी दिख रही है।" },
    "hero.durgaCaption": { "bn-IN": "প্রত্যাবর্তন মহোৎসব ২০২৫-এর মা দুর্গা। এই ছবি সম্মানের জন্য।", "en-IN": "Maa Durga from the 2025 Protyabortan mahotsav, shown with respect.", "hi-IN": "प्रत्यावर्तन महोत्सव २०२५ की माँ दुर्गा। यह चित्र सम्मान के लिए है।" },
    "story.title": { "bn-IN": "আপনাদের হাতেই তৈরি", "en-IN": "Built by your hands", "hi-IN": "आपके हाथों से बना" },
    "story.decorAlt": { "bn-IN": "মণ্ডপের সাজের কাজ করছেন কারিগরেরা।", "en-IN": "Workers putting up pandal decorations.", "hi-IN": "कारीगर मंडप की सजावट लगा रहे हैं।" },
    "story.decorCaption": { "bn-IN": "মণ্ডপের সাজসজ্জার কাজ।", "en-IN": "Decoration work on the pandal.", "hi-IN": "मंडप की सजावट का काम।" },
    "steps.title": { "bn-IN": "রেজিস্ট্রেশন খুব সহজ", "en-IN": "Registration is simple", "hi-IN": "पंजीकरण बहुत आसान है" },
    "steps.oneTitle": { "bn-IN": "১. কথা বলুন বা লিখুন", "en-IN": "1. Speak or type", "hi-IN": "१. बोलें या लिखें" },
    "steps.one": { "bn-IN": "কারিগর সাথী একটা একটা প্রশ্ন করবেন। মুখে বলুন, অথবা লিখুন।", "en-IN": "Karigar Saathi asks one question at a time. Speak, or type.", "hi-IN": "कारीगर साथी एक-एक सवाल पूछेंगे। बोलें, या लिखें।" },
    "steps.twoTitle": { "bn-IN": "২. তথ্য মিলিয়ে নিন", "en-IN": "2. Check the details", "hi-IN": "२. जानकारी मिला लें" },
    "steps.two": { "bn-IN": "নাম, নম্বর ও কাজের কথা আপনি দেখে ঠিক বলবেন।", "en-IN": "You will see your name, number and work, and say if they are right.", "hi-IN": "नाम, नंबर और काम की बात आप देखकर ठीक बताएँगे।" },
    "steps.threeTitle": { "bn-IN": "৩. ছবি ও সম্মতি", "en-IN": "3. Photo and consent", "hi-IN": "३. तस्वीर और सहमति" },
    "steps.three": { "bn-IN": "ছবি এখন দিতে পারেন, বা পরে আয়োজকের সাহায্যে দিতে পারেন। ছবি প্রকাশ আলাদা অনুমতি।", "en-IN": "You can give a photo now, or later with an organiser's help. Publishing a photo needs separate permission.", "hi-IN": "तस्वीर अभी दे सकते हैं, या बाद में आयोजक की मदद से। तस्वीर छापना अलग अनुमति है।" },
    "facts.dateLabel": { "bn-IN": "তারিখ", "en-IN": "Date", "hi-IN": "तारीख" },
    "facts.date": { "bn-IN": "রবিবার, ১ নভেম্বর ২০২৬", "en-IN": "Sunday, 1 November 2026", "hi-IN": "रविवार, १ नवम्बर २०२६" },
    "facts.venueLabel": { "bn-IN": "স্থান", "en-IN": "Venue", "hi-IN": "स्थान" },
    "facts.venue": {
      "bn-IN": "প্রত্যাবর্তন দুর্গাপুজোর একই অনুষ্ঠানস্থল, মুনশিভেরি, মহিষবাথান, সল্টলেক সেক্টর V, কলকাতা 700102",
      "en-IN": "The Protyabortan Durga Puja venue, Munshi Bheri, Mahish Bathan, Salt Lake Sector V, Kolkata 700102",
      "hi-IN": "प्रत्यावर्तन दुर्गा पूजा का वही स्थल, मुंशी भेरी, महिषबाथान, साल्ट लेक सेक्टर V, कोलकाता 700102"
    },
    "facts.orgLabel": { "bn-IN": "আয়োজক", "en-IN": "Organisers", "hi-IN": "आयोजक" },
    "facts.org": { "bn-IN": "KarmYog for the 21st Century এবং Bharatiya Krishak Samaj", "en-IN": "KarmYog for the 21st Century and Bharatiya Krishak Samaj", "hi-IN": "KarmYog for the 21st Century और Bharatiya Krishak Samaj" },
    "facts.timeNote": { "bn-IN": "অনুষ্ঠানের সময় আয়োজক দল পরে জানাবে। পুজোর দিন ১৬–২০ অক্টোবর ২০২৬। এই সম্মিলনী তার পর, ১ নভেম্বর।", "en-IN": "The organisers will share the programme time later. The Puja days are 16–20 October 2026. This gathering is after that, on 1 November.", "hi-IN": "कार्यक्रम का समय आयोजक बाद में बताएँगे। पूजा के दिन १६–२० अक्टूबर २०२६ हैं। यह सम्मेलन उसके बाद, १ नवम्बर को है।" },
    "trust.short": {
      "bn-IN": "আপনার তথ্য শুধু রেজিস্ট্রেশন, পরিচয় যাচাই ও অনুষ্ঠানের ব্যবস্থাপনার কাজে ব্যবহার করা হবে। আপনার অনুমতি ছাড়া আপনার ছবি প্রকাশ করা হবে না।",
      "en-IN": "Your details are used only for registration, identity checks and running the event. Your photo will not be published without your permission.",
      "hi-IN": "आपकी जानकारी केवल पंजीकरण, पहचान जाँच और आयोजन के लिए है। बिना अनुमति आपकी तस्वीर प्रकाशित नहीं होगी।"
    },
    "trust.link": { "bn-IN": "গোপনীয়তার পুরো কথা পড়ুন", "en-IN": "Read the full privacy notice", "hi-IN": "पूरी गोपनीयता सूचना पढ़ें" },
    "footer.tagline": { "bn-IN": "Roots · Possibility · Prosperity", "en-IN": "Roots · Possibility · Prosperity", "hi-IN": "Roots · Possibility · Prosperity" },
    "progress": { "bn-IN": "ধাপ {n} / {total}", "en-IN": "Step {n} / {total}", "hi-IN": "चरण {n} / {total}" },
    "mode.voice": { "bn-IN": "কথা বলুন", "en-IN": "Speak", "hi-IN": "बोलें" },
    "mode.chat": { "bn-IN": "লিখে বলুন", "en-IN": "Type", "hi-IN": "लिखें" },
    "actions.ok": { "bn-IN": "ঠিক আছে", "en-IN": "That's right", "hi-IN": "ठीक है" },
    "actions.change": { "bn-IN": "পরিবর্তন করুন", "en-IN": "Change it", "hi-IN": "बदलें" },
    "actions.type": { "bn-IN": "লিখে দিন", "en-IN": "Type it", "hi-IN": "लिख दें" },
    "actions.help": { "bn-IN": "সাহায্য চাই", "en-IN": "I need help", "hi-IN": "मदद चाहिए" },
    "actions.back": { "bn-IN": "আগের ধাপ", "en-IN": "Previous step", "hi-IN": "पिछला चरण" },
    "actions.skip": { "bn-IN": "এখন বলব না", "en-IN": "Skip for now", "hi-IN": "अभी नहीं बताऊँगा" },
    "actions.unknown": { "bn-IN": "জানি না", "en-IN": "I don't know", "hi-IN": "पता नहीं" },
    "actions.editPrev": { "bn-IN": "আগের উত্তর বদলাতে চাই", "en-IN": "I want to change an earlier answer", "hi-IN": "पहले का जवाब बदलना है" },
    "actions.listen": { "bn-IN": "শুনুন", "en-IN": "Listen", "hi-IN": "सुनें" },
    "actions.stop": { "bn-IN": "থামুন", "en-IN": "Stop", "hi-IN": "रोकें" },
    "actions.repeat": { "bn-IN": "আবার বলুন", "en-IN": "Say it again", "hi-IN": "फिर बोलें" },
    "actions.startVoice": { "bn-IN": "হ্যাঁ, শুরু করুন", "en-IN": "Yes, start", "hi-IN": "हाँ, शुरू करें" },
    "actions.startType": { "bn-IN": "লিখে রেজিস্ট্রেশন করব", "en-IN": "I will type", "hi-IN": "मैं लिखूँगा" },
    "actions.helpOrg": { "bn-IN": "আয়োজকের সাহায্য চাই", "en-IN": "Ask an organiser for help", "hi-IN": "आयोजक से मदद माँगें" },
    "actions.submit": { "bn-IN": "রেজিস্ট্রেশন জমা দিন", "en-IN": "Submit registration", "hi-IN": "पंजीकरण जमा करें" },
    "actions.copy": { "bn-IN": "নম্বর কপি করুন", "en-IN": "Copy the number", "hi-IN": "नंबर कॉपी करें" },
    "actions.copied": { "bn-IN": "কপি হয়েছে", "en-IN": "Copied", "hi-IN": "कॉपी हो गया" },
    "mic.listening": { "bn-IN": "শুনছি… থামতে বোতাম চাপুন।", "en-IN": "Listening… press stop when you finish.", "hi-IN": "सुन रहे हैं… खत्म होने पर रोकें दबाएँ।" },
    "mic.working": { "bn-IN": "কথা লেখা হচ্ছে…", "en-IN": "Writing down what you said…", "hi-IN": "आपकी बात लिखी जा रही है…" },
    "recovery.none": { "bn-IN": "আপনার কথা শুনতে পাইনি। আবার বলবেন, নাকি লিখে দেবেন?", "en-IN": "I could not hear you. Will you say it again, or type it?", "hi-IN": "आपकी आवाज़ नहीं सुनाई दी। फिर बोलेंगे, या लिखेंगे?" },
    "recovery.unclear": { "bn-IN": "দুঃখিত, কথাটি পরিষ্কার বুঝতে পারিনি। আরেকবার ধীরে বলুন, অথবা এখানে লিখুন।", "en-IN": "Sorry, I could not understand clearly. Please say it slowly, or type it here.", "hi-IN": "माफ़ कीजिए, बात साफ़ नहीं समझ पाया। धीरे से फिर बोलें, या यहाँ लिखें।" },
    "recovery.offline": { "bn-IN": "এখন কথা শোনার সুবিধাটি কাজ করছে না। আপনি চাইলে এখানে লিখে রেজিস্ট্রেশন চালিয়ে যেতে পারেন।", "en-IN": "Speech is not available right now. You can keep registering by typing here.", "hi-IN": "अभी बोलकर सुनने की सुविधा काम नहीं कर रही। आप यहाँ लिखकर पंजीकरण जारी रख सकते हैं।" },
    "recovery.phoneSpeech": { "bn-IN": "ফোনের নিজের কথা-শোনা চালু করুন", "en-IN": "Use this phone's speech tool", "hi-IN": "फ़ोन की अपनी बोलने की सुविधा चालू करें" },
    "prompt.intro": {
      "bn-IN": "নমস্কার। প্রত্যাবর্তন কারিগর বিজয়া সম্মিলনীর রেজিস্ট্রেশন সহকারী বলছি। আমি আপনাকে সহজভাবে রেজিস্ট্রেশন করতে সাহায্য করব। আপনি মুখে উত্তর দিতে পারেন, অথবা চাইলে লিখেও দিতে পারেন। শুরু করব?",
      "en-IN": "Nomoskar. I am the registration helper for the Protyabortan Karigar Vijay Sammelan. I will help you register simply. You can answer by speaking, or by typing. Shall we start?",
      "hi-IN": "नमस्कार। मैं प्रत्यावर्तन कारीगर विजया सम्मेलन का पंजीकरण सहायक हूँ। मैं आपको आसानी से पंजीकरण करने में मदद करूँगा। आप बोलकर जवाब दे सकते हैं, या लिखकर। क्या शुरू करें?"
    },
    "prompt.name": { "bn-IN": "আপনার পুরো নামটি ধীরে ধীরে বলুন। আমি আপনার নামটি লিখে দেখাব, আপনি ঠিক আছে কি না জানাবেন।", "en-IN": "Please say your full name slowly. I will show it in writing, and you can tell me if it is right.", "hi-IN": "अपना पूरा नाम धीरे-धीरे बोलें। मैं उसे लिखकर दिखाऊँगा, आप बताएँगे कि ठीक है या नहीं।" },
    "prompt.mobile": { "bn-IN": "আপনার মোবাইল নম্বরটি একবারে বা দুই-তিনটি সংখ্যার ভাগে বলুন। আমি নম্বরটি লিখে দেখাব, তারপর আপনি মিলিয়ে নেবেন।", "en-IN": "Say your mobile number all at once, or in groups of two or three digits. I will show it, then you can check it.", "hi-IN": "अपना मोबाइल नंबर एक साथ या दो-तीन अंकों के समूह में बोलें। मैं नंबर लिखकर दिखाऊँगा, फिर आप मिला लें।" },
    "prompt.locality": { "bn-IN": "আপনি কোন পাড়া, গ্রাম বা এলাকায় থাকেন? জায়গাটার নাম বলুন।", "en-IN": "Which neighbourhood, village or area do you live in? Say the place name.", "hi-IN": "आप किस मोहल्ले, गाँव या इलाके में रहते हैं? जगह का नाम बोलें।" },
    "prompt.post": { "bn-IN": "পোস্ট অফিসের নাম জানালে বলুন। না জানলে ‘জানি না’ বলতে পারেন।", "en-IN": "If you know the post office, say it. If not, you can say you don't know.", "hi-IN": "डाकघर का नाम पता हो तो बोलें। नहीं पता तो ‘पता नहीं’ कह सकते हैं।" },
    "prompt.ps": { "bn-IN": "থানা বা ব্লকের নাম জানালে বলুন। না জানলে ‘জানি না’ বলতে পারেন।", "en-IN": "If you know the police station or block, say it. If not, you can skip.", "hi-IN": "थाना या ब्लॉक का नाम पता हो तो बोलें। नहीं तो छोड़ सकते हैं।" },
    "prompt.district": { "bn-IN": "আপনার জেলার নাম বলুন।", "en-IN": "Please say your district.", "hi-IN": "अपने जिले का नाम बोलें।" },
    "prompt.pin": { "bn-IN": "পিন কোড জানলে বলুন। না জানলে এড়িয়ে যেতে পারেন।", "en-IN": "Say the PIN code if you know it. You can skip it.", "hi-IN": "पिन कोड पता हो तो बोलें। नहीं तो छोड़ सकते हैं।" },
    "prompt.work": { "bn-IN": "প্রত্যাবর্তনের মণ্ডপে আপনি কী ধরনের কাজ করেছিলেন? যেমন বাঁশের কাঠামো, ফ্যাব্রিকেশন, সাজসজ্জা, রং বা ফিনিশিং, কিংবা আলোর কাজ। আপনি নিজের ভাষায় বলুন, অথবা নিচের কার্ড বেছে নিন।", "en-IN": "What kind of work did you do on the Protyabortan pandal? For example bamboo structure, fabrication, decoration, painting or finishing, or lighting. Say it in your own words, or tap the cards.", "hi-IN": "प्रत्यावर्तन के मंडप में आपने किस तरह का काम किया? जैसे बाँस का ढाँचा, फैब्रिकेशन, सजावट, रंग या फिनिशिंग, या लाइट का काम। अपने शब्दों में बोलें, या कार्ड चुनें।" },
    "prompt.workDetail": { "bn-IN": "আপনি কী কাজ করেছিলেন, একটু বলুন। না বলতে চাইলে এড়িয়ে যেতে পারেন।", "en-IN": "Say a little about the work you did. You can skip this.", "hi-IN": "आपने क्या काम किया, थोड़ा बताएँ। चाहें तो छोड़ सकते हैं।" },
    "prompt.team": { "bn-IN": "আপনি কোন দলের সঙ্গে কাজ করেছিলেন? জানা না থাকলে ‘জানি না’ বলতে পারেন।", "en-IN": "Which team did you work with? If you don't know, you can say so.", "hi-IN": "आपने किस दल के साथ काम किया? पता नहीं हो तो ‘पता नहीं’ कह सकते हैं।" },
    "prompt.sardar": { "bn-IN": "আপনার সরদার বা দলের নেতার নাম জানালে বলুন। জানা না থাকলে ‘জানি না’ বলতে পারেন।", "en-IN": "If you know your sardar or team lead's name, say it. If you don't, say so.", "hi-IN": "अपने सरदार या दल के मुखिया का नाम पता हो तो बोलें। नहीं पता तो कह दें।" },
    "prompt.sardarMobile": { "bn-IN": "সরদারের মোবাইল নম্বর জানলে বলুন। না জানলে এড়িয়ে যেতে পারেন।", "en-IN": "Say the sardar's mobile number if you know it. You can skip it.", "hi-IN": "सरदार का मोबाइल नंबर पता हो तो बोलें। नहीं तो छोड़ सकते हैं।" },
    "prompt.attendance": { "bn-IN": "আপনি কি ১ নভেম্বর অনুষ্ঠানে আসতে পারবেন?", "en-IN": "Will you be able to come to the gathering on 1 November?", "hi-IN": "क्या आप १ नवम्बर के आयोजन में आ पाएँगे?" },
    "prompt.photo": { "bn-IN": "এবার আপনার একটি পরিষ্কার ছবি তুলব। স্ক্রিনে ‘ক্যামেরা খুলুন’ বোতামটি চাপুন। ক্যামেরার অনুমতি চাইলে অনুমতি দিন। ছবি উঠলে দেখুন—ঠিক হলে ‘এই ছবি ব্যবহার করুন’, না হলে ‘আবার ছবি তুলুন’ চাপুন।", "en-IN": "Now we will take a clear photo. Press Open camera. Allow the camera if the phone asks. If the photo looks right, press Use this photo. If not, press Take again.", "hi-IN": "अब एक साफ़ तस्वीर लेंगे। ‘कैमरा खोलें’ दबाएँ। फ़ोन अनुमति माँगे तो अनुमति दें। तस्वीर ठीक हो तो ‘यह तस्वीर इस्तेमाल करें’, नहीं तो ‘फिर से लें’ दबाएँ।" },
    "prompt.consent": { "bn-IN": "রেজিস্ট্রেশন জমা দিতে নিচের কথাটি পড়ে টিক দিন। ছবি প্রকাশের অনুমতি এর পর আলাদা করে চাওয়া হবে।", "en-IN": "To submit, read the note below and tick it. Permission to publish your photo is a separate question after this.", "hi-IN": "जमा करने के लिए नीचे की बात पढ़कर सही का निशान लगाएँ। तस्वीर प्रकाशित करने की अनुमति इसके बाद अलग से पूछी जाएगी।" },
    "prompt.publicity": { "bn-IN": "আপনার নাম ও ছবি কি আমরা ‘প্রত্যাবর্তনের কারিগর’ সম্মাননা গ্যালারিতে প্রকাশ করতে পারি? অনুমতি দেওয়া আপনার ইচ্ছা। না বললেও আপনার রেজিস্ট্রেশন হবে।", "en-IN": "May we show your name and photo in the Protyabortan karigar honour gallery? This is your choice. Registration still goes through if you say no.", "hi-IN": "क्या हम आपका नाम और तस्वीर ‘प्रत्यावर्तन के कारीगर’ सम्मान गैलरी में दिखा सकते हैं? यह आपकी इच्छा है। ना कहने पर भी पंजीकरण होगा।" },
    "prompt.review": { "bn-IN": "এবার আপনার দেওয়া তথ্যগুলো একবার মিলিয়ে নিই। সব ঠিক থাকলে ‘রেজিস্ট্রেশন জমা দিন’ চাপুন। কিছু বদলাতে চাইলে সেই অংশটি নির্বাচন করুন।", "en-IN": "Let us check what you gave. If it is all right, press Submit registration. To change something, choose that part.", "hi-IN": "अब दी गई जानकारी मिला लें। सब ठीक हो तो ‘पंजीकरण जमा करें’ दबाएँ। कुछ बदलना हो तो वह हिस्सा चुनें।" },
    "prompt.success": { "bn-IN": "আপনার রেজিস্ট্রেশন জমা হয়েছে। নম্বরটি সংরক্ষণ করে রাখুন। আয়োজক দল আপনার তথ্য যাচাই করে অনুষ্ঠানে উপস্থিতির বিষয়টি নিশ্চিত করবে। ধন্যবাদ।", "en-IN": "Your registration has been received. Please keep the number. The organisers will check the details and confirm attendance. Thank you.", "hi-IN": "आपका पंजीकरण जमा हो गया है। नंबर संभालकर रखें। आयोजक जानकारी जाँचकर उपस्थिति पक्की करेंगे। धन्यवाद।" },
    "confirm.heard": { "bn-IN": "আমি কি ঠিক শুনেছি—{value}?", "en-IN": "Did I hear this right — {value}?", "hi-IN": "क्या मैंने ठीक सुना — {value}?" },
    "label.answer": { "bn-IN": "আপনার উত্তর", "en-IN": "Your answer", "hi-IN": "आपका जवाब" },
    "cat.structure_bamboo": { "bn-IN": "মণ্ডপের কাঠামো বা বাঁশের কাজ", "en-IN": "Pandal structure or bamboo work", "hi-IN": "मंडप का ढाँचा या बाँस का काम" },
    "cat.fabrication": { "bn-IN": "ফ্যাব্রিকেশন বা কাঠামো তৈরি", "en-IN": "Fabrication or frame making", "hi-IN": "फैब्रिकेशन या ढाँचा बनाना" },
    "cat.decoration_draping": { "bn-IN": "মণ্ডপের সাজসজ্জা বা কাপড়ের কাজ", "en-IN": "Decoration or draping", "hi-IN": "मंडप की सजावट या कपड़े का काम" },
    "cat.painting_finishing": { "bn-IN": "রং, ফিনিশিং বা ডেকর বসানোর কাজ", "en-IN": "Painting, finishing or décor fitting", "hi-IN": "रंग, फिनिशिंग या सजावट लगाना" },
    "cat.lighting_installation": { "bn-IN": "আলো বা লাইটিং ইনস্টলেশনের কাজ", "en-IN": "Lighting installation", "hi-IN": "लाइट लगाने का काम" },
    "cat.other_pandal_work": { "bn-IN": "অন্য মণ্ডপ নির্মাণ বা সাজসজ্জার কাজ", "en-IN": "Other pandal building or decoration work", "hi-IN": "मंडप बनाने या सजाने का अन्य काम" },
    "attendance.yes": { "bn-IN": "হ্যাঁ, আসতে পারব", "en-IN": "Yes, I can come", "hi-IN": "हाँ, आ सकता हूँ" },
    "attendance.unsure": { "bn-IN": "এখনও নিশ্চিত নই", "en-IN": "Not sure yet", "hi-IN": "अभी पक्का नहीं" },
    "attendance.no": { "bn-IN": "না, আসতে পারব না", "en-IN": "No, I cannot come", "hi-IN": "नहीं, नहीं आ पाऊँगा" },
    "consent.text": {
      "bn-IN": "আপনার নাম, মোবাইল নম্বর, ঠিকানা, কাজের পরিচয় এবং ছবি এই অনুষ্ঠানের রেজিস্ট্রেশন, পরিচয় যাচাই ও ব্যবস্থাপনার জন্য নেওয়া হচ্ছে। এই তথ্য কেবল অনুমোদিত আয়োজক দল ব্যবহার করবে। আপনার নাম ও ছবি প্রকাশ্যে দেখানোর অনুমতি আলাদাভাবে চাওয়া হবে। আপনি অনুমতি না দিলেও রেজিস্ট্রেশন করতে পারবেন।",
      "en-IN": "Your name, mobile number, address, work identity and photo are collected for registration, identity checks and running this event. Only the authorised organising team will use them. Permission to show your name and photo publicly is asked separately. You can still register if you do not give that permission.",
      "hi-IN": "आपका नाम, मोबाइल नंबर, पता, काम की पहचान और तस्वीर इस आयोजन के पंजीकरण, पहचान जाँच और व्यवस्था के लिए ली जा रही है। केवल अधिकृत आयोजक दल इसका उपयोग करेगा। नाम और तस्वीर सार्वजनिक रूप से दिखाने की अनुमति अलग से पूछी जाएगी। अनुमति न देने पर भी पंजीकरण हो सकता है।"
    },
    "consent.check": { "bn-IN": "আমি এই কথা পড়েছি এবং রেজিস্ট্রেশনের জন্য রাজি আছি", "en-IN": "I have read this and I agree to register", "hi-IN": "मैंने यह पढ़ लिया है और पंजीकरण के लिए सहमत हूँ" },
    "publicity.yes": { "bn-IN": "হ্যাঁ, অনুমতি দিচ্ছি", "en-IN": "Yes, I give permission", "hi-IN": "हाँ, अनुमति देता हूँ" },
    "publicity.no": { "bn-IN": "না, প্রকাশ করবেন না", "en-IN": "No, do not publish", "hi-IN": "नहीं, प्रकाशित न करें" },
    "photo.open": { "bn-IN": "ক্যামেরা খুলুন", "en-IN": "Open camera", "hi-IN": "कैमरा खोलें" },
    "photo.take": { "bn-IN": "ছবি তুলুন", "en-IN": "Take photo", "hi-IN": "तस्वीर लें" },
    "photo.retake": { "bn-IN": "আবার ছবি তুলুন", "en-IN": "Take again", "hi-IN": "फिर से लें" },
    "photo.use": { "bn-IN": "এই ছবি ব্যবহার করুন", "en-IN": "Use this photo", "hi-IN": "यह तस्वीर इस्तेमाल करें" },
    "photo.gallery": { "bn-IN": "ফোনের গ্যালারি থেকে ছবি বেছে নিন", "en-IN": "Choose a photo from the phone gallery", "hi-IN": "फ़ोन की गैलरी से तस्वीर चुनें" },
    "photo.assisted": { "bn-IN": "আয়োজকের সাহায্যে পরে ছবি দেব", "en-IN": "I will give the photo later with an organiser's help", "hi-IN": "आयोजक की मदद से बाद में तस्वीर दूँगा" },
    "photo.uploading": { "bn-IN": "ছবি পাঠানো হচ্ছে…", "en-IN": "Sending the photo…", "hi-IN": "तस्वीर भेजी जा रही है…" },
    "photo.failed": { "bn-IN": "ছবি যায়নি। আবার চেষ্টা করুন, অথবা গ্যালারি থেকে বেছে নিন।", "en-IN": "The photo did not go through. Try again, or choose one from the gallery.", "hi-IN": "तस्वीर नहीं गई। फिर कोशिश करें, या गैलरी से चुनें।" },
    "photo.denied": { "bn-IN": "ক্যামেরা খোলেনি। গ্যালারি থেকে ছবি বেছে নিতে পারেন।", "en-IN": "The camera did not open. You can choose a photo from the gallery.", "hi-IN": "कैमरा नहीं खुला। गैलरी से तस्वीर चुन सकते हैं।" },
    "photo.close": { "bn-IN": "ক্যামেরা বন্ধ করুন", "en-IN": "Close camera", "hi-IN": "कैमरा बंद करें" },
    "review.name": { "bn-IN": "নাম", "en-IN": "Name", "hi-IN": "नाम" },
    "review.mobile": { "bn-IN": "মোবাইল", "en-IN": "Mobile", "hi-IN": "मोबाइल" },
    "review.locality": { "bn-IN": "এলাকা", "en-IN": "Area", "hi-IN": "इलाका" },
    "review.district": { "bn-IN": "জেলা", "en-IN": "District", "hi-IN": "जिला" },
    "review.work": { "bn-IN": "কাজ", "en-IN": "Work", "hi-IN": "काम" },
    "review.detail": { "bn-IN": "কাজের কথা", "en-IN": "Work detail", "hi-IN": "काम का विवरण" },
    "review.team": { "bn-IN": "দল", "en-IN": "Team", "hi-IN": "दल" },
    "review.sardar": { "bn-IN": "সরদার", "en-IN": "Sardar", "hi-IN": "सरदार" },
    "review.attendance": { "bn-IN": "উপস্থিতি", "en-IN": "Attendance", "hi-IN": "उपस्थिति" },
    "review.photo": { "bn-IN": "ছবি", "en-IN": "Photo", "hi-IN": "तस्वीर" },
    "review.consent": { "bn-IN": "রেজিস্ট্রেশনের সম্মতি", "en-IN": "Registration consent", "hi-IN": "पंजीकरण की सहमति" },
    "review.publicity": { "bn-IN": "ছবি প্রকাশ", "en-IN": "Photo publication", "hi-IN": "तस्वीर प्रकाशन" },
    "review.change": { "bn-IN": "পরিবর্তন করুন", "en-IN": "Change", "hi-IN": "बदलें" },
    "review.given": { "bn-IN": "দেওয়া হয়েছে", "en-IN": "Given", "hi-IN": "दी गई" },
    "review.notGiven": { "bn-IN": "দেওয়া হয়নি", "en-IN": "Not given", "hi-IN": "नहीं दी गई" },
    "review.yesPublish": { "bn-IN": "প্রকাশের অনুমতি আছে", "en-IN": "Publication allowed", "hi-IN": "प्रकाशन की अनुमति है" },
    "review.noPublish": { "bn-IN": "প্রকাশ করা হবে না", "en-IN": "Will not be published", "hi-IN": "प्रकाशित नहीं होगा" },
    "review.laterPhoto": { "bn-IN": "পরে, আয়োজকের সাহায্যে", "en-IN": "Later, with an organiser's help", "hi-IN": "बाद में, आयोजक की मदद से" },
    "review.unknown": { "bn-IN": "জানি না", "en-IN": "Not known", "hi-IN": "पता नहीं" },
    "success.keep": { "bn-IN": "আপনার নম্বর", "en-IN": "Your number", "hi-IN": "आपका नंबर" },
    "success.note": { "bn-IN": "রেজিস্ট্রেশন মানেই উপস্থিতি বা চূড়ান্ত যাচাই নয়। আয়োজক দল তথ্য দেখে নিশ্চিত করবে।", "en-IN": "Registration is not itself proof of attendance or final verification. The organisers will check the details.", "hi-IN": "पंजीकरण अपने आप उपस्थिति या अंतिम जाँच का प्रमाण नहीं है। आयोजक जानकारी देखकर पक्का करेंगे।" },
    "error.required": { "bn-IN": "এটি লাগবে। আবার বলুন বা লিখুন।", "en-IN": "This is needed. Please say or type it.", "hi-IN": "यह ज़रूरी है। फिर बोलें या लिखें।" },
    "error.invalid": { "bn-IN": "এটি মিলছে না। আবার দেখুন।", "en-IN": "This does not look right. Please check it.", "hi-IN": "यह मेल नहीं खा रहा। फिर देखें।" },
    "error.uncertain": { "bn-IN": "কাজের ধরন নিশ্চিত বুঝতে পারিনি। নিচের কার্ড থেকে বেছে নিন।", "en-IN": "I could not be sure of the work type. Please choose from the cards.", "hi-IN": "काम का प्रकार पक्का नहीं समझ पाया। नीचे के कार्ड से चुनें।" },
    "error.not_allowed": { "bn-IN": "এই তালিকা থেকে একটি কাজ বেছে নিন।", "en-IN": "Please choose a type of work from this list.", "hi-IN": "इस सूची में से एक काम चुनें।" },
    "error.submit": { "bn-IN": "এখন জমা হয়নি। আপনার লেখা তথ্য আছে। আবার জমা দিন।", "en-IN": "It was not submitted. Your answers are still here. Please submit again.", "hi-IN": "अभी जमा नहीं हुआ। आपके जवाब यहीं हैं। फिर जमा करें।" },
    "error.config": { "bn-IN": "সংরক্ষণের ব্যবস্থা এখন যুক্ত নয়। আয়োজককে জানান। আপনার লেখা তথ্য এই পাতায় আছে।", "en-IN": "Saving is not connected yet. Please tell an organiser. Your answers are still on this page.", "hi-IN": "सहेजने की व्यवस्था अभी जुड़ी नहीं है। आयोजक को बताएँ। आपके जवाब इस पृष्ठ पर हैं।" },
    "error.rate": { "bn-IN": "একসাথে অনেকবার চেষ্টা হয়েছে। একটু পরে আবার জমা দিন।", "en-IN": "Too many tries at once. Please submit again after a short wait.", "hi-IN": "एक साथ बहुत बार कोशिश हुई। थोड़ी देर बाद फिर जमा करें।" },
    "error.photo": { "bn-IN": "ছবি এখনো জমা হয়নি। আবার পাঠান, অথবা পরে দেওয়ার পথ নিন।", "en-IN": "The photo is not saved yet. Send it again, or choose to give it later.", "hi-IN": "तस्वीर अभी सहेजी नहीं गई। फिर भेजें, या बाद में देने का रास्ता चुनें।" },
    "submitting": { "bn-IN": "জমা হচ্ছে। একটু অপেক্ষা করুন।", "en-IN": "Submitting. Please wait.", "hi-IN": "जमा हो रहा है। थोड़ा इंतज़ार करें।" },
    "help.title": { "bn-IN": "আয়োজকের সাহায্য", "en-IN": "Help from an organiser", "hi-IN": "आयोजक की मदद" },
    "help.body": { "bn-IN": "একা রেজিস্ট্রেশন করতে অসুবিধা হলে এই নম্বরে ফোন করুন। নম্বরগুলো প্রত্যাবর্তনের প্রকাশিত যোগাযোগ।", "en-IN": "If registering alone is difficult, call these numbers. They are the published Protyabortan contacts.", "hi-IN": "अकेले पंजीकरण में कठिनाई हो तो इन नंबरों पर फ़ोन करें। ये प्रत्यावर्तन के प्रकाशित संपर्क हैं।" },
    "field.name": { "bn-IN": "নাম", "en-IN": "Name", "hi-IN": "नाम" },
    "field.mobile": { "bn-IN": "মোবাইল", "en-IN": "Mobile", "hi-IN": "मोबाइल" },
    "field.locality": { "bn-IN": "এলাকা", "en-IN": "Area", "hi-IN": "इलाका" },
    "field.post": { "bn-IN": "পোস্ট অফিস", "en-IN": "Post office", "hi-IN": "डाकघर" },
    "field.ps": { "bn-IN": "থানা বা ব্লক", "en-IN": "Police station or block", "hi-IN": "थाना या ब्लॉक" },
    "field.district": { "bn-IN": "জেলা", "en-IN": "District", "hi-IN": "जिला" },
    "field.pin": { "bn-IN": "পিন কোড", "en-IN": "PIN code", "hi-IN": "पिन कोड" },
    "field.work": { "bn-IN": "কাজের ধরন", "en-IN": "Type of work", "hi-IN": "काम का प्रकार" },
    "field.workDetail": { "bn-IN": "কাজের কথা", "en-IN": "Work detail", "hi-IN": "काम का विवरण" },
    "field.team": { "bn-IN": "দল", "en-IN": "Team", "hi-IN": "दल" },
    "field.sardar": { "bn-IN": "সরদার", "en-IN": "Sardar", "hi-IN": "सरदार" },
    "field.sardarMobile": { "bn-IN": "সরদারের মোবাইল", "en-IN": "Sardar's mobile", "hi-IN": "सरदार का मोबाइल" },
    "field.attendance": { "bn-IN": "উপস্থিতি", "en-IN": "Attendance", "hi-IN": "उपस्थिति" },
    "field.photo": { "bn-IN": "ছবি", "en-IN": "Photo", "hi-IN": "तस्वीर" },
    "field.consent": { "bn-IN": "সম্মতি", "en-IN": "Consent", "hi-IN": "सहमति" },
    "field.publicity": { "bn-IN": "ছবি প্রকাশ", "en-IN": "Photo publication", "hi-IN": "तस्वीर प्रकाशन" },
    "assisted.label": { "bn-IN": "সহযোগিতায় রেজিস্ট্রেশন", "en-IN": "Assisted registration", "hi-IN": "सहायता से पंजीकरण" },
    "assisted.by": { "bn-IN": "যে আয়োজক সাহায্য করছেন, তাঁর নাম", "en-IN": "Name of the organiser who is helping", "hi-IN": "जो आयोजक मदद कर रहे हैं, उनका नाम" },
    "privacy.title": { "bn-IN": "গোপনীয়তা", "en-IN": "Privacy", "hi-IN": "गोपनीयता" },
    "privacy.pending": { "bn-IN": "এই লেখাটি খসড়া। চূড়ান্ত কথা আয়োজক দল অনুমোদন করবে। কতদিন তথ্য রাখা হবে, সেই সিদ্ধান্তও এখনো বাকি।", "en-IN": "This notice is a draft. The organising team still has to approve the final wording. How long records are kept is also still to be decided.", "hi-IN": "यह लेख मसौदा है। अंतिम शब्द आयोजक दल को मंज़ूर करने हैं। रिकॉर्ड कितने दिन रखे जाएँगे, यह निर्णय अभी बाकी है।" },
    "privacy.audio": { "bn-IN": "কথা শোনার সময় অডিও শুধু লেখার জন্য ব্যবহার হয়। সাধারণভাবে সেই অডিও জমা রাখা হয় না।", "en-IN": "When you speak, the audio is used only to write down the words. It is not kept afterwards.", "hi-IN": "जब आप बोलते हैं, आवाज़ केवल शब्द लिखने के लिए इस्तेमाल होती है। बाद में वह आवाज़ नहीं रखी जाती।" },
    "privacy.home": { "bn-IN": "প্রথম পাতায় ফিরুন", "en-IN": "Back to the first page", "hi-IN": "पहले पृष्ठ पर लौटें" },
    "admin.title": { "bn-IN": "কারিগর রেজিস্ট্রেশন", "en-IN": "Karigar registrations", "hi-IN": "कारीगर पंजीकरण" },
    "admin.login": { "bn-IN": "আয়োজক প্রবেশ", "en-IN": "Organiser sign in", "hi-IN": "आयोजक प्रवेश" },
    "admin.token": { "bn-IN": "প্রবেশের চাবি", "en-IN": "Access token", "hi-IN": "प्रवेश कुंजी" },
    "admin.enter": { "bn-IN": "ঢুকুন", "en-IN": "Enter", "hi-IN": "घुसें" },
    "admin.logout": { "bn-IN": "বেরোন", "en-IN": "Sign out", "hi-IN": "बाहर जाएँ" },
    "admin.search": { "bn-IN": "নাম, নম্বর বা রেজিস্ট্রেশন খুঁজুন", "en-IN": "Search name, number or registration", "hi-IN": "नाम, नंबर या पंजीकरण खोजें" },
    "admin.empty": { "bn-IN": "এই ছাঁকে কোনো রেকর্ড নেই।", "en-IN": "No records in this filter.", "hi-IN": "इस छन्नी में कोई रिकॉर्ड नहीं।" },
    "admin.loading": { "bn-IN": "লোড হচ্ছে…", "en-IN": "Loading…", "hi-IN": "लोड हो रहा है…" },
    "admin.error": { "bn-IN": "তালিকা আনা যায়নি।", "en-IN": "The list could not be loaded.", "hi-IN": "सूची नहीं आ सकी।" },
    "admin.unauth": { "bn-IN": "এই পাতা শুধু আয়োজকদের জন্য।", "en-IN": "This page is only for organisers.", "hi-IN": "यह पृष्ठ केवल आयोजकों के लिए है।" },
    "admin.all": { "bn-IN": "সব", "en-IN": "All", "hi-IN": "सभी" },
    "admin.prev": { "bn-IN": "আগের পাতা", "en-IN": "Previous page", "hi-IN": "पिछला पृष्ठ" },
    "admin.next": { "bn-IN": "পরের পাতা", "en-IN": "Next page", "hi-IN": "अगला पृष्ठ" },
    "admin.save": { "bn-IN": "সংরক্ষণ করুন", "en-IN": "Save", "hi-IN": "सहेजें" },
    "admin.saved": { "bn-IN": "সংরক্ষিত হয়েছে", "en-IN": "Saved", "hi-IN": "सहेज लिया गया" },
    "admin.noteWarn": { "bn-IN": "নোট ছোট রাখুন। অপ্রয়োজনীয় সংবেদনশীল তথ্য লিখবেন না।", "en-IN": "Keep the note short. Do not write unnecessary sensitive details.", "hi-IN": "नोट छोटा रखें। अनावश्यक संवेदनशील जानकारी न लिखें।" },
    "admin.duplicate": { "bn-IN": "সম্ভাব্য ডুপ্লিকেট — যাচাই করুন, মুছে ফেলবেন না", "en-IN": "Possible duplicate — review it, do not delete it", "hi-IN": "संभव डुप्लिकेट — जाँचें, मिटाएँ नहीं" },
    "status.pending_verification": { "bn-IN": "যাচাই বাকি", "en-IN": "Pending verification", "hi-IN": "जाँच बाकी" },
    "status.needs_correction": { "bn-IN": "সংশোধন লাগবে", "en-IN": "Needs correction", "hi-IN": "सुधार चाहिए" },
    "status.verified": { "bn-IN": "যাচাই হয়েছে", "en-IN": "Verified", "hi-IN": "जाँच हुई" },
    "status.confirmed": { "bn-IN": "নিশ্চিত", "en-IN": "Confirmed", "hi-IN": "पक्का" },
    "status.waitlisted": { "bn-IN": "অপেক্ষমাণ", "en-IN": "Waitlisted", "hi-IN": "प्रतीक्षा सूची" },
    "status.cancelled": { "bn-IN": "বাতিল", "en-IN": "Cancelled", "hi-IN": "रद्द" },
    "attendance.attended": { "bn-IN": "এসেছিলেন", "en-IN": "Attended", "hi-IN": "आए थे" },
    "attendance.absent": { "bn-IN": "আসেননি", "en-IN": "Absent", "hi-IN": "नहीं आए" },
    "export.verified": { "bn-IN": "যাচাই হওয়া তালিকা", "en-IN": "Verified list", "hi-IN": "जाँची हुई सूची" },
    "export.team": { "bn-IN": "দল অনুযায়ী তালিকা", "en-IN": "Team list", "hi-IN": "दल के अनुसार सूची" },
    "export.roster": { "bn-IN": "সম্মাননার তালিকা", "en-IN": "Recognition roster", "hi-IN": "सम्मान सूची" },
    "export.checkin": { "bn-IN": "উপস্থিতির তালিকা", "en-IN": "Check-in list", "hi-IN": "उपस्थिति सूची" },
    "export.gallery": { "bn-IN": "গ্যালারির প্রার্থী", "en-IN": "Gallery candidates", "hi-IN": "गैलरी के उम्मीदवार" },
    "export.contacts": { "bn-IN": "যোগাযোগ তালিকা", "en-IN": "Contact list", "hi-IN": "संपर्क सूची" },
    "complete.missing": { "bn-IN": "এই ফোনে রেজিস্ট্রেশন নম্বর রাখা নেই। নম্বর কপি করা থাকলে সেটিই ব্যবহার করুন।", "en-IN": "This phone does not have a saved registration number. Use the number if you copied it.", "hi-IN": "इस फ़ोन में पंजीकरण नंबर सहेजा नहीं है। कॉपी किया हो तो वही इस्तेमाल करें।" },
    "nav.label": { "bn-IN": "বিষয়", "en-IN": "Sections", "hi-IN": "विषय" },
    "nav.story": { "bn-IN": "গড়ে ওঠার গল্প", "en-IN": "How it was built", "hi-IN": "बनने की कहानी" },
    "nav.people": { "bn-IN": "কারিগরদের গল্প", "en-IN": "The karigars", "hi-IN": "कारीगरों की कहानी" },
    "nav.facts": { "bn-IN": "অনুষ্ঠানের তথ্য", "en-IN": "Event details", "hi-IN": "आयोजन की जानकारी" },
    "nav.register": { "bn-IN": "রেজিস্ট্রেশন", "en-IN": "Registration", "hi-IN": "पंजीकरण" },
    "golpo.title": { "bn-IN": "যেখানে ছিল জঞ্জালের স্তূপ, সেখানেই গড়ে উঠল সম্মানের মণ্ডপ", "en-IN": "Where there was a heap of waste, a pavilion of respect now stands", "hi-IN": "जहाँ कचरे का ढेर था, वहीं सम्मान का मंडप खड़ा हुआ" },
    "golpo.p1": { "bn-IN": "প্রত্যাবর্তনের এই কাহিনি শুধু মণ্ডপের সৌন্দর্যের গল্প নয়। আগে এই জমিতে ফেলে দেওয়া নির্মাণবর্জ্য ও আবর্জনা জমে ছিল। পরিষ্কার, বাঁশের কাঠামো, সাজ ও আলোর কাজে সেই জায়গা বদলেছে।", "en-IN": "This story is more than the beauty of a pandal. The ground had held discarded construction waste and rubbish. Clearing, bamboo structure, decoration and light changed the place.", "hi-IN": "यह कहानी सिर्फ़ मंडप की सुंदरता की नहीं। इस ज़मीन पर निर्माण का कचरा और गंदगी जमा थी। सफ़ाई, बाँस का ढाँचा, सजावट और रोशनी ने जगह बदल दी।" },
    "golpo.p2": { "bn-IN": "যে সৌন্দর্য দর্শকের চোখে পড়ে, তার পেছনে অনেক হাতের কাজ। এই বিজয়া সম্মিলনী সেই কারিগরদের সম্মান জানাতে চায়।", "en-IN": "What visitors see rests on many hands. This Vijay Sammelan is to honour those karigars.", "hi-IN": "जो सुंदरता दर्शक देखते हैं, उसके पीछे कई हाथों का काम है। यह विजया सम्मेलन उन्हीं कारीगरों का सम्मान है।" },
    "golpo.more": { "bn-IN": "রূপান্তরের পুরো গল্প পড়ুন", "en-IN": "Read the full story", "hi-IN": "पूरी कहानी पढ़ें" },
    "golpo.meet": { "bn-IN": "কারিগরদের সঙ্গে পরিচিত হন", "en-IN": "Meet the karigars", "hi-IN": "कारीगरों से मिलें" },
    "time.title": { "bn-IN": "রূপান্তরের ধাপ", "en-IN": "Steps of the change", "hi-IN": "बदलाव के चरण" },
    "time.beforeAlt": { "bn-IN": "জমিতে নির্মাণবর্জ্য ও আবর্জনার স্তূপ।", "en-IN": "Heaps of construction waste and rubbish on the ground.", "hi-IN": "ज़मीन पर निर्माण कचरे और गंदगी के ढेर।" },
    "time.beforeCap": { "bn-IN": "একসময় এই জমি জুড়ে ছিল ফেলে দেওয়া নির্মাণবর্জ্য ও আবর্জনা।", "en-IN": "This ground once held discarded construction waste and rubbish.", "hi-IN": "कभी इस ज़मीन पर फेंका हुआ निर्माण कचरा और गंदगी थी।" },
    "time.bambooCap": { "bn-IN": "বাঁশের কাঠামো বাঁধার কাজ।", "en-IN": "Bamboo framework being tied.", "hi-IN": "बाँस का ढाँचा बाँधने का काम।" },
    "time.nightAlt": { "bn-IN": "রাতে আলোয় বাঁশের মণ্ডপ ও সামনের পথ।", "en-IN": "The bamboo pavilion and path, lit at night.", "hi-IN": "रात में रोशनी में बाँस का मंडप और सामने का रास्ता।" },
    "time.nightCap": { "bn-IN": "রাতের আলোয় দেখা যায় গড়ে ওঠা মণ্ডপ।", "en-IN": "At night the finished pavilion is visible in the light.", "hi-IN": "रात की रोशनी में बना मंडप दिखता है।" },
    "people.title": { "bn-IN": "যাঁদের হাতে গড়ে ওঠে", "en-IN": "The people whose hands built it", "hi-IN": "जिनके हाथों से यह बना" },
    "people.note": { "bn-IN": "এখানে কাজের কথা আছে। নামের সঙ্গে মুখের ছবি এখনো দেওয়া হয়নি।", "en-IN": "These cards tell the work. A face is not shown with a name yet.", "hi-IN": "यहाँ काम की बात है। नाम के साथ चेहरा अभी नहीं दिखाया गया है।" },
    "people.anilTitle": { "bn-IN": "অনিল সামন্ত", "en-IN": "Anil Samanta", "hi-IN": "अनिल सामंत" },
    "people.anilRole": { "bn-IN": "উৎসবের আড়ালের যত্ন ও সমন্বয়", "en-IN": "Care and coordination behind the festival", "hi-IN": "उत्सव के पीछे देखभाल और तालमेल" },
    "people.anilBody": { "bn-IN": "সাক্ষাৎকারে তিনি নিজের নাম বলেছেন। ভোরে পতাকা ও প্রার্থনার দায়িত্ব, আলো জ্বালানো, দলের আসা-যাওয়া সামলানো এবং রাতে তালিকা রাখার কথা বলেছেন। বাড়ির জেলা সাক্ষাৎকারে স্পষ্ট নয়, তাই সেটি এখানে নেই।", "en-IN": "In the interview he said his name. He spoke of the dawn flag and prayer, lighting, coordinating who arrives, and keeping lists late at night. His home district is not clear in the interview, so it is not given here.", "hi-IN": "साक्षात्कार में उन्होंने अपना नाम बताया। भोर में ध्वज और प्रार्थना, रोशनी जलाना, टीमों के आने-जाने का तालमेल और रात में सूची रखने की बात कही। घर का ज़िला साक्षात्कार में स्पष्ट नहीं, इसलिए यहाँ नहीं है।" },
    "people.paritoshTitle": { "bn-IN": "পরিতোষ কুমার মণ্ডল", "en-IN": "Paritosh Kumar Mondal", "hi-IN": "परितोष कुमार मंडल" },
    "people.paritoshRole": { "bn-IN": "সাইটের কাজ দেখাশোনা ও সমন্বয়", "en-IN": "Coordinates and oversees site work", "hi-IN": "साइट के काम की देखरेख और तालमेल" },
    "people.paritoshBody": { "bn-IN": "সাক্ষাৎকারে তিনি নিজের নাম বলেছেন। ২০০৯ সাল থেকে এই উদ্যোগের সঙ্গে যুক্ত থাকার কথা বলেছেন। সাইটে তিনি কাজ দেখাশোনা ও সমন্বয় করেন। কোনো নির্দিষ্ট পদবি এখানে দেওয়া হয়নি।", "en-IN": "In the interview he said his name. He said he has been associated with the initiative since 2009. On site he coordinates and oversees the work. No exact job title is given here.", "hi-IN": "साक्षात्कार में उन्होंने अपना नाम बताया। उन्होंने २००९ से इस पहल से जुड़े रहने की बात कही। साइट पर वे काम की देखरेख और तालमेल करते हैं। कोई निश्चित पदनाम यहाँ नहीं दिया गया है।" },
    "people.santoshTitle": { "bn-IN": "সন্তোষ মণ্ডল", "en-IN": "Santosh Mondal", "hi-IN": "संतोष मंडल" },
    "people.santoshRole": { "bn-IN": "বাঁশের কাজে অভিজ্ঞ হাত", "en-IN": "Skilled hands in bamboo work", "hi-IN": "बाँस के काम में अनुभवी हाथ" },
    "people.santoshBody": { "bn-IN": "সাক্ষাৎকারে তিনি নিজের নাম বলেছেন। সামনে বাঁশ ছিলে আকার দেওয়ার কাজ চলছিল। তিনি ২০১২–১৩ সাল থেকে যুক্ত থাকার কথা বলেছেন।", "en-IN": "In the interview he said his name. Bamboo was being shaved and shaped in front of him. He said his association began around 2012–13.", "hi-IN": "साक्षात्कार में उन्होंने अपना नाम बताया। सामने बाँस छीलकर आकार देने का काम चल रहा था। उन्होंने २०१२–१३ से जुड़े रहने की बात कही।" },
    "story.pageTitle": { "bn-IN": "গড়ে ওঠার গল্প", "en-IN": "How the place was built", "hi-IN": "जगह कैसे बनी" },
    "story.concept": { "bn-IN": "জঞ্জালের স্তূপ থেকে আলোর মণ্ডপ: কারিগরদের হাতে প্রত্যাবর্তনের রূপান্তর।", "en-IN": "From a heap of waste to a pavilion of light: the transformation of Protyabortan in the karigars' hands.", "hi-IN": "कचरे के ढेर से रोशनी का मंडप: कारीगरों के हाथों प्रत्यावर्तन का रूपांतरण।" },
    "story.lead": { "bn-IN": "মুনশিভেরির এই জমি একসময় ফেলে দেওয়া বর্জ্যে ঢাকা ছিল। পরিষ্কার, বাঁশ, পথ, সাজ আর আলোর কাজে সেটি প্রত্যাবর্তনের মণ্ডপ হয়ে উঠেছে। এই পাতা সেই পথের কথা বলে।", "en-IN": "This ground at Munshi Bheri was once covered with discarded waste. Clearing, bamboo, paths, decoration and light turned it into the Protyabortan pavilion. This page follows that path.", "hi-IN": "मुंशीभेरी की यह ज़मीन कभी फेंके हुए कचरे से ढकी थी। सफ़ाई, बाँस, रास्ते, सजावट और रोशनी ने उसे प्रत्यावर्तन का मंडप बनाया। यह पन्ना वही रास्ता बताता है।" },
    "story.c1Title": { "bn-IN": "আগে যা ছিল", "en-IN": "What was here before", "hi-IN": "पहले यहाँ क्या था" },
    "story.c1": { "bn-IN": "সরবরাহ করা ছবিতে জমি জুড়ে নির্মাণবর্জ্য, আবর্জনা আর কাদামাখা অসম পথ দেখা যায়। হাঁটার মতো পরিষ্কার জায়গা তখন তৈরি ছিল না। এই ছবি কোনো এক দিনের খতিয়ান নয়। এগুলো জায়গাটি বদলের আগের চেহারা।", "en-IN": "The supplied photographs show construction waste, rubbish and a muddy, uneven path across the ground. A clear place to walk was not ready then. These pictures are not a log of one date. They show the place before it changed.", "hi-IN": "दी गई तस्वीरों में ज़मीन पर निर्माण का कचरा, गंदगी और कीचड़ भरा ऊँचा-नीचा रास्ता दिखता है। चलने लायक साफ़ जगह तब तैयार नहीं थी। ये तस्वीरें किसी एक तारीख का हिसाब नहीं हैं। ये जगह के बदलने से पहले का रूप हैं।" },
    "story.c2Title": { "bn-IN": "জমি সরানো ও প্রস্তুতি", "en-IN": "Clearing and preparing the ground", "hi-IN": "ज़मीन साफ़ करना और तैयारी" },
    "story.c2": { "bn-IN": "ভাঙা ইট ও মাটির কাছে একটি এক্সকাভেটর কাজ করতে দেখা যায়। জলাশয়ের ধারের খোলা জমিও এই পরিসরের অংশ। কতজন, কত ঘণ্টা বা কত টাকায় এই পরিষ্কার হয়েছে, সেই হিসাব এখানে নেই। ছবিতে যা দেখা যায়, সেটুকুই বলা হচ্ছে।", "en-IN": "An excavator is at work beside broken brick and soil. The open ground by the water is part of the same stretch. How many people, hours or rupees this clearing took is not stated here. Only what the photographs show is described.", "hi-IN": "टूटी ईंट और मिट्टी के पास एक एक्सकेवेटर काम करता दिखता है। जल के किनारे की खुली ज़मीन भी इसी परिसर का हिस्सा है। सफ़ाई में कितने लोग, कितने घंटे या कितने रुपये लगे, वह हिसाब यहाँ नहीं है। तस्वीर में जो दिखता है, वही कहा गया है।" },
    "story.c3Title": { "bn-IN": "বাঁশের কাঠামো", "en-IN": "The bamboo framework", "hi-IN": "बाँस का ढाँचा" },
    "story.c3": { "bn-IN": "জমি তৈরি হওয়ার পর বাঁশের কাঠামো বাঁধা হয়েছে। ছবিতে একজন কারিগর মুনশিভেরিতে বাঁশের ফ্রেমের কাজে আছেন। এটি কোনো নাম-দেওয়া প্রতিকৃতি নয়। অফিসিয়াল সাইটে প্রথম বাঁশের কথা ২১ সেপ্টেম্বর এবং ফ্রেম গড়ে ওঠার কথা ২৪ সেপ্টেম্বর লেখা আছে। এই ছবি সেই তারিখের বলে দাবি করা হয়নি।", "en-IN": "After the ground was prepared, the bamboo framework was tied. In the photograph a karigar is at the bamboo frame in Munshi Bheri. It is not a named portrait. The official site records first bamboo on 21 September and frames taking shape on 24 September. This photograph is not claimed as one of those dates.", "hi-IN": "ज़मीन तैयार होने के बाद बाँस का ढाँचा बाँधा गया। तस्वीर में एक कारीगर मुंशीभेरी में बाँस के फ्रेम पर काम कर रहे हैं। यह किसी नाम वाला चित्र नहीं है। आधिकारिक साइट पर पहला बाँस २१ सितम्बर और फ्रेम बनना २४ सितम्बर लिखा है। इस तस्वीर को उन तारीखों की नहीं कहा गया है।" },
    "story.c4Title": { "bn-IN": "পথ, রেলিং, সাজ ও সবুজ", "en-IN": "Paths, rails, decoration and greenery", "hi-IN": "रास्ते, रेलिंग, सजावट और हरियाली" },
    "story.c4": { "bn-IN": "তারপর এসেছে হাঁটার পথ, রেলিং, ছাদ ও সাজের কাজ। এক ছবিতে মণ্ডপের সাজ লাগানো হচ্ছে। আরেক ছবিতে জলাশয়ের ধারে গাছের থলি ও বাঁশের রেলিং। অফিসিয়াল সাইটে ৭ অক্টোবর ছাদ, হাঁটার পথ ও প্রথম সাজ, এবং ৮ অক্টোবর কুঁড়ে, রেলিং ও পুকুরের পথের কথা আছে। সেই খতিয়ান আলাদা। এই ছবিগুলো সেই দিনের বলে বাঁধা হয়নি।", "en-IN": "Then came walkways, railings, roofs and decoration. One photograph shows pandal decoration going up. Another shows bagged plants and a bamboo rail beside the water. The official site lists roofs, walkways and first decoration on 7 October, and huts, railings and the pond walk on 8 October. That log is separate. These photographs are not tied to those days.", "hi-IN": "फिर आए चलने के रास्ते, रेलिंग, छत और सजावट। एक तस्वीर में मंडप की सजावट लग रही है। दूसरी में जल के किनारे थैलों में पौधे और बाँस की रेलिंग है। आधिकारिक साइट पर ७ अक्टूबर छत, रास्ते और पहली सजावट, और ८ अक्टूबर झोपड़ी, रेलिंग और तालाब का रास्ता लिखा है। वह खाता अलग है। ये तस्वीरें उन दिनों से नहीं बाँधी गईं।" },
    "story.c5Title": { "bn-IN": "সন্ধ্যা ও আলো", "en-IN": "Evening and light", "hi-IN": "शाम और रोशनी" },
    "story.c5": { "bn-IN": "কাজ সন্ধ্যা পেরিয়েও চলেছে। রাতের ছবিতে বাঁশের মণ্ডপ, রেলিং ও সামনের পথ আলোয় দেখা যায়। অফিসিয়াল সাইটে ২৮ সেপ্টেম্বর রাতের কাজের কথা আছে। এই রাতের ছবি সেই তারিখের নয়। ", "en-IN": "Work continued past evening. The night photograph shows the lit bamboo pavilion, railings and the path in front. The official site records night work on 28 September. This night photograph is not that date.", "hi-IN": "काम शाम के बाद भी चला। रात की तस्वीर में बाँस का मंडप, रेलिंग और सामने का रास्ता रोशनी में दिखता है। आधिकारिक साइट पर २८ सितम्बर रात का काम लिखा है। यह रात की तस्वीर उस तारीख की नहीं है।" },
    "story.c6Title": { "bn-IN": "যাঁদের হাতে এল এই রূপ", "en-IN": "The people behind this change", "hi-IN": "जिनके हाथों से यह रूप आया" },
    "story.c6": { "bn-IN": "মণ্ডপ নিজে থেকে ওঠেনি। বাঁশ ছাঁটা, কাঠামো বাঁধা, জায়গা বুঝিয়ে দেওয়া, ভোরের আলো ও রাতের তালিকা—এসব মানুষের কাজ। সাক্ষাৎকারে যাঁরা নিজের নাম বলেছেন, তাঁদের কাজের কথা আলাদা পাতায় আছে। মুখ দেখে নাম ধরা হয়নি। কতজন কাজ করেছেন, সেই সংখ্যা এখানে নেই।", "en-IN": "The pavilion did not rise by itself. Shaping bamboo, tying the frame, showing people where to work, dawn light and night lists are people's work. Those who said their own names in the interview are on a separate page. No face has been matched to a name. How many people worked is not stated here.", "hi-IN": "मंडप अपने आप नहीं उठा। बाँस छीलना, ढाँचा बाँधना, जगह समझाना, भोर की रोशनी और रात की सूची—ये लोगों का काम है। साक्षात्कार में जिन्होंने अपना नाम कहा, उनकी बात अलग पन्ने पर है। चेहरा देखकर नाम नहीं जोड़ा गया। कितने लोगों ने काम किया, वह संख्या यहाँ नहीं है।" },
    "story.c7Title": { "bn-IN": "কেন এই বিজয়া সম্মিলনী", "en-IN": "Why this Vijay Sammelan", "hi-IN": "यह विजया सम्मेलन क्यों" },
    "story.c7": { "bn-IN": "আপনাদের হাতে গড়ে উঠেছে প্রত্যাবর্তন। এবার আপনাদের সম্মানে আমাদের বিজয়া সম্মিলনী। দিন রবিবার, ১ নভেম্বর ২০২৬। জায়গা প্রত্যাবর্তন দুর্গাপূজা প্রাঙ্গণ, মুনশিভেরি, মহিষবাথান, সল্টলেক সেক্টর ৫, কলকাতা ৭০০১০২। আয়োজক কারমযোগ ফর দ্য ২১স্ট সেঞ্চুরি ও ভারতীয় কৃষক সমাজ। পুজোর দিন ১৬ থেকে ২০ অক্টোবর ২০২৬। সম্মিলনী সেই দিনগুলোর মধ্যে নয়।", "en-IN": "Protyabortan has been built by your hands. This Vijay Sammelan is to honour you. The day is Sunday, 1 November 2026. The place is the Protyabortan Durga Puja venue, Munshi Bheri, Mahish Bathan, Salt Lake Sector V, Kolkata 700102. The organisers are KarmYog for the 21st Century and Bharatiya Krishak Samaj. The Puja days are 16 to 20 October 2026. The Sammelan is not one of those days.", "hi-IN": "आपके हाथों प्रत्यावर्तन बना है। अब आपके सम्मान में हमारी विजया सम्मेलनी है। दिन रविवार, १ नवम्बर २०२६। जगह प्रत्यावर्तन दुर्गा पूजा प्रांगण, मुंशीभेरी, महिषबाथान, साल्ट लेक सेक्टर ५, कोलकाता ७००१०२। आयोजक कार्मयोग फॉर द २१स्ट सेंचुरी और भारतीय कृषक समाज हैं। पूजा के दिन १६ से २० अक्टूबर २०२६ हैं। सम्मेलन उन दिनों में नहीं है।" },
    "story.calendarNote": { "bn-IN": "নিচের তারিখ অফিসিয়াল সাইটের কাজের খতিয়ান। উপরের কোনো ছবির সঙ্গে এই তারিখ জোড়া হয়নি।", "en-IN": "The dates below are the official site's work log. No photograph above is tied to one of these dates.", "hi-IN": "नीचे की तारीखें आधिकारिक साइट का काम का खाता हैं। ऊपर की किसी तस्वीर को इन तारीखों से नहीं जोड़ा गया है।" },
    "story.clearAlt": { "bn-IN": "ভাঙা ইট ও মাটির কাছে একটি হলুদ এক্সকাভেটর।", "en-IN": "A yellow excavator beside broken brick and soil.", "hi-IN": "टूटी ईंट और मिट्टी के पास एक पीला एक्सकेवेटर।" },
    "story.clearCap": { "bn-IN": "জমি পরিষ্কারের সময় একটি এক্সকাভেটর কাজ করছে।", "en-IN": "An excavator at work while the ground is being cleared.", "hi-IN": "ज़मीन साफ़ होते समय एक एक्सकेवेटर काम कर रहा है।" },
    "story.mudAlt": { "bn-IN": "কাদামাখা পথ ও নির্মাণবর্জ্য।", "en-IN": "A muddy path and construction waste.", "hi-IN": "कीचड़ भरा रास्ता और निर्माण कचरा।" },
    "story.mudCap": { "bn-IN": "অসমতল জমি ও কাদামাখা পথের মধ্যেই প্রস্তুতির কাজ এগোচ্ছিল।", "en-IN": "Preparation went on across uneven ground and a muddy path.", "hi-IN": "ऊँची-नीची ज़मीन और कीचड़ भरे रास्ते पर तैयारी का काम चल रहा था।" },
    "story.lakeAlt": { "bn-IN": "জলাশয়ের ধারে খোলা জমি।", "en-IN": "Open ground beside the water.", "hi-IN": "जल के किनारे खुली ज़मीन।" },
    "story.lakeCap": { "bn-IN": "জলাশয়ের ধারের এই পরিসরও জায়গাটির অংশ।", "en-IN": "This stretch beside the water is part of the same place.", "hi-IN": "जल के किनारे का यह हिस्सा भी उसी जगह का अंग है।" },
    "story.greenAlt": { "bn-IN": "জলাশয়ের ধারে সারি সারি গাছের থলি ও বাঁশের রেলিং।", "en-IN": "Rows of bagged plants and a bamboo rail beside the water.", "hi-IN": "जल के किनारे थैलों में पौधे और बाँस की रेलिंग।" },
    "story.greenCap": { "bn-IN": "জলাশয়ের ধারে সবুজ ও বাঁশের রেলিং।", "en-IN": "Greenery and a bamboo rail beside the water.", "hi-IN": "जल के किनारे हरियाली और बाँस की रेलिंग।" },
    "story.close": { "bn-IN": "আলোয় মণ্ডপ দেখা যায়। সেই আলোর আড়ালে থাকে কারিগরদের হাত। এই সম্মিলনী তাঁদের সম্মানের জন্য।", "en-IN": "The lit pavilion is what people see. Behind that light are the karigars' hands. This gathering is to honour them.", "hi-IN": "रोशनी में मंडप दिखता है। उस रोशनी के पीछे कारीगरों के हाथ हैं। यह सम्मेलन उनके सम्मान के लिए है।" },
    "story.calendarTitle": { "bn-IN": "অফিসিয়াল সাইটে কাজের ধাপ", "en-IN": "Work steps on the official site", "hi-IN": "आधिकारिक साइट पर काम के चरण" },
    "story.calendar": { "bn-IN": "প্রত্যাবর্তনের অফিসিয়াল সাইটে মুনশিভেরির কাজ এভাবে লেখা আছে: ২১ সেপ্টেম্বর প্রথম বাঁশ, ২৪ সেপ্টেম্বর দেয়াল ও মাচা, ২৮ সেপ্টেম্বর রাতের কাজ, ৭ অক্টোবর ছাদ ও হাঁটার পথ, ৮ অক্টোবর কুঁড়ে ও রেলিং, ৯ অক্টোবর মাটির কাজ। পুজো ১৬ থেকে ২০ অক্টোবর। বিজয়া সম্মিলনী আলাদা দিন: ১ নভেম্বর ২০২৬।", "en-IN": "The official Protyabortan site lists the Munshi Bheri work as: 21 September first bamboo, 24 September walls and platforms, 28 September night work, 7 October roofs and walkways, 8 October huts and railings, 9 October clay. The Puja is 16 to 20 October. The Vijay Sammelan is a different day: 1 November 2026.", "hi-IN": "प्रत्यावर्तन की आधिकारिक साइट पर मुंशीभेरी का काम इस तरह लिखा है: २१ सितम्बर पहला बाँस, २४ सितम्बर दीवार और मंच, २८ सितम्बर रात का काम, ७ अक्टूबर छत और रास्ते, ८ अक्टूबर झोपड़ी और रेलिंग, ९ अक्टूबर मिट्टी का काम। पूजा १६ से २० अक्टूबर है। विजया सम्मेलन अलग दिन है: १ नवम्बर २०२६।" },
    "people.watch": { "bn-IN": "সাক্ষাৎকারের ভিডিও দেখুন", "en-IN": "Watch the interview video", "hi-IN": "साक्षात्कार का वीडियो देखें" },
    "people.watchNote": { "bn-IN": "ভিডিওতে যাঁরা নিজে নাম বলেছেন, তাঁদের কাজের কথা এখানে আছে।", "en-IN": "These cards follow people who said their own names in the video.", "hi-IN": "ये कार्ड उन्हीं के हैं जिन्होंने वीडियो में अपना नाम कहा।" },
    "admin.exports": { "bn-IN": "তালিকা নামান", "en-IN": "Download lists", "hi-IN": "सूचियाँ डाउनलोड करें" },
    "admin.back": { "bn-IN": "তালিকায় ফিরুন", "en-IN": "Back to the list", "hi-IN": "सूची पर वापस जाएँ" },
    "admin.photo": { "bn-IN": "জমা দেওয়া ছবি", "en-IN": "Submitted photo", "hi-IN": "जमा की गई तस्वीर" },
    "admin.audit": { "bn-IN": "পরিবর্তনের খাতা", "en-IN": "Change record", "hi-IN": "बदलाव का खाता" },
    "admin.missing": { "bn-IN": "এই রেকর্ড পাওয়া যায়নি।", "en-IN": "This record was not found.", "hi-IN": "यह रिकॉर्ड नहीं मिला।" },
    "admin.find": { "bn-IN": "খুঁজুন", "en-IN": "Search", "hi-IN": "खोजें" },
    "admin.status": { "bn-IN": "যাচাইয়ের অবস্থা", "en-IN": "Verification status", "hi-IN": "जाँच की स्थिति" },
    "admin.note": { "bn-IN": "নোট", "en-IN": "Note", "hi-IN": "नोट" },
    "admin.badToken": { "bn-IN": "চাবি মেলেনি।", "en-IN": "The token did not match.", "hi-IN": "कुंजी नहीं मिली।" },
    "admin.created": { "bn-IN": "জমা হয়েছে", "en-IN": "Submitted", "hi-IN": "जमा हुआ" },
    "admin.updated": { "bn-IN": "শেষ পরিবর্তন", "en-IN": "Last change", "hi-IN": "आखिरी बदलाव" },
    "admin.locale": { "bn-IN": "ভাষা", "en-IN": "Language", "hi-IN": "भाषा" }
  };

  var current = "bn-IN";

  function normalize(lang) {
    if (lang === "en" || lang === "en-IN") return "en-IN";
    if (lang === "hi" || lang === "hi-IN") return "hi-IN";
    return "bn-IN";
  }

  function get() {
    try {
      return normalize(localStorage.getItem("kvs-lang"));
    } catch (err) {
      return current;
    }
  }

  function set(lang) {
    current = normalize(lang);
    try { localStorage.setItem("kvs-lang", current); } catch (err) { /* ignore */ }
    document.documentElement.lang = current.slice(0, 2);
    return current;
  }

  function t(key, vars) {
    var row = STR[key];
    var text = row ? (row[current] || row["bn-IN"]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.replace(new RegExp("\\{" + name + "\\}", "g"), String(vars[name]));
      });
    }
    return text;
  }

  function apply(scope) {
    var rootNode = scope || document;
    rootNode.querySelectorAll("[data-i18n]").forEach(function (node) {
      node.textContent = t(node.getAttribute("data-i18n"));
    });
    rootNode.querySelectorAll("[data-i18n-alt]").forEach(function (node) {
      node.alt = t(node.getAttribute("data-i18n-alt"));
    });
    rootNode.querySelectorAll("[data-i18n-aria]").forEach(function (node) {
      node.setAttribute("aria-label", t(node.getAttribute("data-i18n-aria")));
    });
    rootNode.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
      node.placeholder = t(node.getAttribute("data-i18n-placeholder"));
    });
  }

  function keys() {
    return Object.keys(STR);
  }

  function hasAllLanguages() {
    return keys().every(function (key) {
      var row = STR[key];
      return row["bn-IN"] && row["en-IN"] && row["hi-IN"];
    });
  }

  current = typeof localStorage === "undefined" ? "bn-IN" : get();

  return { t: t, set: set, get: get, apply: apply, keys: keys, hasAllLanguages: hasAllLanguages, STR: STR };
});
