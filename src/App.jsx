import { useState, useRef, useEffect } from 'react'
import { FaPlay, FaPause, FaStop, FaAngleDoubleLeft, FaAngleDoubleRight, FaVolumeUp, FaVolumeMute } from "react-icons/fa"
import songs from "./data/songs.json"

const App = () => {
  const [playText, setPlayText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMute, setIsMute] = useState(false);
  const [currentSong, setCurrentSong] = useState(songs[0].title)
  const audioRef = useRef(new Audio(`https://github.com/AmrendraOG/wavex/raw/refs/heads/master/assets/songs/${currentSong}.mp3`));
  const [artwork, setArtwork] = useState(`https://raw.githubusercontent.com/AmrendraOG/wavex/refs/heads/master/assets/covers/${currentSong}.png`);

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  }

  useEffect(() => {
    setIsMute(volume === '0')
  }, [volume]);

  const handleClick = () => {
    if (playText) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPlayText(!playText);
  }

  const handleStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayText(false)
  }

  useEffect(() => {
    audioRef.current.pause();

    const audio = new Audio(`https://github.com/AmrendraOG/wavex/raw/refs/heads/master/assets/songs/${currentSong}.mp3`);
    audioRef.current = audio;

    setArtwork(`https://raw.githubusercontent.com/AmrendraOG/wavex/refs/heads/master/assets/covers/${currentSong}.png`);


    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateProgress);

    // Reset when audio ends
    audio.addEventListener("ended", () => setPlayText(false));

    if (playText) {
      audio.play();
    }

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", () => setPlayText(false));
    };
  }, [currentSong]);

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  }

  const handleLeft = () => {
    audioRef.current.currentTime -= 10;
  }

  const handleRight = () => {
    audioRef.current.currentTime += 10;
  }

  return (
    <div className='h-screen flex flex-col'>
      <div className='flex flex-col justify-center text-center py-6 bg-cyan-950'>
        <p className='text-4xl text-cyan-400 font-extrabold'>WaveX</p>
        <p className='text-sm text-cyan-600 font-extrabold'>By Amrendra Maurya</p>
      </div>
      <div className='main h-screen flex flex-row'>
        <div className='songsList w-96 bg-cyan-950 overflow-y-hidden p-8'>
          <h1 className='text-white text-2xl bg-cyan-950 font-bold text-center p-4'>Songs List</h1>
          <ul className='flex flex-col gap-4'>
            {songs.map((song, index) => {
              return (
                <button key={index} className={`bg-cyan-700 p-2 rounded  text-white hover:bg-cyan-800`} onClick={() => {
                  audioRef.current = new Audio(`https://github.com/AmrendraOG/wavex/raw/refs/heads/master/assets/songs/${currentSong}.mp3`);
                  setCurrentSong(song.title);
                  setPlayText(true);
                  audioRef.current.volume = volume / 100;
                }
                }>
                  <strong>{song.title} - {song.artists}</strong>
                </button>
              )
            })}
          </ul>
        </div>

        <div className='player flex-1 overflow-hidden bg-gray-900 flex flex-col justify-center items-center gap-8'>
          <div className='artwork rounded w-80 h-80 md:w-64 md:h-64 bg-cyan-950 flex justify-center items-center'>
            <img src={artwork} />
          </div>
          <div className='text-white text-3xl font-bold'>
            {currentSong}
          </div>
          <div className='slider'>
            <input
              type='range'
              min={0}
              max={audioRef.current.duration || 0}
              className='w-80 accent-cyan-500'
              value={progress}
              onChange={handleSeek}
            />
          </div>
          <div className='buttons flex flex-row gap-8'>
            <button className='rounded-full p-4 text-cyan-400 text-4xl font-bold hover:bg-cyan-500 hover:text-black'
              onClick={handleLeft}
            >
              <FaAngleDoubleLeft />
            </button>
            <button className='rounded-full p-6 bg-cyan-400 text-black font-bold hover:bg-cyan-500' onClick={handleClick}>
              {playText ? <FaPause /> : <FaPlay />}
            </button>
            <button className='rounded-full p-6 bg-cyan-400 text-black font-bold hover:bg-cyan-500'
              onClick={handleStop}
            >
              <FaStop />
            </button>
            <button className='rounded-full p-4 text-cyan-400 text-4xl font-bold hover:bg-cyan-500 hover:text-black'
              onClick={handleRight}
            >
              <FaAngleDoubleRight />
            </button>
          </div>
          <div className='volumeControl text-cyan-400 flex flex-row gap-2 accent-cyan-400'>
            {isMute ? <FaVolumeMute /> : <FaVolumeUp />}
            <input type="range"
              min='0'
              max='100'
              value={volume}
              onChange={handleVolume}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App