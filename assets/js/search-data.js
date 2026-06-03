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
          description: "How NatureDesk connects biodiversity data, EBVs, and policy into traceable decision support.",
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
        },{id: "nav-code-of-conduct",
          title: "Code of Conduct",
          description: "NatureDesk rules for biodiversity intelligence, scientific collaboration, AI-assisted workflows, and external communication.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/site/code-of-conduct/";
          },
        },{id: "nav-contact",
          title: "contact",
          description: "Explore a pilot or collaboration around biodiversity monitoring, EBVs, and traceable AI support.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/site/contact/";
          },
        },{id: "projects-rag-for-international-biodiversity-agreements-amp-scientific-reports",
          title: 'RAG for international biodiversity agreements &amp;amp; scientific reports',
          description: "A UvA challenge focused on improving searchability and source-grounded retrieval across IUCN resolutions and related biodiversity-policy material.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/1_uva_rag_biodiversity_agreements_scientific_reports.html";
            },},{id: "projects-help-us-build-an-llm-powered-biodiversity-assistant-for-ecologists-using-bon-in-a-box",
          title: 'Help us build an LLM-powered biodiversity assistant for ecologists using BON in a...',
          description: "A UvA challenge to prototype a front-end and LLM assistant that helps ecologists work with BON in a Box more easily.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/2_uva_biodiversity_assistant_bon_in_a_box.html";
            },},{id: "projects-south-holland-lighthouse-use-case",
          title: 'South Holland lighthouse use case',
          description: "Evidence support for South Holland water governance, drinkwater security, PFAS pressure, and biodiversity-relevant system stress.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/3_south_holland_lighthouse_use_case.html";
            },},{id: "projects-the-hague-use-case",
          title: 'The Hague use case',
          description: "A municipal biodiversity monitoring and governance route built around Groenmonitor, stadsnatuur themes, and inspectable public evidence surfaces.",
          section: "Projects",handler: () => {
              window.location.href = "/site/projects/4_the_hague_use_case.html";
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
