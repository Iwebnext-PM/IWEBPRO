# Security Specification for Iwebpro CMS & Leads

## 1. Data Invariants
1. Only authenticated administrators in the `admins` collection can write to CMS collections (`siteSettings`, `homepageSections`, `pages`, `services`, `serviceAreas`, `testimonials`, `faqs`, `media`, `activityLogs`).
2. Public website visitors can read published CMS content (`isPublished == true` or site configuration).
3. Public website visitors can create `contactSubmissions` with required customer information, but CANNOT read, update, or delete submissions.
4. Only administrators can read and update `contactSubmissions`.
5. Authenticated administrators can manage media records, service entries, and site settings.
6. Admin role cannot be self-escalated.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated CMS Overwrite:** An anonymous attacker sends a `setDoc` request to `/siteSettings/global` attempting to overwrite the phone number. -> *PERMISSION_DENIED*
2. **Unauthenticated Service Deletion:** An anonymous attacker sends a `deleteDoc` request to `/services/ac-repair`. -> *PERMISSION_DENIED*
3. **Public Lead Scraping:** An unauthenticated visitor queries `/contactSubmissions` attempting to download other customers' phone numbers and emails. -> *PERMISSION_DENIED*
4. **Lead State Tampering:** An unauthenticated visitor sends an `updateDoc` to change a lead's status to `completed` or modify technician notes. -> *PERMISSION_DENIED*
5. **Admin Self-Promotion:** A non-admin user signs in and attempts to write themselves into `/admins/{uid}`. -> *PERMISSION_DENIED*
6. **Activity Log Forgery:** An unauthenticated user posts a fake log entry to `/activityLogs`. -> *PERMISSION_DENIED*
7. **Draft Content Exfiltration:** An unauthenticated user attempts to list unpublished draft pages or hidden testimonials. -> *PERMISSION_DENIED*
8. **Malicious Script Injection in Services:** An attacker attempts to write an oversized 5MB payload into a service description. -> *PERMISSION_DENIED*
9. **Media Library Wipeout:** An unauthenticated user sends batch delete requests to `/media`. -> *PERMISSION_DENIED*
10. **Spoofed Admin Email:** A user sends a request with an unverified email claiming admin privileges. -> *PERMISSION_DENIED*
11. **Lead Field Mutation on Create:** A customer creates a submission but attempts to pre-set `assignedTechnician` or internal notes. -> *PERMISSION_DENIED*
12. **Id Path Traversal:** A user attempts to write with an invalid special-character document ID. -> *PERMISSION_DENIED*
