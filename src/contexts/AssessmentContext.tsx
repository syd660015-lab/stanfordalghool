import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { AssessmentRecord, OperationType, FirestoreErrorInfo } from '../types';
import { SCORING_TABLES } from '../constants';

interface AssessmentContextType {
  user: User | null;
  loading: boolean;
  assessments: AssessmentRecord[];
  activeAssessment: AssessmentRecord | null;
  createAssessment: (patientData: AssessmentRecord['patient']) => Promise<string>;
  updateAssessment: (id: string, data: Partial<AssessmentRecord>) => Promise<void>;
  setActiveAssessmentById: (id: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeAssessment = assessments.find(a => a.id === activeId) || null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Validate connection to Firestore
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (!user) {
      setAssessments([]);
      return;
    }

    const q = query(
      collection(db, 'assessments'),
      where('examinerId', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentRecord));
      setAssessments(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'assessments');
    });

    return unsubscribe;
  }, [user]);

  const createAssessment = async (patientData: AssessmentRecord['patient']) => {
    if (!user) throw new Error('User must be signed in');
    
    const id = doc(collection(db, 'assessments')).id;
    const newRecord: AssessmentRecord = {
      id,
      examinerId: user.uid,
      patient: patientData,
      scores: {
        nonverbal: { fluidReasoning: 0, knowledge: 0, quantitative: 0, visualSpatial: 0, workingMemory: 0, sum: 0, iq: 0 },
        verbal: { fluidReasoning: 0, knowledge: 0, quantitative: 0, visualSpatial: 0, workingMemory: 0, sum: 0, iq: 0 },
        fullScale: { sum: 0, iq: 0 }
      },
      itemResponses: {},
      behavioralObservations: {
        isLanguageFitting: true,
        understandsInstructions: true,
        visionFitting: true,
        motorFitting: true,
        healthFitting: true,
        cooperation: true,
        environmentFitting: true,
        isRepresentative: true,
        engagement: '',
        problemSolvingStyle: '',
        frustrationTolerance: '',
        comments: ''
      },
      qualitativeObservations: {
        processNotes: ''
      },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      startTime: '',
      endTime: ''
    };

    try {
      await setDoc(doc(db, 'assessments', id), newRecord);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `assessments/${id}`);
      return '';
    }
  };

  const updateAssessment = async (id: string, data: Partial<AssessmentRecord>) => {
    const path = `assessments/${id}`;
    
    // If scores are being updated, ensure totals and full scale are synced
    if (data.scores) {
      const s = data.scores;
      // Sync nonverbal sum if subtests were updated
      s.nonverbal.sum = s.nonverbal.fluidReasoning + s.nonverbal.knowledge + s.nonverbal.quantitative + s.nonverbal.visualSpatial + s.nonverbal.workingMemory;
      s.nonverbal.iq = SCORING_TABLES.sumToIQ(s.nonverbal.sum);
      
      // Sync verbal sum
      s.verbal.sum = s.verbal.fluidReasoning + s.verbal.knowledge + s.verbal.quantitative + s.verbal.visualSpatial + s.verbal.workingMemory;
      s.verbal.iq = SCORING_TABLES.sumToIQ(s.verbal.sum);
      
      // Sync full scale
      s.fullScale.sum = s.nonverbal.sum + s.verbal.sum;
      s.fullScale.iq = SCORING_TABLES.sumToIQ(s.fullScale.sum / 2); // Simplified Full Scale logic for now
    }

    try {
      await setDoc(doc(db, 'assessments', id), { ...data, updatedAt: serverTimestamp() }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const setActiveAssessmentById = (id: string) => {
    setActiveId(id || null);
  };

  return (
    <AssessmentContext.Provider value={{ user, loading, assessments, activeAssessment, createAssessment, updateAssessment, setActiveAssessmentById }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
