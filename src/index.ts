import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import routes from "./routes";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3003;

app.use(express.json())
app.use(cors({ origin: '*' }));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})