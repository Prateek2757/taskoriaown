export type Category = "new" | "pro" | "customer";

export interface Article {
  id: string;
  title: string;
  cat: Category;
  catLabel: string;
  content: string;
}

export interface ArticleGroup {
  heading: string;
  articles: { id: string; title: string }[];
}

export const CATEGORY_LABELS: Record<Category, string> = {
  new: "New to Taskoria",
  pro: "Professionals",
  customer: "Customers",
};

export const CATEGORY_GROUPS: Record<Category, ArticleGroup[]> = {
  new: [
    {
      heading: "Welcome to Taskoria",
      articles: [
        { id: "what-is-taskoria", title: "What is Taskoria and how does it work?" },
        { id: "how-to-start", title: "How to get started on Taskoria" },
        { id: "safety", title: "How Taskoria keeps you safe" },
        { id: "create-account", title: "Creating your Taskoria account" },
        { id: "complete-profile", title: "Completing your profile" },
        { id: "contact-us", title: "How to contact Taskoria support" },
      ],
    },
    {
      heading: "Trust & Safety",
      articles: [
        { id: "banned-reviews", title: "Banned reviews policy" },
        { id: "safeguarding", title: "Safeguarding and welfare at Taskoria" },
        { id: "illegal-content", title: "Illegal content policy" },
      ],
    },
  ],
  pro: [
    {
      heading: "Account",
      articles: [
        { id: "unsubscribe", title: "How to unsubscribe" },
        { id: "deactivate", title: "How do I deactivate my account?" },
        { id: "suspension", title: "User suspension policy" },
        { id: "complaints", title: "Complaints handling procedure" },
      ],
    },
    {
      heading: "Credits & Billing",
      articles: [
        { id: "credits", title: "What is a credit and how much does it cost?" },
        { id: "invoices", title: "Where do I find my invoices?" },
        { id: "credit-pack", title: "What are Credit Pack Subscriptions?" },
        { id: "credit-return", title: "Credit return policy" },
        { id: "lead-pricing", title: "Understanding lead pricing on Taskoria" },
      ],
    },
    {
      heading: "Credit Returns",
      articles: [
        { id: "eligible-returns", title: "Eligible reasons for returns" },
        { id: "request-return", title: "Requesting a credit return" },
        { id: "return-evidence", title: "How do you review return evidence?" },
      ],
    },
    {
      heading: "Setting up for success",
      articles: [
        { id: "setup-success", title: "Setting up for success" },
        { id: "get-hired", title: "Get Hired Guarantee (GHG)" },
        { id: "adding-reviews", title: "Adding reviews to your Taskoria profile" },
      ],
    },
    {
      heading: "Optimise your account",
      articles: [
        { id: "verified", title: "What is Taskoria Verified?" },
        { id: "elite", title: "What is Elite Pro?" },
        { id: "refer", title: "How do I refer a friend?" },
      ],
    },
    {
      heading: "Tips",
      articles: [
        { id: "first-message", title: "A great first message" },
        { id: "email-templates", title: "Email templates" },
        { id: "how-to-get-hired", title: "How to get hired" },
        { id: "screen-leads", title: "How does Taskoria screen leads?" },
        { id: "sms-templates", title: "SMS templates" },
      ],
    },
  ],
  customer: [
    {
      heading: "Getting started",
      articles: [
        { id: "post-job", title: "How do I post a job for free?" },
        { id: "responses", title: "How many responses can I receive?" },
        { id: "enquiries", title: "What is Enquiries?" },
        { id: "compare-pros", title: "How do I compare professionals?" },
      ],
    },
    {
      heading: "Quotes & Hiring",
      articles: [
        { id: "getting-quotes", title: "Understanding your quotes" },
        { id: "hire-pro", title: "How do I hire a professional?" },
        { id: "after-hire", title: "What happens after I hire someone?" },
        { id: "cancel-job", title: "How do I cancel or edit my job?" },
      ],
    },
    {
      heading: "Reviews & Safety",
      articles: [
        { id: "leave-review", title: "How do I leave a review?" },
        { id: "report-pro", title: "How do I report a professional?" },
        { id: "press", title: "How do I submit a press enquiry?" },
      ],
    },
    {
      heading: "Account & Billing",
      articles: [
        { id: "refund", title: "Can I get a refund?" },
        { id: "delete-account", title: "How do I delete my account?" },
        { id: "privacy", title: "Privacy and data settings" },
      ],
    },
  ],
};

export const POPULAR_ARTICLES = [
  { id: "what-is-taskoria", cat: "new" as Category },
  { id: "screen-leads", cat: "pro" as Category },
  { id: "credits", cat: "pro" as Category },
  { id: "post-job", cat: "customer" as Category },
  { id: "credit-pack", cat: "pro" as Category },
  { id: "refer", cat: "pro" as Category },
  { id: "get-hired", cat: "pro" as Category },
  { id: "verified", cat: "pro" as Category },
  { id: "responses", cat: "customer" as Category },
  { id: "elite", cat: "pro" as Category },
  { id: "enquiries", cat: "customer" as Category },
  { id: "press", cat: "customer" as Category },
];

export const ARTICLES: Record<string, Article> = {
  "what-is-taskoria": {
    id: "what-is-taskoria",
    title: "What is Taskoria and how does it work?",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Taskoria is Australia's leading marketplace connecting customers who need services with verified local professionals ready to help.</p>
      <h3>For customers</h3>
      <p>You simply describe the job you need done, set your location, and Taskoria matches you with verified professionals in your area. You'll receive up to five personalised quotes — all for free. Compare reviews, ratings, and prices, then choose the right pro for you.</p>
      <h3>For professionals</h3>
      <p>Taskoria helps you grow your business by connecting you with customers actively looking for your services. You only pay for leads you're interested in — there's no monthly subscription required to get started.</p>
      <h3>How the matching works</h3>
      <ul>
        <li>Customer posts a job with details and location</li>
        <li>Taskoria sends the job to matched professionals nearby</li>
        <li>Up to 5 pros send quotes directly to the customer</li>
        <li>Customer reviews and hires their preferred professional</li>
      </ul>
    `,
  },
  "how-to-start": {
    id: "how-to-start",
    title: "How to get started on Taskoria",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Getting started on Taskoria takes less than two minutes, whether you're a customer or a professional.</p>
      <h3>As a customer</h3>
      <ul>
        <li>Head to taskoria.com.au and click "Post a job"</li>
        <li>Describe the service you need and add your location</li>
        <li>Receive quotes from up to 5 verified local professionals</li>
        <li>Compare profiles and reviews, then hire with confidence</li>
      </ul>
      <h3>As a professional</h3>
      <ul>
        <li>Create your free professional profile</li>
        <li>Add your services, service areas, and photos of your work</li>
        <li>Get verified to unlock more leads</li>
        <li>Browse and respond to jobs in your area</li>
      </ul>
    `,
  },
  "safety": {
    id: "safety",
    title: "How Taskoria keeps you safe",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Your safety is our top priority. Every professional on Taskoria is subject to verification checks before they can respond to jobs.</p>
      <h3>Verification checks</h3>
      <ul>
        <li>Identity verification via government-issued ID</li>
        <li>ABN / business registration checks</li>
        <li>Insurance validation where applicable</li>
        <li>Review of previous work history and references</li>
      </ul>
      <h3>Reporting issues</h3>
      <p>If you encounter any issue with a professional or customer on Taskoria, you can report it directly from the conversation thread. Our trust & safety team responds within 24 hours.</p>
    `,
  },
  "create-account": {
    id: "create-account",
    title: "Creating your Taskoria account",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Setting up your Taskoria account is quick and straightforward.</p>
      <h3>Steps to create an account</h3>
      <ul>
        <li>Visit taskoria.com.au and click "Sign up"</li>
        <li>Enter your name, email address, and a secure password</li>
        <li>Verify your email address via the confirmation link</li>
        <li>Select whether you're a customer or professional</li>
        <li>Complete your profile with your location and contact details</li>
      </ul>
      <h3>Signing in with Google or Apple</h3>
      <p>You can also sign up using your existing Google or Apple account for a faster experience. Just click the relevant button on the sign-up screen.</p>
    `,
  },
  "complete-profile": {
    id: "complete-profile",
    title: "Completing your profile",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>A complete profile helps you get the most out of Taskoria, whether you're a customer or a professional.</p>
      <h3>What to include</h3>
      <ul>
        <li>A clear profile photo</li>
        <li>Your location and service area (for professionals)</li>
        <li>A brief bio describing your experience</li>
        <li>Your services and pricing range</li>
        <li>Photos of past work (professionals)</li>
      </ul>
      <p>Profiles with photos and complete information receive significantly more responses than incomplete ones.</p>
    `,
  },
  "contact-us": {
    id: "contact-us",
    title: "How to contact Taskoria support",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Our support team is available to help you with any question or issue you encounter on Taskoria.</p>
      <h3>Ways to reach us</h3>
      <ul>
        <li>Help Center — Search for answers to common questions right here</li>
        <li>Submit a request — Fill out our support form and we'll respond within 24 hours</li>
        <li>Live chat — Available Mon–Fri, 9am–5pm AEST</li>
        <li>Phone — Call 1300 XXX XXX for urgent queries</li>
      </ul>
      <h3>Response times</h3>
      <p>We aim to respond to all requests within one business day. Urgent safety concerns are escalated and handled within 4 hours.</p>
    `,
  },
  "banned-reviews": {
    id: "banned-reviews",
    title: "Banned reviews policy",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Taskoria has a strict policy against fake, incentivised, or malicious reviews to protect the integrity of our platform.</p>
      <h3>What reviews are banned</h3>
      <ul>
        <li>Reviews left by friends, family, or colleagues of the professional</li>
        <li>Reviews offered in exchange for discounts or gifts</li>
        <li>Reviews submitted by fake accounts</li>
        <li>Defamatory or harassing reviews</li>
      </ul>
      <p>Professionals found to be soliciting banned reviews may have their account suspended.</p>
    `,
  },
  "safeguarding": {
    id: "safeguarding",
    title: "Safeguarding and welfare at Taskoria",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Taskoria has a zero-tolerance policy toward any behaviour that puts the safety or wellbeing of our users at risk.</p>
      <h3>Our commitments</h3>
      <ul>
        <li>All professionals undergo identity verification</li>
        <li>We provide a safe in-platform messaging system</li>
        <li>Our trust team monitors for unsafe behaviour 7 days a week</li>
        <li>We cooperate fully with law enforcement when required</li>
      </ul>
      <p>If you feel unsafe at any time, please contact our team immediately at safety@taskoria.com.au or call 1300 XXX XXX.</p>
    `,
  },
  "illegal-content": {
    id: "illegal-content",
    title: "Illegal content policy",
    cat: "new",
    catLabel: "New to Taskoria",
    content: `
      <p>Taskoria strictly prohibits any illegal content or services being posted on our platform.</p>
      <h3>What's not allowed</h3>
      <ul>
        <li>Services that require unlicensed operation in regulated trades</li>
        <li>Content that is defamatory, harassing, or discriminatory</li>
        <li>Fake identities or misrepresentation of credentials</li>
        <li>Any services that violate Australian law</li>
      </ul>
      <p>If you encounter content that appears to violate this policy, report it immediately using the "Report" button on any listing or profile.</p>
    `,
  },
  "screen-leads": {
    id: "screen-leads",
    title: "How does Taskoria screen leads I receive?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Taskoria uses a multi-step process to ensure the leads you receive are genuine, relevant, and high-quality.</p>
      <h3>Our screening process</h3>
      <ul>
        <li>Customer identity is verified at sign-up</li>
        <li>Job posts are reviewed for completeness and legitimacy</li>
        <li>Our AI flags and removes spam or low-quality submissions</li>
        <li>Leads are matched to you only when your skills and location align</li>
      </ul>
      <h3>What if I receive a bad lead?</h3>
      <p>If you believe a lead doesn't meet quality standards, you can request a credit return directly from the job page. Our team reviews each request within 2 business days.</p>
    `,
  },
  "credit-pack": {
    id: "credit-pack",
    title: "What are Credit Pack Subscriptions?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Credit Pack Subscriptions let you pre-purchase credits at a discounted rate, giving you a reliable budget to respond to leads each month.</p>
      <h3>How it works</h3>
      <ul>
        <li>Choose a monthly credit pack that suits your business volume</li>
        <li>Credits are added to your account automatically each month</li>
        <li>Unused credits roll over to the following month (up to 3 months)</li>
        <li>Cancel anytime — no lock-in contracts</li>
      </ul>
      <h3>Available packs</h3>
      <p>Packs range from starter (50 credits/month) to professional (500 credits/month). Larger packs offer greater per-credit discounts.</p>
    `,
  },
  "get-hired": {
    id: "get-hired",
    title: "What is the Get Hired Guarantee?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>The Get Hired Guarantee (GHG) is Taskoria's commitment that if you don't win a job from a lead, we'll credit you back.</p>
      <h3>How it works</h3>
      <ul>
        <li>You respond to a lead with a quote</li>
        <li>The customer hires a different professional</li>
        <li>You submit a GHG claim within 14 days</li>
        <li>Our team reviews and, if eligible, credits your account</li>
      </ul>
      <h3>Eligibility requirements</h3>
      <ul>
        <li>Your profile must be 100% complete</li>
        <li>You must respond within 24 hours of receiving the lead</li>
        <li>Your quote must include a personalised message</li>
      </ul>
    `,
  },
  "verified": {
    id: "verified",
    title: "What is Taskoria Verified?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Taskoria Verified is a badge awarded to professionals who have completed our full identity and credential verification process.</p>
      <h3>What verification includes</h3>
      <ul>
        <li>Government-issued ID check</li>
        <li>ABN / business registration confirmation</li>
        <li>Relevant licence or certificate upload</li>
        <li>Insurance document review</li>
      </ul>
      <h3>Benefits of being verified</h3>
      <ul>
        <li>A Verified badge displayed on your profile</li>
        <li>Priority placement in search results</li>
        <li>Higher customer trust and conversion rates</li>
        <li>Access to premium leads in your area</li>
      </ul>
    `,
  },
  "elite": {
    id: "elite",
    title: "What is Elite Pro?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Elite Pro is Taskoria's top-tier status for professionals who consistently deliver outstanding results and customer satisfaction.</p>
      <h3>How to qualify</h3>
      <ul>
        <li>Maintain a 4.8-star average rating or above</li>
        <li>Complete at least 50 jobs through Taskoria</li>
        <li>Hold active Taskoria Verified status</li>
        <li>Zero unresolved complaints in the last 12 months</li>
      </ul>
      <h3>Elite Pro benefits</h3>
      <ul>
        <li>Gold Elite Pro badge on your profile</li>
        <li>Featured placement in category search results</li>
        <li>Dedicated account manager</li>
        <li>10% discount on all credit purchases</li>
      </ul>
    `,
  },
  "credits": {
    id: "credits",
    title: "What is a credit and how much does it cost?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Credits are the currency used on Taskoria to respond to leads and connect with potential customers.</p>
      <h3>Credit pricing</h3>
      <p>Credits are purchased in packs. Individual credit prices vary by pack size, ranging from $1.50 per credit (small packs) to $0.90 per credit (large packs).</p>
      <h3>How many credits does a lead cost?</h3>
      <p>Lead prices vary based on the service category, job size, and customer location. Larger or more complex jobs typically cost more credits. You'll always see the credit cost before choosing to respond to any lead.</p>
    `,
  },
  "refer": {
    id: "refer",
    title: "How do I refer a friend?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Earn bonus credits by referring other professionals to join Taskoria.</p>
      <h3>How to refer</h3>
      <ul>
        <li>Go to your account dashboard and click "Refer a friend"</li>
        <li>Share your unique referral link via email, SMS, or social media</li>
        <li>When your friend signs up and purchases their first credit pack, you both earn bonus credits</li>
      </ul>
      <h3>Referral rewards</h3>
      <p>You'll receive 20 bonus credits for each successful referral. Your friend will receive 10 bonus credits to get started. There's no limit to how many friends you can refer.</p>
    `,
  },
  "post-job": {
    id: "post-job",
    title: "How do I post a job for free?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Posting a job on Taskoria is completely free and takes less than 2 minutes.</p>
      <h3>Steps to post a job</h3>
      <ul>
        <li>Visit taskoria.com.au and click "Post a job"</li>
        <li>Search for the service you need (e.g. "House Cleaning")</li>
        <li>Answer a few quick questions about your job</li>
        <li>Enter your suburb or postcode</li>
        <li>Submit — you'll start receiving quotes shortly</li>
      </ul>
      <h3>Tips for a great job post</h3>
      <ul>
        <li>Be specific about what you need (e.g. "3-bedroom house, weekly clean")</li>
        <li>Include your preferred dates or timeframe</li>
        <li>Mention any special requirements upfront</li>
      </ul>
    `,
  },
  "responses": {
    id: "responses",
    title: "How many responses can a customer receive?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>When you post a job on Taskoria, you can receive up to 5 quotes from verified professionals in your area.</p>
      <h3>Why only 5?</h3>
      <p>Limiting responses to 5 ensures you receive focused, quality quotes rather than being overwhelmed by dozens of messages. Each professional knows they're competing with a small group, so they're motivated to send you their best offer.</p>
      <h3>What if I want more quotes?</h3>
      <p>If you haven't received enough responses after 48 hours, you can choose to open your job to additional professionals from your job dashboard.</p>
    `,
  },
  "enquiries": {
    id: "enquiries",
    title: "What is Enquiries?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Enquiries is a feature that lets you message professionals directly before committing to a formal quote request.</p>
      <h3>How Enquiries works</h3>
      <ul>
        <li>Find a professional's profile you're interested in</li>
        <li>Click "Send enquiry" to start a conversation</li>
        <li>Ask questions, share details, and discuss pricing informally</li>
        <li>If you're happy, request a formal quote directly from the chat</li>
      </ul>
      <p>Enquiries are free and there's no obligation to hire.</p>
    `,
  },
  "press": {
    id: "press",
    title: "How do I submit a general press enquiry?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>For media and press-related questions, our communications team is happy to help.</p>
      <h3>How to get in touch</h3>
      <p>Send your press enquiry to press@taskoria.com.au with the subject line "Press enquiry — [your publication/outlet name]". Please include your deadline and a brief description of your story.</p>
      <h3>Response times</h3>
      <p>We aim to respond to all press enquiries within one business day. For urgent requests, please indicate this clearly in your email subject line.</p>
    `,
  },
  "invoices": {
    id: "invoices",
    title: "Where do I find my invoices?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>All your invoices and billing history are accessible directly from your Taskoria account dashboard.</p>
      <h3>How to find invoices</h3>
      <ul>
        <li>Log in to your account at taskoria.com.au</li>
        <li>Click your profile icon in the top-right corner</li>
        <li>Select "Billing & Invoices" from the menu</li>
        <li>Download any invoice as a PDF</li>
      </ul>
      <p>Invoices are generated automatically each time you purchase credits or a subscription and are also emailed to your registered address.</p>
    `,
  },
  "unsubscribe": {
    id: "unsubscribe",
    title: "How to unsubscribe",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>You can unsubscribe from Taskoria email notifications at any time without deleting your account.</p>
      <h3>Managing email preferences</h3>
      <ul>
        <li>Go to Account Settings → Notifications</li>
        <li>Toggle off the types of emails you no longer want to receive</li>
        <li>Or click "Unsubscribe" at the bottom of any Taskoria email</li>
      </ul>
      <h3>Cancelling a subscription</h3>
      <p>To cancel a Credit Pack Subscription, go to Billing → Subscriptions and click "Cancel subscription". Your credits will remain active until the end of the current billing period.</p>
    `,
  },
  "deactivate": {
    id: "deactivate",
    title: "How do I deactivate my account?",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>If you need a break from Taskoria, you can temporarily deactivate your account rather than deleting it permanently.</p>
      <h3>Deactivating vs deleting</h3>
      <ul>
        <li>Deactivating hides your profile and pauses incoming leads</li>
        <li>Your credits, reviews, and history are preserved</li>
        <li>You can reactivate at any time from your settings</li>
      </ul>
      <h3>How to deactivate</h3>
      <ul>
        <li>Go to Account Settings → Account Status</li>
        <li>Click "Deactivate account"</li>
        <li>Select a reason and confirm</li>
      </ul>
    `,
  },
  "suspension": {
    id: "suspension",
    title: "User suspension policy",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Taskoria may suspend accounts that violate our community standards or Terms of Service.</p>
      <h3>Common reasons for suspension</h3>
      <ul>
        <li>Soliciting fake or incentivised reviews</li>
        <li>Providing false information during verification</li>
        <li>Harassment or abusive behaviour toward other users</li>
        <li>Operating without required licences or insurance</li>
      </ul>
      <h3>Appealing a suspension</h3>
      <p>Email appeals@taskoria.com.au with your account details and a description of the situation. Our team will review within 3 business days.</p>
    `,
  },
  "complaints": {
    id: "complaints",
    title: "Complaints handling procedure",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Taskoria takes all complaints seriously and has a clear process for resolving disputes.</p>
      <h3>How to lodge a complaint</h3>
      <ul>
        <li>Email complaints@taskoria.com.au with your account details</li>
        <li>Describe the issue clearly and attach any supporting evidence</li>
        <li>Our team will acknowledge within 1 business day</li>
        <li>Resolution typically occurs within 5 business days</li>
      </ul>
      <p>For complex disputes, we may engage an independent mediator.</p>
    `,
  },
  "credit-return": {
    id: "credit-return",
    title: "Credit return policy",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Taskoria's credit return policy ensures professionals are fairly compensated when leads don't meet quality standards.</p>
      <h3>Key policy points</h3>
      <ul>
        <li>Returns must be requested within 14 days of receiving the lead</li>
        <li>Each lead can only be credited once</li>
        <li>Approved credits are returned to your account within 24 hours</li>
        <li>Repeated return requests may trigger a review of your account</li>
      </ul>
    `,
  },
  "lead-pricing": {
    id: "lead-pricing",
    title: "Understanding lead pricing on Taskoria",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Lead prices on Taskoria vary based on several factors to ensure fair pricing for all professionals.</p>
      <h3>What affects lead price</h3>
      <ul>
        <li>Service category — high-value services cost more credits</li>
        <li>Job size — larger or more complex jobs attract higher credit costs</li>
        <li>Location — metro areas may have different pricing</li>
        <li>Customer quality score — higher-quality customers may cost slightly more</li>
      </ul>
      <p>You'll always see the credit cost displayed before choosing to respond to any lead.</p>
    `,
  },
  "eligible-returns": {
    id: "eligible-returns",
    title: "Eligible reasons for credit returns",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Credit returns are available in specific circumstances where a lead does not meet Taskoria's quality standards.</p>
      <h3>Eligible reasons</h3>
      <ul>
        <li>Customer provided false contact details</li>
        <li>Customer never responded to your messages</li>
        <li>Job was already filled before you were contacted</li>
        <li>Lead was outside your stated service area</li>
        <li>Customer's budget was significantly different from what was posted</li>
      </ul>
      <h3>Not eligible</h3>
      <ul>
        <li>Customer chose a different professional</li>
        <li>You changed your mind after purchasing the lead</li>
        <li>Price disputes that were not declared upfront</li>
      </ul>
    `,
  },
  "request-return": {
    id: "request-return",
    title: "Requesting a credit return",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>If you believe a lead is eligible for a credit return, here's how to submit a request.</p>
      <h3>How to submit</h3>
      <ul>
        <li>Go to your lead history and find the relevant lead</li>
        <li>Click "Request credit return" on the lead details page</li>
        <li>Select the reason from the dropdown menu</li>
        <li>Provide supporting evidence (e.g. screenshot of no response)</li>
        <li>Submit — requests must be made within 14 days of receiving the lead</li>
      </ul>
      <p>Our team reviews all requests within 2 business days.</p>
    `,
  },
  "return-evidence": {
    id: "return-evidence",
    title: "How Taskoria reviews credit return evidence",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Our team carefully reviews all credit return requests to ensure fair outcomes for both professionals and customers.</p>
      <h3>Review process</h3>
      <ul>
        <li>We verify the details of the original lead</li>
        <li>We check communication logs between you and the customer</li>
        <li>We may contact the customer to understand their perspective</li>
        <li>A decision is made within 2 business days</li>
      </ul>
      <p>You'll be notified by email of the outcome. If approved, credits are returned to your account immediately.</p>
    `,
  },
  "setup-success": {
    id: "setup-success",
    title: "Setting up for success on Taskoria",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Professionals who follow these steps win significantly more jobs on Taskoria.</p>
      <h3>Profile essentials</h3>
      <ul>
        <li>Use a professional headshot or logo</li>
        <li>Write a compelling bio that highlights your experience</li>
        <li>List all relevant services and your service area</li>
        <li>Upload at least 5 photos of your past work</li>
      </ul>
      <h3>Response best practices</h3>
      <ul>
        <li>Respond to leads within 1 hour for best results</li>
        <li>Always personalise your message — don't use generic templates</li>
        <li>Include your price range and estimated timeline upfront</li>
      </ul>
    `,
  },
  "adding-reviews": {
    id: "adding-reviews",
    title: "Adding reviews to your Taskoria profile",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>You can invite past customers to leave reviews on your Taskoria profile, even for work done outside the platform.</p>
      <h3>How to request reviews</h3>
      <ul>
        <li>Go to your profile → Reviews → "Request a review"</li>
        <li>Enter your customer's name and email</li>
        <li>They'll receive a link to leave a review on your profile</li>
      </ul>
      <h3>Review guidelines</h3>
      <p>Reviews must be from genuine customers. Any reviews that violate our banned reviews policy will be removed and may result in account action.</p>
    `,
  },
  "first-message": {
    id: "first-message",
    title: "A great first message to a customer",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Your first message to a customer is the most important one. Here's how to stand out.</p>
      <h3>What to include</h3>
      <ul>
        <li>Use their name if available</li>
        <li>Reference specific details from their job post</li>
        <li>State your price or price range clearly</li>
        <li>Mention your relevant experience briefly</li>
        <li>End with a clear call to action</li>
      </ul>
    `,
  },
  "email-templates": {
    id: "email-templates",
    title: "Email templates for professionals",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Use these templates as a starting point, but always personalise them for each customer.</p>
      <h3>Initial quote template</h3>
      <p><em>"Hi [Name], thanks for posting your job! I've been providing [service] in [area] for [X] years and would love to help. Based on what you've described, I'm quoting approximately $[price]. I'm available [dates]. Happy to answer any questions!"</em></p>
      <h3>Follow-up template</h3>
      <p><em>"Hi [Name], just following up on my quote from [date]. I'd love the opportunity to help with your [service] job. Please let me know if you have any questions!"</em></p>
    `,
  },
  "how-to-get-hired": {
    id: "how-to-get-hired",
    title: "How to get hired on Taskoria",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>Winning more jobs on Taskoria comes down to speed, quality of response, and a great profile.</p>
      <h3>Proven tactics</h3>
      <ul>
        <li>Respond to leads within 30 minutes — early responders win more</li>
        <li>Personalise every message — reference the customer's specific job details</li>
        <li>Include your price or a price range upfront</li>
        <li>Keep your profile updated with recent reviews and photos</li>
        <li>Follow up politely if you haven't heard back within 24 hours</li>
      </ul>
    `,
  },
  "sms-templates": {
    id: "sms-templates",
    title: "SMS templates for professionals",
    cat: "pro",
    catLabel: "Professionals",
    content: `
      <p>SMS messages have a 98% open rate — use them wisely when following up on leads.</p>
      <h3>Initial SMS template</h3>
      <p><em>"Hi [Name], it's [Your Name] from Taskoria re your [service] job. I've sent a quote — happy to chat anytime. [Your number]"</em></p>
      <h3>Follow-up SMS</h3>
      <p><em>"Hi [Name], just checking you received my quote for your [service] job. Let me know if you have questions! — [Your Name]"</em></p>
    `,
  },
  "compare-pros": {
    id: "compare-pros",
    title: "How do I compare professionals?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Taskoria makes it easy to compare multiple professionals side by side before making your decision.</p>
      <h3>What to look at</h3>
      <ul>
        <li>Star rating — average score from verified past customers</li>
        <li>Number of reviews — more reviews means more reliability</li>
        <li>Response time — how quickly they typically reply</li>
        <li>Verified badge — indicates identity and credential checks passed</li>
        <li>Price — compare quotes fairly by scope of work</li>
      </ul>
    `,
  },
  "getting-quotes": {
    id: "getting-quotes",
    title: "Understanding your quotes",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>When professionals respond to your job, you'll receive personalised quotes in your Taskoria inbox.</p>
      <h3>What's included in a quote</h3>
      <ul>
        <li>The professional's proposed price or rate</li>
        <li>A personalised message about your job</li>
        <li>Their profile, rating, and reviews</li>
        <li>Estimated timeline for completion</li>
      </ul>
      <p>You can message any professional directly to ask follow-up questions before making your decision. There's no obligation to hire.</p>
    `,
  },
  "hire-pro": {
    id: "hire-pro",
    title: "How do I hire a professional?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Once you've found the right professional, hiring them through Taskoria is simple.</p>
      <h3>Steps to hire</h3>
      <ul>
        <li>Review the quotes in your inbox</li>
        <li>Click on a professional's profile to read reviews and see past work</li>
        <li>Message them to confirm details</li>
        <li>Click "Hire" on their quote to confirm the booking</li>
      </ul>
      <p>Once hired, you'll receive a confirmation with the professional's contact details and job summary.</p>
    `,
  },
  "after-hire": {
    id: "after-hire",
    title: "What happens after I hire someone?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Once you've hired a professional, here's what to expect next.</p>
      <h3>Immediate steps</h3>
      <ul>
        <li>You'll receive a confirmation email with the professional's contact details</li>
        <li>The professional will reach out to confirm timing and any final details</li>
        <li>Your job post is automatically closed to new quotes</li>
      </ul>
      <h3>After the job is done</h3>
      <ul>
        <li>Mark the job as complete in your dashboard</li>
        <li>Leave a review to help other customers</li>
        <li>Rate your experience — your feedback matters</li>
      </ul>
    `,
  },
  "cancel-job": {
    id: "cancel-job",
    title: "How do I cancel or edit my job?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>You can edit or cancel your job at any time before hiring a professional.</p>
      <h3>Editing a job</h3>
      <ul>
        <li>Go to "My Jobs" in your dashboard</li>
        <li>Click on the job you want to edit</li>
        <li>Select "Edit job" and update any details</li>
        <li>Professionals who've already quoted will be notified of changes</li>
      </ul>
      <h3>Cancelling a job</h3>
      <p>Click "Cancel job" on your job page. If you've already hired a professional, please contact them directly to discuss.</p>
    `,
  },
  "leave-review": {
    id: "leave-review",
    title: "How do I leave a review?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>After your job is completed, you'll be prompted to leave a review for your professional. Reviews help the community make informed decisions.</p>
      <h3>How to leave a review</h3>
      <ul>
        <li>You'll receive an email prompt 48 hours after your job is marked complete</li>
        <li>Or go to your job history and click "Leave a review"</li>
        <li>Rate the professional from 1–5 stars</li>
        <li>Write a short description of your experience</li>
        <li>Submit — it'll be live on their profile within 24 hours</li>
      </ul>
    `,
  },
  "report-pro": {
    id: "report-pro",
    title: "How do I report a professional?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>If you have a negative experience with a professional, you can report them directly from the Taskoria platform.</p>
      <h3>How to report</h3>
      <ul>
        <li>Go to the professional's profile or your conversation thread</li>
        <li>Click the three-dot menu and select "Report"</li>
        <li>Choose the reason for your report</li>
        <li>Add any additional context or evidence</li>
        <li>Submit — our team will review within 24 hours</li>
      </ul>
      <p>All reports are handled confidentially. You can also email trust@taskoria.com.au for urgent safety concerns.</p>
    `,
  },
  "refund": {
    id: "refund",
    title: "Can I get a refund?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Taskoria is free for customers — you never pay to post a job or receive quotes, so there's generally nothing to refund.</p>
      <h3>If you paid a professional directly</h3>
      <p>Payment disputes between customers and professionals are handled between the two parties. If you paid via Taskoria's payment feature, contact our support team and we'll assist with mediation.</p>
      <h3>Contact us</h3>
      <p>For any billing concerns, reach out to support@taskoria.com.au with your account details and a description of the issue.</p>
    `,
  },
  "delete-account": {
    id: "delete-account",
    title: "How do I delete my account?",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>You can permanently delete your Taskoria account at any time from your account settings.</p>
      <h3>Steps to delete</h3>
      <ul>
        <li>Go to Account Settings → Privacy</li>
        <li>Scroll to the bottom and click "Delete my account"</li>
        <li>Confirm your decision — this action is permanent</li>
      </ul>
      <p>Deleting your account will remove all your data, job history, and reviews. We recommend downloading your data first.</p>
    `,
  },
  "privacy": {
    id: "privacy",
    title: "Privacy and data settings",
    cat: "customer",
    catLabel: "Customers",
    content: `
      <p>Taskoria is committed to protecting your personal data in accordance with Australian Privacy Principles.</p>
      <h3>Managing your data</h3>
      <ul>
        <li>View and edit your personal information in Account Settings</li>
        <li>Download a copy of your data at any time</li>
        <li>Control which notifications you receive</li>
        <li>Opt out of marketing communications</li>
      </ul>
      <p>For full details, see our Privacy Policy at taskoria.com.au/privacy or email privacy@taskoria.com.au.</p>
    `,
  },
};
