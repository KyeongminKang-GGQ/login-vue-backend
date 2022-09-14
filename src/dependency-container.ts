import { Routes } from "@routes/Routes";
import { container, Lifecycle } from "tsyringe";

const injectDependency = (): void => {
    container.registerSingleton(Routes);
};

export default injectDependency;
