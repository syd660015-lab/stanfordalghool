import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

/**
 * firestore.rules.test.ts
 * 
 * Verifies the "Dirty Dozen" payloads against the firestore.rules.
 */

let testEnv: RulesTestEnvironment;

const PROJECT_ID = "test-project-" + Date.now();
const ADMIN_EMAIL = "ashoorgool2003@gmail.com";

describe("Firestore Security Rules", () => {
  beforeAll(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: PROJECT_ID,
      firestore: {
        rules: await (await import("fs")).promises.readFile("firestore.rules", "utf8"),
      },
    });
  });

  afterAll(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("1. Denies unauthenticated read", async () => {
    const unauthDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(unauthDb, "assessments/test-1")));
  });

  it("2. Denies identity spoofing during creation", async () => {
    const aliceDb = testEnv.authenticatedContext("alice", { email: "alice@example.com", email_verified: true }).firestore();
    await assertFails(
      setDoc(doc(aliceDb, "assessments/test-1"), {
        patient: { name: "John Doe", birthDate: "2010-01-01", testDate: "2026-04-27" },
        examinerId: "bob", // Spoofing bob
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  it("3. Denies resource poisoning via malicious IDs", async () => {
    const aliceDb = testEnv.authenticatedContext("alice", { email: "alice@example.com", email_verified: true }).firestore();
    await assertFails(
      setDoc(doc(aliceDb, "assessments/!!#@"), {
        patient: { name: "John Doe", birthDate: "2010-01-01", testDate: "2026-04-27" },
        examinerId: "alice",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );
  });

  it("5. Denies unauthorized update by non-owner", async () => {
    const aliceDb = testEnv.authenticatedContext("alice", { email: "alice@example.com", email_verified: true }).firestore();
    const bobDb = testEnv.authenticatedContext("bob", { email: "bob@example.com", email_verified: true }).firestore();

    // Alice creates an assessment
    const assessmentRef = doc(aliceDb, "assessments/alice-doc");
    await assertSucceeds(
      setDoc(assessmentRef, {
        patient: { name: "John Doe", birthDate: "2010-01-01", testDate: "2026-04-27" },
        examinerId: "alice",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    );

    // Bob tries to update Alice's assessment
    const bobRef = doc(bobDb, "assessments/alice-doc");
    await assertFails(updateDoc(bobRef, { "patient.name": "Hacked" }));
  });

  it("12. Denies deletion by non-admin", async () => {
    const aliceDb = testEnv.authenticatedContext("alice", { email: "alice@example.com", email_verified: true }).firestore();
    const adminDb = testEnv.authenticatedContext("admin", { email: ADMIN_EMAIL, email_verified: true }).firestore();

    // Alice creates assessment
    await setDoc(doc(adminDb, "assessments/to-delete"), {
      patient: { name: "Delete Me", birthDate: "2010-01-01", testDate: "2026-04-27" },
      examinerId: "admin",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Alice tries to delete
    await assertFails(deleteDoc(doc(aliceDb, "assessments/to-delete")));
    
    // Admin succeeds
    await assertSucceeds(deleteDoc(doc(adminDb, "assessments/to-delete")));
  });
});
