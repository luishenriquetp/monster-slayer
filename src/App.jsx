import { useState } from 'react'
import './App.css'

function App() {
const [monsterHealth, setMonsterHealth] = useState(100)
const [yourHealth, setYourHealth] = useState(100)
const [monstersDefeated, setMonstersDefeated] = useState(0)
const [highestScore, setHighestScore] = useState(0)
const [battleLog, setBattleLog] = useState(['hello', 'world'])
const [showTitle, setShowTitle] = useState(false);
const [fadeClass, setFadeClass] = useState('');

const handleAttack = () => {
  const monsterAttack = Math.ceil(Math.random() * 10);
  const yourAttack = Math.ceil(Math.random() * 10);
  

  if (monsterHealth - monsterAttack > 0) {
    setMonsterHealth((state) => state - monsterAttack);
  } else {
    setMonsterHealth(0);
    setBattleLog(state => [...state, 'win']);
    console.log(battleLog);
  } 
  setTimeout(monster, 3000);
  function monster() {
    setShowTitle(true);
    setFadeClass('fade-in');
  if (yourHealth - yourAttack > 0) {
    setYourHealth((state) => state - yourAttack);
  } else {
    setYourHealth(0);
    setBattleLog(state => [...state, 'lose']);
    console.log(battleLog);
  } 
  setTimeout(() => {
    setFadeClass('fade-out');
  }, 4000); 
}
}

  return (
    <>
      <h1>Monster Slayer</h1>
      
      <div className="card">
        <p>Monster Health<br/>{monsterHealth} %</p>
        <p>Your Health<br/>{yourHealth} %</p>
        <p>Monsters Defeated<br/>{monstersDefeated} %</p>
        <p>Highest Score<br/>{highestScore} %</p>
        <button onClick={handleAttack}>
          Attack
        </button>
        <button>
          Special Attack
        </button>
        <button>
          Heal
        </button>
        <button>
          Surrender
        </button>
        <p>
          Battle Log
        </p>
        <p className="read-the-docs">
        <div>
      {showTitle && <h1 className={fadeClass}>Título com efeito de esvanecimento</h1>}
    </div>  
        {battleLog.map((entry, index) => (
            <p key={index}>{entry}</p>
          ))}
      </p>
      </div>
      
    </>
  )
}

export default App
