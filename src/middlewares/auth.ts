import catchAsync from "../utils/catchAsync";
import {Request, Response, NextFunction} from "express";


class AuthMiddleware {
    protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        console.log(req.isAuthenticated(), "authenticated")
        if (req.isAuthenticated()) {
            res.locals.user = req.user
            return next()
        } else {
            res.json({
                success: false,
                data: "You are not logged in"
            })
        }
    })

}

export default new AuthMiddleware()