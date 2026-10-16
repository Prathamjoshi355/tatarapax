import { PoliciesConfig } from '../types';

export const DEFAULT_POLICIES_CONFIG: PoliciesConfig = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    companyName: 'Tantrapex Technology Pvt. Ltd.',
    introText: 'Tantrapex Technology Pvt. Ltd. respects the privacy of all candidates and is committed to protecting their personal information. By registering with us, you agree to the collection and use of your data as outlined in this Privacy Policy.',
    lastUpdated: 'Updated 2026',
    contactEmail1: 'info@tantrapex.com',
    contactEmail2: 'hr@tantrapex.com',
    sections: [
      {
        id: 'p-1',
        title: '1. Information We Collect',
        content: 'We may collect the following information during registration or service usage:',
        bullets: [
          'Name, age, gender, and contact details (phone number, email, address).',
          'Academic qualifications, resume, and career-related details.',
          'Payment details for registration fee processing.',
          'Assessment scores, training progress, and placement activity participation.'
        ]
      },
      {
        id: 'p-2',
        title: '2. How We Use the Information',
        content: 'Your information is used for the following purposes:',
        bullets: [
          'To register you for our services.',
          'To provide assessments, training, and LMS access.',
          'To share your profile and details with partner companies for placement opportunities.',
          'To contact you with updates, opportunities, and service-related communications.',
          'To maintain records for legal, accounting, and compliance purposes.'
        ]
      },
      {
        id: 'p-3',
        title: '3. Data Sharing',
        content: 'We adhere to strict confidentiality guidelines regarding user data:',
        bullets: [
          'We do not sell, trade, or rent candidate information to third parties.',
          'Information may be shared only with partner companies/recruiters as part of placement opportunities.',
          'We may disclose information if required by law, court order, or government authority.'
        ]
      },
      {
        id: 'p-4',
        title: '4. Data Security',
        content: 'Security measures in place to protect candidate data:',
        bullets: [
          'We implement reasonable technical and organizational measures to protect personal data.',
          'However, Tantrapex cannot guarantee absolute security of information transmitted electronically.'
        ]
      },
      {
        id: 'p-5',
        title: '5. Candidate Rights',
        content: 'Candidates have the following rights regarding their data:',
        bullets: [
          'Request correction of inaccurate personal data.',
          'Request limited use of your data for placement activities.',
          'Withdraw from services (as per our Cancellation & Refund Policy), though fee remains non-refundable.'
        ]
      },
      {
        id: 'p-6',
        title: '6. Data Retention',
        content: 'Candidate data will be retained as long as necessary to provide services and fulfill legal obligations.'
      },
      {
        id: 'p-7',
        title: '7. Changes to This Policy',
        content: 'Tantrapex reserves the right to update this Privacy Policy at any time. Updates will be posted on our official website.'
      }
    ]
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    companyName: 'Tantrapex Technology Pvt. Ltd.',
    introText: 'Welcome to Tantrapex Technology Pvt. Ltd. By registering and using our services, you agree to the following Terms of Service:',
    lastUpdated: 'Updated 2026',
    sections: [
      {
        id: 't-1',
        title: '1. Services Provided',
        content: '1.1 We provide services including but not limited to skill assessments, LMS access, and placement guidance. 1.2 These services are designed to help candidates improve employability skills and prepare for job opportunities.',
        bullets: [
          'Skill assessments and competency evaluations.',
          'Access to our Learning Management System (LMS) for training and preparation.',
          'Guidance, mentorship, and opportunities to participate in campus placement drives and related activities.'
        ]
      },
      {
        id: 't-2',
        title: '2. Registration Fee',
        content: '2.1 A non-refundable registration fee of ₹2,499/- (Rupees Two Thousand Four Hundred Ninety-Nine only) is charged for enrollment. 2.2 This fee covers assessment, LMS access, and participation in placement-related activities. 2.3 The fee does not constitute a job placement charge or guarantee of employment.',
        callout: {
          type: 'info',
          text: 'Registration Fee: ₹2,499/- (Rupees Two Thousand Four Hundred Ninety-Nine only). Non-refundable and covers assessment, training, & LMS access.'
        }
      },
      {
        id: 't-3',
        title: '3. No Job Guarantee',
        content: '3.1 Tantrapex is not a recruitment agency. We do not guarantee or promise any job or placement. 3.2 Final employment outcomes depend solely on the candidate’s skills, performance, qualifications, and the hiring organization’s selection criteria.',
        callout: {
          type: 'danger',
          text: 'NO JOB GUARANTEE: Tantrapex provides placement facilitation and training services. Final hiring is solely determined by partner companies.'
        }
      },
      {
        id: 't-4',
        title: '4. Candidate Responsibilities',
        content: 'Responsibilities expected from all registered candidates:',
        bullets: [
          '4.1 Candidates must provide accurate and truthful information during registration. Any misrepresentation may lead to cancellation of services without refund.',
          '4.2 Candidates are responsible for actively participating in assessments, training, and placement activities.',
          '4.3 Candidates must maintain professional behavior during interactions with Tantrapex, partner companies, and placement activities.'
        ]
      },
      {
        id: 't-5',
        title: '5. Refund & Cancellation Policy',
        content: '5.1 All fees paid are non-refundable and non-transferable, irrespective of candidate’s participation or success in placement drives. 5.2 Once registration is completed, cancellation requests will not be entertained.'
      },
      {
        id: 't-6',
        title: '6. Limitation of Liability',
        content: '6.1 Tantrapex shall not be liable for candidate’s inability to secure employment, hiring decisions of third-party companies, or indirect/incidental damages. 6.2 Our responsibility is limited to providing agreed services (assessment, LMS access, placement opportunities).'
      },
      {
        id: 't-7',
        title: '7. Intellectual Property',
        content: 'All content, training material, assessments, and LMS resources provided are the intellectual property of Tantrapex. Candidates shall not copy, distribute, or misuse any material without written consent.'
      },
      {
        id: 't-8',
        title: '8. Governing Law & Jurisdiction',
        content: 'These Terms shall be governed by and construed under the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts at Indore, Madhya Pradesh.'
      },
      {
        id: 't-9',
        title: '9. Amendments',
        content: 'Tantrapex reserves the right to modify these Terms of Service at any time. Updates will be published on our official website, and continued use of services shall constitute acceptance of the revised terms.'
      },
      {
        id: 't-10',
        title: 'Declaration & Acceptance',
        content: 'By registering and paying the fee, you acknowledge that:',
        bullets: [
          'You have read, understood, and agreed to these Terms of Service.',
          'You are aware that Tantrapex does not guarantee a job or placement.',
          'The registration fee is for services, not for job assurance.'
        ],
        callout: {
          type: 'success',
          text: 'By continuing registration, you explicitly confirm acceptance of all above terms and conditions.'
        }
      }
    ]
  },
  disclaimer: {
    id: 'disclaimer',
    title: 'Disclaimer',
    companyName: 'Tantrapex Technology Pvt. Ltd.',
    introText: 'Important Declaration by Tantrapex Technology Pvt. Ltd.',
    lastUpdated: 'Updated 2026',
    sections: [
      {
        id: 'd-1',
        title: '1. No Job Guarantee',
        content: 'Tantrapex Technology Pvt. Ltd. provides assessment, training, and placement opportunity facilitation services only. We do not guarantee or assure any candidate of a job, employment, or placement.',
        callout: {
          type: 'danger',
          text: 'Disclaimer Notice: Tantrapex Technology Pvt. Ltd. provides skill assessment, training, and placement facilitation services only. We do not guarantee job selection or employment.'
        }
      },
      {
        id: 'd-2',
        title: '2. Nature of Services',
        content: 'The registration fee of ₹2,499/- is solely for services including skill assessment, access to our Learning Management System (LMS), and participation in placement-related activities. The fee is not a placement charge or employment fee.'
      },
      {
        id: 'd-3',
        title: '3. Candidate’s Responsibility',
        content: 'Final selection and employment depend entirely on the candidate’s performance, skills, qualifications, and the requirements of the hiring organizations. Tantrapex has no role or control over final hiring decisions.'
      },
      {
        id: 'd-4',
        title: '4. No Refund Policy',
        content: 'All fees paid are non-refundable and non-transferable, irrespective of candidate’s participation or outcome in assessments, training, or placement drives.'
      },
      {
        id: 'd-5',
        title: '5. Limitation of Liability',
        content: 'Tantrapex shall not be responsible for any loss, disappointment, or claim arising from a candidate’s inability to secure employment.'
      }
    ]
  },
  refund: {
    id: 'refund',
    title: 'Cancellation & Refund Policy',
    companyName: 'Tantrapex Technology Pvt. Ltd.',
    introText: 'Financial Terms and Policy of Tantrapex Technology Pvt. Ltd.',
    lastUpdated: 'Updated 2026',
    sections: [
      {
        id: 'r-1',
        title: '1. Non-Refundable Fee',
        content: 'The registration fee of ₹2,499/- (Rupees Two Thousand Four Hundred Ninety-Nine only) paid by the candidate is strictly non-refundable and non-transferable under any circumstances.',
        callout: {
          type: 'warning',
          text: 'Strict Non-Refundable Policy: ₹2,499/- fee paid is non-refundable and non-transferable under all circumstances once registered.'
        }
      },
      {
        id: 'r-2',
        title: '2. No Cancellation After Registration',
        content: 'Once the candidate has registered and payment has been processed, the service will be considered as availed. Cancellation requests will not be entertained.'
      },
      {
        id: 'r-3',
        title: '3. Nature of Services',
        content: 'The registration fee is charged only for:',
        bullets: [
          'Skill assessment and competency evaluation,',
          'Access to Tantrapex’s Learning Management System (LMS), and',
          'Participation in placement-related activities.'
        ]
      },
      {
        id: 'r-4',
        title: '4. Candidate’s Responsibility',
        content: 'It is the responsibility of the candidate to participate in assessments, training, and placement activities. Non-participation by the candidate will not qualify for any refund.'
      },
      {
        id: 'r-5',
        title: '5. Service Failure Disclaimer',
        content: 'Tantrapex shall not be liable to refund fees for:',
        bullets: [
          'Candidate’s inability to secure employment,',
          'Rejection by hiring organizations, or',
          'Lack of participation by the candidate.'
        ]
      }
    ]
  }
};
