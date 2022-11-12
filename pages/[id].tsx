import type { NextPage } from 'next';
// create wrapper components
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { server,bff } from '../config';
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
type Props = {
  _id: string;
  高清流: 流;
  低清流: 流;
  主播头像: string;
  直播间标题: string;
};
type 流 = {
  url: string;
  width: number;
  height: number;
};
const Home: NextPage<any> = (pageProps) => {
  const url =
    'https://pull-l3.douyincdn.com/stage/stream-111681004412338258_or4.flv';
  const classNames = 'h-screen object-cover video-pos';
  const 更新连麦信息 = async function (id:string) {
    console.log("更新连麦信息")
    let res = await fetch(`${bff}/link?id=${id}`);
    let json = await res.json()
    pageProps.连麦信息=json
  }
  const 设置网页标题=function(房间信息: any){
    document.title = 房间信息.anchor.nickname + '的直播间'
  }
  const 设置视频宽高=function(房间信息: any){
    document.documentElement.style.setProperty('--video-height', '' + (房间信息.高清流.height || '1920'));
    document.documentElement.style.setProperty('--video-width', '' + (房间信息.高清流.width || '1080'));
  }
  const 设置网页图标=function(房间信息: any){
    var link: HTMLLinkElement = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 房间信息.anchor.avatar_thumb.url_list[0]
    document.getElementsByTagName('head')[0].appendChild(link);
  }
  // ready();
  useEffect(() => {
    设置网页标题(pageProps)
    设置网页图标(pageProps)
    设置视频宽高(pageProps)
    
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
      <Screenshot id={pageProps._id} url={pageProps.低清流.url} 更新连麦信息={更新连麦信息} ></Screenshot>
    </div>
  );
};
Home.getInitialProps = async function (context) {
  // let res = await fetch(`${server}/api/room?id=${context.query.id}`);
  // let json = await res.json()
  let response = await fetch(`${bff}/room?id=${context.query.id}`);
  // return await response.json();
  let json = await response.json()
  // console.log(json.anchor.nickname)
  // json.主播头像 = json.anchor.avatar_thumb.url_list[0]
  // json.直播间标题 = json.anchor.nickname + '的直播间'
  return json;
};

export default Home;


