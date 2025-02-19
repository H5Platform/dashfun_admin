const Constants = {
  MenuItems: {
    BackendAccounts: "Backend Accounts",
    Game: "Game",
  },

  Authority: {
    UserManagement: 0x01,
    GameManagement: 0x02,
    TaskManagement: 0x04,
  },

  GameStatus: {
    All: 0,
    Pending: 1,
    Online: 2,
    Removed: 3,
  },

  GameGenre: {},

  UserStatus: {
    Normal: 1,
    ResetPassword: 2,
    Ban: 3,
  },

  TaskCategory: {
    Challenge: 1,
    Daily: 2,
  },

  TaskTypes: {
    Normal: 1,
    Daily: 2,
    Every2Days: 3,
    Every3Days: 4,
    Every7Days: 5,
  },

  TaskConditions: {
    PlayRandomGame: 1,
    PlayGame: 2,
    LevelUp: 3,
    JoinTGChannel: 4,
    FollowX: 5,
    SpendTGStars: 6,
    BindWallet: 7,
    InviteFriends: 8,
  },

  TaskRewardTypes: {
    DashFunCoin: 1, //奖励dash coin，这个暂时没用
    DashFunXP: 2, //奖励dashfun xp
    GamePoint: 3, //奖励游戏对应的积分
  },
};

export default Constants;
