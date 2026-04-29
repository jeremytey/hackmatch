import * as skillRepository from '../repositories/skill.repository';
import { Skill } from '@prisma/client';

export async function getAllSkills(): Promise<Skill[]> {
    return await skillRepository.listSkills();
}
