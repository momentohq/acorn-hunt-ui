import styles from './GameList.module.css';
import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Link
} from '@aws-amplify/ui-react'

const baseUrl = 'https://jprc0jj2tb.execute-api.us-east-1.amazonaws.com/demo';

function GameList({ authToken }) {
  const [games, setGames] = useState([])

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
		fetch(`${baseUrl}/games`, {
			method: 'POST',
			body: JSON.stringify({
				duration: 7200,
				name: 'SaaS Factory'
			})
		})
			.then(response => response.json())
			.then(response => {
				router.push({ pathname: `/games/${response.id}`, query: { auth: authToken, username:  username} });
			});
	}

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Games</h1>
      </header>
      <div className={styles['game-list']}>
        {games.map(game => (
          <Link className={styles.link} href={`/games/${game.id}?auth=${authToken}`} key={game.id}>
            <Card className={styles.card}>
              <h2>{game.name}</h2>
              <Button>Join</Button>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )

}

export default GameList;
