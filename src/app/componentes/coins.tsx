import React from "react";

interface CoinProps {
    numberOfCoins: number;
    x: number;
    y: number;
}

export class Coin extends React.Component<CoinProps> {
    render() {
        const { numberOfCoins, x, y } = this.props;
        return (
            <div>
                {/* Your Coin component JSX */}
            </div>
        );
    }
}

export const Coins = () => {
    return (
        <div>
            <Coin numberOfCoins={10} x={100} y={100} />
        </div>
    );
};