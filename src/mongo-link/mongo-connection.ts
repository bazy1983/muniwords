import { Collection, MongoClient, ServerApiVersion } from "mongodb";
const uri = process.env.MONGO_DB as string;

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

export async function run(method: Method, payload: Record<string, string>, cb: (output: any[])=> void): Promise<void> {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        const db = await client.db("munimade");
        const collection: Collection = db.collection('game');
        switch (method) {
            case 'GET':
                if(payload?.get ==='count'){
                    console.log('hello')
                    const count  = await collection.countDocuments()
                    cb([{count}])
                } else {
                    const getCursor = await collection.find(payload);
                    const documents = await getCursor.toArray()
                    // console.log('>>>', documents)
                    cb(documents) ;
                }
                break;
            case 'POST':
                const doc = await collection.findOne({guess: {$regex : payload.guess}});
                console.log('')
                if(!doc){
                    await collection.insertOne(payload)
                    cb([{message: 'ok'}]);
                } else {
                    cb([{message: 'fail'}])
                }
                break;
            default:
                break;
        }

    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
