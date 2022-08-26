import type { NextPage } from 'next';
// create wrapper components
import dynamic from 'next/dynamic';
export const ReactFlvPlayerWrapper = dynamic(
  () => import('@asurraa/react-ts-flv-player/dist/NextReactFlvPlayer'),
  {
    ssr: false,
  }
);
// import ReactFlvPlayerWrapper from './ReactFlvPlayerWrapper';
// import ReactFlvPlayer from './ReactFlvPlayer';
const url =
  'https://pull-flv-f1-admin.douyincdn.com/third/stream-111499196967682157_md.flv';
const Home: NextPage = () => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center bg-douyin">
      {/* <video
        controls
        className="w-8/12 video-pos h-screen object-cover "
        src="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-28b21827-dcf2-495f-8477-6d8cd79b4872/195abe6b-dadb-4b9d-ade6-98c9085fa68f.mp4"
      /> */}
      <ReactFlvPlayerWrapper
        url={url}
        isMuted={undefined}
        isLive={true}
        showControls={true}
        enableStashBuffer={true}
      />
    </div>
  );
};

export default Home;
