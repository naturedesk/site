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
          description: "Verken een pilot of samenwerking rond biodiversiteitsmonitoring, EBV’s en navolgbare AI-ondersteuning.",
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
          section: "News",},{id: "projects-rag-for-international-biodiversity-agreements-amp-scientific-reports",
          title: 'RAG for international biodiversity agreements &amp;amp; scientific reports',
          description: "A UvA challenge focused on improving searchability and source-grounded retrieval across IUCN resolutions and related biodiversity-policy material.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/1_uva_rag_biodiversity_agreements_scientific_reports/";
            },},{id: "projects-help-us-build-an-llm-powered-biodiversity-assistant-for-ecologists-using-bon-in-a-box",
          title: 'Help us build an LLM-powered biodiversity assistant for ecologists using BON in a...',
          description: "A UvA challenge to prototype a front-end and LLM assistant that helps ecologists work with BON in a Box more easily.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/2_uva_biodiversity_assistant_bon_in_a_box/";
            },},{id: "projects-south-holland-lighthouse-use-case",
          title: 'South Holland lighthouse use case',
          description: "Evidence support for South Holland water governance, drinkwater security, PFAS pressure, and biodiversity-relevant system stress.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/3_south_holland_lighthouse_use_case/";
            },},{id: "projects-the-hague-use-case",
          title: 'The Hague use case',
          description: "A municipal biodiversity monitoring and governance route built around Groenmonitor, stadsnatuur themes, and inspectable public evidence surfaces.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/4_the_hague_use_case/";
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
