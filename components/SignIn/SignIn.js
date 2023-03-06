import {
  Button,
  TextField
} from '@aws-amplify/ui-react';
import styles from './SignIn.module.css';
import { useState } from 'react';

function SignIn({ onLogin }) {

  const [username, setUsername] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault;

    onLogin(username);    
  }

  return (
    <div className={styles['signin-container']}>
      <div className={styles['signin-card']}>
        <form onSubmit={handleFormSubmit}>
          <div className={styles['signin-input']}>
            <TextField
              type="text"
              label="Type in a username to join the hunt"
              placeholder="Enter your username"
              onChange={(e) => {
								setUsername(e.target.value)
							}}
            />
          </div>
          <div className={styles['signin-button']}>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;