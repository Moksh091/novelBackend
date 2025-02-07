"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Routes_1 = require("./Routes");
const app = (0, express_1.default)();
const port = process.env.port || 3000;
app.use(express_1.default.json());
// app.use(cookieParser());
app.use((0, cors_1.default)({
    credentials: true,
    origin: "http://localhost:5173"
}));
app.use('/api/v1', Routes_1.router);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
