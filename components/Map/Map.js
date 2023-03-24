import { Grid } from '@aws-amplify/ui-react';
import Tile from './Tile';

function Map({ width, height, specialTiles = [] }) {
  const tiles = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const specialTile = specialTiles.find((tile) => tile.x === x && tile.y === y);
      const type = specialTile ? specialTile.type : '';
      tiles.push(<div key={`${x}-${y}`}><Tile type={type} /></div>);
    }
  }

  return (
    <Grid
      templateColumns={`repeat(${width}, 1fr)`}
      templateRows={`repeat(${height}, 1fr)`}
      gap="0px"
    >
      {tiles}
    </Grid>
  );
};

export default Map;