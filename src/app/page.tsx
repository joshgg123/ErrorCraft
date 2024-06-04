'use client';

import React from 'react';

const Menu: React.FC = () => {

    const startGame = () => {

        window.location.href = '/game';
       
    };

    const showControls = () => {
        alert("Controles del juego:\n- Movimiento: WASD o flechas\n- Saltar: Barra espaciadora\n- Pausa: P");
      
    };

    return (
      <div className='Menu'>
          <div className="text-center text-white font-sans">
            <h1 className="text-4xl mb-6 text-black">Menú del Juego</h1>
            <button 
                onClick={startGame} 
                className="block w-48 mx-auto py-2 my-2 text-lg font-semibold cursor-pointer border-none rounded bg-blue-400 text-gray-800 hover:bg-blue-600"
            >
                Iniciar Juego
            </button>
            <button 
                onClick={showControls} 
                className="block w-48 mx-auto py-2 my-2 text-lg font-semibold cursor-pointer border-none rounded bg-blue-400 text-gray-800 hover:bg-blue-600"
            >
                Ver Controles
            </button>
        </div>
      </div>

    );
};

export default Menu;