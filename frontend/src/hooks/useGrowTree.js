import { useState } from "react";

const useGrowTree = (initialCarbonSaved = 50) => {
  const [carbonSaved, setCarbonSaved] = useState(initialCarbonSaved);

  const growTree = () => {
    setCarbonSaved((prev) => prev + 10); // Increase carbon saved by 10 kg
  };

  return { carbonSaved, growTree };
};

export default useGrowTree;