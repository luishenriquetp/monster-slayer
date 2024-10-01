import { useState, useEffect, useRef } from 'react';
import './App.css';
import "nes.css/css/nes.min.css";
import Dialog from './components/Dialog';


function App() {
// #region States/Refs
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monstersDefeated, setMonstersDefeated] = useState(0);
  const [highestScore, setHighestScore] = useState(0);
  const [battleLog, setBattleLog] = useState([]);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [openWinner, setOpenWinner] = useState(false);
  const [openLooser, setOpenLooser] = useState(false);
  const [openSurrender, setOpenSurrender] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [specialAttack, setSpecialAttack] = useState(true);
  const [specialActionsCounter, setSpecialActionsCounter] = useState(0);
  const [heal, setHeal] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null); // Reference to the audio element

  const handleAudioToggle = () => {
    if (!isPlaying) {
      // Play the audio
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Audio playback failed:', error);
        });
    } else {
      // Pause the audio
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const cancelTurnRef = useRef(false); // Usando useRef aqui

  
  const battleLogRef = useRef(null);



// #endregion
// #region Handlers

  const handleTurn = () => {
    setButtonsDisabled(true);
    const monsterAttack = Math.ceil(Math.random() * 30);
    const playerAttack = Math.ceil(Math.random() * 30);
    
    setTimeout(turn1, 1000);
    function turn1() {
      if (monsterHealth - playerAttack > 0) {
        setMonsterHealth((state) => state - playerAttack);
        setBattleLog(state => [...state, `Monster suffered ${playerAttack}% of damage.`]);
      } else {
        setMonsterHealth(0);
        setBattleLog(state => [...state, 'You win!']);
        cancelTurnRef.current = true;
        setOpenWinner(true);
      }
    }

    setTimeout(turn2, 3000);
    function turn2() {
      if(cancelTurnRef.current) return;
      if (playerHealth - monsterAttack > 0) {
        setPlayerHealth((state) => state - monsterAttack);
        setBattleLog(state => [...state, `You suffered ${monsterAttack}% of damage.`]);
      } else {
        setPlayerHealth(0);
        setBattleLog(state => [...state, 'You lose!']);
        cancelTurnRef.current = true
        setOpenLooser(true);
        
      }
      setSpecialActionsCounter(() => specialActionsCounter + 1);
      if(specialActionsCounter === 2) {
        setSpecialAttack(false);
        setHeal(false)
      }
      if(cancelTurnRef.current) return;
      setButtonsDisabled(false);
    }
    
  };

  const handleSpecialAttackTurn = () => {
    setButtonsDisabled(true);
    setSpecialActionsCounter(() => 0);
    setSpecialAttack(true);
    const monsterAttack = Math.ceil(Math.random() * 30);
    const playerAttack = Math.ceil(Math.random() * 30) * 3;
    
    setTimeout(turn1, 1000);
    function turn1() {
      if (monsterHealth - playerAttack > 0) {
        setMonsterHealth((state) => state - playerAttack);
        setBattleLog(state => [...state, `Monster suffered ${playerAttack}% of damage.`]);
      } else {
        setMonsterHealth(0);
        setBattleLog(state => [...state, 'You win!']);
        cancelTurnRef.current = true;
        setOpenWinner(true);
      }
    }

    setTimeout(turn2, 3000);
    function turn2() {
      if(cancelTurnRef.current) return;
      if (playerHealth - monsterAttack > 0) {
        setPlayerHealth((state) => state - monsterAttack);
        setBattleLog(state => [...state, `You suffered ${monsterAttack}% of damage.`]);
      } else {
        setPlayerHealth(0);
        setBattleLog(state => [...state, 'You lose!']);
        cancelTurnRef.current = true
        setOpenLooser(true);
        
      }
      if(cancelTurnRef.current) return;
      setButtonsDisabled(false);
    }
    
  };

  const handleHealTurn = () => {
    setPlayerHealth(() => playerHealth + 10);
    setHeal(true);
    setSpecialActionsCounter(() => 0)
  }

  const handleNewTurnWinner = () => {
    setButtonsDisabled(() => false);
    setSpecialAttack(() => true);
    setHeal(() => true);
    setPlayerHealth(100);
    setMonsterHealth(100);
    setBattleLog([]);
    setSpecialActionsCounter(() => 0);
    cancelTurnRef.current = false;
    setOpenWinner(false);
    setSpecialActionsCounter(() => 0);
    cancelTurnRef.current = false;
    setOpenWinner(false);
    setMonstersDefeated((prevMonstersDefeated) => {
      const newMonstersDefeated = prevMonstersDefeated + 1;

      setHighestScore((prevHighestScore) => {
        const newHighestScore = newMonstersDefeated > prevHighestScore ? newMonstersDefeated : prevHighestScore;

        localStorage.setItem('highestScore', newHighestScore);
  
        return newHighestScore;
      });
  
      return newMonstersDefeated;
    });
  }

  const handleNewTurnLooser = () => {
    setButtonsDisabled(() => false);
    setSpecialAttack(() => true);
    setHeal(() => true);
    setPlayerHealth(100);
    setMonsterHealth(100);
    setBattleLog([]);
    setSpecialActionsCounter(() => 0);
    cancelTurnRef.current = false;
    setOpenLooser(false);
    setOpenSurrender(false);
  }

  // #endregion
// #region Effects
  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [battleLog]);

  useEffect(() => {
    const savedScore = localStorage.getItem('highestScore');
    if (savedScore) {
        setHighestScore(parseInt(savedScore, 10));
    }
  }, []);
// #endregion
  return (
    <div className='relative'>
      <audio ref={audioRef} src="https://raw.githubusercontent.com/luishenriquetp/monster-slayer/refs/heads/main/src/assets/battle.wav" hidden loop></audio>
      <div className="bg-[url('https://raw.githubusercontent.com/luishenriquetp/monster-slayer/refs/heads/main/src/assets/background.jpg')] w-full h-screen bg-cover fixed opacity-50 inset-0 -z-10"/>

      {/* Highest Score / Monsters Defeated info bar */}
      <div className = "hidden lg:block text-center nes-container is-dark is-rounded columns-3 p-2">
        <p className="text-left">
          <span className="hidden lg:inline">Highest Score: </span>
          <span className="inline lg:hidden">HS: </span>
          {highestScore}
        </p>
        <a className="text-center" onClick={() => setOpenSettings(true)}>
          Settings
        </a>  
        <p className = "text-right">
          <span className="hidden lg:inline">Monsters Defeated: </span>
          <span className="inline lg:hidden">lg: </span>
          {monstersDefeated}</p>
      </div>
      
      {/* Game container */}
      <div className = "m-0 pt-5 flex min-w-80">
        <div className = "mx-auto max-w-7xl text-center">
          
          {/* Title */}
          <h1 className = "lg:text-3xl leading-tight lg:mb-4 ">Monster Slayer</h1>
          <a className="lg:hidden text-center" onClick={() => setOpenSettings(true)}>
          Settings
        </a>  
          
          {/* Win/Loose/Surrender modal */}
          <section>

            <Dialog
              openAction={openWinner} 
              title="You Win!"
              subtitle="Continue playing?"
              renderCancel={true}
              handleCancel={() => setOpenWinner(false)}
              handleOk={handleNewTurnWinner}
            />           

            <Dialog
              openAction={openLooser} 
              title="You Loose!"
              subtitle="Continue playing?"
              renderCancel={true}
              handleCancel={() => setOpenLooser(false)}
              handleOk={handleNewTurnLooser}
            />

            <Dialog
              openAction={openSurrender} 
              title="Surrender"
              subtitle="Are you sure?"
              renderCancel={true}
              handleCancel={() => setOpenSurrender(false)}
              handleOk={handleNewTurnLooser}
            />

            <dialog className="nes-dialog is-rounded z-10" id="dialog" open={openSettings}>
              <form method="dialog">
                <p className="title mb-5">Settings</p>
                <button
                  type="button"
                  className={`nes-btn mb-5 text-center ${buttonsDisabled ? 'is-disabled' : ''}`}
                  disabled={buttonsDisabled}
                  onClick={handleAudioToggle}>
                    {isPlaying ? 'Pause Audio' : 'Play Audio'}
                </button>
                <p className="title mb-5">About</p>
                <p className="mb-5">Developer: <a href="https://luishenriquetp.github.io" target="_blank">Luís Trindade</a></p>
                <p className="mb-5">Concept: <a href="https://www.linkedin.com/in/pedro-janelli-da-silva-ruas/" target="_blank">Pedro Ruas</a></p>
                <menu className="dialog-menu">
                  <button onClick={()=>setOpenSettings(false)} className="nes-btn is-primary">Ok</button>
                </menu>
              </form>
            </dialog>
            

          </section>
          
          
          

          {/* Player/Monster/Controls panel */}
          <div className="flex justify-between items-center">
            
            {/* Player Pannel */}
            <div className="flex flex-col items-center">
              <p className="mb-3 w-full">
                <progress className={`nes-progress ${playerHealth > 50 ? 'is-success' : 'is-error' }`} value={playerHealth} max="100"></progress>
              </p>
              <img src="https://raw.githubusercontent.com/luishenriquetp/monster-slayer/refs/heads/main/src/assets/hero.jpg" className="mx-auto w-auto h-36 lg:h-60" alt="hero"/>
              <p>Hero<br/><span className=" lg:hidden"> HS:{highestScore}</span></p>
            </div>

            {/* Controls */}
            <div className="flex w-10 lg:w-72  mx-5 flex-col items-center">
              <button 
                type="button" 
                className={`nes-btn w-full mb-5 ${buttonsDisabled ? 'is-disabled' : 'is-primary'}`}
                onClick={handleTurn} 
                disabled={buttonsDisabled}
              >
                <span className="hidden lg:inline">Attack</span>
                <span className="inline lg:hidden">A</span>
              </button>
              <button 
                type="button" 
                className={`nes-btn w-full mb-5 ${specialAttack || buttonsDisabled ? 'is-disabled' : 'is-warning'}`}
                onClick={handleSpecialAttackTurn} 
                disabled={specialAttack}
              >
                <span className="hidden lg:inline">Special Attack</span>
                <span className="inline lg:hidden">B</span>
              </button>
              <button 
                type="button" 
                className={`nes-btn w-full mb-5 ${heal || buttonsDisabled ? 'is-disabled' : 'is-success'}`}
                onClick={handleHealTurn} 
                disabled={heal}
              >
                <span className="hidden lg:inline">Heal</span>
                <span className="inline lg:hidden">X</span>
              </button>
              <button 
                type="button" 
                className={`nes-btn w-full mb-5 ${buttonsDisabled ? 'is-disabled' : 'is-error'}`}
                onClick={() => setOpenSurrender(true)} 
                disabled={buttonsDisabled}
              >
                <span className="hidden lg:inline">Surrender</span>
                <span className="inline lg:hidden">Y</span>
              </button>
              
              
            </div>
            

            {/* Monster Panel */}
            <div className="flex flex-col items-center">
              <p className="mb-3 w-full">
                <progress className={`nes-progress  ${monsterHealth > 50 ? 'is-success' : 'is-error' }`} value={monsterHealth} max="100"></progress>
              </p>
              <img src="https://raw.githubusercontent.com/luishenriquetp/monster-slayer/refs/heads/main/src/assets/monster.jpg" className="mx-auto w-auto h-36 lg:h-60" alt="monster"/>
              <p>Monster<br/><span className=" lg:hidden"> MD:{monstersDefeated}</span></p>
            </div>
          </div>

          {/* Battle log */}
          <div className="hidden lg:inline">
            <h6>Battle Log</h6>
            <div className=" nes-container is-rounded overflow-y-scroll h-20" ref={battleLogRef}>
              <div className="read-the-docs">
                {battleLog.map((entry, index) => (
                  <p key={index}>{entry}</p>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Battle Log */}
      <h6 className="text-center lg:hidden">{battleLog[battleLog.length-1]}</h6>
    
    </div>
  );
}

export default App;
