import { FC, Fragment, useEffect, useRef } from "react";
import flvjs from "flv.js";
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
var nj = require('numjs');

export const Screenshot: FC<流> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const distance = require('euclidean-distance')
    const 更新连麦信息 = function () {
        console.log("更新连麦信息")
    }
    const 基准色=nj.array([31,31,43,255]).subtract(128).tolist()
    const 计算行相似度=function(row1:Array<Uint8Array>,row2:Array<Uint8Array>){
        let r1 = nj.array(row1).subtract(128).tolist()
        let r2
        if(row2.length>0){
            r2 = nj.array(row2).subtract(128).tolist()
        }else{
            r2 = 基准色
        }
        console.log(r2)
        let 行1=tf.tensor1d(r1)
        let 行2=tf.tensor1d(r2)
        // num = float(np.dot(v1, v2))  # 向量点乘
        // # print(np.linalg.norm(v1))
        // denom = np.linalg.norm(v1) * np.linalg.norm(v2)  # 求模长的乘积
        // return 0.5 + 0.5 * (num / denom) if denom != 0 else 0
        let num = parseFloat(nj.dot(nj.array(r1),nj.array(r2)).tolist()[0])
        let denom = parseFloat(tf.norm(行1).arraySync().toString())*parseFloat(tf.norm(行2).arraySync().toString())
        if(denom == 0){
            return 0.5
        }else{
            return 0.5 + 0.5 * (num / denom)
        }
        
    }
    // const 识别上边界 = function(img:Array<Uint8Array>){
    //     let index=0
    //     let distance=0
    //     const width=img[0].length/4
    //     do {
    //         distance=计算行相似度(img[index],nj.array([31, 31, 43, 255]).multiply(width).tolist())
    //         index++
    //     } while (distance < 0.99);
    //     return index
    // }
    useEffect(() => {
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
        let 基准行: any
        player.on(flvjs.Events.METADATA_ARRIVED, (e) => {
            // console.log(e)
            height = e.height
            width = e.width
            基准行 = nj.array(Array(width).fill([31, 31, 43, 255])).flatten().tolist()
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
            if (canvasCtx && video && width && height&&基准行) {
                //设置canvas画布的宽和高，这一步很重要，决定截图是否完整
                canvasCtx.drawImage(video, 0, 0, width, height);
                let imageM = nj.images.read(canvas).reshape(height*width,4)
                let startRow: number = -1
                let endRow: number = height
                let 最大i=0
                imageM.iteraxis(0, function (row: any, i: number) {
                    // let 行内首像素 = row.tolist()[0]
                    // let 行内末像素 = row.tolist()[width - 1]
                    // let d = distance(行内首像素, [31, 31, 43, 255])
                    // d += distance(行内末像素, [31, 31, 43, 255])
                    // // console.log(d)
                    // if (d > 88) {
                    //     if (startRow == -1) {
                    //         startRow = i
                    //     }
                    //     endRow = i
                    // }
                    if(i<最大i){
                        return
                    }
                    let d = 计算行相似度(row.tolist(),[])
                    // let d=0
                    // console.log(d)
                    if (d < 0.99) {
                        最大i=i+width
                        if (startRow == -1) {
                            startRow = Math.floor(i/width)
                        }
                        endRow = Math.floor(i/width)
                    }else{
                        最大i=i
                    }
                });
                // console.log(startRow, endRow)
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