const getSendingToEmail = (users, currentUser) =>
  users?.filter(notCurrentUser => notCurrentUser !== currentUser)[0];

export default getSendingToEmail;
