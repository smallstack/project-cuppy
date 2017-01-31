import { IOC } from "smallstack";
IOC.register("test", () => { console.log("YEAH") });
IOC.get<Function>("test")();


console.log("hey hooo", IOC);
