import styles from './games.module.css';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import {
  Button,
  Card,
  Link
} from '@aws-amplify/ui-react'
import Head from 'next/head';
import Modal from '../components/Modal';

const baseUrl = 'https://jprc0jj2tb.execute-api.us-east-1.amazonaws.com/demo';

function GameList() {
  const router = useRouter();

  const [games, setGames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [gameName, setGameName] = useState('');


  useEffect(() => {
    async function loadGames() {
      const response = await fetch(`${baseUrl}/games`, {
        method: 'GET'
      });
      const gameList = await response.json();
      setGames(gameList);
    }

    loadGames();
  }, []);

  const handleCreateNewRoom = async (e) => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleConfirm = () => {
    fetch(`${baseUrl}/games`, {
      method: 'POST',
      body: JSON.stringify({
        duration: 7200,
        name: gameName
      })
    })
      .then(response => response.json())
      .then(response => {
        router.push(`/games/${response.id}`);
      });
  };

  const handleSignOut = () => {
    localStorage.removeItem('AH-username');
    localStorage.removeItem('AH-authToken');
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Games | Acorn Hunt</title>
      </Head>
      <div className={styles.contentWrapper}>
        <div className={styles.buttons}>
          <Button className={styles.createGame} onClick={handleCreateNewRoom}>+ Create Game</Button>
          <Button className={styles.signout} onClick={handleSignOut}>Sign Out</Button>
        </div>
        <div className={styles.header}>
          <img src="/banner.png" className={styles.headerImage} />
        </div>
        <Modal onClose={() => setShowModal(false)} show={showModal} title="Create a new game">
          <div>
            <div className={styles['modal-body']}>
              <input className={styles.input} type="text" placeholder='Enter game name' value={gameName} onChange={(e) => setGameName(e.target.value)} />
            </div>
            <div className={styles['modal-footer']}>
              <button className={styles.cancel} onClick={handleCancel}>Cancel</button>
              <button className={styles.confirm} onClick={handleConfirm}>Confirm</button>
            </div>
          </div>
        </Modal>

        <div className={styles['game-list']}>
          {games.map(game => (
            <Link className={styles.link} href={`/games/${game.id}`} key={game.id}>
              <Card className={styles.card}>
                <h2>{game.name}</h2>
                <Button className={styles.join}>Join</Button>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
};

export default GameList;
