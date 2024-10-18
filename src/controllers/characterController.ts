import { Request, Response, RequestHandler } from "express"
import { supabase } from "../config/superbaseConfig"

const getData: RequestHandler = async (req: Request, res: Response):Promise<void> => {
    console.log("hello")
    try {
        console.log("hell")
        const { data, error } = await supabase.from("characters").select("*")
        if (error) {
            console.log(`chracterController~getData() : ${error} , Error fetching data`)
            res.status(400).json({ message: "Error fetching data" });
            return 
        }
        if (data.length === 0) {
            console.log("No data found in the characters table");
        } else {
            console.log(data, "Fetched data");
        }
        res.status(200).json(data)
    } catch (err) {
        console.log(`chracterController~getData() : ${err}, Internal server error`)
        res.status(500).send({ message: "Internal server error" })
    }
}

export {
    getData
}