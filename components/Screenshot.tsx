import { FC, Fragment, useEffect, useRef } from "react";
import flvjs from "flv.js";

export const Screenshot: FC<流> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const distance = require('euclidean-distance')
    const 更新连麦信息 = function () {
        console.log("更新连麦信息")
    }
    useEffect(() => {
        var nj = require('numjs');
        const player = flvjs.createPlayer(
            {
                type: "flv",
                url: props.url,
                hasVideo: true
            },
            {
                enableStashBuffer: false
            }
        );
        flvjs.LoggingControl.enableVerbose=false
        flvjs.LoggingControl.enableWarn=false
        let height: number;
        let width: number;
        player.attachMediaElement(videoRef.current!);
        player.on(flvjs.Events.METADATA_ARRIVED, (e) => {
            // console.log(e)
            height = e.height
            width = e.width
        })
        let oldStartRow = -1
        let oldEndRow = -1
        let 之前是四宫格 = false
        player.on(flvjs.Events.STATISTICS_INFO, (e) => {
            let canvas = document.createElement('canvas'); //创建canvas标签
            canvas.height = height
            canvas.width = width
            let canvasCtx = canvas.getContext('2d');
            let video = document.getElementById('screenshot') as HTMLVideoElement;
            if (canvasCtx && video && width && height) {
                //设置canvas画布的宽和高，这一步很重要，决定截图是否完整
                canvasCtx.drawImage(video, 0, 0, width, height);
                let imageM = nj.images.read(canvas)
                let startRow: number = -1
                let endRow: number = -1
                imageM.iteraxis(0, function (row: any, i: number) {
                    let 行内首像素 = row.tolist()[0]
                    let 行内末像素 = row.tolist()[width - 1]
                    let d = distance(行内首像素, [31, 31, 43, 255])
                    d += distance(行内末像素, [31, 31, 43, 255])
                    // console.log(d)
                    if (d > 88) {
                        if (startRow == -1) {
                            startRow = i
                        }
                        endRow = i
                    }
                });
                // console.log(startRow/height, endRow/height)
                let array = imageM.tolist()
                let distanceList = []
                for (let index = 1; index < 5; index++) {
                    distanceList[index - 1] = distance(array[Math.floor((startRow + endRow) / 2)][width / 5 * index], [31, 31, 43, 255])
                }
                let 四宫格
                if (nj.array(distanceList).mean() < 32) {
                    四宫格 = true
                } else {
                    四宫格 = false
                }
                if (Math.abs((endRow - startRow) - (oldEndRow - oldStartRow)) > 10) {
                    //发现布局发生改变
                    document.documentElement.style.setProperty('--video-start-p', startRow / height + '');
                    document.documentElement.style.setProperty('--video-end-p', endRow / height + '');
                    // TODO: 人数变化
                    更新连麦信息()
                } else if (startRow > 10 && 之前是四宫格 != 四宫格) {
                    // TODO: 人数变化
                    更新连麦信息()
                }
                oldStartRow = startRow
                oldEndRow = endRow
                之前是四宫格 = 四宫格
            }
        })
        player.load();
        player.play();


        // player.on("error", (err) => {
        //   props.errorCallback?.(err);
        // });
    }, []);
    return (
        <Fragment>
            <video id="screenshot" className="absolute invisible" muted={true} autoPlay={true} ref={videoRef} />
        </Fragment>
    );
}

export default Screenshot;