import type { NextPage } from 'next';
// create wrapper components
import dynamic from 'next/dynamic';
export const ReactFlvPlayerWrapper = dynamic(
  () => import('@ztxtxwd/react-ts-flv-player/dist/ReactFlvPlayer'),
  {
    ssr: false,
  }
);
const url =
  'https://pull-flv-f1-admin.douyincdn.com/third/stream-111499196967682157_md.flv';
const classNames = 'w-screen h-screen object-cover';
const Home: NextPage = () => {
  return (
    <div className="flex max-h-screen flex-col items-center justify-center bg-douyin">
      <ReactFlvPlayerWrapper
        url={url}
        isMuted={undefined}
        isLive={true}
        showControls={true}
        enableStashBuffer={true}
        classNames={classNames}
      />
    </div>
  );
};

export default Home;
