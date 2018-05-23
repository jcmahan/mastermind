import React from 'react';

const ScoresPage = (props) => {
    return (
        <div className="Scores">
            <h1>High Scores</h1>
            {props.scores.length ? 
                props.scores.map
                ( s => <p key={s._id}>Player Initials: {s.initials}
                Number of Guesses: {s.numGuesses}
                It Took You How Long? {s.seconds}</p>)
            :
                <h2>No High Scores Yet!</h2>}
        </div>
    );
}

export default ScoresPage; 