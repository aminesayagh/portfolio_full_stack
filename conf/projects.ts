const TASK_PROJECTS = {
    'WEB_DESIGNER': 'Web Designer',
    'WEB_DEVELOPER': 'Web Developer',
    'MOBILE_DEVELOPER': 'Mobile Developer',
    "CRYPTO_DEVELOPER": "Crypto Developer",
    "GRAPHIC_DESIGNER": "Graphic Designer",
    "MARKETER": "Marketer",
    "DATABASE_CONSULTANT": "Database Consultant",
    "SCRAPE_DEVELOPER": "Scrape Developer",
    "BACKEND_DEVELOPER": "Backend Developer",
    "FRONTEND_DEVELOPER": "Frontend Developer",
    "INFRASTRUCTURE_DEVELOPER": "Infrastructure Developer",
    "TECHNICAL_ADVISOR": "Technical Advisor",
    'FULLSTACK_DEVELOPER': 'FULLSTACK DEVELOPER',
} as const;

const TITLE = {
    'CTO': 'CTO',
    'CEO': 'CEO',
    'CO_FOUNDER': 'CO-FOUNDER',
    'FOUNDER': 'FOUNDER',
    'TECHNICAL_ADVISOR': 'TECHNICAL ADVISOR',
    'RECHERCHE_AND_DEVELOPMENT': 'RECHERCHE AND DEVELOPMENT',
    'FREELANCER': 'FREELANCER',
    'AUTOMATION_SPECIALIST': 'AUTOMATION SPECIALIST',
    "ACADEMIC_PROJECT_PLATFORM_ARCHITECT" :'ACADEMIC PROJECT PLATFORM ARCHITECT'
} as const;

export type TaskProject = typeof TASK_PROJECTS[keyof typeof TASK_PROJECTS];
export type TitleProject = typeof TITLE[keyof typeof TITLE];

const { WEB_DESIGNER, WEB_DEVELOPER, MOBILE_DEVELOPER, CRYPTO_DEVELOPER, GRAPHIC_DESIGNER, MARKETER, DATABASE_CONSULTANT, SCRAPE_DEVELOPER, BACKEND_DEVELOPER, FRONTEND_DEVELOPER, FULLSTACK_DEVELOPER, INFRASTRUCTURE_DEVELOPER } = TASK_PROJECTS;
const { CTO, CEO, CO_FOUNDER, FOUNDER, TECHNICAL_ADVISOR, RECHERCHE_AND_DEVELOPMENT, FREELANCER,ACADEMIC_PROJECT_PLATFORM_ARCHITECT, AUTOMATION_SPECIALIST } = TITLE;

export type ProjectTitle = 'Happy Water' | "Sofiane Pamart's Musical NFT" | 'Cyber Cohesion' | 'Shinobi Boy' | 'Web Application for managing university Projects' | 'SODIADD' | 'Jonas Agency' | "Lavish Trading" | "Maschool" | "FreeLance Projects";

interface Project {
    id: `${number}`;
    title: ProjectTitle;
    tasks: TaskProject[];
    category: ('best' | 'ongoing' | 'completed')[];
    jobTitle: TitleProject[];
    picture?: string[];
}
const PROJECTS: Project[] = [
    {
        id: '1',
        title: 'Happy Water',
        category: ['best', 'completed'],
        tasks: [WEB_DESIGNER, WEB_DEVELOPER, CRYPTO_DEVELOPER],
        jobTitle: [CTO, CO_FOUNDER],
        picture: ['images/project/happy_water_mockup_main.jpg']
    },
    {
        id: '2',
        title: "Sofiane Pamart's Musical NFT",
        category: ['completed'],
        tasks: [FRONTEND_DEVELOPER],
        jobTitle: [ AUTOMATION_SPECIALIST]
    },
    {
        id: '3',
        title: "Cyber Cohesion",
        tasks: [WEB_DEVELOPER, DATABASE_CONSULTANT],
        category: ['ongoing'],
        jobTitle: [TECHNICAL_ADVISOR, RECHERCHE_AND_DEVELOPMENT]
    },
    {
        id: '4',
        title: "Shinobi Boy",
        category: ['completed'],
        tasks: [FULLSTACK_DEVELOPER, SCRAPE_DEVELOPER, INFRASTRUCTURE_DEVELOPER],
        jobTitle: [FOUNDER]
    },
    {
        id: '5',
        title: "Web Application for managing university Projects",
        tasks: [FULLSTACK_DEVELOPER],
        category: ['completed'],
        jobTitle: [ACADEMIC_PROJECT_PLATFORM_ARCHITECT]
    },
    {
        id: '6',
        title: "SODIADD",
        category: ['best', 'ongoing'],
        tasks: [WEB_DESIGNER, FULLSTACK_DEVELOPER],
        jobTitle: [CTO, CO_FOUNDER],
        picture: ['images/project/sodiadd_mockup_main.jpg'],
    },
    {
        id: '7',
        title: "Jonas Agency",
        category: ['completed'],
        tasks: [FULLSTACK_DEVELOPER],
        jobTitle: [FREELANCER]
    },
    {
        id: '8',
        category: ['best', 'completed'],
        title: "Lavish Trading",
        tasks: [WEB_DESIGNER,FULLSTACK_DEVELOPER],
        jobTitle: [FREELANCER],
        picture: ['images/project/lavish_mockup_main.jpg']
    },
    {
        id: '9',
        category: ['completed'],
        title: "Maschool",
        tasks: [WEB_DESIGNER, FRONTEND_DEVELOPER],
        jobTitle: [CO_FOUNDER]
    },
    {
        id: '10',
        category: ['completed'],
        title: "FreeLance Projects",
        tasks: [WEB_DESIGNER, GRAPHIC_DESIGNER, WEB_DEVELOPER],
        jobTitle: [FREELANCER]
    }
];

export const getProject = (id: string) => PROJECTS.find(project => project.id === id);
export const getProjectsByCategory = (category: 'best' | 'ongoing' | 'completed') => PROJECTS.filter(project => project.category.includes(category));

export default PROJECTS;