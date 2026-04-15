import { PrismaClient, SkillCategory } from '@prisma/client';
const prisma = new PrismaClient();

const skills = [
    // Frontend
    { name: 'React', category: SkillCategory.FRONTEND },
    { name: 'HTML/CSS', category: SkillCategory.FRONTEND },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND },

    // Backend
    { name: 'Node.js', category: SkillCategory.BACKEND },
    { name: 'Express', category: SkillCategory.BACKEND },
    { name: 'Django', category: SkillCategory.BACKEND },
    { name: 'SQL', category: SkillCategory.BACKEND },

    // Full Stack
    { name: 'Next.js', category: SkillCategory.FULLSTACK },
    { name: 'NestJS', category: SkillCategory.FULLSTACK },
    { name: 'GraphQL', category: SkillCategory.FULLSTACK },

    // Data Science
    { name: 'Python', category: SkillCategory.DATA_SCIENCE },
    { name: 'R', category: SkillCategory.DATA_SCIENCE },
    { name: 'TensorFlow', category: SkillCategory.DATA_SCIENCE },

    // Machine Learning
    { name: 'Scikit-learn', category: SkillCategory.MACHINE_LEARNING },
    { name: 'PyTorch', category: SkillCategory.MACHINE_LEARNING },

    // Mobile
    { name: 'React Native', category: SkillCategory.MOBILE },
    { name: 'Flutter', category: SkillCategory.MOBILE },

    // DevOps
    { name: 'Docker', category: SkillCategory.DEVOPS },
    { name: 'Kubernetes', category: SkillCategory.DEVOPS },
    { name: 'AWS', category: SkillCategory.DEVOPS },
    
    // UI/UX
    { name: 'Figma', category: SkillCategory.UI_UX_DESIGN },
    { name: 'Adobe XD', category: SkillCategory.UI_UX_DESIGN },
    { name: 'Sketch', category: SkillCategory.UI_UX_DESIGN },

    // Other
    { name: 'Git', category: SkillCategory.OTHER },
];

async function main() {
    for (const skill of skills) {
        await prisma.skill.upsert({
            where: { name: skill.name },
            update: {},
            create: skill,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });