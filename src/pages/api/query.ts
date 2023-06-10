import { run } from "@/mongo-link/mongo-connection";
import { IResponse } from "./add";

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface IRequest extends Request {
  query: any
}

const handler = async (req: IRequest, res: IResponse) => {
  console.log(req.query)
  const query = req.query;
  // console.log(query)
  await run(req.method as Method, query, (output)=>{

    res.status(200).json(output);
  });
  }

  export default handler