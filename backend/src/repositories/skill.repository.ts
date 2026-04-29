import prisma from '../lib/prisma';
import { Skill } from '@prisma/client';

// get all skills
export async function listSkills(): Promise<Skill[]> {
    const skills = await prisma.skill.findMany({
        orderBy: { name: 'asc' },
    });
    return skills;
}