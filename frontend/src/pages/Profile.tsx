import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit3, 
  Save, 
  LogOut, 
  Camera,
  Layers,
  Sprout,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { ScrollReveal } from '../components/ScrollReveal';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
}

export default function Profile() {
  const { farmerName, farmName, totalAcres, crops, soilReports, setActivePage } = useFarmStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: farmerName || 'Farmer',
    email: JSON.parse(localStorage.getItem('user') || '{}').email || 'No email',
    phone: JSON.parse(localStorage.getItem('user') || '{}').phone || '+91 XXXXX XXXXX',
    location: JSON.parse(localStorage.getItem('user') || '{}').location?.city || 'Location not set',
    avatar: JSON.parse(localStorage.getItem('user') || '{}').avatar || 'https://images.unsplash.com/photo-1542010589005-d1eacc3918f2?auto=format&fit=crop&q=80&w=200&h=200'
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('krishi_user_profile');
    const savedUser = localStorage.getItem('user');
    
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setProfile(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        location: user.location?.city || user.location || prev.location,
        avatar: user.avatar || prev.avatar
      }));
    } else if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('krishi_user_profile', JSON.stringify(profile));
    // Dispatch custom event to notify Topbar
    window.dispatchEvent(new Event('profileUpdate'));
    setIsEditing(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setActivePage('login');
  };

  const stats = [
    { label: 'Total Land', value: `${totalAcres} Acres`, icon: Layers, color: 'text-indigo-400' },
    { label: 'Active Crops', value: crops.length, icon: Sprout, color: 'text-green-400' },
    { label: 'Soil Health', value: `${soilReports[0]?.results?.healthScore || 0}%`, icon: Activity, color: 'text-teal-400' }
  ];

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      {/* 🟢 1. PROFILE HEADER */}
      <ScrollReveal direction="down">
        <div className="relative p-8 glass border border-white/10 rounded-[40px] overflow-hidden bg-gradient-to-br from-green-900/40 to-transparent">
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <User size={120} className="text-white" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-teal-500/30 shadow-2xl relative flex items-center justify-center bg-teal-500/10 text-teal-500 text-3xl font-black">
                {profile.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-all group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      setProfile({ ...profile, avatar: '' });
                    }}
                  />
                ) : (
                  profile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={32} className="text-white" />
                  </div>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-teal-500 text-bg flex items-center justify-center shadow-lg hover:scale-110 transition-all cursor-pointer border-4 border-bg group">
                  <Camera size={18} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="space-y-2">
                   <input
                     type="text"
                     value={profile.name}
                     onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                     placeholder="Your Name"
                     className="text-3xl font-display font-black text-white bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-full focus:outline-none focus:border-teal-500/50"
                   />
                   <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest pl-1">Name & Avatar are editable</p>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl font-display font-black text-white tracking-tight mb-2">
                    {profile.name}
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                      <Mail size={12} className="text-teal-500" />
                      {profile.email}
                    </span>
                    <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60">
                      <MapPin size={12} className="text-teal-500" />
                      {profile.location}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={`px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all shadow-xl ${
                  isEditing 
                    ? 'bg-green-500 text-bg shadow-green-500/20 hover:scale-105' 
                    : 'glass border border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-12 h-12 rounded-2xl glass border border-white/10 text-white/40 hover:text-red-400 hover:border-red-500/30 flex items-center justify-center transition-all bg-red-500/5 group"
              >
                <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 📊 2. FARMING STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <ScrollReveal key={i} direction="up" delay={0.1 * i}>
            <div className="p-6 glass border border-white/10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent flex items-center justify-between group hover:border-white/20 transition-all">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-display font-black text-white">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 📄 3. PERSONAL INFORMATION */}
        <ScrollReveal direction="left">
          <div className="p-10 glass border border-white/10 rounded-[40px] space-y-8 bg-gradient-to-br from-white/5 to-transparent h-full">
            <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
              <User size={24} className="text-teal-500" />
              General Information
            </h2>

            <div className="space-y-6">
              {[
                { label: 'Full Name', key: 'name', icon: User },
                { label: 'Email Address', key: 'email', icon: Mail },
                { label: 'Phone Number', key: 'phone', icon: Phone },
                { label: 'Location', key: 'location', icon: MapPin }
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest flex items-center gap-2">
                    <field.icon size={12} />
                    {field.label}
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={(profile as any)[field.key]}
                      onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                      className="w-full py-3 px-4 glass border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-teal-500/50 transition-all bg-white/5"
                    />
                  ) : (
                    <p className="text-sm font-bold text-white/80 py-3 px-1">{(profile as any)[field.key]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* 🌾 4. FARM DETAILS */}
        <ScrollReveal direction="right">
          <div className="p-10 glass border border-white/10 rounded-[40px] space-y-8 bg-gradient-to-br from-teal-500/5 to-transparent h-full">
            <h2 className="text-2xl font-display font-black text-white flex items-center gap-3">
              <Layers size={24} className="text-indigo-400" />
              Farm Details
            </h2>

            <div className="space-y-8">
               <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Farm Name</p>
                    <p className="text-xl font-bold text-white tracking-tight">{farmName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Land Ownership</p>
                    <p className="text-sm font-bold text-white/60">Self Owned • {totalAcres} Acres</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Verification Status</p>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400">
                    <CheckCircle2 size={24} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Verified Farmer</p>
                      <p className="text-[10px] font-bold opacity-60 italic">Your identify has been verified by the district portal.</p>
                    </div>
                  </div>
               </div>

               <div className="space-y-2">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Quick Actions</p>
                  <div className="flex gap-2">
                    <button onClick={() => setActivePage('soil')} className="flex-1 py-3 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-teal-500/30 transition-all">
                      View Documents
                    </button>
                    <button className="flex-1 py-3 glass border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:border-teal-500/30 transition-all">
                      Support
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
