import { Flex, Heading, View, Text } from '@aws-amplify/ui-react'

function PlayerList({ players, username }) {
  return (
    <>
      <View>
        <Flex direction={{ base: 'column', medium: 'row' }}>
          <View flex={{ base: 0, medium: 1 }}>
            <View margin="0 auto" maxWidth={{ base: '95vw', medium: '100vw' }}>
              <Heading
                padding={'.5em'}
                textAlign={'center'}
                level={5}
                color={'#FFFFFF'}
              >
                Players ({players.length})
              </Heading>
              <View padding="0 1em">
                <Flex direction="column" height="5em" backgroundColor={'white'} padding=".8em" borderRadius={'5px'} boxShadow={'0 0 10px rgba(0, 0, 0, 0.1)'}>
                  {players.map((player) => (
                    <Text key={player} fontWeight={player == username ? 600 : 200}>{player}</Text>
                  ))}
                </Flex>
              </View>
            </View>
          </View>
        </Flex>
      </View>
    </>
  )
}

export default PlayerList;
