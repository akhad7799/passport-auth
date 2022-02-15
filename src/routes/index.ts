import {Router} from "express"
import auth from "./auth"

const router = Router({mergeParams: true})

router.use("/api/auth", auth)

export default router
