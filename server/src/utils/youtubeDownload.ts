import YoutubeMp3Downloader from "youtube-mp3-downloader";
import path from 'path'
import ffmpegPath from "ffmpeg-static";
import { ISong } from "../types/ISong";

export const YoutubeDownloader = (id : string) => {
    const config = {
      "ffmpegPath": ffmpegPath ?? '',
      "outputPath": path.join(__dirname, '..','public', 'mp3'),
      "youtubeVideoQuality": "highestaudio",
      "queueParallelism": 2,
      "progressTimeout": 2000,
      "allowWebm": false
    }
    const YD = new YoutubeMp3Downloader(config)


    return new Promise<ISong>((resolve , reject) => {
        YD.download(id, `${id}.mp3`);
        console.log('download');

        YD.on("finished", function( _ , data) {
            resolve(data);
            console.log('finish');
        });
      
        YD.on("error", function(error) {
            reject('error');
            console.log(error);
        });
    })


  
   
  
    YD.on("progress", function(progress) {

        console.log('progress');
        console.log(JSON.stringify(progress));
    });
  
}