/**
 * ============================================
 * PORTFOLIO DATA — EDIT ALL YOUR INFO HERE
 * ============================================
 * This file contains all editable content for your portfolio.
 * Update values here without touching any other file.
 */

const portfolioData = {

  // ==========================================
  // PERSONAL INFO
  // ==========================================
  personal: {
    name: "Ahmed Nasr",
    firstName: "Ahmed",
    lastName: "Nasr",
    initials: "AN",
    title: "MEAN Stack Developer",
    typedTitles: [               // Array of titles for typing animation
      "MEAN Stack Developer",
      "Full Stack Web Developer",
      "Angular Developer",
      "Node.js Developer",
    ],
    email: "ahmednasrr.business@gmail.com",
    phone: "+201024270459",
    location: "Mansoura, Egypt",
    profileImage: "assets/images/profile.jpg",
    aboutImage: "assets/images/about-me-cropped.jpeg",
    cv: "assets/cv/my-cv.pdf",
    aboutText: `I am a passionate Full Stack Developer specializing in the MEAN stack (MongoDB, Express.js, Angular, Node.js). I love building scalable, efficient, and user-friendly web applications. With a strong foundation in both frontend and backend development, I strive to deliver clean, maintainable code and exceptional user experiences. I am always eager to learn new technologies and tackle challenging problems.`,
  },

  // ==========================================
  // STATISTICS
  // ==========================================
  statistics: [
    { id: "stat-experience", value: 1,    suffix: "+", label: "Years Experience" },
    { id: "stat-projects",   value: 10,   suffix: "+", label: "Projects Done"    },
    { id: "stat-expertise",  value: null, text: "MEAN Stack", label: "Expertise"       },
  ],

  // ==========================================
  // EDUCATION
  // ==========================================
  education: [
    {
      degree: "Computer And Information Sciences",
      field: "Computer And Information Sciences",
      institution: "Mansoura University",
      grade: "Very Good",
      status: "3rd Academic Year",
      year: "Current Student",
      description: "Currently studying Computer and Information Sciences at Mansoura University, building a foundation in computing, programming, and information systems."
    }
  ],

  // ==========================================
  // EXPERIENCE (newest first)
  // ==========================================
  experience: [
    {
      title: "Fresh MEAN Stack Developer",
      company: "",
      type: "Part-time",
      duration: "December -- Present",
      current: true,
      responsibilities: [
        "Developed and maintained full-stack web applications using the MEAN stack",
        "Collaborated with cross-functional teams to design and implement new features",
        "Optimized application performance and improved load times by 30%",
        "Implemented RESTful APIs consumed by Angular frontend applications",
        "Participated in code reviews and maintained high code quality standards"
      ],
      technologies: ["Angular", "Node.js", "Express.js", "MongoDB", "TypeScript", "REST APIs"]
    },
    {
      title: "Junior Front-End Developer",
      company: "",
      type: "Part-time",
      duration: "Jun 2025 \u2014 Mar 2025",
      current: false,
      responsibilities: ["Built responsive web interfaces using HTML, CSS, and Vanilla JavaScript."],
      technologies: ["HTML", "CSS", "Vanilla Javascript"]
    }
  ],

  // ==========================================
  // SKILLS — PROGRAMMING & CONCEPTS
  // ==========================================
  programmingSkills: [
    { name: "JavaScript", icon: "fab fa-js" },
    { name: "TypeScript", icon: "fab fa-js" },
    { name: "HTML5 & CSS3", icon: "fab fa-html5" },
    { name: "Data Structures", icon: "fas fa-code" },
    { name: "OOP Concepts", icon: "fas fa-layer-group" },
    { name: "REST API Design", icon: "fas fa-plug" },
  ],

  // ==========================================
  // SKILLS — TECHNOLOGIES
  // ==========================================
  techSkills: [
    { name: "Angular",           icon: "fab fa-angular",    description: "Component-based SPA development with RxJS, services, routing, and state management." },
    { name: "Node.js",           icon: "fab fa-node-js",    description: "Server-side JavaScript runtime for scalable backend applications and APIs." },
    { name: "Express.js",        icon: "fas fa-server",     description: "Fast, minimalist web framework for building RESTful APIs and web services." },
    { name: "MongoDB",           icon: "fas fa-database",   description: "NoSQL document database for flexible, scalable data storage solutions." },
    { name: "Git & GitHub",      icon: "fab fa-git-alt",    description: "Version control, branching strategies, pull requests, and collaborative workflows." },
    { name: "Responsive Design", icon: "fas fa-mobile-alt", description: "Mobile-first layouts using Flexbox, CSS Grid, and media queries." },
    { name: "HTML5",             icon: "fab fa-html5",      description: "Semantic markup, accessibility, SEO-friendly structure and modern HTML APIs." },
    { name: "CSS3",              icon: "fab fa-css3-alt",   description: "Advanced styling, animations, custom properties, Flexbox and CSS Grid." },
    { name: "UI/UX Design",      icon: "fas fa-paint-brush",description: "User-centered design principles, wireframing, and creating intuitive interfaces." },
  ],

  // ==========================================
  // PROJECTS
  // ==========================================
  projects: [
    {
      name: "Rownaq Perfumes",
      category: "E-Commerce Web Application",
      categoryIcon: "fas fa-shopping-bag",
      type: "Full Stack",
      duration: "2026",
      current: true,
      description: "A modern e-commerce website designed for Ronaq, an Egyptian premium perfume brand, with a clean and elegant shopping experience. Built with Angular, Node.js, Express.js, and MongoDB, featuring responsive design and seamless product browsing.",
      responsibilities: [
        "Built a modern, responsive e-commerce storefront for an Egyptian luxury perfume brand",
        "Developed scalable RESTful APIs with Node.js & Express for catalog management, shopping cart, and orders",
        "Designed high-performance dynamic UI with Angular featuring reactive state management and seamless product filtering",
        "Architected MongoDB database models ensuring high data integrity, reliability, and rapid query execution"
      ],
      image: "assets/images/projects/rownaq-perfumes.jpeg",
      technologies: ["Angular", "Node.js", "Express.js", "MongoDB", "TypeScript", "REST APIs"],
      liveUrl: "https://rownaq-store-client.vercel.app/",
      githubUrl: "#",
    },
    {
      name: "Personal Portfolio Website",
      category: "Personal Portfolio",
      categoryIcon: "fas fa-laptop-code",
      type: "Front-End",
      duration: "2026",
      current: true,
      description: "A modern, responsive personal portfolio built with HTML5, CSS3, and Vanilla JavaScript. Features dark/light mode, smooth animations, and a fully editable data-driven architecture.",
      responsibilities: [
        "Engineered an ultra-fast, responsive portfolio showcasing MEAN stack projects and capabilities",
        "Implemented interactive features including dynamic theme toggling, typed text animation, and scroll reveal",
        "Created custom particle canvas background, magnetic buttons, and 3D card tilt effects",
        "Designed mobile-first responsive layout guaranteeing optimal user experience across all devices"
      ],
      image: "assets/images/projects/personal-portfolio.jpg",
      technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ],

  // ==========================================
  // SERVICES
  // ==========================================
  services: [
    {
      icon: "fas fa-code",
      name: "Full Stack Development",
      description: "End-to-end web application development using the MEAN stack. From database design to responsive frontend interfaces.",
    },
    {
      icon: "fab fa-angular",
      name: "MEAN Stack Development",
      description: "Specialized development with MongoDB, Express.js, Angular, and Node.js for scalable, modern web applications.",
    },
    {
      icon: "fas fa-laptop-code",
      name: "Frontend Development",
      description: "Crafting beautiful, responsive, and highly performant user interfaces with modern HTML5, CSS3, and JavaScript.",
    },
    {
      icon: "fas fa-server",
      name: "Backend Development",
      description: "Building robust, secure, and scalable server-side applications and RESTful APIs with Node.js and Express.js.",
    },
    {
      icon: "fas fa-mobile-alt",
      name: "Responsive Web Design",
      description: "Mobile-first, cross-device responsive design ensuring perfect user experience on all screen sizes.",
    },
    {
      icon: "fas fa-plug",
      name: "API Integration",
      description: "Seamless third-party API integration and development of custom RESTful APIs with proper documentation and security.",
    },
    {
      icon: "fas fa-cloud",
      name: "SaaS Development",
      description: "Developing Software-as-a-Service platforms with multi-tenancy, subscription management, and scalable architecture.",
    },
    {
      icon: "fas fa-paint-brush",
      name: "UI/UX Implementation",
      description: "Translating design mockups and wireframes into clean, pixel-perfect, accessible, and interactive web experiences.",
    },
  ],

  // ==========================================
  // SOCIAL LINKS
  // ==========================================
  socialLinks: {
    facebook:  "https://facebook.com/[YOUR_USERNAME]",
    linkedin:  "https://www.linkedin.com/in/ahmedd-nasrr/",
    github:    "https://github.com/AhmedMahmoudNasr-git",
    twitter:   "",   // leave empty to hide
    instagram: "",   // leave empty to hide
  },

  // ==========================================
  // CONTACT INFO
  // ==========================================
  contact: {
    email:    "ahmedmahmoudnsr@gmail.com",
    phone:    "+201024270459",
    location: "Mansoura, Egypt",
  },

};
