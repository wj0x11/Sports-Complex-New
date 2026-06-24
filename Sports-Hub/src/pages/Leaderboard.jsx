import "../styles/leaderboard.css";

function Leaderboard() {
  const leaderboards = [
    {
      sport: "Basketball",

      players: [
        {
          name: "Kasun Perera",

          points: "1280 Points",
        },

        {
          name: "Nimal Silva",

          points: "1120 Points",
        },

        {
          name: "Ashen Fernando",

          points: "980 Points",
        },
      ],
    },

    {
      sport: "Badminton",

      players: [
        {
          name: "Dilshan Jayasuriya",

          points: "1420 Points",
        },

        {
          name: "Kavindu Silva",

          points: "1200 Points",
        },

        {
          name: "Ravindu Perera",

          points: "1010 Points",
        },
      ],
    },
  ];

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="leaderboard-header">
          <h1 className="leaderboard-title">Sports Leaderboard</h1>

          <p className="leaderboard-subtitle">
            Track top players, rankings, and sports achievements across the
            complex.
          </p>
        </div>

        <div className="leaderboard-grid">
          {leaderboards.map((leaderboard, index) => (
            <div className="leaderboard-card" key={index}>
              <h2 className="leaderboard-sport">{leaderboard.sport}</h2>

              {leaderboard.players.map((player, i) => (
                <div className="player-item" key={i}>
                  <div className="player-info">
                    <h3>{player.name}</h3>

                    <p>{player.points}</p>
                  </div>

                  <div className="player-rank">#{i + 1}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
