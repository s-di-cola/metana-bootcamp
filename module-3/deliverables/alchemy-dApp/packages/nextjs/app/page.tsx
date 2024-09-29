// pages/index.tsx

"use client";

import type {NextPage} from "next";
import NFTCard from "~~/components/alchemy/NFTCard";
import React, {useEffect, useState, useCallback} from "react";
import {useScaffoldReadContract, useScaffoldWriteContract} from "~~/hooks/scaffold-eth";
import {notification} from "~~/utils/scaffold-eth";
import {useAccount} from "wagmi";
import TradeModal from "~~/components/alchemy/TradeModal";
import ForgeSystem from "~~/components/alchemy/ForgeSystem";

const tokens = {
    IRON: 0,
    COPPER: 1,
    SILVER: 2,
    GOLD: 3,
    PLATINUM: 4,
    PALLADIUM: 5,
    RHODIUM: 6,
};

const Home: NextPage = () => {
    const [allTokensData, setAllTokensData] = useState([]);
    const {address} = useAccount();

    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [selectedFromToken, setSelectedFromToken] = useState(null);
    const [isTrading, setIsTrading] = useState(false);

    const {data: balances, refetch: refetchBalances} = useScaffoldReadContract({
        contractName: "Forgery",
        functionName: "getBalances",
        args: address ? [address] : null,
        enabled: !!address,
    });

    const {writeContractAsync, isMining} = useScaffoldWriteContract("Forgery");

    const handleAction = useCallback(
        async (action, tokenType, amount) => {
            try {
                const functionName =
                    action === "burn"
                        ? "burn"
                        : tokenType <= tokens.SILVER
                            ? "forgeBasicToken"
                            : "forgeCompoundToken";

                console.log(`Attempting to ${action} token ${tokenType}`);
                 await writeContractAsync({
                    functionName,
                    args: [tokenType, amount],
                });

                notification.success(`Token ${action}ed successfully.`);
                await refetchBalances();
            } catch (error) {
                console.error(`Error ${action}ing token:`, error);
                notification.error(`Failed to ${action} token. See console for details.`);
            }
        },
        [writeContractAsync, refetchBalances]
    );

    const handleTradeClick = (token) => {
        setSelectedFromToken(token);
        setIsTradeModalOpen(true);
    };

    const handleTrade = async (toTokenType, amount) => {
        setIsTrading(true);
        try {
            const fromTokenType = tokens[selectedFromToken.tokenType];
            console.log(`Trading ${amount} of ${selectedFromToken.tokenType} to ${Object.keys(tokens)[toTokenType]}`);

            const tx = await writeContractAsync({
                functionName: "trade",
                args: [fromTokenType, toTokenType, amount],
            });
            notification.success(`Traded successfully.`);
            await refetchBalances();
        } catch (error) {
            console.error(`Error trading tokens:`, error);
            notification.error(`Failed to trade tokens. See console for details.`);
        } finally {
            setIsTrading(false);
            setIsTradeModalOpen(false);
        }
    };

    const loadTokenData = useCallback(async (tokenType, tokenIndex) => {
        try {
            const response = await fetch(
                `/tokens/metadata/${Object.keys(tokens)[tokenType].toLowerCase()}/${tokenIndex}`
            );
            if (!response.ok) {
                console.error(`Failed to fetch metadata for token ${tokenType} index ${tokenIndex}`);
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error(`Failed to load metadata for token ${tokenType} index ${tokenIndex}:`, error);
            return null;
        }
    }, []);

    const loadAllTokens = useCallback(async () => {
        if (!address) return; // Ensure the user is connected
        const balancesData = balances || new Array(Object.keys(tokens).length).fill(0);

        console.log("Balances:", balancesData);

        const tokensArray = await Promise.all(
            balancesData.map(async (balance, index) => {
                const tokenIndex = index % 5;
                const tokenData = await loadTokenData(index, tokenIndex);
                return tokenData
                    ? {
                        ...tokenData,
                        tokenType: Object.keys(tokens)[index],
                        tokenIndex,
                        quantity: Number(balance),
                    }
                    : null;
            })
        );
        const filteredTokens = tokensArray.filter(Boolean);
        console.log("All Tokens Data:", filteredTokens);
        setAllTokensData(filteredTokens);
    }, [balances, loadTokenData, address]);

    useEffect(() => {
        loadAllTokens();
    }, [loadAllTokens, balances]);

    return (
        <div className="flex flex-col items-center flex-grow pt-8 space-y-6">
            <div className="px-5 text-center">
                <h1 className="block text-2xl mb-2">Welcome to the</h1>
                <h1 className="block text-3xl font-bold">Forgery</h1>
            </div>
            <ForgeSystem/>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                {allTokensData && allTokensData.length > 0 ? (
                    allTokensData.map((token, index) => (
                        <div key={index} className="flex">
                            <NFTCard
                                title={`${token.tokenType} - ${token.name}`}
                                description={token.description}
                                image={`/tokens/images/${token.tokenType.toLowerCase()}/${token.tokenIndex}.webp`}
                                quantity={token.quantity}
                                buttons={[
                                    {
                                        label: "Trade",
                                        variant: "btn-primary",
                                        disabled: isMining || token.quantity === 0,
                                        onClick: () => handleTradeClick(token),
                                    },
                                    {
                                        label: isMining ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            "Forge"
                                        ),
                                        variant: "btn-secondary",
                                        disabled: isMining,
                                        onClick: () => handleAction("forge", tokens[token.tokenType], 1),
                                    },
                                    {
                                        label: isMining ? (
                                            <span className="loading loading-spinner loading-sm"></span>
                                        ) : (
                                            "Burn"
                                        ),
                                        variant: "btn-error",
                                        disabled: isMining || token.quantity === 0,
                                        onClick: () => handleAction("burn", tokens[token.tokenType], 1),
                                    },
                                ]}
                            />
                        </div>
                    ))
                ) : (
                    <p>Loading NFT data...</p>
                )}
            </div>
            {selectedFromToken && (
                <TradeModal
                    isOpen={isTradeModalOpen}
                    onClose={() => setIsTradeModalOpen(false)}
                    fromToken={selectedFromToken}
                    onTrade={handleTrade}
                    isTrading={isTrading}
                />
            )}
        </div>
    );
};

export default Home;
