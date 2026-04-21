import * as userRepository from "../repositories/user.repository";
import { UserProfile } from "../repositories/user.repository";
import { AppError } from "../lib/app.error";
import { UpdateUserDto } from "../validators/user.validator";

export async function getUserProfileById(userId: number): Promise<UserProfile> {
    const userProfile = await userRepository.getUserProfileById(userId);
    if (!userProfile) {
        throw new AppError("User not found", 404);
    }
    return userProfile;
}

export async function updateUserProfile(userId: number, data: UpdateUserDto): Promise<UserProfile> {
    const existingUser = await userRepository.findUserById(userId);
    if (!existingUser) {
        throw new AppError("User not found", 404);
    }
    const updatedUser = await userRepository.updateUser(userId, data);
    return updatedUser;
}
