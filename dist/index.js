"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./app/config"));
const db_1 = __importDefault(require("./app/config/db"));
const index_1 = __importDefault(require("./app/routes/index"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const app = (0, express_1.default)();
const PORT = config_1.default.port;
// middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
app.get('/', (req, res) => {
    res.send('stellar way Server is Live!');
});
// app.ts এ রাউট মাউন্ট করার আগে
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});
app.use('/api/v1', index_1.default);
app.use(globalErrorhandler_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
