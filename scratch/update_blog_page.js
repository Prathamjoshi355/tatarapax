import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const DEFAULT_BLOG_SECTIONS = [
  {
    id: "blog-hero",
    type: "blog-hero",
    title: "Latest Blogs & Career Insights",
    subtitle: "Read helpful guides, placement preparation tips, and interview advice written by career coaches and tech professionals.",
    content: {
      badgeText: "CAREER ARTICLES & TIPS",
      categories: [
        "All Articles",
        "Placement Prep",
        "Technical Skills",
        "Interview Tips",
        "Resume & LinkedIn"
      ]
    },
    design: {
      backgroundColor: "#f2f4f8",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "12",
      animation: "fade"
    }
  },
  {
    id: "blog-ribbon",
    type: "blog-ribbon",
    title: "Editorial Value Metrics Ribbon",
    subtitle: "Why our placement guides deliver results",
    content: {
      features: [
        {
          id: "ribbon-1",
          icon: "verified_user",
          title: "Vetted Industry Insights",
          desc: "Articles written directly by campus recruiting heads and technical engineering managers."
        },
        {
          id: "ribbon-2",
          icon: "account_tree",
          title: "Curated Roadmaps",
          desc: "Structured week-by-week preparation schedules designed for tier-2 and tier-3 colleges."
        },
        {
          id: "ribbon-3",
          icon: "payments",
          title: "100% Free Resources",
          desc: "Every guide, template, and breakdown is open-access with no paywalls for students."
        }
      ]
    },
    design: {
      backgroundColor: "#eceef2",
      textColor: "#5f5e5e",
      headingColor: "#191c1f",
      borderRadius: "4px",
      paddingY: "12",
      animation: "fade"
    }
  },
  {
    id: "blog-newsletter",
    type: "blog-newsletter",
    title: "Get placement tips and drive updates delivered directly to your inbox.",
    subtitle: "Join 35,000+ engineering and management students receiving weekly company patterns, aptitude questions, and verified job notices.",
    content: {
      badgeText: "Weekly Career Dispatch",
      buttonText: "Subscribe",
      placeholder: "Enter your email address",
      disclaimer: "Zero spam. Unsubscribe anytime. Strictly career opportunities and study roadmaps.",
      successMessage: "Thank you for subscribing! Check your inbox for the latest placement guide."
    },
    design: {
      backgroundColor: "#f2f4f8",
      textColor: "#e0e2e6",
      headingColor: "#ffffff",
      borderRadius: "12px",
      paddingY: "16",
      animation: "fade"
    }
  }
];

const DEFAULT_BLOG_POSTS = [
  {
    id: "blog-1",
    title: "How to Prepare for Campus Aptitude Tests in 30 Days",
    slug: "how-to-prepare-for-campus-aptitude-tests-in-30-days",
    category: "Placement Prep",
    excerpt: "Learn the most common quantitative aptitude and logical reasoning questions asked by top IT services companies.",
    content: `Campus aptitude tests are the first critical filter in college recruitment drives for companies like TCS, Infosys, Wipro, Accenture, and Cognizant. With the right 30-day structured roadmap, any student can systematically master the syllabus.

### Week 1: Foundational Arithmetic
Focus on high-weightage topics: Percentages, Profit & Loss, Simple & Compound Interest, and Ratios. Solve 25 problems daily under timed conditions to build speed and accuracy.

### Week 2: Speed Math & Time-Distance
Practice Time, Speed & Distance, Boats & Streams, and Time & Work. Learn Vedic math shortcuts for 2-digit multiplication, square roots, and percentages to save precious seconds in speed-based screening rounds.

### Week 3: Logical & Analytical Reasoning
Dedicate this week to Blood Relations, Seating Arrangements (Linear & Circular), Syllogisms, and Coding-Decoding. Accuracy is paramount here as negative marking often applies.

### Week 4: Verbal Ability & Full Mock Tests
Revise Reading Comprehension, Sentence Correction, Subject-Verb Agreement, and Para Jumbles. Take 5 full-length timed mock exams to build endurance and test-taking confidence.

**Key Takeaway:** Consistent daily practice for 90 minutes beats last-minute cramming. Track your errors in an analysis notebook and retake challenging question sets.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5yuIvmW3eqxGMlE3LgRrn-uBthJUyj6mqwr1uju2rIQzVSk_ArMrCMqn35HxY5oGbYu53Ewao10WXR0XYFLM4y3WgFnvDgGMB0tbbipfhKuIhkK3rZq_Erjh4IFtlGOn7tEtSRT9NL19AqtvrA8Cy5DvCYhFtKnHg_EUnlp-GHs4fb5eh-E0_s1ptNMlnZbcGWEkv1cuzoohdMm3v401o2mJpN6nYwGqnePsU8CNEB-JO5Fmi8jKbRQ",
    date: "Nov 24, 2024",
    readTime: "5 min read",
    status: "published"
  },
  {
    id: "blog-2",
    title: "Top 10 Behavioral Interview Questions and How to Answer Them",
    slug: "top-10-behavioral-interview-questions-and-how-to-answer-them",
    category: "Interview Tips",
    excerpt: "Use the STAR method to answer tough HR and situational questions with clarity and confidence.",
    content: `Technical excellence gets you the interview; behavioral competence gets you the offer letter. HR recruiters look for culture fit, resilience, and teamwork.

### The STAR Framework
- **Situation:** Briefly set the scene and context.
- **Task:** Explain what needed to be accomplished.
- **Action:** Describe the specific actions YOU took.
- **Result:** Share the measurable outcome and what you learned.

### Top Questions to Master
1. **Tell me about yourself:** Keep it focused on your academic projects, key skills, and why you are excited about this role.
2. **Tell me about a time you faced a difficult challenge in a project:** Emphasize problem diagnosis and proactive communication.
3. **How do you handle disagreement with a teammate?** Demonstrate empathy, listening skills, and objective compromise.
4. **What is your greatest weakness?** Mention a real area you are actively improving with concrete steps taken.
5. **Where do you see yourself in 3 years?** Express interest in mastering technical architecture and mentoring juniors.

Always prepare 2 thoughtful questions to ask the interviewer at the end of the conversation.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuBQVo4ipjwG1prGtdtYI0PI6sIodbE0R9xQDfpPT6hTLtM3bGU-yrlThfimA8bhcPwi0GBmMWE8AgYWaP49Qp_cwhkFbcEzpEe62SMampYQHz2C44qmXbL55ceyJY-R7sUcUGMaL-kitjVK4JvA3Y3VsAZ4tLOWN3YyQEk0XB1Gr1d84zFBr2uWZsoTUvhQe9xpmoSW5FrAoWgsAXe-zP-vYVFCfSb5JYxeDBWtM0qn9TG3TM1ooZHA",
    date: "Nov 18, 2024",
    readTime: "6 min read",
    status: "published"
  },
  {
    id: "blog-3",
    title: "5 Common Resume Mistakes Engineering Students Make",
    slug: "5-common-resume-mistakes-engineering-students-make",
    category: "Resume & LinkedIn",
    excerpt: "Ensure your resume passes ATS scanners by avoiding formatting errors, cluttered layouts, and missing project links.",
    content: `Over 75% of fresher resumes get rejected before reaching a human recruiter due to automated Applicant Tracking Systems (ATS) or poorly formatted summaries.

### 1. Complex Two-Column & Graphic Heavy Layouts
ATS parsers read left-to-right, top-to-bottom. Two-column tables, skill rating progress bars, and icon graphics scramble parsed data. Use clean, single-column chronological layouts.

### 2. Missing Live Project & GitHub URLs
Listing 'Library Management System' without a GitHub repository link or live demo URL raises skepticism. Include clickable links for all technical projects.

### 3. Vague Project Descriptions Without Metrics
Instead of 'Worked on website frontend using React', write: 'Developed responsive candidate dashboard using React.js and TailwindCSS, reducing load latency by 35% across 200+ mock users.'

### 4. Cluttering High School Marks
Once in engineering, your 10th and 12th details need only one line. Use that space for certifications, hackathon participations, and technical tool stacks.

### 5. Overloading Buzzwords Without Context
Only list languages and frameworks you can defend in a live whiteboarding session. If you write 'Docker & Kubernetes', know how containers differ from virtual machines.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCYybGH3VuiPmRoktJdZk3m3tLDPoVX-N0E7jVi93A8kWtYjVdeaiyqLeppRY3z07ABkPTAxc-twt1WXIoPsA8QIKiu-UuHObqv-T9JCmFSF0r4mwXxXmwxxbQcLGoQI0TFVF7wuambzFwXwRrFQq9w29unhQ2M4s-spopVftXAM0XVxrdB_qJAWMNjgK8rgTwZDioNVe6Qb6V-zgYa3TNwYmqRGe9mquuMAFi7LgZ-98Q_m46vwa_7zA",
    date: "Nov 12, 2024",
    readTime: "4 min read",
    status: "published"
  },
  {
    id: "blog-4",
    title: "Essential Data Structures for Product Company Coding Rounds",
    slug: "essential-data-structures-for-product-company-coding-rounds",
    category: "Technical Skills",
    excerpt: "A beginner-friendly checklist of arrays, linked lists, trees, and graphs needed for technical assessments.",
    content: `Landing a job at product-based companies requires deep intuition in algorithmic problem solving. Here is the curated checklist of core patterns you must master.

### Core Data Structures
- **Arrays & Strings:** Two pointers, sliding window, prefix sums, Kadane's algorithm.
- **Hash Maps & Sets:** Frequency counting, anagram checks, two-sum variations with O(1) lookups.
- **Linked Lists:** Fast & slow pointer (Floyd's cycle detection), reversal in-place, merge sorted lists.
- **Binary Trees & BST:** Pre-order, in-order, post-order, BFS level-order traversals, lowest common ancestor.
- **Heaps & Priority Queues:** Top-K frequent elements, running median, merging K sorted streams.
- **Graphs:** Adjacency lists, BFS/DFS, topological sorting (Kahn's), shortest path (Dijkstra).

### Recommended Practice Strategy
Solve 75 curated standard questions (such as Blind 75) rather than 500 random problems. Focus on identifying the pattern within the first 5 minutes of reading the problem statement.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6G9hXql1c6Rqw_aV8QW8ymyjUvbSpTYy2HBWlwmTJLpL2SnqG-cWHuPeQWd2K1iP0te5-dLnhbooVLOelBPzs55PzYdQiDqv0eGw3QEy76HXyf4-9z1hQ-8CQ9lURAIa99T497T4gUxAPgwwP5Vyfx62zsSYCSc9gbHvI5ggDrIy9BgH6MsOID0nc3banoRmPCkPPWackOQp9O9v2smEOQ6mujY_hxqxb7gKrbJLWagulQrw599BGJA",
    date: "Oct 30, 2024",
    readTime: "7 min read",
    status: "published"
  },
  {
    id: "blog-5",
    title: "What Recruiters Look for in Fresher Software Engineers",
    slug: "what-recruiters-look-for-in-fresher-software-engineers",
    category: "Placement Prep",
    excerpt: "Insights from senior tech recruiters on problem-solving skills, basic fundamentals, and communication.",
    content: `When companies interview campus candidates, they do not expect 5 years of enterprise architecture experience. Instead, talent acquisition leads evaluate four foundational pillars:

### 1. Conceptual Fundamentals
Can you explain ACID properties in databases? Do you know the difference between process and thread? Recruiters test CS core fundamentals in OS, DBMS, OOPs, and Computer Networks.

### 2. Learnability & Coachability
Tech stacks evolve rapidly. How quickly can you pick up Go or TypeScript if your college taught C++? Recruiters look for curiosity, personal curiosity projects, and an open mind.

### 3. Clear Communication While Problem Solving
In coding rounds, do not code silently for 20 minutes. Think out loud! Explain edge cases you are considering, why you chose a hash map over a nested loop, and compute time/space complexity.

### 4. Team Culture & Accountability
Will you be enjoyable to collaborate with in a daily sprint? Speak positively about past team challenges and take ownership of mistakes.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8pbGZVEZt1FV_O1YuZ95PLrBrCrR1W6nNGG4BZ5WRvohNAtHb13IoEojB2Ir3J0rXjxCrC92VGRo_xyGCPq4YQPOs7jASbZPdp9MQfm03ByOBstTfO1PIZeGZ4zMgV94YepUDZPhZYM0vWf80LZvC5mc25iVFSspGBw6iN6Zbk0SPeT7UuVGjhs34BRyeD7pBdTQrq4hsm5tNtsT2UGsVoe3LNXTaJQqQ3shEiqWlGjaS6FGxYAzXfQ",
    date: "Oct 15, 2024",
    readTime: "5 min read",
    status: "published"
  },
  {
    id: "blog-6",
    title: "How to Handle Rejection and Stay Motivated During Campus Placements",
    slug: "how-to-handle-rejection-and-stay-motivated-during-campus-placements",
    category: "Interview Tips",
    excerpt: "Practical advice on analyzing interview mistakes, improving skills, and staying focused on the next hiring drive.",
    content: `Campus placement season can be an emotional rollercoaster. Rejection is rarely a measure of your worth; often it simply means that specific opening was not the right match today.

### 1. The 2-Hour Debrief Rule
Within 2 hours of receiving a rejection, write down every single question asked in that interview, which ones you felt hesitant about, and which technical concepts need review.

### 2. Avoid Peer Comparison
Seeing classmates announce offers on social media can create anxiety. Everyone has their own timeline. The first offer is rarely the best offer of your career.

### 3. Continuous Skill Sharpening
Use non-interview days to polish mock interviews with peers. Record your answers on video to check body language, eye contact, and pacing.

### 4. Tap Into Private Placement Drives
TantraPex hosts verified corporate hiring drives every month for engineering and MCA students across India. One rejection is just a redirect to a better company suited to your unique skillset.`,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1W-BwsuzjEEL5NqV5A_d7k_JFROi7HXDllC1MIKSFWmV8UfyAF_SnFGj981zWLlW4aiK4EaEdeTHDdkMCjajaVA24IQBRU4AvaHH5YcNdUzXeEBYO0odQ7Fa52IMpBVdixie965i5EErRXbWzBhjIrI7ZQlRihAaQ7q4U7SxaxObSVCw69oZnaJo5YGi_o1zppx8Pxo0EhssNlPeRjjZmXlwFkJiQ_ebHQHdk8p7ZoF5k1hZszMiVRA",
    date: "Oct 02, 2024",
    readTime: "6 min read",
    status: "published"
  }
];

async function updateBlog() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("tatrapax");

  // 1. Update pages collection for "blog"
  const pagesCol = db.collection("pages");
  const result = await pagesCol.updateOne(
    { id: "blog" },
    {
      $set: {
        title: "Latest Blogs & Career Insights",
        slug: "/blog",
        seo: {
          title: "Latest Blogs & Career Insights | TantraPex Technologies",
          description: "Read helpful guides, placement preparation tips, and interview advice written by career coaches and tech professionals.",
          keywords: "campus placement, interview preparation, aptitude tests, engineering resume, tech jobs"
        },
        sections: DEFAULT_BLOG_SECTIONS
      }
    },
    { upsert: true }
  );

  console.log("Pages collection updated for blog:", result);

  // 2. Update blogs collection with all 6 rich articles
  const blogsCol = db.collection("blogs");
  await blogsCol.deleteMany({});
  const insertResult = await blogsCol.insertMany(DEFAULT_BLOG_POSTS);
  console.log("Inserted articles into blogs collection:", insertResult.insertedCount);

  await client.close();
  console.log("Done updating MongoDB blog data!");
}

updateBlog().catch(console.error);
