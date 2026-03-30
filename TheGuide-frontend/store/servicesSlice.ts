import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceCharacteristic {
  [key: string]: string;
}

export interface Service {
  id: string;
  name: string;
  image: string;
  type: number;
  typeName: string;
  characteristics: ServiceCharacteristic;
  facebookId?: string; // ✅ AJOUT UNIQUEMENT ICI
}

interface ServicesState {
  services: Service[];
  loading: boolean;
  error: string | null;
}

const getTypeName = (type: number): string => {
  switch (type) {
    case 0: return 'restauration';
    case 1: return 'transport';
    case 2: return 'boutique';
    case 3: return 'activité';
    case 4: return 'hebergement';
    case 5: return 'guide';
    default: return 'unknown';
  }
};

const initialState: ServicesState = {
    services: [
    { id: '1', name: "Le Petit Beur", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlUvgXsIhCuojeyLVhG_F8BI4Mb0TofZeKnA&s", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Marocaine", "Ambiance": "Chaleureuse", "Prix moyen": "150-250 DH" }, facebookId: "OTHER_USER"  },
    { id: '2', name: "Dar Naji", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/5d/89/ae/img-20181012-wa0013-largejpg.jpg?w=900&h=500&s=1", type: 0, typeName: getTypeName(0), characteristics: { "Spécialités": "Tajines, Couscous, Pastilla", "Ambiance": "Traditionnel marocain", "Prix moyen": "120-200 DH" }, facebookId: "OTHER_USER"  },
    { id: '3', name: "Al Fassia", image: "https://alfassia.com/wp-content/uploads/2020/02/NOTRE-SELECTION-DE-SALADES-scaled.jpg", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Marocaine haut de gamme", "Ambiance": "Élégante", "Note": "4.8/5" }, facebookId: "OTHER_USER"  },
    { id: '4', name: "La Table du Marché", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/5c/8a/51/la-table-du-marche-hivernage.jpg?w=900&h=500&s=1", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Internationale", "Ambiance": "Moderne", "Spécialité": "Produits frais" }, facebookId: "OTHER_USER"  },
    { id: '5', name: "Ty Potes", image: "https://media-cdn.tripadvisor.com/media/photo-s/0a/14/09/5f/ty-potes.jpg", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Française", "Ambiance": "Convivial", "Spécialité": "Crêpes et galettes" }, facebookId: "OTHER_USER"  },
    { id: '6', name: "Le Ziryab", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/3d/e2/b9/caption.jpg?w=1200&h=1200&s=1", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Marocaine", "Ambiance": "Traditionnelle", "Musique": "Andalouse" }, facebookId: "OTHER_USER"  },
    { id: '7', name: "La Brasserie", image: "https://media-cdn.tripadvisor.com/media/photo-m/1280/1b/23/91/cf/la-brasserie.jpg", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Française", "Ambiance": "Élégante", "Spécialité": "Fruits de mer" }, facebookId: "OTHER_USER"  },
    { id: '8', name: "Le Sushi Bar", image: "https://www.royalmansour.com/wp-content/uploads/2024/07/Le-Sushi-Bar-8.jpg", type: 0, typeName: getTypeName(0), characteristics: { "Cuisine": "Japonaise", "Spécialité": "Sushi premium", "Note": "4.7/5" }, facebookId: "OTHER_USER"  },
    { id: '9', name: "Taxi Rabat", image: "https://i0.wp.com/leseco.ma/wp-content/uploads/2020/02/taxis-rabat-1.jpg?fit=800%2C600&ssl=1", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Taxis collectifs et individuels", "Tarifs": "À partir de 10 DH", "Disponibilité": "24h/24" }, facebookId: "OTHER_USER"  },
    { id: '10', name: "CTM Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiRXhM17qYwW09ZSjvbCZWXRGV2eM8vGML7Q&s", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Bus interurbains", "Destinations": "Maroc entier", "Réservation": "En ligne" }, facebookId: "OTHER_USER"  },
    { id: '11', name: "Alsa City Bus", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPiEl9EnY88zxjoDMufGgmO5vBKULF409VtA&s", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Bus urbains", "Réseau": "Rabat-Salé", "Tarif": "6 DH" }, facebookId: "OTHER_USER"  },
    { id: '12', name: "ONCF Rabat-Agdal", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBGGrGTQVwhkGz9fVo0UIgpudxClhFdr_BRg&s", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Trains", "Lignes": "Nationales", "Services": "Première et seconde classe" }, facebookId: "OTHER_USER"  },
    { id: '13', name: "Tramway Rabat-Salé", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT040x9cS5C_fJXDM01H7q4q2yK8kbVxelzEg&s", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Tramway", "Lignes": "L1 et L2", "Tarif": "8 DH" }, facebookId: "OTHER_USER"  },
    { id: '14', name: "VTC Rabat", image: "https://www.infinity-luxe-chauffeur.com/wp-content/uploads/2023/07/van-avec-chauffeur-prive-1024x683.jpg", type: 1, typeName: getTypeName(1), characteristics: { "Type": "VTC", "Réservation": "Appli mobile", "Service": "Premium" }, facebookId: "OTHER_USER"  },
    { id: '15', name: "Location Voitures Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE-sQ4VatJDZ66J91L3IznrhZL5nkIVnqLdQ&s", type: 1, typeName: getTypeName(1), characteristics: { "Type": "Location de voitures", "Agences": "Aéroport et ville", "Véhicules": "Économique à luxe" }, facebookId: "OTHER_USER"  },
    { id: '16', name: "Souk El Had", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRe9DOEaA4rDsq0oH7g-UNj9Gc3TzbLkoFqiA&s", type: 2, typeName: getTypeName(2), characteristics: { "Produits": "Artisanat local, épices, vêtements", "Horaires": "9h-20h", "Jour": "Mardi et jeudi" }, facebookId: "OTHER_USER"  },
    { id: '17', name: "Marjane Rabat", image: "https://en.bladi.net/img/logo/rabat-restricts-supermarket-access-amid-covid-19-surge-73256.jpg", type: 2, typeName: getTypeName(2), characteristics: { "Type": "Hypermarché", "Horaires": "9h-22h", "Services": "Parking gratuit" }, facebookId: "OTHER_USER"  },
    { id: '18', name: "Mega Mall Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvhc8XGI73MzM76TjL_4V7TiHa8dqToz6bXg&s", type: 2, typeName: getTypeName(2), characteristics: { "Type": "Centre commercial", "Enseignes": "100+", "Cinéma": "Oui" }, facebookId: "OTHER_USER"  },
    { id: '19', name: "Artisanat Marocain", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSkGT61lZkJQmfCG9kQnQaztRYz7iJ90AS5g&s", type: 2, typeName: getTypeName(2), characteristics: { "Produits": "Tapis, poterie, bijoux", "Prix": "À discuter", "Qualité": "Artisanale" }, facebookId: "OTHER_USER"  },
    { id: '20', name: "Les Cuisines de Riad", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYh-WE-GeVfxQ95ggHSaUtpgsGBdyiof-AYA&s", type: 2, typeName: getTypeName(2), characteristics: { "Produits": "Épices, huiles d'olive", "Spécialité": "Produits du terroir", "Ambiance": "Authentique" }, facebookId: "OTHER_USER"  },
    { id: '21', name: "Souk Sebt", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRovCaIYt3zSMVjpADASnM9sUQK3rS8cqFJhQ&s", type: 2, typeName: getTypeName(2), characteristics: { "Jour": "Samedi", "Produits": "Fruits, légumes, artisanat", "Ambiance": "Animé" }, facebookId: "OTHER_USER"  },
    { id: '22', name: "Tour Hassan", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmYRmeU9Lhoh20sCJK5rz0kGwgnUTEcU44MQ&s", type: 3, typeName: getTypeName(3), characteristics: { "Horaires": "8h-18h", "Prix": "70 DH", "Histoire": "Minaret inachevé du XIIe siècle" }, facebookId: "OTHER_USER"  },
    { id: '23', name: "Chellah", image: "https://mobile.ledesk.ma/wp-content/uploads/2023/11/La-necropole-merinide-de-Chellah.jpeg", type: 3, typeName: getTypeName(3), characteristics: { "Horaires": "8h30-17h30", "Prix": "70 DH", "Particularité": "Site archéologique romain et médiéval" }, facebookId: "OTHER_USER"  },
    { id: '24', name: "Kasbah des Oudayas", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0c/47/12/da/oudayas-view-from-the.jpg?w=800&h=500&s=1", type: 3, typeName: getTypeName(3), characteristics: { "Horaires": "8h-18h", "Accès": "Gratuit", "Vue": "Océan et fleuve" }, facebookId: "OTHER_USER"  },
    { id: '25', name: "Jardin d'Essais Botaniques", image: "https://www.inra.org.ma/sites/default/files/jb.jpg", type: 3, typeName: getTypeName(3), characteristics: { "Horaires": "8h-17h", "Prix": "10 DH", "Superficie": "50 hectares" }, facebookId: "OTHER_USER"  },
    { id: '26', name: "Musée Mohammed VI", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzWEjA6Emw-2kzLULgvkAq_m3DEs31eTXRyA&s", type: 3, typeName: getTypeName(3), characteristics: { "Horaires": "10h-18h", "Prix": "40 DH", "Art": "Moderne et contemporain" }, facebookId: "OTHER_USER"  },
    { id: '27', name: "Plage de Rabat", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/16/2b/5f/ff/photo0jpg.jpg?w=1200&h=-1&s=1", type: 3, typeName: getTypeName(3), characteristics: { "Accès": "Gratuit", "Activités": "Baignade, surf", "Saison": "Juin à septembre" }, facebookId: "OTHER_USER"  },
    { id: '28', name: "Golf Royal de Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA3oMZ7AHYpEk2aP6d61Y4K45hJpdZ7Ue8MQ&s", type: 3, typeName: getTypeName(3), characteristics: { "Parcours": "18 trous", "Prix": "400 DH", "Location": "Matériel disponible" }, facebookId: "OTHER_USER"  },
    { id: '29', name: "Théâtre Mohammed V", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt_TMYD2OnOVdWyZ1uC5NdC9TING3l2aylMw&s", type: 3, typeName: getTypeName(3), characteristics: { "Programmation": "Théâtre, concerts", "Tarifs": "50-200 DH", "Architecture": "Mauresque" }, facebookId: "OTHER_USER"  },
    { id: '30', name: "Hotel La Tour Hassan", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdR6M9Vo1c6uE2HcIsJ6pTkADcSs5QC4QcRg&s", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "5", "Prix": "1500 DH/nuit", "Services": "Piscine, Spa, Restaurant" }, facebookId: "OTHER_USER"  },
    { id: '31', name: "Riad Dar Zouhour", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/c9/15/9f/patio.jpg?w=900&h=500&s=1", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "4", "Prix": "800 DH/nuit", "Style": "Riad traditionnel" }, facebookId: "OTHER_USER"  },
    { id: '32', name: "Hotel Farah Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfWSrc1jo32VXExEHSNjgzY7jsOMDJXNpa2g&s", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "5", "Prix": "1200 DH/nuit", "Services": "Piscine, Fitness" }, facebookId: "OTHER_USER"  },
    { id: '33', name: "Le Dawliz", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjL2GI3I_LG8PvG_q9ob5n5cq4LSh5mCw01g&s", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "5", "Prix": "1800 DH/nuit", "Vue": "Bord de mer" }, facebookId: "OTHER_USER"  },
    { id: '34', name: "Hotel Chellah", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQAc5MTFPhFX5kwMV888LcUT7wJg9Q3HEbkbw&s", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "4", "Prix": "700 DH/nuit", "Localisation": "Centre-ville" }, facebookId: "OTHER_USER"  },
    { id: '35', name: "Ibis Rabat Agdal", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0e/e6/38/53/chambre-standard.jpg?w=900&h=500&s=1", type: 4, typeName: getTypeName(4), characteristics: { "Étoiles": "3", "Prix": "450 DH/nuit", "Style": "Économique" }, facebookId: "OTHER_USER"  },
    { id: '36', name: "StayHere Rabat", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/28/f5/29/40/stayhere-agdal-2-rue.jpg?w=900&h=500&s=1", type: 4, typeName: getTypeName(4), characteristics: { "Type": "Appart-hôtel", "Prix": "600 DH/nuit", "Services": "Cuisine équipée" }, facebookId: "OTHER_USER"  },
    { id: '37', name: "Guide Rabat Médina", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi-lssfswo60-uv10NOZbaBc4G2353CdwTjg&s", type: 5, typeName: getTypeName(5), characteristics: { "Langues": "Français, Anglais, Arabe", "Tarif": "300 DH", "Durée": "3h" }, facebookId: "OTHER_USER"  },
    { id: '38', name: "Visite Guidée Chellah", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMXLKBOptmw_XMdBinJg-vJbGLg7ujCwL9vQ&s", type: 5, typeName: getTypeName(5), characteristics: { "Langues": "Français, Anglais", "Tarif": "200 DH", "Durée": "2h" }, facebookId: "OTHER_USER"  },
    { id: '39', name: "Circuit Oudayas", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8ZImqsVo3_iVK0R1_aJqUDeK-oycSmTzXIQ&s", type: 5, typeName: getTypeName(5), characteristics: { "Langues": "Français, Arabe", "Tarif": "250 DH", "Durée": "2h30" }, facebookId: "OTHER_USER"  },
    { id: '40', name: "Tour Royal Rabat", image: "https://www.lesiteinfo.com/wp-content/uploads/2024/10/Theatre-1280x720.jpg", type: 5, typeName: getTypeName(5), characteristics: { "Langues": "Français, Anglais", "Tarif": "350 DH", "Durée": "4h" }, facebookId: "OTHER_USER"  },
    { id: '41', name: "Excursion Rabat", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyBl2jDDuaqDb8hHE-fxunadBPdN3M0izv3A&s", type: 5, typeName: getTypeName(5), characteristics: { "Langues": "Français, Anglais, Espagnol", "Tarif": "500 DH/jour", "Itinéraire": "Personnalisable" }, facebookId: "OTHER_USER"  }
  ],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<Service[]>) => {
      state.services = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addService: (state, action: PayloadAction<Service>) => {
      state.services.push(action.payload);
    },
    editService: (state, action: PayloadAction<Service>) => {
      const index = state.services.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.services[index] = action.payload;
      }
    },
    deleteService: (state, action: PayloadAction<string>) => {
      state.services = state.services.filter(
        (service) => service.id !== action.payload
      );
    },
  },
});

export const { setServices, setLoading, setError, addService, editService, deleteService } = servicesSlice.actions;
export default servicesSlice.reducer;