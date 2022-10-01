// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { bff } from '../../config';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let response = await fetch(`${bff}/room?id=${req.query.id}`);
  // return await response.json();
  console.log(await response.text())
  res.status(200).json({ name: 'John Doe' });
  return res
}
