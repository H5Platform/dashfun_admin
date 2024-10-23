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
    Normal: 0,
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
};

export default Constants;
