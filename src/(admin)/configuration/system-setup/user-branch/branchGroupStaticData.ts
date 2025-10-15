import { User } from 'lucide-react';
type UserDetail = {
  group: string;
  subGroupName: string;
  menuName: string;
  slug: string;
  displayOrder: string;
  isActive: string;
  selected: boolean;
};

const slugify = (province: string, name: string): string => {
  return `${province.toLowerCase().replace(/ /g, "_")}__${name
    .toLowerCase()
    .replace(/ /g, "_")
    .replace(/,/g, "")
    .replace(/\./g, "")}`;
};

const provinceData: Record<string, string[]> = {
  "Gandaki Province": [
    "Gandaki Province", "Gorkha", "Damauli", "Besisahar", "Pokhara", "Syangja", "Baglung", "Beni",
    "Abukhaireni", "Waling", "Kusma", "Lekhnath", "Pokharebagar", "Galyan", "Sotipasal", "Putalibazar",
    "Huwas", "Kusmisera", "Bhimad", "Sundar Bazar", "Dulegauda", "Palungtar", "Galkot", "Duipiple"
  ],
  "Lumbini Province": [
    "Lumbini Province", "Kawasoti", "Rolpa", "Pyuthan", "Dang", "Tulsipur", "Lamahi", "Bhairahwa",
    "Butwal", "Jitpur", "Sandhikharka", "Gulmi", "Khalanga", "Madigram", "Nepalgunj", "Kohalpur",
    "Palpa", "Parasi", "Gopigunj", "Rajhar", "Lumbini", "Murgiya", "Taulihawa", "Rampur, Palpa",
    "Thada", "Bhalubang", "Devdaha", "Bhalwari", "Chandrauta", "Bardaghat", "Khajura", "Bansgadhi",
    "Samsergunj", "Rapti Sonari"
  ],
  "Karnali Province": [
    "Karnali Province", "West Rukum", "Jajarkot", "Surkhet", "Jumla", "Dailekh", "Humla", "Salyan",
    "Mehelkuna", "West Surkhet", "Taratal", "Magragadhi", "Salli bazar", "Manma", "Mugu", "Sinja",
    "Dolpa", "Tharmare", "Dunai"
  ],
  "Sudurpashchim Province": [
    "Sudurpashchim Province", "Gulariya", "Rajapur", "Bhurigaun", "Bajhang", "Accham", "Bajura",
    "Dipayal", "Tikapur", "Lamki", "Dhangadhi", "Attariya", "Mahendranagar", "Dadeldhura", "Baitadi",
    "Darchula", "Sukhad", "Belauri", "Bhajani", "Joshipur", "Punarbas", "Shanfebagar", "Kamalbazar",
    "Kolti, Bajura", "Binayak", "Masuriya", "Bahuniya", "Pahalmanpur", "Jhalari", "Hasuliya", "Patan",
    "Jogbudha"
  ],
  "Head Office - IME": [
    "Head Office - IME", "Head Office", "Head Office Agency", "IME Digital"
  ]
};

export const groupedBranchData: Record<string, Record<string, UserDetail[]>> = {};

for (const [province, branches] of Object.entries(provinceData)) {
  groupedBranchData[province] = {};
  branches.forEach((branch, idx) => {
    groupedBranchData[province][branch] = [
      {
        group: province,
        subGroupName: branch,
        menuName: branch,
        slug: slugify(province, branch),
        displayOrder: String(idx + 1),
        isActive: "1",
        selected: false
      }
    ];
  });
}

console.log(JSON.stringify(groupedBranchData, null, 2));
