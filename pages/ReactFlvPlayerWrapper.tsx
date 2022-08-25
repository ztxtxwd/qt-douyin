// create wrapper components
import dynamic from 'next/dynamic';
export const ReactFlvPlayerWrapper = dynamic(() => import('./ReactFlvPlayer'), {
  ssr: false,
});
export default ReactFlvPlayerWrapper;