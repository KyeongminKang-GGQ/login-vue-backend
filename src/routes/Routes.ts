import { Router } from "express";
import { inject, singleton } from "tsyringe";

@singleton()
export class Routes {
    create = (): Router => {
        const router = Router();
        return router;
    };
}
