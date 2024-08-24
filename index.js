import express from "express";
import cors from "cors"
import redirect  from "../redirect.controller.js";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json()); app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000', 'https://www.dineo.in', 'https://dineo.in'], // Add all allowed origins here
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true // Allow credentials
};
app.use(cors(corsOptions));

app.get("/", redirect)
app.get("/greet", (req, res)=>(res.send("hello world")))

const port = process.env.PORT || 5600
app.listen((port), () => console.log(`server started on PORT ${port}`))

export default app;