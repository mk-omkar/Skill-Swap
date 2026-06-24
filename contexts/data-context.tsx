import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type SkillOffer = {
  id: string;
  tutorId: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  price: number; // in credits or free
  availableSessions: number;
  rating: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
};

export type Session = {
  id: string;
  offerId: string;

  tutorId: string;
  tutorName: string;

  learnerId: string;
  learnerName: string;

  scheduledAt: string;
  status: 'requested' | 'accepted' | 'completed' | 'cancelled' | 'rejected';
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  sessionId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Report = {
  id: string;
  reporterId: string;
  targetId: string; // user or offer id
  type: 'user' | 'offer' | 'session';
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
};

type DataContextType = {
  offers: SkillOffer[];
  sessions: Session[];
  reviews: Review[];
  reports: Report[];
  addOffer: (offer: Omit<SkillOffer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOffer: (id: string, updates: Partial<SkillOffer>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  bookSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  addReport: (report: Omit<Report, 'id' | 'createdAt'>) => Promise<void>;
  searchOffers: (query: string, category?: string) => SkillOffer[];
  getUserOffers: (userId: string) => SkillOffer[];
  getUserSessions: (userId: string) => Session[];
  getUserReviews: (userId: string) => Review[];
  cancelSession: (id: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [offers, setOffers] = useState<SkillOffer[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [offersData, sessionsData, reviewsData, reportsData] = await Promise.all([
        AsyncStorage.getItem('offers'),
        AsyncStorage.getItem('sessions'),
        AsyncStorage.getItem('reviews'),
        AsyncStorage.getItem('reports'),
      ]);

      if (offersData) {
        setOffers(JSON.parse(offersData));
      }
        
      
      if (sessionsData) setSessions(JSON.parse(sessionsData));
      if (reviewsData) setReviews(JSON.parse(reviewsData));
      if (reportsData) setReports(JSON.parse(reportsData));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveOffers = async (newOffers: SkillOffer[]) => {
    try {
      await AsyncStorage.setItem('offers', JSON.stringify(newOffers));
      setOffers(newOffers);
    } catch (error) {
      console.error('Error saving offers:', error);
    }
  };

  const saveSessions = async (newSessions: Session[]) => {
    try {
      await AsyncStorage.setItem('sessions', JSON.stringify(newSessions));
      setSessions(newSessions);
    } catch (error) {
      console.error('Error saving sessions:', error);
    }
  };

  const saveReviews = async (newReviews: Review[]) => {
    try {
      await AsyncStorage.setItem('reviews', JSON.stringify(newReviews));
      setReviews(newReviews);
    } catch (error) {
      console.error('Error saving reviews:', error);
    }
  };

  const saveReports = async (newReports: Report[]) => {
    try {
      await AsyncStorage.setItem('reports', JSON.stringify(newReports));
      setReports(newReports);
    } catch (error) {
      console.error('Error saving reports:', error);
    }
  };

  const addOffer = async (offerData: Omit<SkillOffer, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newOffer: SkillOffer = {
      ...offerData,
      id: `offer_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveOffers([...offers, newOffer]);
  };

  const updateOffer = async (id: string, updates: Partial<SkillOffer>) => {
    const updatedOffers = offers.map(offer =>
      offer.id === id ? { ...offer, ...updates, updatedAt: new Date().toISOString() } : offer
    );
    await saveOffers(updatedOffers);
  };

  const deleteOffer = async (id: string) => {
    const updatedOffers = offers.filter(offer => offer.id !== id);
    await saveOffers(updatedOffers);
  };

  const bookSession = async (sessionData: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newSession: Session = {
      ...sessionData,
      id: `session_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // decrement available sessions for the offer
    const offer = offers.find(o => o.id === sessionData.offerId);
    if (offer && offer.availableSessions > 0) {
      await updateOffer(offer.id, { availableSessions: offer.availableSessions - 1 });
    }
    await saveSessions([...sessions, newSession]);
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    const updatedSessions = sessions.map(session =>
      session.id === id ? { ...session, ...updates, updatedAt: new Date().toISOString() } : session
    );
    await saveSessions(updatedSessions);
  };

  const addReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await saveReviews([...reviews, newReview]);
  };

  const addReport = async (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: `report_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    await saveReports([...reports, newReport]);
  };

  const cancelSession = async (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (!session) return;
    // increment available sessions back on cancellation
    const offer = offers.find(o => o.id === session.offerId);
    if (offer) {
      await updateOffer(offer.id, { availableSessions: offer.availableSessions + 1 });
    }
    await updateSession(id, { status: 'cancelled' });
  };

  const searchOffers = (query: string, category?: string) => {
    return offers.filter(offer => {
      const matchesQuery = offer.title.toLowerCase().includes(query.toLowerCase()) ||
                          offer.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || offer.category === category;
      return matchesQuery && matchesCategory;
    });
  };

  const getUserOffers = (userId: string) => {
    return offers.filter(offer => offer.tutorId === userId);
  };

  const getUserSessions = (userId: string) => {
    return sessions.filter(session => session.tutorId === userId || session.learnerId === userId);
  };

  const getUserReviews = (userId: string) => {
    return reviews.filter(review => review.revieweeId === userId);
  };

  const value: DataContextType = {
    offers,
    sessions,
    reviews,
    reports,
    addOffer,
    updateOffer,
    deleteOffer,
    bookSession,
    updateSession,
    addReview,
    addReport,
    searchOffers,
    getUserOffers,
    getUserSessions,
    getUserReviews,
    cancelSession,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
