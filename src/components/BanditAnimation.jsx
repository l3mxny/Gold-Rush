import React from 'react';

const Bandit = ({ side }) => (
  <div className={`bandit ${side}`}>
    <img
      src={side === 'left' ? '/assets/bandit2.png' : '/assets/bandit1.png'}
      alt="Bandit"
      className="bandit-img"
    />
  </div>
);

export default function BanditAnimation({ amount, show }) {
  return (
    <>
      {show && (
        <div className="stolen-notification">
          ⚠️ BANDITS STOLE ${amount}! ⚠️
        </div>
      )}
      <div className="bandit-container">
        <Bandit side="left" />
        <Bandit side="right" />
      </div>
    </>
  );
}
