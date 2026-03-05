import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

// Dynamic API Base URL - works on both localhost and Vercel
const API_BASE_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:5000/api'
  : '/api';

const quizDatabase = [
  {
    title: "Round 1: International Women's Day & Global Awareness",
    pool: [
      { q: "What is the official theme for International Women's Day 2026?", options: ["Give To Gain", "Invest in Women", "Break the Bias", "Equality for All"], a: "Give To Gain" },
      { q: "Globally, what three colors symbolize International Women's Day?", options: ["Purple, Green, and White", "Red, White, and Blue", "Black, White, and Pink", "Green, Yellow, and Blue"], a: "Purple, Green, and White" },
      { q: "What does the color purple specifically represent in the context of Women's Day?", options: ["Justice and Dignity", "Strength and Courage", "Peace and Harmony", "Love and Compassion"], a: "Justice and Dignity" },
      { q: "In what year did the United Nations officially recognize International Women's Day?", options: ["1975", "1985", "1995", "2005"], a: "1975" },
      { q: "Which country was the first in the world to grant women the right to vote in 1893?", options: ["New Zealand", "United States", "United Kingdom", "Australia"], a: "New Zealand" },
      { q: "What is the term for the invisible, systemic barrier that prevents women from rising to top corporate roles?", options: ["The Glass Ceiling", "The Concrete Wall", "The Iron Gate", "The Wooden Door"], a: "The Glass Ceiling" },
      { q: "Which month is globally recognized as Women's History Month?", options: ["March", "April", "May", "June"], a: "March" },
      { q: "What does the acronym SDG stand for in the context of the UN's goal for gender equality (Goal 5)?", options: ["Sustainable Development Goals", "Social Development Goals", "Strategic Development Goals", "Systematic Development Goals"], a: "Sustainable Development Goals" },
      { q: "What is the term used to describe the unpaid domestic work and caregiving women often do after returning home from their official jobs?", options: ["The Second Shift", "The Double Duty", "The Extra Load", "The Hidden Work"], a: "The Second Shift" },
      { q: "Which international organization annually publishes the 'Global Gender Gap Report'?", options: ["The World Economic Forum (WEF)", "United Nations", "World Health Organization", "International Monetary Fund"], a: "The World Economic Forum (WEF)" },
      { q: "The origins of International Women's Day are heavily rooted in which type of historical movements?", options: ["Labor and working conditions movements", "Peace movements", "Environmental movements", "Education movements"], a: "Labor and working conditions movements" },
      { q: "The UN's 2026 overarching campaign focuses on removing structural barriers under the slogan: 'Rights. Justice. Action. For...' whom?", options: ["ALL Women and Girls", "All People", "All Children", "All Families"], a: "ALL Women and Girls" },
      { q: "What is the term for acknowledging how different aspects of a person's identity (like gender, race, and class) combine to create unique modes of discrimination?", options: ["Intersectional Feminism", "Inclusive Feminism", "Global Feminism", "Modern Feminism"], a: "Intersectional Feminism" },
      { q: "The first official National Woman's Day was observed in 1909 in which country?", options: ["The United States", "Germany", "France", "United Kingdom"], a: "The United States" },
      { q: "Complete the famous empowerment phrase: 'Empowered women empower...'", options: ["Women", "Men", "Children", "Society"], a: "Women" },
      { q: "Globally, what fraction of men's salaries do women earn on average for equal work, according to recent UN data?", options: ["Approximately 77%", "Approximately 85%", "Approximately 90%", "Approximately 95%"], a: "Approximately 77%" },
      { q: "What color is used specifically as the global symbol for domestic violence awareness?", options: ["Purple", "Red", "Blue", "Green"], a: "Purple" },
      { q: "In several Eastern European countries, International Women's Day is celebrated in combination with which other holiday?", options: ["Mother's Day", "Father's Day", "Christmas", "Easter"], a: "Mother's Day" },
      { q: "What does the acronym 'GBV' stand for in human rights terminology?", options: ["Gender-Based Violence", "Global Basic Violence", "General Behavioral Violence", "Gender Behavioral Validation"], a: "Gender-Based Violence" },
      { q: "According to the WHO, approximately what proportion of women worldwide have experienced physical or sexual violence?", options: ["1 in 3", "1 in 4", "1 in 5", "1 in 2"], a: "1 in 3" }
    ]
  },
  {
    title: "Round 2: Workplace Rights, POSH & Corporate Equality",
    pool: [
      { q: "In Indian corporate law, what does 'POSH' stand for?", options: ["Prevention of Sexual Harassment", "Protection of Sexual Health", "Policy on Sexual Harassment", "Prevention of Social Harassment"], a: "Prevention of Sexual Harassment" },
      { q: "In what year was the POSH Act officially passed in India?", options: ["2013", "2010", "2016", "2019"], a: "2013" },
      { q: "What is the name of the mandatory committee that every company with 10 or more employees must form under the POSH Act?", options: ["Internal Complaints Committee (ICC)", "Employee Welfare Committee", "Safety Committee", "HR Committee"], a: "Internal Complaints Committee (ICC)" },
      { q: "According to the POSH Act, who must ideally chair the Internal Complaints Committee?", options: ["A senior-level woman employee", "The CEO", "The HR Manager", "An external consultant"], a: "A senior-level woman employee" },
      { q: "True or False: The POSH Act only applies to incidents that happen physically inside the office building.", options: ["False (It covers any 'extended workplace,' including company cabs and business trips)", "True", "Only for meetings", "Only for conferences"], a: "False (It covers any 'extended workplace,' including company cabs and business trips)" },
      { q: "What is the term for a harassment situation where a superior demands favors in exchange for a promotion or job security?", options: ["Quid Pro Quo", "Hostile Environment", "Retaliation", "Discrimination"], a: "Quid Pro Quo" },
      { q: "What term describes a workplace where intimidating or offensive behavior makes it impossible for an employee to do their job?", options: ["A Hostile Work Environment", "A Toxic Workplace", "A Stressful Environment", "An Uncomfortable Workplace"], a: "A Hostile Work Environment" },
      { q: "Under the Indian Maternity Benefit Act, what is the duration of paid maternity leave for a first or second child?", options: ["26 weeks", "12 weeks", "18 weeks", "24 weeks"], a: "26 weeks" },
      { q: "True or False: Retaliation (like demotion or firing) against a woman who files a POSH complaint is illegal.", options: ["True", "False", "Only if proven", "Only in private companies"], a: "True" },
      { q: "Are male employees protected under the Indian POSH Act of 2013?", options: ["No (The Act is currently women-centric, though many IT companies enforce gender-neutral internal policies)", "Yes", "Only in some states", "Only if they complain"], a: "No (The Act is currently women-centric, though many IT companies enforce gender-neutral internal policies)" },
      { q: "What is the maximum time limit to file a POSH complaint from the date of the last incident?", options: ["3 months (can be extended by 3 months under special circumstances)", "1 month", "6 months", "1 year"], a: "3 months (can be extended by 3 months under special circumstances)" },
      { q: "Does the POSH Act protect interns, consultants, and freelance contractors visiting the office?", options: ["Yes", "No", "Only interns", "Only consultants"], a: "Yes" },
      { q: "Which landmark 1997 Supreme Court guidelines paved the way for the POSH Act?", options: ["The Vishaka Guidelines", "The Nirbhaya Guidelines", "The Shah Bano Guidelines", "The Kesavananda Guidelines"], a: "The Vishaka Guidelines" },
      { q: "Can an anonymous complaint be officially investigated by the ICC under the POSH Act?", options: ["No, complaints must be in writing and signed", "Yes", "Only if emailed", "Only if approved by HR"], a: "No, complaints must be in writing and signed" },
      { q: "What Indian Act ensures that men and women receive the same pay for the same work?", options: ["The Equal Remuneration Act", "The Minimum Wages Act", "The Labor Act", "The Employment Act"], a: "The Equal Remuneration Act" },
      { q: "What is the corporate term for an extended, approved break from work, often used for caregiving or upskilling?", options: ["A Sabbatical", "A Vacation", "A Leave", "A Break"], a: "A Sabbatical" },
      { q: "True or False: Employers are legally required to conduct regular POSH awareness workshops for all employees.", options: ["True", "False", "Only annually", "Only for new hires"], a: "True" },
      { q: "What term describes the act of explaining something to a woman in a condescending or patronizing way, assuming she lacks knowledge?", options: ["Mansplaining", "Explaining", "Teaching", "Informing"], a: "Mansplaining" },
      { q: "If an employee is harassed by a client or third-party vendor, can she complain to her company's ICC?", options: ["Yes", "No", "Only if in office", "Only if reported to HR first"], a: "Yes" },
      { q: "What is a 'Zero FIR'?", options: ["A police complaint that can be filed at any police station, regardless of jurisdiction", "A rejected FIR", "An anonymous FIR", "A digital FIR"], a: "A police complaint that can be filed at any police station, regardless of jurisdiction" }
    ]
  },
  {
    title: "Round 3: Digital & Cyber Safety (IT Environment Focus)",
    pool: [
      { q: "What does '2FA' stand for in digital security?", options: ["Two-Factor Authentication", "Two-Step Authentication", "Two-Way Authentication", "Two-Level Authentication"], a: "Two-Factor Authentication" },
      { q: "What is the term for fraudulent emails disguised as official corporate communication to steal passwords?", options: ["Phishing", "Hacking", "Spying", "Trolling"], a: "Phishing" },
      { q: "What is considered a much safer alternative to receiving 2FA codes via SMS?", options: ["Using an Authenticator App (like Google or Microsoft Authenticator)", "Email codes", "Phone calls", "Physical tokens"], a: "Using an Authenticator App (like Google or Microsoft Authenticator)" },
      { q: "What tool should employees always use to encrypt their data when working from public Wi-Fi?", options: ["A VPN (Virtual Private Network)", "Antivirus software", "Firewall", "Proxy server"], a: "A VPN (Virtual Private Network)" },
      { q: "What is the malicious practice of publishing someone's private or identifying information online without consent?", options: ["Doxing", "Hacking", "Phishing", "Spamming"], a: "Doxing" },
      { q: "What is the official web portal to report cybercrimes in India?", options: ["www.cybercrime.gov.in", "www.india.gov.in", "www.police.gov.in", "www.crime.gov.in"], a: "www.cybercrime.gov.in" },
      { q: "What is the dedicated 4-digit national helpline number for financial cyber fraud in India?", options: ["1930", "100", "108", "112"], a: "1930" },
      { q: "What does 'NCII' stand for, a severe form of digital harassment against women?", options: ["Non-Consensual Intimate Imagery", "National Cyber Intelligence Initiative", "Network Control Internal Interface", "New Cyber Internet Issues"], a: "Non-Consensual Intimate Imagery" },
      { q: "What is 'Smishing'?", options: ["Phishing attacks carried out via SMS text messages", "Email phishing", "Phone phishing", "Social media phishing"], a: "Phishing attacks carried out via SMS text messages" },
      { q: "Why is it recommended to use a physical cover over a laptop webcam when not in use?", options: ["To prevent remote spying via malware/spyware", "To protect from dust", "To save battery", "To improve video quality"], a: "To prevent remote spying via malware/spyware" },
      { q: "What is the term for creating a fake online persona to deceive someone into a relationship or scam?", options: ["Catfishing", "Phishing", "Ghosting", "Trolling"], a: "Catfishing" },
      { q: "What is the safest way to dispose of an old hard drive containing sensitive personal data?", options: ["Physical destruction or cryptographic wiping (not just formatting)", "Throwing it away", "Selling it", "Donating it"], a: "Physical destruction or cryptographic wiping (not just formatting)" },
      { q: "What is the term for a software vulnerability that is discovered by attackers before the software vendor is aware of it?", options: ["A Zero-Day vulnerability", "A Known vulnerability", "A Patched vulnerability", "A Minor vulnerability"], a: "A Zero-Day vulnerability" },
      { q: "True or False: Deleting a photo from a social media platform guarantees it is permanently removed from the internet.", options: ["False", "True", "Only if deleted within 24 hours", "Only on some platforms"], a: "False" },
      { q: "What is the term for repeatedly sending unwanted messages, tracking, or monitoring someone electronically?", options: ["Cyberstalking", "Phishing", "Spamming", "Hacking"], a: "Cyberstalking" },
      { q: "What does the 'S' in HTTPS signify when browsing the web?", options: ["Secure (indicating the connection is encrypted)", "Safe", "Speed", "Standard"], a: "Secure (indicating the connection is encrypted)" },
      { q: "If someone threatens to release private digital content unless a ransom is paid, what is this crime called?", options: ["Sextortion", "Phishing", "Hacking", "Blackmail"], a: "Sextortion" },
      { q: "True or False: Using 'Incognito' or 'Private Browsing' mode hides your internet activity from your employer's network administrators.", options: ["False", "True", "Only on company devices", "Only on personal devices"], a: "False" },
      { q: "What is the most secure method for managing multiple complex passwords?", options: ["Using a reputable Password Manager", "Writing them down", "Using the same password", "Memorizing them"], a: "Using a reputable Password Manager" },
      { q: "Why should you turn off GPS location tagging on your smartphone camera app?", options: ["To prevent stalkers from extracting exact coordinates (EXIF data) from uploaded photos", "To save battery", "To improve photo quality", "To reduce file size"], a: "To prevent stalkers from extracting exact coordinates (EXIF data) from uploaded photos" }
    ]
  },
  {
    title: "Round 4: Commute & Mobility Safety (Cab Onboarding Focus)",
    pool: [
      { q: "What is the single Pan-India emergency number for Police, Fire, and Ambulance?", options: ["112", "100", "108", "101"], a: "112" },
      { q: "What is the name of the official, comprehensive women's safety app launched by the Tamil Nadu Police?", options: ["Kaaval Uthavi", "Women Safety App", "112 India", "Himmat"], a: "Kaaval Uthavi" },
      { q: "What is the very first thing an employee should verify before stepping into a company-assigned cab?", options: ["The driver's identity and the vehicle's registration number against the app/roster", "The cab's cleanliness", "The music playing", "The air conditioning"], a: "The driver's identity and the vehicle's registration number against the app/roster" },
      { q: "When traveling in a cab at night, what digital feature should you immediately activate with a trusted contact?", options: ["Live Location sharing", "Video calling", "Text messaging", "Social media updates"], a: "Live Location sharing" },
      { q: "What mechanical check should you quickly perform on the cab door when getting in?", options: ["Ensure the Child Lock is turned OFF", "Check the seat belt", "Check the windows", "Check the mirrors"], a: "Ensure the Child Lock is turned OFF" },
      { q: "For maximum safety and visibility, where is the best place to sit in an assigned cab?", options: ["In the rear seat, diagonally opposite the driver", "Next to the driver", "In the front passenger seat", "In the middle of the back seat"], a: "In the rear seat, diagonally opposite the driver" },
      { q: "If a cab driver takes an unfamiliar or unapproved route, what is the immediate protocol?", options: ["Question the driver and immediately alert the mobility/transport helpdesk", "Stay quiet", "Call the police", "Get out immediately"], a: "Question the driver and immediately alert the mobility/transport helpdesk" },
      { q: "What is the 'Buddy System' in corporate commuting?", options: ["Traveling or walking to transit points with a colleague so no one is alone", "Using a buddy app", "Having a travel partner", "Group travel"], a: "Traveling or walking to transit points with a colleague so no one is alone" },
      { q: "What is the dedicated National Women's Helpline Number in India?", options: ["1091", "100", "108", "112"], a: "1091" },
      { q: "If the cab driver stops to pick up an unauthorized passenger, what should you do?", options: ["Object immediately, refuse the ride, and contact the transport desk", "Stay in the cab", "Get out and walk", "Call a friend"], a: "Object immediately, refuse the ride, and contact the transport desk" },
      { q: "True or False: A company's safety liability generally includes ensuring a female employee is safely dropped off at her gate during night shifts.", options: ["True", "False", "Only in some companies", "Only in metros"], a: "True" },
      { q: "Pressing a smartphone's power button rapidly 3 to 5 times usually triggers what built-in feature?", options: ["Emergency SOS", "Camera", "Flashlight", "Voice assistant"], a: "Emergency SOS" },
      { q: "Why is it dangerous to wear noise-canceling headphones while waiting for a cab at night?", options: ["It eliminates auditory situational awareness, making you vulnerable to approach", "It blocks emergency sounds", "It reduces visibility", "It causes dizziness"], a: "It eliminates auditory situational awareness, making you vulnerable to approach" },
      { q: "What is the purpose of the 'Route Tracker' feature used by IT mobility teams?", options: ["To monitor the cab in real-time and trigger an alert if it deviates from the approved path", "To track speed", "To monitor fuel", "To track passengers"], a: "To monitor the cab in real-time and trigger an alert if it deviates from the approved path" },
      { q: "If your company cab breaks down on a dark road, what is the safest course of action?", options: ["Stay inside the locked car and immediately call the company emergency transport number", "Get out and walk", "Flag down another car", "Call the police"], a: "Stay inside the locked car and immediately call the company emergency transport number" },
      { q: "True or False: Employees are expected to engage in personal conversations with cab drivers to maintain a friendly environment.", options: ["False (Keep communication strictly professional and route-related)", "True", "Only if the driver starts", "Only for short trips"], a: "False (Keep communication strictly professional and route-related)" },
      { q: "What is a 'Safe Word' in the context of commuting?", options: ["A pre-agreed code word used on a phone call to secretly signal to a friend that you are in danger", "A password for the cab", "A word to call the driver", "A safety phrase"], a: "A pre-agreed code word used on a phone call to secretly signal to a friend that you are in danger" },
      { q: "What should you have ready in your hand before you step out of the cab at your destination?", options: ["Your house keys or building access card", "Your phone", "Your wallet", "Your bag"], a: "Your house keys or building access card" },
      { q: "If you feel uneasy in a moving cab, what psychological de-escalation tactic is commonly recommended?", options: ["Make a loud, simulated phone call saying exactly where you are and that someone is waiting outside for you", "Stay silent", "Confront the driver", "Get out at traffic light"], a: "Make a loud, simulated phone call saying exactly where you are and that someone is waiting outside for you" },
      { q: "Which Indian railway force launched the 'Meri Saheli' initiative for the security of women traveling alone?", options: ["The Railway Protection Force (RPF)", "Railway Police", "Indian Railways", "Railway Board"], a: "The Railway Protection Force (RPF)" }
    ]
  },
  {
    title: "Round 5: Inspiring Women in Tech & Leadership",
    pool: [
      { q: "Who is historically widely recognized as the world's first computer programmer?", options: ["Ada Lovelace", "Grace Hopper", "Katherine Johnson", "Marie Curie"], a: "Ada Lovelace" },
      { q: "Which female computer scientist invented the Spanning Tree Protocol (STP), a foundational concept in network routing?", options: ["Radia Perlman", "Ada Lovelace", "Grace Hopper", "Katherine Johnson"], a: "Radia Perlman" },
      { q: "Which pioneer in computer programming co-developed COBOL and is credited with popularizing the term 'computer bug'?", options: ["Grace Hopper", "Ada Lovelace", "Radia Perlman", "Katherine Johnson"], a: "Grace Hopper" },
      { q: "Name the prominent woman who founded the global organization 'Girls Who Code.'", options: ["Reshma Saujani", "Sheryl Sandberg", "Indra Nooyi", "Sudha Murty"], a: "Reshma Saujani" },
      { q: "Who became the first Indian woman to found and lead a unicorn tech company (Nykaa)?", options: ["Falguni Nayar", "Kiran Mazumdar-Shaw", "Roshni Nadar", "Sudha Murty"], a: "Falguni Nayar" },
      { q: "Who is the Chairperson of HCLTech, making her one of the most prominent women in Indian IT?", options: ["Roshni Nadar Malhotra", "Falguni Nayar", "Kiran Mazumdar-Shaw", "Sudha Murty"], a: "Roshni Nadar Malhotra" },
      { q: "Which former COO of Facebook authored the highly influential corporate book 'Lean In'?", options: ["Sheryl Sandberg", "Reshma Saujani", "Indra Nooyi", "Susan Wojcicki"], a: "Sheryl Sandberg" },
      { q: "Which NASA mathematician played a critical role in the success of the Apollo 11 moon landing?", options: ["Katherine Johnson", "Ada Lovelace", "Grace Hopper", "Radia Perlman"], a: "Katherine Johnson" },
      { q: "Who is the celebrated Indian author, philanthropist, and former chairperson of the Infosys Foundation?", options: ["Sudha Murty", "Falguni Nayar", "Roshni Nadar", "Kiran Mazumdar-Shaw"], a: "Sudha Murty" },
      { q: "Who is the current female CEO of the global tech giant Oracle Corporation?", options: ["Safra Catz", "Ginni Rometty", "Indra Nooyi", "Sheryl Sandberg"], a: "Safra Catz" },
      { q: "Who was the first woman of Indian origin to go to space?", options: ["Kalpana Chawla", "Sunita Williams", "Indra Nooyi", "Sudha Murty"], a: "Kalpana Chawla" },
      { q: "Which famous Hollywood actress co-invented a frequency-hopping technology that laid the groundwork for modern Wi-Fi and Bluetooth?", options: ["Hedy Lamarr", "Grace Kelly", "Audrey Hepburn", "Marilyn Monroe"], a: "Hedy Lamarr" },
      { q: "Who was the first female CEO of IBM?", options: ["Ginni Rometty", "Safra Catz", "Indra Nooyi", "Sheryl Sandberg"], a: "Ginni Rometty" },
      { q: "Who served as the highly influential CEO of PepsiCo for 12 years?", options: ["Indra Nooyi", "Sheryl Sandberg", "Ginni Rometty", "Safra Catz"], a: "Indra Nooyi" },
      { q: "What is the 'Matilda Effect' in science and tech?", options: ["The bias of denying women credit for their scientific achievements, often attributing them to male colleagues", "The effect of women in leadership", "The impact of women in tech", "The role of women in innovation"], a: "The bias of denying women credit for their scientific achievements, often attributing them to male colleagues" },
      { q: "Which famous Indian scientist is celebrated as the 'Missile Woman of India'?", options: ["Tessy Thomas", "Kalpana Chawla", "Sunita Williams", "Indra Nooyi"], a: "Tessy Thomas" },
      { q: "Who is the current female Chief Financial Officer (CFO) of Microsoft?", options: ["Amy Hood", "Sheryl Sandberg", "Ginni Rometty", "Safra Catz"], a: "Amy Hood" },
      { q: "Who was the first Indian woman to win an Olympic medal?", options: ["Karnam Maleswari", "P.T. Usha", "Mary Kom", "Saina Nehwal"], a: "Karnam Maleswari" },
      { q: "Name the former CEO of YouTube who was instrumental in Google's early growth.", options: ["Susan Wojcicki", "Sheryl Sandberg", "Reshma Saujani", "Indra Nooyi"], a: "Susan Wojcicki" },
      { q: "Name the Nobel Peace Prize laureate known globally for her activism for girls' education.", options: ["Malala Yousafzai", "Mother Teresa", "Amartya Sen", "Nelson Mandela"], a: "Malala Yousafzai" }
    ]
  }
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function App() {
  const [currentPage, setCurrentPage] = useState('greeting');
  const [adminInput, setAdminInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userEmployeeId, setUserEmployeeId] = useState('');
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [roundsData, setRoundsData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [review, setReview] = useState([]);
  const [rank, setRank] = useState(null);
  const [quote, setQuote] = useState('');
  const [sweetMessage, setSweetMessage] = useState('');
  const [selectedResponses, setSelectedResponses] = useState([]);
  
  // Leaderboard and Admin page states
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [adminDataLoading, setAdminDataLoading] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    if (started && !showResults) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, currentRound, showResults]);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleNext(true);
    }
  }, [timeLeft]);

  // Function to fetch leaderboard data
  const fetchLeaderboardData = () => {
    fetch(`${API_BASE_URL}/leaderboard`)
      .then(resp => resp.json())
      .then(data => {
        setLeaderboardData(data);
        setLeaderboardLoading(false);
        setAdminDataLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setLeaderboardLoading(false);
        setAdminDataLoading(false);
      });
  };

  useEffect(() => {
    let pollInterval;

    // Fetch leaderboard data when page changes to leaderboard or admin
    if (currentPage === 'leaderboard' || currentPage === 'admin') {
      setLeaderboardLoading(true);
      setAdminDataLoading(true);
      
      // Fetch immediately on page load
      fetchLeaderboardData();

      // Set up auto-refresh every 5 seconds
      pollInterval = setInterval(() => {
        fetchLeaderboardData();
      }, 5000);
    }

    // Cleanup interval when page changes away from leaderboard/admin
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [currentPage]);

  const startQuiz = () => {
    if (!userName.trim()) {
      alert('Please enter your name to start.');
      return;
    }
    if (!userEmail.trim()) {
      alert('Please enter your email to start.');
      return;
    }
    if (!disclosureAccepted) {
      alert('Please accept the disclosure to proceed.');
      return;
    }

    const prepared = quizDatabase.map(rnd => {
      const selected = shuffleArray(rnd.pool).slice(0, 4).map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }));
      return { title: rnd.title, questions: selected };
    });
    setRoundsData(prepared);
    setStarted(true);
    setCurrentPage('quiz');
    setTimeLeft(60);
  };

  const handleSelect = (roundIdx, qIdx, choice) => {
    setAnswers(a => ({ ...a, [`${roundIdx}:${qIdx}`]: choice }));
  };

  const handleNext = (fromTimer = false) => {
    if (!fromTimer) {
      const current = roundsData[currentRound];
      for (let i = 0; i < current.questions.length; i++) {
        if (!answers[`${currentRound}:${i}`]) {
          alert('Please answer all 4 questions before moving to the next round!');
          return;
        }
      }
    }
    if (currentRound < roundsData.length - 1) {
      setCurrentRound(c => c + 1);
      setTimeLeft(60);
    } else {
      submitResults();
    }
  };

  const computeResults = () => {
    let s = 0;
    const rev = [];
    roundsData.forEach((rnd, ri) => {
      rnd.questions.forEach((q, qi) => {
        const key = `${ri}:${qi}`;
        const user = answers[key] || 'No answer';
        const correct = q.a;
        if (user === correct) s++;
        rev.push({ round: ri + 1, question: q.q, user, correct });
      });
    });
    return { score: s, review: rev };
  };

  const updateLeaderboard = async (newScore) => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      const board = await response.json();
      
      // Calculate rank based on current leaderboard
      const betterScores = board.filter(entry => entry.score > newScore).length;
      setRank(betterScores + 1);
    } catch (error) {
      console.error('Error updating leaderboard:', error);
      // Fallback if server is not available
      setRank(1);
    }
  };

  const getPersonalizedQuotes = () => {
    const inspirationalQuotes = [
      `"${userName}, you're a force of nature—your strength inspires change!"`,
      `"${userName}, thank you for standing up for women's safety and rights!"`,
      `"Every woman deserves respect, and ${userName}, you're proving it!"`,
      `"${userName}, you're not just taking a quiz—you're becoming an advocate!"`,
      `"${userName}, your knowledge is power. Keep spreading awareness!"`,
      `"Women like ${userName} make the world a safer place!"`,
      `"${userName}, you've got the awareness to protect yourself and others!"`,
      `"Happy Women's Day, ${userName}! Keep shining and never stop fighting for what's right!"`,
      `"${userName}, your commitment to women's safety matters so much!"`,
      `"${userName}, you're a champion for women's empowerment!"`,
      `"Strong women like ${userName} build strong nations!"`,
      `"${userName}, celebrate yourself—you deserve it this Women's Day!"`,
      `"Today and every day, ${userName}, you are valued and powerful!"`,
      `"${userName}, being a woman is your superpower—use it wisely!"`,
      `"${userName}, the world needs more voices like yours standing up for what's right!"`
    ];

    const sweetMessages = [
      `${userName}, go celebrate yourself today—you deserve all the happiness!`,
      `${userName}, your brilliance brightens the world. Enjoy your special day!`,
      `Make today magical, ${userName}! You've earned it!`,
      `${userName}, remember: you're capable of incredible things. Believe in yourself!`,
      `Today is your day to shine, ${userName}. Go make it unforgettable!`,
      `${userName}, you inspire everyone around you. Keep being amazing!`,
      `Go forward with confidence, ${userName}! The world is better with you in it!`,
      `${userName}, you're not just smart—you're kind, brave, and unstoppable!`,
      `Celebrate your strength today, ${userName}! You've got this!`,
      `${userName}, may your day be filled with joy, laughter, and endless possibilities!`
    ];

    const randomQuote = inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)];
    const randomMessage = sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
    
    return { quote: randomQuote, message: randomMessage };
  };

  const submitResults = () => {
    const { score: finalScore, review: rev } = computeResults();
    setScore(finalScore);
    setReview(rev);
    updateLeaderboard(finalScore);
    const { quote: finalQuote, message: finalMessage } = getPersonalizedQuotes();
    setQuote(finalQuote);
    setSweetMessage(finalMessage);
    setShowResults(true);
    const payload = { name: userName, email: userEmail, employeeId: userEmployeeId, answers, score: finalScore, timestamp: new Date().toISOString() };
    fetch(`${API_BASE_URL}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(resp => resp.json())
      .then(data => {
        console.log('server response', data);
        // Immediately refresh leaderboard data after submission
        fetchLeaderboardData();
      })
      .catch(err => console.error('Submission error', err));
  };

  const accessAdmin = () => {
    const adminPassword = 'admin123';
    const adminToken = 'womensday_admin_2024';
    
    if (adminInput === adminPassword || adminInput === adminToken) {
      setCurrentPage('admin');
      setAdminInput('');
    } else {
      alert('Invalid admin credentials. Access denied.');
      setAdminInput('');
    }
  };

  const exportToExcel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leaderboard`);
      const allResponses = await response.json();

      if (allResponses.length === 0) {
        alert('No responses to export.');
        return;
      }

      // Prepare data for Excel
      const excelData = allResponses.map((entry, idx) => ({
        'S.No': idx + 1,
        'Name': entry.name,
        'Email': entry.email,
        'Score': `${entry.score}/20`,
        'Date': new Date(entry.date).toLocaleString(),
        'Percentage': `${((entry.score / 20) * 100).toFixed(1)}%`
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);
      
      // Auto-size columns
      const colWidths = [
        { wch: 5 },  // S.No
        { wch: 20 }, // Name
        { wch: 30 }, // Email
        { wch: 8 }, // Score
        { wch: 20 }, // Date
        { wch: 12 }  // Percentage
      ];
      ws['!cols'] = colWidths;
      
      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Quiz Responses');
      
      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `womens_day_quiz_responses_${date}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, filename);
      alert(`Excel file "${filename}" has been downloaded successfully!`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Error exporting to Excel. Make sure the server is running.');
    }
  };

  const clearAllResponses = async () => {
    if (window.confirm('Are you sure you want to clear ALL responses? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/leaderboard`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          alert('All responses have been cleared.');
          // Refresh data immediately instead of reloading page
          fetchLeaderboardData();
          setSelectedResponses([]);
        }
      } catch (error) {
        console.error('Error clearing responses:', error);
        alert('Error clearing responses. Make sure the server is running.');
      }
    }
  };

  const clearSelectedResponses = async (indicesToRemove) => {
    if (indicesToRemove.length === 0) {
      alert('No responses selected for deletion.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${indicesToRemove.length} selected response(s)?`)) {
      try {
        // Get current leaderboard to find IDs
        const response = await fetch(`${API_BASE_URL}/leaderboard`);
        const allResponses = await response.json();
        
        // Map indices to IDs
        const idsToRemove = indicesToRemove.map(idx => allResponses[idx]?.id).filter(Boolean);
        
        const deleteResponse = await fetch(`${API_BASE_URL}/leaderboard/delete-multiple`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: idsToRemove })
        });
        
        const result = await deleteResponse.json();
        
        if (result.success) {
          alert(`${idsToRemove.length} response(s) have been deleted.`);
          // Refresh data immediately instead of reloading page
          fetchLeaderboardData();
          setSelectedResponses([]);
        }
      } catch (error) {
        console.error('Error deleting responses:', error);
        alert('Error deleting responses. Make sure the server is running.');
      }
    }
  };

  if (currentPage === 'greeting') {
    return (
      <div className="container greeting-container">
        <div className="greeting-content">
          <h1>🌸 Happy International Women's Day! 🌸</h1>
          
          <div className="greeting-message">
            <h2>🎉 Celebrating the Strength, Resilience, and Achievements of Women Everywhere! 🎉</h2>
            
            <div className="greeting-text">
              <p>Today, we honor the incredible women who have shaped our world with their courage, intelligence, and unwavering spirit.</p>
              
              <p>From trailblazing leaders to everyday heroes, women continue to break barriers, challenge norms, and inspire change.</p>
              
              <p><strong>Your voice matters. Your strength matters. Your dreams matter.</strong></p>
              
              <p>Take this moment to celebrate yourself and join us in learning about women's safety and empowerment!</p>
            </div>
            
            <div className="greeting-icons">
              <span>💪</span>
              <span>❤️</span>
              <span>✨</span>
              <span>🌟</span>
              <span>👑</span>
            </div>
          </div>
          
          <button type="button" className="greeting-btn" onClick={() => setCurrentPage('intro')}>
            Start Your Journey ✨
          </button>
          
          <div className="company-logos">
            <p style={{ color: '#666', marginBottom: '15px', fontWeight: '500' }}>Organized by:</p>
            <div className="logos-container">
              <div className="logo-box">
                <img src="/consulttrans-logo.svg" alt="ConsultTrans" className="company-logo" />
              </div>
              <div className="logo-box" style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '10px' }}>
                <img src="/sutherland-logo.svg" alt="Sutherland" className="company-logo" style={{ backgroundColor: '#ffffff', padding: '5px', borderRadius: '4px' }} />
              </div>
            </div>
          </div>
          
          <div className="greeting-footer">
            <p>International Women's Day - March 8th</p>
            <p>#IWD2026 #WomenEmpowerment #BreakTheBias</p>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'intro') {
    return (
      <div className="container">
        <h1>Women's Safety Quiz</h1>
        <p>Welcome! This quiz has 5 rounds with 4 random questions each. You'll have <strong>1 minute</strong> per round.</p>
        <div className="name-field">
          <label htmlFor="userName"><strong>Full Name:</strong></label>
          <input type="text" id="userName" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your full name..." />
        </div>
        <div className="name-field">
          <label htmlFor="userEmail"><strong>Email Address:</strong></label>
          <input type="email" id="userEmail" value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="Enter your email..." />
        </div>
        <div className="disclosure-box">
          <h3>📋 Data Disclosure</h3>
          <p>By participating, you consent to us collecting your name, email, quiz responses, and score. This data will be used to:</p>
          <ul>
            <li>Display your performance on the leaderboard</li>
            <li>Provide feedback and insights on women's safety awareness</li>
            <li>Improve our quiz content and features</li>
          </ul>
          <p>Your data is treated with confidentiality and will not be shared without permission.</p>
          <label className="checkbox-label">
            <input type="checkbox" checked={disclosureAccepted} onChange={e => setDisclosureAccepted(e.target.checked)} />
            I understand and accept the data disclosure
          </label>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" onClick={startQuiz}>Start Quiz</button>
          <button type="button" className="secondary-btn" onClick={() => setCurrentPage('leaderboard')}>View Leaderboard</button>
          <button type="button" className="secondary-btn" onClick={() => setCurrentPage('admin-login')}>🔐 Admin Login</button>
        </div>
      </div>
    );
  }

  if (currentPage === 'admin-login') {
    return (
      <div className="container">
        <h1>🔐 Admin Dashboard Login</h1>
        <p style={{ textAlign: 'center', marginBottom: '30px', color: '#666' }}>Enter your admin credentials to access the dashboard</p>
        
        <div className="quote-box">
          <div className="name-field">
            <label htmlFor="adminPassword"><strong>Admin Password:</strong></label>
            <input 
              type="password" 
              id="adminPassword"
              value={adminInput} 
              onChange={e => setAdminInput(e.target.value)} 
              placeholder="Enter admin password..." 
              onKeyPress={(e) => e.key === 'Enter' && accessAdmin()}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button type="button" onClick={accessAdmin}>Login to Admin Dashboard</button>
          <button type="button" className="secondary-btn" onClick={() => {
            setAdminInput('');
            setCurrentPage('intro');
          }}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (currentPage === 'leaderboard') {
    const handleBackToHome = () => {
      // Reset all form fields
      setUserName('');
      setUserEmail('');
      setUserEmployeeId('');
      setDisclosureAccepted(false);
      setStarted(false);
      setCurrentRound(0);
      setAnswers({});
      setTimeLeft(120);
      setShowResults(false);
      setScore(0);
      setReview([]);
      setRank(null);
      setQuote('');
      setSweetMessage('');
      setCurrentPage('intro');
    };

    return (
      <div className="container">
        <h1>🏆 Leaderboard</h1>
        {leaderboardLoading ? (
          <p>Loading leaderboard...</p>
        ) : leaderboardData.length === 0 ? (
          <p>No participants yet. Be the first to take the quiz!</p>
        ) : (
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, idx) => (
                <tr key={entry.id} className={idx === 0 ? 'top-scorer' : ''}>
                  <td>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}</td>
                  <td>{entry.name}</td>
                  <td>{entry.score} / 20</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button type="button" onClick={handleBackToHome}>Back to Home</button>
      </div>
    );
  }

  if (currentPage === 'admin') {
    const handleSelectResponse = (idx) => {
      setSelectedResponses(prev => 
        prev.includes(idx) 
          ? prev.filter(i => i !== idx)
          : [...prev, idx]
      );
    };

    const handleClearSelected = () => {
      clearSelectedResponses(selectedResponses);
      setSelectedResponses([]); // Clear selection after deletion
    };

    return (
      <div className="container admin-container">
        <h1>👨‍💼 Admin Dashboard</h1>
        
        {/* Admin Controls */}
        <div className="admin-controls">
          <button type="button" onClick={exportToExcel} className="export-btn">
            📊 Export to Excel
          </button>
          <button type="button" onClick={clearAllResponses} className="clear-all-btn">
            🗑️ Clear All Responses
          </button>
          {selectedResponses.length > 0 && (
            <button type="button" onClick={handleClearSelected} className="clear-selected-btn">
              🗑️ Delete Selected ({selectedResponses.length})
            </button>
          )}
        </div>

        <h2>All Quiz Responses ({leaderboardData.length})</h2>
        
        {adminDataLoading ? (
          <p>Loading responses...</p>
        ) : leaderboardData.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          <div className="admin-table">
            {leaderboardData.map((entry, idx) => (
              <div key={entry.id} className={`response-card ${selectedResponses.includes(idx) ? 'selected' : ''}`}>
                <div className="response-header">
                  <input
                    type="checkbox"
                    checked={selectedResponses.includes(idx)}
                    onChange={() => handleSelectResponse(idx)}
                    className="response-checkbox"
                  />
                  <h3>#{idx + 1} - {entry.name}</h3>
                </div>
                <p><strong>Email:</strong> {entry.email}</p>
                <p><strong>Score:</strong> {entry.score} / 20 ({((entry.score / 20) * 100).toFixed(1)}%)</p>
                <p><strong>Date:</strong> {new Date(entry.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
        
        <button type="button" onClick={() => setCurrentPage('intro')}>Back to Home</button>
      </div>
    );
  }

  if (currentPage === 'quiz' && !showResults) {
    if (roundsData.length === 0) return null;
    const round = roundsData[currentRound];
    return (
      <div className="container">
        <h2>{round.title}</h2>
        <div id="timer-display">Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? `0${timeLeft % 60}` : timeLeft % 60}</div>
        <div>
          {round.questions.map((q, qi) => (
            <div key={qi} className="question-block">
              <div className="question-title">Q{qi + 1}: {q.q}</div>
              {q.options.map((opt, oi) => (
                <label key={oi}>
                  <input type="radio" name={`${currentRound}:${qi}`} value={opt} checked={answers[`${currentRound}:${qi}`] === opt} onChange={() => handleSelect(currentRound, qi, opt)} /> {opt}
                </label>
              ))}
            </div>
          ))}
        </div>
        {currentRound < roundsData.length - 1 ? (
          <button onClick={() => handleNext(false)}>Next Round</button>
        ) : (
          <button onClick={submitResults}>Submit Final Answers</button>
        )}
      </div>
    );
  }

  if (showResults) {
    const handleResetQuiz = () => {
      // Clear all state
      setUserName('');
      setUserEmail('');
      setUserEmployeeId('');
      setDisclosureAccepted(false);
      setStarted(false);
      setCurrentRound(0);
      setAnswers({});
      setTimeLeft(60);
      setShowResults(false);
      setScore(0);
      setReview([]);
      setRank(null);
      setQuote('');
      setSweetMessage('');
      setCurrentPage('intro');
      // Refresh the page
      window.location.reload();
    };

    return (
      <div className="container">
        <h1>🎉 Quiz Completed!</h1>
        <h2>{userName}, you scored {score} out of {roundsData.length * 4}</h2>
        {rank && <p className="rank-badge">Your Rank: <strong>{rank}</strong> {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : ''}</p>}
        <div className="review-section">
          <h3>Answer Review</h3>
          {review.map((r, idx) => (
            <div key={idx} className="question-block">
              <div className="question-title">Round {r.round}: {r.question}</div>
              <p>Your answer: <span className={r.user === r.correct ? 'correct' : 'wrong'}>{r.user}</span></p>
              <p>Correct answer: <strong>{r.correct}</strong></p>
            </div>
          ))}
        </div>
        <div className="quote-box">
          <div className="main-quote">{quote}</div>
          <div className="sweet-message">✨ {sweetMessage}</div>
        </div>
        <button type="button" onClick={() => setCurrentPage('leaderboard')}>View Leaderboard</button>
        <button type="button" onClick={handleResetQuiz}>Take Quiz Again</button>
      </div>
    );
  }
}

export default App;
