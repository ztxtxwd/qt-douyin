import { NextApiRequest, NextApiResponse } from 'next';
import { bff } from '../../config';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  let response = await fetch(`${bff}/link?id=${req.query.id}`);
  // return await response.json();
  res.status(200).json( await response.json())
  return res
}
