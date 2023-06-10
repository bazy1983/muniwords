import { run } from "@/mongo-link/mongo-connection";

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface IResponse extends Omit<Response, 'status'> {
    status: (a: number) => {json: (a: any) => void};
}


const handler = async (req: Request, res: IResponse) => {
    if(req.method === 'GET') {
        res.status(403)
        return
    };
    // console.log(req.headers, req.cookies, req.body)
    const {name, guess: inputGuess} = req.body as unknown as {name: string, guess: string}
    const guess = inputGuess.replace(/\d+/g, '').trim();
    const document = {name, guess, timestamp: new Date().toISOString()}
    await run(req.method as Method, document, (output)=>{
        res.status(200).json(output);
    });
  }

  export default handler