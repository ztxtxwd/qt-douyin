import type { NextPage } from 'next';
import ReactFlvPlayerWrapper from './ReactFlvPlayerWrapper';
const url =
  'https://pull-flv-l13.douyincdn.com/stage/stream-111497065803284920_or4.flv?expire=1662042470&sign=c44f26b4f60cd45ff30494955b322f09';
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
        isMuted={false}
        isLive={true}
        showControls={true}
        enableStashBuffer={true}
      />
    </div>
  );
};

export default Home;
