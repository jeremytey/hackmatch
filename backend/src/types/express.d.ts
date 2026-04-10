import { JwtPayload } from "./auth.types";

// extends the Express Request interface to include a user property, 
// which will hold the decoded JWT payload after authentication.
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}
