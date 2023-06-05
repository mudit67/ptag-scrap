// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);
  console.log(body);
  res.send(JSON.stringify("ok!"));
}
