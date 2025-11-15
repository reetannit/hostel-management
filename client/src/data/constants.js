import image01 from '../assets/hostelImages/image01.jpg';
import image02 from '../assets/hostelImages/image02.jpg';
import image03 from '../assets/hostelImages/image03.jpg';
import { Shield, Wifi, UtensilsCrossed, WashingMachine, BookOpen, Dumbbell, Bed, Sofa, CarFront } from 'lucide-react';

export const SLIDES = [
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: '🏢',
    title: 'Welcome to Modern Hostel Living',
    subtitle: 'Your home away from home with world-class facilities',
    buttonText: 'Explore Features',
    buttonLink: 'features',
    image: image01,
    imageAlt: 'Welcome to Modern Hostel Living'
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: '🛏️',
    title: 'Comfortable Rooms & Amenities',
    subtitle: 'Experience premium comfort with modern amenities',
    buttonText: 'View Gallery',
    buttonLink: 'gallery',
    image: image02,
    imageAlt: 'Comfortable Rooms and Amenities'
  },
  {
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    icon: '👥',
    title: 'Community & Support',
    subtitle: 'Join a vibrant community with 24/7 support',
    buttonText: 'Read Reviews',
    buttonLink: 'testimonials',
    image: image03,
    imageAlt: 'Community and Support'
  }
];

export const FEATURES = [
  {
    icon: Shield,
    title: 'Secure Environment',
    description: '24/7 security with CCTV surveillance and biometric access control for your safety'
  },
  {
    icon: Wifi,
    title: 'High-Speed WiFi',
    description: 'Unlimited high-speed internet connectivity in all rooms and common areas'
  },
  {
    icon: UtensilsCrossed,
    title: 'Quality Meals',
    description: 'Nutritious and delicious meals prepared with hygiene and variety in mind'
  },
  {
    icon: WashingMachine,
    title: 'Laundry Service',
    description: 'Convenient laundry facilities and services to keep your wardrobe fresh'
  },
  {
    icon: BookOpen,
    title: 'Study Rooms',
    description: 'Quiet study spaces with comfortable seating and proper lighting'
  },
  {
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Well-equipped gym and recreation facilities for your wellness'
  }
];

export const GALLERY_ITEMS = [
  {
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: Bed,
    title: 'Deluxe Rooms',
    description: 'Spacious and comfortable'
  },
  {
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: UtensilsCrossed,
    title: 'Dining Area',
    description: 'Clean and hygienic'
  },
  {
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: Sofa,
    title: 'Common Area',
    description: 'Relax and socialize'
  },
  {
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    icon: Dumbbell,
    title: 'Fitness Center',
    description: 'Stay healthy and fit'
  }
];

export const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    role: 'Engineering Student',
    avatar: 'RS',
    text: "The best hostel experience I've had! The facilities are top-notch, and the staff is incredibly supportive. The WiFi is super fast, which is perfect for my online classes.",
    rating: 5
  },
  {
    name: 'Priya Kapoor',
    role: 'Medical Student',
    avatar: 'PK',
    text: "Safety was my primary concern, and this hostel exceeded my expectations. The 24/7 security and girls-only floor make me feel completely safe. Highly recommended!",
    rating: 5
  },
  {
    name: 'Amit Verma',
    role: 'MBA Student',
    avatar: 'AV',
    text: "From the food quality to the study rooms, everything is well-maintained. The community here is amazing, and I've made friends for life. Great value for money!",
    rating: 5
  }
];