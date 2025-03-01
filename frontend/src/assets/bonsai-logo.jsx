// const BonsaiLogo = () => (
//     <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
//       <path
//         d="M20 8C13.3726 8 8 13.3726 8 20C8 26.6274 13.3726 32 20 32C26.6274 32 32 26.6274 32 20C32 13.3726 26.6274 8 20 8Z"
//         fill="#14B8A6"
//       />
//       <path d="M20 12C20 12 16 16.5 16 20C16 23.5 18 28 20 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
//       <path d="M20 12C20 12 24 16.5 24 20C24 23.5 22 28 20 28" stroke="white" strokeWidth="2" strokeLinecap="round" />
//       <path d="M20 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" />
//       <path d="M44 16H48C50.2091 16 52 17.7909 52 20C52 22.2091 50.2091 24 48 24H44V16Z" fill="#14B8A6" />
//       <path d="M56 16H60C62.2091 16 64 17.7909 64 20C64 22.2091 62.2091 24 60 24H56V16Z" fill="#14B8A6" />
//       <path d="M68 16H76C78.2091 16 80 17.7909 80 20C80 22.2091 78.2091 24 76 24H68V16Z" fill="#14B8A6" />
//       <path d="M84 16H88C90.2091 16 92 17.7909 92 20C92 22.2091 90.2091 24 88 24H84V16Z" fill="#14B8A6" />
//       <path d="M96 16H104C106.209 16 108 17.7909 108 20C108 22.2091 106.209 24 104 24H96V16Z" fill="#14B8A6" />
//     </svg>
//   )
  
//   export default BonsaiLogo
  
import React from 'react';

const BonsaiLogo = ({ width = 150, height = 150 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="100" cy="100" r="95" stroke="green" strokeWidth="5" fill="lightgreen" />
    <path
      d="M80 150 C 70 120, 50 100, 75 70 C 85 60, 95 55, 110 65 C 125 75, 140 70, 145 90 C 150 110, 130 130, 120 140 C 110 150, 90 160, 80 150"
      stroke="darkgreen"
      strokeWidth="4"
      fill="none"
    />
    <rect x="90" y="140" width="20" height="30" fill="saddlebrown" stroke="brown" strokeWidth="3" />
    <text x="50" y="190" fontSize="24" fill="darkgreen" fontWeight="bold">Bons.ai</text>
  </svg>
);

export default BonsaiLogo;
