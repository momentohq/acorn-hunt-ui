function Tile ({ type }) {
  return (
    <div
      style={{
        width: '100%',
        paddingTop: '100%', // Set aspect ratio to 1:1
        backgroundImage: type ? `url('/${type}.png')` : '',
        backgroundColor: 'green',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxSizing: 'border-box'
      }}
      
    ></div>
  );
};

export default Tile;