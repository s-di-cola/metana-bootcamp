import React, { useEffect, useState } from "react";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const ForgeSystem: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const { data: lastMintedTime } = useScaffoldReadContract({
    contractName: "Forgery",
    functionName: "getLastMintedTime",
  });

  const { data: canForgeNow } = useScaffoldReadContract({
    contractName: "Forgery",
    functionName: "canForgeNow",
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (canForgeNow === false) {
      setTimeLeft(60); // Start the countdown from 60 seconds
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(0);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [canForgeNow]);

  const formatTime = (timestamp: any): string => {
    if (!timestamp) return "Loading...";
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex items-center justify-center p-2 bg-base-200 shadow-sm rounded-md">
      <div className="flex flex-wrap items-center justify-center space-x-3 text-sm">
        <div className="flex items-center">
          <span className="font-semibold mr-1">Last Minted:</span>
          {formatTime(lastMintedTime)}
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-1">Next Forge In:</span>
          {timeLeft}s
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-1">Status:</span>
          {canForgeNow === undefined ? (
            <span className="badge badge-outline">Loading...</span>
          ) : canForgeNow ? (
            <span className="badge badge-success">Ready</span>
          ) : (
            <span className="badge badge-error">Cooling Down</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgeSystem;
