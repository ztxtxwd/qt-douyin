import type { NextPage } from 'next';
// create wrapper components
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { server } from '../config';
// import Screenshot from '../components/Screenshot'
export const ReactFlvPlayerWrapper = dynamic(
  () => import('@ztxtxwd/react-ts-flv-player/dist/ReactFlvPlayer'),
  {
    ssr: false,
  }
);
export const Screenshot = dynamic(
  () => import('../components/Screenshot'),
  {
    ssr: false,
  }
);
// import nj from 'numjs';
// if (typeof window !== 'undefined') {
//   var a = nj.array([2, 3, 4]);
//   console.log(a);
// }
type Props = {
  高清流: 流;
  低清流: 流;
  主播头像:string;
  直播间标题:string;
};
type 流 = {
  url: string;
  width: number;
  height: number;
};
const Home: NextPage<Props> = (pageProps) => {
  const url =
    'https://pull-l3.douyincdn.com/stage/stream-111681004412338258_or4.flv';
  const classNames = 'h-screen object-cover video-pos';

  // ready();
  useEffect(() => {
    var link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = pageProps.主播头像
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = pageProps.直播间标题
    document.documentElement.style.setProperty('--video-height',''+(pageProps.高清流.height||'1920') );
    document.documentElement.style.setProperty('--video-width', ''+(pageProps.高清流.width||'1080'));
  }, []);
  return (
    <div className="flex max-h-screen flex-col items-center justify-center bg-douyin">
      <ReactFlvPlayerWrapper
        url={pageProps.高清流.url}
        isMuted={true}
        isLive={true}
        showControls={true}
        enableStashBuffer={true}
        classNames={classNames}
      />
      <Screenshot url={pageProps.低清流.url} ></Screenshot>
    </div>
  );
};
Home.getInitialProps = async function (context) {
  let res = await fetch(`${server}/api/room?id=${context.query.id}`);
  let json = await res.json()
  json.主播头像=json.anchor.avatar_thumb.url_list[0]
  json.直播间标题=json.anchor.nickname+'的直播间'
  return json;
};

export default Home;
