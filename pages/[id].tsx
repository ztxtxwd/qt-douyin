import type { NextPage } from 'next';
// create wrapper components
import dynamic from 'next/dynamic';
import { server } from '../config';

export const ReactFlvPlayerWrapper = dynamic(
  () => import('@ztxtxwd/react-ts-flv-player/dist/ReactFlvPlayer'),
  {
    ssr: false,
  }
);
// import nj from 'numjs';
// if (typeof window !== 'undefined') {
//   var a = nj.array([2, 3, 4]);
//   console.log(a);
// }

// function ready() {
//   let canvas = document.createElement('canvas'); //创建canvas标签
//   let canvasCtx = canvas.getContext('2d');
//   let video = document.getElementsByTagName('video')[0];
//   //设置canvas画布的宽和高，这一步很重要，决定截图是否完整
//   canvas.width = video.offsetWidth;
//   canvas.height = video.offsetHeight;
//   let width = 1088;
//   let height = 1920;
//   //用drawImage方法将图片保存下来
//   if (canvasCtx) {
//     alert(3);
//     var a = numjs.array([2, 3, 4]);
//     console.log(a);
//     canvasCtx.drawImage(video, 0, 0, canvas.width, canvas.height);
//   }
// }

const Home: NextPage = (pageProps) => {
  const url =
    'https://pull-flv-f13.douyincdn.com/stage/stream-399893771064967269_or4.flv?expire=1664520139&sign=d82de27d4556f38331c692ad88057d02';
  const classNames = 'h-screen object-cover video-pos';
  // ready();
  return (
    <div className="flex max-h-screen flex-col items-center justify-center bg-douyin">
      <ReactFlvPlayerWrapper
        url={url}
        isMuted={true}
        isLive={true}
        showControls={true}
        enableStashBuffer={true}
        classNames={classNames}
      />
    </div>
  );
};
Home.getInitialProps = async function (context) {
  let res = await fetch(`${server}/api/hello?id=${context.query.id}`);
  return await res.json();
};

export default Home;
