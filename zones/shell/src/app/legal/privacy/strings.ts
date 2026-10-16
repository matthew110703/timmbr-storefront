import type { LegalContentSectionData } from "@/lib/api/types";

export const strings = {
  metadata: {
    title: "Privacy Policy | Timmbr",
    description:
      "Learn how Timmbr collects, uses, and protects your personal information when you shop with us.",
  },
};

export const FALLBACK_PRIVACY_CONTENT: LegalContentSectionData = {
  type: "legal-content",
  show: true,
  sortOrder: 1,
  title: "Privacy Policy",
  effectiveDate: "16 October 2026",
  lastUpdated: "16 October 2026",
  intro:
    'At Timmbr ("Timmbr", "we", "us", or "our"), we respect your privacy and are committed to handling your personal information responsibly. This Privacy Policy explains how we collect, use, store, disclose, and protect personal information when you visit our website at https://www.timmbr.com/, purchase furniture from us, visit our physical stores or showrooms, contact our customer support team, or otherwise interact with our business. This Policy applies to our online and offline furniture retail activities in India. By using our website or interacting with our services, you acknowledge that you have had an opportunity to read this Privacy Policy. Where consent is required by applicable law, we will seek that consent separately and will not treat your use of the website alone as consent to every form of data processing.',
  sections: [
    {
      id: "1",
      heading: "About Timmbr",
      paragraphs: [
        "Timmbr is a furniture brand offering ready-made and custom-made furniture to customers in India.",
      ],
      subsections: [
        {
          id: "Contact",
          heading: "Business and contact details",
          items: [
            "Legal entity name: Timmbr Private Limited",
            "Brand name: Timmbr",
            "Registered office address: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
            "Website: https://www.timmbr.com/",
            "Customer support email: hello@timmbr.com",
            "Customer support phone: +91 80 4567 8900",
            "Privacy contact: privacy@timmbr.com",
            "Grievance Officer: Priya Nair, Head of Customer Experience",
            "Grievance contact details: grievance@timmbr.com",
          ],
        },
      ],
    },
    {
      id: "2",
      heading: "Personal Information We Collect",
      paragraphs: [
        "Depending on how you interact with Timmbr, we may collect the following categories of information.",
      ],
      subsections: [
        {
          id: "2.1",
          heading: "Information you provide directly",
          paragraphs: ["This may include:"],
          items: [
            "Name, email address, and mobile number.",
            "Billing address and furniture delivery address.",
            "Order details, purchase history, invoices, and transaction references.",
            "Furniture preferences, product selections, dimensions, and customisation requirements.",
            "Information you provide when requesting a quotation, booking a consultation, or contacting customer support.",
            "Information included in reviews, feedback, complaints, and messages.",
            "Information provided when registering for an account, subscribing to updates, or submitting a form.",
            "Information provided when visiting a showroom or arranging an in-person furniture consultation, where applicable.",
          ],
          trailingParagraphs: [
            "Please avoid submitting sensitive personal information unless it is necessary for a specific service and requested through an appropriate channel.",
          ],
        },
        {
          id: "2.2",
          heading: "Order and payment information",
          paragraphs: [
            "When you place an order, we may process information needed to confirm payment, fulfil the order, arrange delivery, process cancellations, and issue refunds.",
            "We support online payments and cash on delivery, subject to the payment methods offered for a particular order.",
            "Online payments may be handled by third-party payment service providers. Depending on the provider and payment method, Timmbr may receive transaction references, payment status, refund status, and limited payment-related details.",
            "We do not intend to collect or store complete card credentials, card security codes, UPI PINs, or banking passwords on our own systems. Payment information is handled according to the arrangements and security practices of the relevant payment provider.",
          ],
        },
        {
          id: "2.3",
          heading: "Information collected automatically",
          paragraphs: [
            "When you access our website, certain technical information may be collected, depending on the website configuration and tools in use. This may include:",
          ],
          items: [
            "IP address and approximate location derived from it.",
            "Browser type, device type, operating system, and language preferences.",
            "Pages viewed, products searched, and interactions with website features.",
            "Referral URLs, access times, and website performance information.",
            "Cookie identifiers and similar online identifiers.",
          ],
          trailingParagraphs: [
            "We will use such technologies according to their purpose and applicable consent requirements.",
          ],
        },
        {
          id: "2.4",
          heading: "Information from service providers",
          paragraphs: [
            "We may receive information from service providers involved in completing your purchase or providing website services, such as:",
          ],
          items: [
            "Payment processors confirming transactions.",
            "Logistics and delivery partners providing delivery updates.",
            "Website hosting, security, and technical service providers.",
            "Analytics or marketing providers, where implemented and appropriately authorised.",
          ],
          trailingParagraphs: [
            "We limit such information to what is reasonably relevant to the relevant service or purpose.",
          ],
        },
      ],
    },
    {
      id: "3",
      heading: "How We Use Personal Information",
      paragraphs: [
        "We may use personal information for the following purposes:",
      ],
      items: [
        "Order processing: To confirm purchases, manage orders, issue invoices, and process payments or refunds.",
        "Delivery and installation: To coordinate delivery, assembly, installation, and other services requested with your furniture purchase.",
        "Custom furniture: To understand your specifications, dimensions, design selections, and customisation requirements.",
        "Customer support: To answer enquiries, resolve complaints, and provide order-related assistance.",
        "Account management: To create and manage customer accounts, where this feature is available.",
        "Business operations: To manage showroom consultations, quotations, inventory coordination, and customer relationships.",
        "Security and fraud prevention: To protect our website, customers, transactions, and business against fraud, misuse, and unauthorised access.",
        "Website improvement: To understand website performance, identify technical issues, and improve the shopping experience, where relevant tools are in use.",
        "Marketing and promotions: To communicate product launches, offers, new collections, and relevant updates through email, SMS, WhatsApp, or other available channels, subject to applicable requirements and your preferences.",
        "Legal and regulatory compliance: To maintain required records, respond to lawful requests, and meet applicable legal obligations.",
        "Dispute resolution: To investigate and resolve order disputes, warranty claims, complaints, and other legitimate business matters.",
      ],
      trailingParagraphs: [
        "We will not use personal information for purposes that are incompatible with the applicable legal basis or the purpose communicated to you.",
      ],
    },
    {
      id: "4",
      heading: "Legal Basis and Consent",
      paragraphs: [
        "We process personal information only where there is an applicable legal basis to do so.",
        "Depending on the circumstances and applicable law, processing may be necessary to fulfil a purchase or provide a requested service, comply with a legal obligation, or pursue another legally permitted purpose.",
        "Where consent is required, we will request it through an appropriate mechanism and explain the purpose of the processing in clear language.",
        "You may withdraw consent where processing is based on consent, subject to applicable law. Withdrawal does not retrospectively invalidate processing that was lawful before withdrawal. It may affect our ability to provide services that depend on the relevant information.",
        "Where appropriate, we will provide a means to withdraw consent that is comparable in accessibility to the means through which consent was provided.",
      ],
    },
    {
      id: "5",
      heading: "Marketing Communications",
      paragraphs: [
        "Timmbr may send promotional communications through email, SMS, WhatsApp, or other channels where available.",
        "These communications may include:",
      ],
      items: [
        "New furniture collections and product launches.",
        "Promotional offers and seasonal sales.",
        "Product recommendations and brand updates.",
        "Invitations to showroom events or consultations.",
      ],
      trailingParagraphs: [
        "We will seek and record consent where required by applicable law and provide an appropriate means to opt out of promotional communications.",
        "You can request to stop marketing messages by using the unsubscribe mechanism in the communication, where available, or by contacting marketing@timmbr.com.",
        "Opting out of marketing will not necessarily stop essential communications relating to an existing order, payment, delivery, refund, warranty, or customer support request.",
        "We will not make consent to promotional marketing a condition of purchasing furniture where such consent is not necessary for the purchase.",
      ],
    },
    {
      id: "6",
      heading: "Cookies and Similar Technologies",
      paragraphs: [
        "Our website may use cookies, pixels, local storage, and similar technologies to support website functionality, remember preferences, understand performance, and, where implemented, measure advertising effectiveness.",
        "Depending on the tools in use, these technologies may serve purposes such as:",
      ],
      items: [
        "Maintaining shopping cart functionality.",
        "Remembering selected preferences.",
        "Measuring website traffic and performance.",
        "Understanding how visitors interact with products and pages.",
        "Measuring marketing campaign effectiveness.",
      ],
      trailingParagraphs: [
        "Where applicable, non-essential tracking technologies will be managed in accordance with legal requirements and relevant consent choices.",
        "You may also be able to manage cookies through your browser settings. Disabling certain cookies may affect website functionality.",
        "The specific cookies and third-party technologies used by Timmbr are documented in our Cookie Policy.",
      ],
    },
    {
      id: "7",
      heading: "Sharing Personal Information",
      paragraphs: [
        "We do not treat customer personal information as a product for sale. We may disclose or make information available to third parties where necessary for the purposes described in this Policy, subject to applicable law.",
        "These third parties may include:",
      ],
      subsections: [
        {
          id: "7.1",
          heading: "Payment service providers",
          paragraphs: [
            "To process online payments, confirm transactions, and facilitate refunds.",
          ],
        },
        {
          id: "7.2",
          heading: "Delivery and installation partners",
          paragraphs: [
            "To deliver furniture to your address, arrange installation or assembly where offered, and provide delivery updates.",
          ],
        },
        {
          id: "7.3",
          heading: "Technology and hosting providers",
          paragraphs: [
            "To operate, maintain, secure, and support our website, databases, communication systems, and related infrastructure.",
          ],
        },
        {
          id: "7.4",
          heading: "Analytics and marketing providers",
          paragraphs: [
            "Where implemented, to measure website usage, manage communications, and assess marketing performance in accordance with applicable requirements.",
          ],
        },
        {
          id: "7.5",
          heading: "Professional advisers and authorities",
          paragraphs: [
            "To obtain legal, accounting, or professional assistance, comply with applicable laws, respond to valid legal requests, or protect our legal rights.",
          ],
        },
        {
          id: "7.6",
          heading: "Business transfers",
          paragraphs: [
            "If Timmbr undergoes a merger, restructuring, acquisition, or transfer of business assets, relevant information may be disclosed to the parties involved where legally permitted and subject to appropriate safeguards.",
          ],
        },
      ],
      trailingParagraphs: [
        "We expect relevant service providers to handle personal information in accordance with their contractual obligations and applicable law.",
        "We do not authorise third parties to use customer information for unrelated purposes merely because they receive it to provide a service to us.",
      ],
    },
    {
      id: "8",
      heading: "Data Storage, Retention, and Security",
      paragraphs: [
        "We retain personal information for as long as reasonably necessary for the purposes for which it was collected, including order fulfilment, customer service, warranty support, accounting, legal compliance, and dispute resolution.",
        "Retention periods may differ depending on the type of information and the applicable legal requirements.",
        "When information is no longer required, we will take appropriate steps to delete it or otherwise dispose of it in accordance with applicable law and our retention procedures, unless continued retention is legally required or permitted.",
        "We use or intend to implement reasonable technical and organisational safeguards appropriate to the information we handle. These may include access controls, secure transmission, restricted access to business systems, and security monitoring, depending on the systems deployed.",
        "No website, storage system, or electronic transmission can be guaranteed to be completely secure. We will handle security incidents and personal data breaches in accordance with applicable legal obligations.",
      ],
    },
    {
      id: "9",
      heading: "Customer Rights and Choices",
      paragraphs: [
        "Subject to applicable law and the commencement of relevant statutory provisions, you may have rights concerning your personal information, including:",
      ],
      items: [
        "Requesting information about personal data processed by Timmbr.",
        "Requesting correction of inaccurate or incomplete information.",
        "Requesting erasure of personal data where applicable.",
        "Withdrawing consent for processing that relies on consent.",
        "Seeking grievance redressal regarding the handling of personal information.",
        "Exercising other rights available under applicable law.",
      ],
      trailingParagraphs: [
        "Some information may need to be retained to complete a transaction, honour a warranty, maintain legally required records, or address a dispute. Any restriction on a request will be handled in accordance with applicable law.",
        "To submit a request, contact privacy@timmbr.com and provide sufficient information for us to identify the relevant account or transaction. We may request reasonable verification to prevent unauthorised disclosure or changes to personal information.",
        "We will respond to requests within the applicable legal timelines and explain where a request cannot be fulfilled in full.",
      ],
    },
    {
      id: "10",
      heading: "Children's Privacy",
      paragraphs: [
        "Our furniture retail services are intended for people who can lawfully enter into the relevant transactions.",
        "We do not knowingly seek to collect children's personal information for unrelated marketing purposes.",
        "Where the Digital Personal Data Protection Act, 2023 and applicable Rules require parental consent or impose restrictions concerning children's personal data, Timmbr will follow those requirements as they become applicable to its activities.",
        "If you believe that a child has provided personal information to us in circumstances that are inappropriate or unauthorised, please contact privacy@timmbr.com so that we can review the matter.",
      ],
    },
    {
      id: "11",
      heading: "Third-Party Websites and Services",
      paragraphs: [
        "Our website may contain links to third-party websites, payment pages, social media platforms, or other external services.",
        "These services may operate under their own privacy policies and terms. Timmbr does not control the privacy practices of independent third parties.",
        "We encourage you to review the privacy information provided by those services before submitting personal information to them.",
      ],
    },
    {
      id: "12",
      heading: "Data Processing and Transfers",
      paragraphs: [
        "Some of our service providers may process or store personal information on systems located outside your state or outside India.",
        "Where such processing or transfer occurs, Timmbr will address it in accordance with applicable Indian law and any relevant restrictions or requirements that apply to the particular transfer.",
        "We will not claim that all information is stored exclusively in India unless that has been verified.",
      ],
    },
    {
      id: "13",
      heading: "Grievance Redressal and Privacy Complaints",
      paragraphs: [
        "If you have a concern about the collection, use, disclosure, or handling of your personal information, you may contact us using the details below.",
      ],
      subsections: [
        {
          id: "Officer",
          heading: "Grievance Officer / Privacy Contact",
          items: [
            "Name: Priya Nair",
            "Designation: Head of Customer Experience",
            "Email: grievance@timmbr.com",
            "Phone: +91 80 4567 8900",
            "Postal address: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
          ],
        },
      ],
      trailingParagraphs: [
        "Please include a description of your concern and any relevant order or reference number, if applicable.",
        "We will acknowledge and address complaints within the time limits prescribed by applicable law. Where the Consumer Protection (E-Commerce) Rules, 2020 apply, the applicable consumer grievance requirements, including the prescribed acknowledgement and redressal timelines, will be followed.",
        "You may also have access to remedies or grievance mechanisms provided by applicable law.",
      ],
    },
    {
      id: "14",
      heading: "Changes to This Privacy Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time to reflect changes in our business, website features, service providers, or legal obligations.",
        'The revised version will be published on this page with an updated "Last Updated" date.',
        "Where a change requires fresh consent or another form of notice under applicable law, we will take the required steps before relying on the changed practices.",
        "We encourage you to review this page periodically.",
      ],
    },
    {
      id: "15",
      heading: "Contact Us",
      paragraphs: [
        "For questions regarding this Privacy Policy or Timmbr's handling of your personal information, contact:",
      ],
      items: [
        "Website: https://www.timmbr.com/",
        "Email: hello@timmbr.com",
        "Phone: +91 80 4567 8900",
        "Registered office: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
        "Privacy and grievance contact: privacy@timmbr.com",
      ],
    },
  ],
};
