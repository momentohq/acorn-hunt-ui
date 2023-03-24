import { Flex, Heading, View } from '@aws-amplify/ui-react'
import { InputArea } from '../InputArea'
import { MessageList } from '../Message'
import { ReadyState } from 'react-use-websocket';

function Chat({ gameId, messages, username, readyState, sendJsonMessage, setMessages }) {
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Connected',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Disconnected',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const handleMessageSend = async (newMessage) => {
    sendJsonMessage({
      action: 'send-message',
      gameId: gameId,
      message: newMessage
    });

    const message = {
      id: messages.length + 1,
      owner: username,
      content: {
        text: newMessage
      },
      createdAt: new Date()
    };

    setMessages([message, ...messages]);
  };

  return (
    <>
      <View>
        <Flex direction={{ base: 'column', medium: 'row' }}>
          <View flex={{ base: 0, medium: 1 }}>
            <View margin="0 auto" maxWidth={{ base: '80vw', medium: '80vw' }}>
              <Heading
                style={{ borderBottom: '1px solid black' }}
                padding={'.5em'}
                textAlign={'center'}
                level={5}
                color={'#FFFFFF'}
              >
                Chat
              </Heading>
              <Flex direction="column" height="65vh" padding={'0 1em'}>
                <MessageList messages={messages} myUsername={username} />
                <InputArea onMessageSend={handleMessageSend} connectionStatus={connectionStatus} />
              </Flex>
            </View>
          </View>
        </Flex>
      </View>
    </>
  )
}

export default Chat;
