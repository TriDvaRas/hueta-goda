import { NextApiRequest, NextApiResponse } from "next";

const commonErrorHandlers = {
    // Handle any other HTTP method
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
        res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
    onError(err: any, req: NextApiRequest, res: NextApiResponse) {
        res.status(500).json({ error: `Why, you broke.\n${err.message}`, status: 500 });
    },
}
export default commonErrorHandlers