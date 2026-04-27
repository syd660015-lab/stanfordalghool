# Security Specification - assessment App

## 1. Data Invariants
- **Authentication**: Users must be authenticated to perform any operation. Supports Google Login (verified) and Anonymous Guest access.
- **Ownership**: Only the examiner who created the assessment (identified by `examinerId`) can read or update it.
- **Admin Access**: The user `ashoorgool2003@gmail.com` is the system admin and has full access to all assessments, including the ability to delete them.
- **Schema Integrity**: Every assessment must strictly follow the `Assessment` entity schema.
- **Audit Trails**: `createdAt` and `updatedAt` timestamps must be set by the server.
- **Immutability**: Once created, the `assessmentId`, `examinerId`, and `createdAt` fields cannot be changed.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)

| ID | Case Name | Payload / Action | Expected Result |
|---|---|---|---|
| 1 | Unauthenticated Read | Try to read `assessments/123` without logging in | **DENIED** |
| 2 | Identity Spoofing (Create) | Create assessment with `examinerId` of another user | **DENIED** |
| 3 | Resource Poisoning (ID) | Create assessment with an ID containing special characters (e.g., `!!#@`) | **DENIED** |
| 4 | Data Corruption (Schema) | Create assessment with `scores` as a string instead of an object | **DENIED** |
| 5 | Unauthorized Update (Non-Owner) | User B tries to update User A's assessment | **DENIED** |
| 6 | Immutable Field Breach (Update) | Try to change the `examinerId` of an existing assessment | **DENIED** |
| 7 | Temporal Spoofing (Create) | Provide a client-side `createdAt` timestamp from the past | **DENIED** |
| 8 | Shadow Update (Ghost Field) | Try to update an assessment with an unauthorized field (e.g., `isVerified: true`) | **DENIED** |
| 9 | Mass Enumeration (List) | Try to list all assessments without a user filter (as a non-admin) | **DENIED** |
| 10 | PII Leakage | Try to read another user's assessment data | **DENIED** |
| 11 | State Shortcutting | Try to set a terminal status field manually if it were restricted | **DENIED** |
| 12 | Admin Escalation | Try to delete an assessment as a regular user | **DENIED** |

## 3. The Test Runner
See `firestore.rules.test.ts` for the implementation of these tests.
