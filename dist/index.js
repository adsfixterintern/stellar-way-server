"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./app/config"));
const db_1 = __importDefault(require("./app/config/db"));
const index_1 = __importDefault(require("./app/routes/index"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const http_1 = require("http");
const socket_1 = require("./app/utils/socket");
const app = (0, express_1.default)();
const PORT = config_1.default.port;
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
(0, db_1.default)();
const server = (0, http_1.createServer)(app);
(0, socket_1.setupSocket)(server);
app.get('/', (req, res) => {
    res.send('stellar way Server is Live!');
});
app.use('/api/v1', index_1.default);
app.use(globalErrorhandler_1.default);
server.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});
