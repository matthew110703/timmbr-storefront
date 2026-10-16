import type { LegalContentSectionData } from "@/lib/api/types";

export const strings = {
  metadata: {
    title: "Terms & Conditions | Timmbr",
    description:
      "Read the terms and conditions governing your use of the Timmbr website and your purchase of furniture from us.",
  },
};

export const FALLBACK_TERMS_CONTENT: LegalContentSectionData = {
  type: "legal-content",
  show: true,
  sortOrder: 1,
  title: "Terms & Conditions",
  effectiveDate: "16 October 2026",
  lastUpdated: "16 October 2026",
  intro:
    'Welcome to Timmbr. These Terms & Conditions ("Terms") govern your access to and use of the Timmbr website at https://www.timmbr.com/, your purchase of furniture through our website, and your transactions with us through our physical stores, showrooms, or other authorised sales channels. Timmbr offers ready-made and custom-made furniture and related services to customers in India. By accessing our website or placing an order, you agree to these Terms, subject to applicable law. If you do not agree with these Terms, please do not use the website. Nothing in these Terms limits any consumer rights that cannot lawfully be excluded or restricted.',
  sections: [
    {
      id: "1",
      heading: "Business Information",
      paragraphs: ["The website and products are operated or offered by:"],
      items: [
        "Brand name: Timmbr",
        "Legal entity name: Timmbr Private Limited",
        "Registered office: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
        "Website: https://www.timmbr.com/",
        "Customer support email: hello@timmbr.com",
        "Customer support phone: +91 80 4567 8900",
        "Grievance Officer: Priya Nair, Head of Customer Experience",
        "Grievance email: grievance@timmbr.com",
      ],
      trailingParagraphs: [
        "The applicable legal entity is responsible for the relevant sale, as identified on your order confirmation, invoice, or other transaction documentation.",
      ],
    },
    {
      id: "2",
      heading: "Eligibility and Account Information",
      paragraphs: [
        "You must provide accurate and complete information when placing an order, registering an account, requesting a quotation, or arranging delivery.",
        "You are responsible for maintaining the confidentiality of your account credentials and for notifying us if you suspect unauthorised access to your account.",
        "You must not use the website for unlawful purposes, attempt to interfere with its operation, submit fraudulent orders, or provide information that you know to be false or misleading.",
        "We may take reasonable steps to investigate suspected fraud, protect our systems, and address misuse, subject to applicable law and consumer rights.",
      ],
    },
    {
      id: "3",
      heading: "Products and Product Descriptions",
      paragraphs: [
        "Timmbr aims to present accurate product descriptions, specifications, photographs, dimensions, materials, finishes, prices, and other relevant information.",
        "Furniture is manufactured from natural and processed materials that may exhibit variations in colour, grain, texture, pattern, or finish. Minor variations may occur between individual products, samples, showroom displays, and website images.",
        "Such natural or manufacturing variations do not automatically mean that a product is defective. However, this provision does not exclude remedies where a product materially differs from its description, is defective, or otherwise fails to meet applicable legal requirements.",
        "Product images are intended to help customers understand the design and appearance of the furniture. Colours and proportions may appear different depending on display settings, lighting, photography, and the surrounding environment.",
        "Please review the listed dimensions, material specifications, finish, and other product details before placing an order.",
      ],
    },
    {
      id: "4",
      heading: "Custom-Made and Made-to-Order Furniture",
      paragraphs: [
        "Some products may be manufactured, finished, or configured according to individual customer requirements.",
        "Depending on the product, customisation may include dimensions, fabric, upholstery, colour, finish, material, configuration, or other specifications agreed upon with the customer.",
        "Before confirming a custom order, customers should review the final specifications, quotation, design selections, dimensions, price, and estimated delivery timeline provided by Timmbr.",
        "Once production has started, changes to specifications may not be possible or may require additional costs and time. Any such changes will be communicated to the customer for agreement where required.",
        "Customisation does not remove a customer's rights in relation to defective, damaged, misdescribed, or otherwise non-conforming products under applicable law.",
        "Any special cancellation, return, or refund conditions for custom-made furniture must be communicated clearly before the customer confirms the order and must comply with applicable law.",
      ],
    },
    {
      id: "5",
      heading: "Pricing, Taxes, and Additional Charges",
      paragraphs: [
        "Product prices will be displayed in Indian Rupees (INR), unless otherwise stated.",
        "The price applicable to an order will be the price communicated at checkout or in the accepted quotation, subject to any clearly disclosed taxes, delivery charges, installation charges, or other applicable fees.",
        "Before confirming an order, customers will be provided with the applicable price and material charges relevant to the transaction.",
        "Any additional charge for delivery, assembly, installation, customisation, or special handling will be disclosed before the customer agrees to the relevant service.",
        "Timmbr may update product prices and promotional offers from time to time. A price change will not, by itself, alter the agreed price of an already confirmed order, except where a lawful adjustment is agreed upon or otherwise permitted by applicable law.",
        "If a genuine pricing or listing error is discovered before an order is accepted, we will contact the customer to explain the issue and discuss the available options. We will not treat a confirmed transaction as cancelled merely to avoid an agreed price without an appropriate legal basis.",
      ],
    },
    {
      id: "6",
      heading: "Orders and Order Confirmation",
      paragraphs: [
        "Customers may place orders through the website or through an authorised offline sales channel.",
        "An online order request is subject to acceptance and confirmation by Timmbr. An automated acknowledgement that an order has been received does not necessarily constitute final acceptance unless expressly stated.",
        "Order confirmation may be communicated through email, SMS, WhatsApp, an account notification, an accepted quotation, or another documented method.",
        "An order may require clarification or additional confirmation if information is incomplete, a delivery location cannot be serviced, payment cannot be verified, or a genuine operational issue arises.",
        "If Timmbr cannot fulfil an order, we will inform the customer and arrange an appropriate cancellation and refund of amounts paid, as applicable.",
        "For offline transactions, the accepted quotation, invoice, written order confirmation, and any separately agreed terms may form part of the transaction documentation.",
        "Customers should review their order confirmation promptly and contact us if they identify an error in the selected product, dimensions, finish, quantity, delivery address, or other order details.",
      ],
    },
    {
      id: "7",
      heading: "Payment Terms",
      paragraphs: [
        "Timmbr may offer online payment methods and cash on delivery, subject to availability for the relevant product and location.",
        "Available online payment methods may include UPI, debit cards, credit cards, net banking, or other payment methods supported by our payment provider.",
        "Online payments are processed through the applicable payment service provider. Payment authorisation, settlement, reversals, and refunds may be subject to the provider's procedures and applicable law.",
        "For cash-on-delivery orders, payment must be made through the method and process communicated at the time of purchase or delivery.",
        "Any advance payment, deposit, or milestone payment for custom-made furniture must be disclosed and agreed upon before the order is confirmed.",
        "Customers must not share payment passwords, UPI PINs, card security codes, or other confidential payment credentials with Timmbr representatives.",
        "Where a payment is deducted but an order is not confirmed, please contact hello@timmbr.com with the transaction reference. We will investigate the issue and coordinate the appropriate resolution.",
      ],
    },
    {
      id: "8",
      heading: "Shipping and Delivery",
      paragraphs: [
        "Delivery availability, estimated delivery dates, shipping charges, and service conditions will be communicated during checkout or through the relevant quotation or order confirmation.",
        "Furniture delivery timelines may depend on product availability, manufacturing schedules, customisation, transportation, location, and installation requirements.",
        "Any delivery timeline provided is an estimate unless expressly confirmed as a binding commitment. We will communicate material delays and revised timelines where reasonably practicable.",
        "Customers must provide an accurate delivery address, contact number, and any other information reasonably required for delivery.",
        "Customers should ensure that the delivery location can accommodate the furniture, including access through doors, staircases, lifts, corridors, and other entry points.",
        "Any requirement for special equipment, restricted-access delivery, additional labour, or other special handling should be discussed before delivery. Additional charges will be communicated and agreed upon where required.",
        "If delivery cannot be completed because of incorrect address details, unavailable access, or the customer's absence, we will coordinate the next steps and disclose any applicable rescheduling charges before they are incurred.",
        "Delivery and installation services are subject to the scope stated in the order confirmation. Delivery does not automatically include assembly, wall mounting, electrical work, or removal of existing furniture unless expressly agreed.",
        "Please refer to our separate Shipping & Delivery Policy for further details.",
      ],
    },
    {
      id: "9",
      heading: "Inspection and Reporting Damage",
      paragraphs: [
        "Customers are encouraged to inspect their furniture upon delivery or installation, where reasonably possible.",
        "If an item appears damaged, defective, incomplete, or materially different from the confirmed order, please notify Timmbr promptly at hello@timmbr.com and provide the order number, a description of the issue, and photographs or other relevant evidence where available.",
        "If delivery personnel provide an inspection or delivery acknowledgement, customers should record any visible damage or discrepancy in the manner reasonably available to them.",
        "Failure to report an issue immediately does not automatically waive rights or remedies available under applicable law.",
        "Timmbr will assess reported issues and communicate the appropriate next steps, which may include inspection, repair, replacement, refund, or another lawful resolution, depending on the circumstances.",
      ],
    },
    {
      id: "10",
      heading: "Cancellation Policy",
      paragraphs: [
        "Customers may request cancellation by contacting orders@timmbr.com and providing their order number.",
        "Cancellation eligibility may depend on whether the order has been accepted, materials have been procured, manufacturing has started, the product has been dispatched, or delivery has been completed.",
        "For ready-made products, cancellation requests will be handled according to the order status and the applicable cancellation terms.",
        "For custom-made or made-to-order products, customers should review the specific cancellation conditions communicated before confirming the order. Production-related costs or cancellation charges will not be imposed arbitrarily and must comply with applicable law.",
        "Where an order cannot be fulfilled by Timmbr, the customer will be informed and any amount refundable under applicable law will be processed appropriately.",
        "Any cancellation charge must be fair, disclosed, and legally permissible. We will not impose a consumer cancellation charge in circumstances where applicable law prohibits it.",
        "Please refer to our separate Cancellation, Returns & Refund Policy for the detailed process and applicable conditions.",
      ],
    },
    {
      id: "11",
      heading: "Returns, Replacements, and Refunds",
      paragraphs: [
        "Requests relating to returns, replacements, refunds, damaged products, defective products, or products that do not match their description will be assessed under the applicable Returns & Refund Policy and relevant law.",
        "The assessment may take into account the nature of the issue, the confirmed product specifications, available evidence, inspection findings, and whether repair or replacement is an appropriate remedy.",
        "Any restrictions applicable to change-of-mind returns or customised products must be disclosed clearly and must not unlawfully exclude consumer remedies.",
        "Approved refunds will generally be returned through the original payment method where practicable, or another mutually agreed and legally permissible method.",
        "Refund processing time may depend on the payment provider, bank, and applicable payment procedures. We will communicate the expected process when a refund is approved.",
        "Nothing in these Terms excludes a consumer's statutory rights concerning defective goods, unfair trade practices, misleading descriptions, or other matters covered by applicable law.",
      ],
    },
    {
      id: "12",
      heading: "Warranty and After-Sales Service",
      paragraphs: [
        "Some products may be supplied with a manufacturer's warranty, Timmbr warranty, or another expressly stated warranty.",
        "Where a warranty applies, the relevant warranty document or product listing should specify its duration, coverage, exclusions, claim procedure, and applicable service conditions.",
        "Warranty coverage may differ depending on the product, material, components, and nature of the defect.",
        "Unless expressly covered by an applicable warranty or required by law, ordinary wear and tear, accidental damage, improper assembly, misuse, unauthorised modification, and damage caused by unsuitable maintenance may not be covered.",
        "Natural variations in wood grain, fabric texture, and other materials are not necessarily defects, subject to the product description and applicable legal requirements.",
        "To submit a warranty claim, contact warranty@timmbr.com with the order number, proof of purchase, a description of the issue, and supporting photographs where available.",
        "Timmbr will assess warranty claims according to the applicable warranty terms and law. Any warranty limitation will apply only to the extent legally permissible.",
      ],
    },
    {
      id: "13",
      heading: "Assembly, Installation, and Product Care",
      paragraphs: [
        "Customers should follow the product-specific assembly, installation, and maintenance instructions provided with the furniture.",
        "Where assembly or installation is included, the scope of service will be specified in the order confirmation or relevant service description.",
        "Customers should ensure that the installation area is suitable for the furniture and that any necessary access, clearance, and structural requirements are met.",
        "Damage resulting from improper assembly, misuse, unsuitable environmental conditions, or failure to follow product care instructions may affect applicable warranty coverage, subject to the terms of the relevant warranty and applicable law.",
        "If you are uncertain about the correct care or installation procedure, contact Timmbr before attempting modifications or repairs.",
      ],
    },
    {
      id: "14",
      heading: "Promotions, Discounts, and Gift Offers",
      paragraphs: [
        "Promotional offers, discount codes, bundles, and gift offers may be made available from time to time.",
        "Each offer may have specific eligibility criteria, validity periods, product restrictions, or minimum purchase requirements, which will be communicated with the offer.",
        "Promotional benefits cannot be combined unless expressly permitted by the offer terms.",
        "Offers will not be applied retrospectively to completed purchases unless expressly stated.",
        "Timmbr may discontinue or modify a promotion prospectively, subject to any obligations arising from an offer already accepted or a transaction already confirmed.",
        "Promotional descriptions and advertised savings will be presented in accordance with applicable consumer protection and advertising requirements.",
      ],
    },
    {
      id: "15",
      heading: "Intellectual Property",
      paragraphs: [
        "Unless otherwise stated, the website and its content—including the Timmbr name and branding, logos, product photographs, designs, descriptions, graphics, text, and other materials—are owned by or licensed to the relevant rights holder.",
        "You may access and use the website for personal, non-commercial shopping and informational purposes.",
        "You must not reproduce, distribute, commercially exploit, modify, or republish website content without prior permission, except where permitted by law.",
        "Nothing in these Terms transfers ownership of Timmbr's intellectual property to a customer.",
        "Custom furniture designs and related materials may be subject to separate written agreements, where applicable.",
      ],
    },
    {
      id: "16",
      heading: "Acceptable Website Use",
      paragraphs: ["You agree not to:"],
      items: [
        "Use the website for unlawful activities or fraudulent transactions.",
        "Attempt unauthorised access to website systems or customer accounts.",
        "Interfere with website availability, security, or operation.",
        "Introduce malicious software or conduct harmful automated activity.",
        "Copy or misuse website content in violation of applicable rights.",
        "Submit false information or impersonate another person.",
        "Use the website in a manner that violates applicable law.",
      ],
      trailingParagraphs: [
        "We may take reasonable and proportionate measures to protect the website, customers, and business from misuse, subject to applicable law.",
      ],
    },
    {
      id: "17",
      heading: "Third-Party Services and Links",
      paragraphs: [
        "Our website may link to or integrate with third-party services, including payment gateways, delivery services, social media platforms, and other external websites.",
        "These services may be governed by their own terms and privacy policies.",
        "Timmbr is not responsible for the independent operation of third-party websites or services, but this provision does not exclude any responsibility that Timmbr may have under applicable law for services it provides, representations it makes, or arrangements for which it is legally responsible.",
      ],
    },
    {
      id: "18",
      heading: "Limitation of Liability",
      paragraphs: [
        "Timmbr will perform its contractual obligations in accordance with the applicable order terms and law.",
        "To the extent permitted by applicable law, Timmbr will not be responsible for losses that are unrelated to our breach of these Terms or that could not reasonably have been anticipated in the circumstances.",
        "Nothing in these Terms excludes or restricts liability where such exclusion or restriction is prohibited by law, including applicable consumer protection rights and remedies.",
        "We do not guarantee uninterrupted or error-free access to the website, although we will take reasonable steps to maintain its operation and address technical issues.",
      ],
    },
    {
      id: "19",
      heading: "Events Beyond Reasonable Control",
      paragraphs: [
        "A delay or failure caused by events beyond our reasonable control may affect order fulfilment or service delivery. Such events may include natural disasters, severe weather, transport disruptions, government restrictions, or major infrastructure failures.",
        "Where such an event affects an order, we will take reasonable steps to inform the customer, explain the expected impact, and discuss available options.",
        "This provision does not automatically cancel an order or remove any refund, cancellation, or other rights that apply under law.",
      ],
    },
    {
      id: "20",
      heading: "Suspension and Termination",
      paragraphs: [
        "We may restrict or suspend access to website features where reasonably necessary to address security threats, suspected fraud, unlawful activity, or material misuse.",
        "Where appropriate, we will provide notice and an opportunity to resolve the issue.",
        "Any action affecting a confirmed order will be handled in accordance with the order terms and applicable law. Suspension of website access does not automatically extinguish outstanding obligations or consumer rights.",
      ],
    },
    {
      id: "21",
      heading: "Privacy and Personal Information",
      paragraphs: [
        "Your use of the website and our services may involve the collection and processing of personal information.",
        "Our handling of personal information is explained in the Timmbr Privacy Policy, available at https://www.timmbr.com/legal/privacy.",
        "By using our services, you acknowledge that you have had an opportunity to review that Policy. Any consent required for personal data processing will be obtained separately where applicable.",
        "Please review the Privacy Policy for information about data collection, payment processing, delivery partners, marketing communications, cookies, retention, and privacy-related requests.",
      ],
    },
    {
      id: "22",
      heading: "Consumer Complaints and Grievance Redressal",
      paragraphs: [
        "If you have a question, complaint, or concern relating to a purchase, delivery, product quality, cancellation, refund, or other service, please contact us using the details below.",
      ],
      subsections: [
        {
          id: "Officer",
          heading: "Customer Grievance Officer",
          items: [
            "Name: Priya Nair",
            "Designation: Head of Customer Experience",
            "Email: grievance@timmbr.com",
            "Phone: +91 80 4567 8900",
            "Address: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
          ],
        },
      ],
      trailingParagraphs: [
        "Please provide your order number, contact details, and a description of the issue so that we can investigate it.",
        "For covered e-commerce transactions, Timmbr will follow the applicable consumer grievance requirements, including the prescribed acknowledgement and redressal timelines.",
        "Nothing in this section prevents customers from approaching a competent consumer dispute redressal body or exercising any other remedy available under applicable law.",
      ],
    },
    {
      id: "23",
      heading: "Governing Law and Disputes",
      paragraphs: [
        "These Terms are governed by the laws of India.",
        "Any dispute arising from a transaction with Timmbr will be addressed in accordance with applicable Indian law and the procedures available to the parties.",
        "Nothing in these Terms removes a consumer's right to approach a consumer commission or other competent authority where permitted by applicable law.",
        "Any contractual jurisdiction provision will apply only to the extent legally valid and will not override mandatory consumer protections.",
      ],
    },
    {
      id: "24",
      heading: "Changes to These Terms",
      paragraphs: [
        "Timmbr may revise these Terms to reflect changes in its products, services, business practices, or legal obligations.",
        'The updated version will be published on this page with a revised "Last Updated" date.',
        "Changes will apply prospectively where appropriate. Any change affecting an existing confirmed order will be handled in accordance with the agreed transaction terms and applicable law.",
        "We encourage you to review these Terms periodically.",
      ],
    },
    {
      id: "25",
      heading: "Contact Information",
      paragraphs: [
        "For questions about these Terms, your order, or Timmbr's services, contact:",
      ],
      items: [
        "Website: https://www.timmbr.com/",
        "Email: hello@timmbr.com",
        "Phone: +91 80 4567 8900",
        "Registered office: No. 12, 3rd Floor, Brigade Road, Bengaluru, Karnataka 560001",
        "Grievance Officer: Priya Nair, Head of Customer Experience",
        "Grievance email: grievance@timmbr.com",
      ],
    },
  ],
};
