/**
 * 传入一个低清流地址，用来分析当前直播间是否发生连麦人数变化
 */
import { FC, Fragment, useEffect, useRef } from "react";
import flvjs from "flv.js";
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import { bff } from '../config';
var nj = require('numjs');

export const Screenshot: FC<流> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    let 连麦人数=1
    const 连麦上下边界配置={

    }
    const 更新连麦信息 = async function () {
        console.log("更新连麦信息")
        let res = await fetch(`${bff}/link?id=235`);
        let json = await res.json()
    }
    const 基准色 = nj.array([31, 31, 43, 255]).subtract(128).tolist()
    let 默认阈值=0.999
    const 计算行相似度 = function (row1: Array<Uint8Array>, row2: Array<Uint8Array>) {
        let r1 = nj.array(row1).subtract(128).tolist()
        let r2
        if (row2.length > 0) {
            r2 = nj.array(row2).subtract(128).tolist()
        } else {
            r2 = 基准色
        }
        // console.log(r2)
        let 行1 = tf.tensor1d(r1)
        let 行2 = tf.tensor1d(r2)
        let num = parseFloat(nj.dot(nj.array(r1), nj.array(r2)).tolist()[0])
        let denom = parseFloat(tf.norm(行1).arraySync().toString()) * parseFloat(tf.norm(行2).arraySync().toString())
        if (denom == 0) {
            return 0.5
        } else {
            return 0.5 + 0.5 * (num / denom)
        }

    }
    const 识别上边界 = function (img: Array<Array<Uint8Array>>) {
        let index = 0
        let distance = 0
        do {
            distance = 计算行相似度(img[index], nj.array([31, 31, 43, 255]).tolist())
            index++
        } while (distance > 默认阈值);
        return index
    }
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
        flvjs.LoggingControl.enableVerbose = false
        flvjs.LoggingControl.enableWarn = false
        let height: number;
        let width: number;
        player.attachMediaElement(videoRef.current!);
        let 基准行: any
        player.on(flvjs.Events.METADATA_ARRIVED, (e) => {
            console.log(e)
            height = e.height
            width = e.width
            基准行 = nj.array(Array(width / 4).fill([31, 31, 43, 255])).flatten().tolist()
        })
        let oldStartRow = -1
        let oldEndRow = -1
        let 之前是四宫格 = false
        player.on(flvjs.Events.STATISTICS_INFO, (e) => {
            let canvas = document.createElement('canvas'); //创建canvas标签
            canvas.height = height
            canvas.width = width
            if(width==360){
                默认阈值=0.995
            }
            let canvasCtx = canvas.getContext('2d');
            let video = document.getElementById('screenshot') as HTMLVideoElement;
            if (canvasCtx && video && width && height && 基准行) {
                //设置canvas画布的宽和高，这一步很重要，决定截图是否完整
                canvasCtx.drawImage(video, 0, 0, width, height);
                let imageM = nj.images.read(canvas)
                let startRow: number = -1
                let endRow: number = height
                let 首列 = nj.rot90(imageM).tolist()[0]
                startRow = 识别上边界(首列)
                endRow = height - 识别上边界(首列.reverse())
                let array = imageM.tolist()

                let 四宫格 = false
                // console.log(首列)
                if (startRow > 10) {
                    // let 有效部分 = imageM.slice([startRow, endRow], [10]).tolist()
                    let 中间行 = 首列.length-Math.floor((startRow + endRow) / 2)
                    for (let index = 0; index < 10; index++) {
                        let 上距离 = 计算行相似度(首列[中间行 + index - 4], 首列[中间行 + index - 3])
                        // console.log(首列[中间行 + index - 3])
                        if (上距离 < 0.95) {
                            四宫格 = true
                            // console.log("有线")
                            break
                        }
                    }

                }
                // console.log(四宫格)
                if (Math.abs((endRow - startRow) - (oldEndRow - oldStartRow)) > 10) {
                    //发现布局发生改变
                    document.documentElement.style.setProperty('--video-start-p', startRow / height + '');
                    document.documentElement.style.setProperty('--video-end-p', endRow / height + '');
                    // TODO: 人数变化
                    debugger
                    props.更新连麦信息(props.id)
                } else if (startRow > 10 && 之前是四宫格 != 四宫格) {
                    // TODO: 人数变化
                    props.更新连麦信息(props.id)
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

function main(): any {
    throw new Error("Function not implemented.");
}
