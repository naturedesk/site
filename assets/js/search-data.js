// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/site/";
    },
  },{id: "nav-approach",
          title: "approach",
          description: "Hoe NatureDesk biodiversiteitsdata, EBV’s en beleid verbindt tot navolgbare besluitondersteuning.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/site/approach/";
          },
        },{id: "nav-use-cases",
          title: "use cases",
          description: "Example application areas for NatureDesk.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/site/use-cases/";
          },
        },{id: "nav-contact",
          title: "contact",
          description: "Start a conversation about pilots, partnerships, and governance-ready workflows.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/site/contact/";
          },
        },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/site/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/site/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-policy-and-governance-synthesis",
          title: 'Policy and governance synthesis',
          description: "Turn policy documents, governance materials, and project evidence into usable first analyses.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/1_nature_governance_synthesis/";
            },},{id: "projects-monitoring-to-reporting-workflows",
          title: 'Monitoring to reporting workflows',
          description: "Connect biodiversity monitoring outputs and indicators to reporting and interpretation work.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/2_monitoring_to_reporting/";
            },},{id: "projects-sovereign-ai-for-nature-practice",
          title: 'Sovereign AI for nature practice',
          description: "Explore explainable, governance-aware AI workflows without defaulting to generic black-box tooling.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/3_sovereign_ai_for_practice/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/site/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/site/teachings/introduction-to-machine-learning/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
