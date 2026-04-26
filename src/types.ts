export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export interface Patient {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  testDate: string;
  school: string;
  grade: string;
}

export interface SubtestScores {
  fluidReasoning: number;
  knowledge: number;
  quantitative: number;
  visualSpatial: number;
  workingMemory: number;
  sum: number;
  iq: number;
}

export interface MultiFactorScores {
  nonverbal: SubtestScores;
  verbal: SubtestScores;
  fullScale: {
    sum: number;
    iq: number;
  };
}

export interface BehavioralObservations {
  isLanguageFitting: boolean;
  understandsInstructions: boolean;
  visionFitting: boolean;
  motorFitting: boolean;
  healthFitting: boolean;
  cooperation: boolean;
  environmentFitting: boolean;
  isRepresentative: boolean;
  comments: string;
}

export interface QualitativeObservations {
  processNotes: string;
  engagement: string;
  problemSolvingStyle: string;
  frustrationTolerance: string;
}

export interface AssessmentRecord {
  id: string;
  examinerId: string;
  patient: Patient;
  scores: MultiFactorScores;
  itemResponses: Record<string, Record<number, number>>;
  behavioralObservations: BehavioralObservations;
  qualitativeObservations: QualitativeObservations;
  createdAt: any;
  updatedAt: any;
}
