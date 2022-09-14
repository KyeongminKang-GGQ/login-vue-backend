import { Routes } from "@routes/Routes";
import { Router } from "express";
import { inject, singleton } from "tsyringe";

@singleton()
export class RouterFactory {
    constructor(@inject(Routes) private routes: Routes) {}

    private readonly version = "v1";
    private readonly baseUrl = `/auth/${this.version}`;

    create = (): Router => {
        const baseRouter = Router();

        baseRouter.use(this.baseUrl, this.routes.create());

        return baseRouter;
    };
}
