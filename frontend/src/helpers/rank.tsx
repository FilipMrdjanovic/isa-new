export const getRankColor = (userRank: any) => {
    if (userRank.name === "Transcendent") {
        return "linear-gradient(45deg, rgb(198, 251, 246), rgb(216, 254, 222), rgb(255, 248, 188))";
    } else {
        return userRank.hexColor;
    }
};