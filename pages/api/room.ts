import { NextApiRequest, NextApiResponse } from 'next';
import { bff } from '../../config';

type ResponseError = {
  message: string;
};

type Room = {
  url: string;
  视频高度: number;
  视频宽度: number;
  有效部分高度: number;
  有效部分上外边距: number;
  连麦人数: number;
  连麦对象: Array<连麦对象>;
};
type 连麦对象 = {
  id: string;
  视频流地址: string;
  头像: string;
  名称: string;
  人气: number;
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
  let response = await fetch(`${bff}/room?id=${req.query.id}`);
  // return await response.json();
  res.status(200).json( await response.json())
  return res
}
