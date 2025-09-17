        };
      }
    },
    endVotingSession: (state) => {
      if (state.currentRoom) {
        state.currentRoom.status = 'results';
        if (state.currentRoom.votingSession) {
          state.currentRoom.votingSession.isActive = false;
        }
      }
    },
    updateVotingTimer: (state, action: PayloadAction<number>) => {
      if (state.currentRoom?.votingSession) {
        state.currentRoom.votingSession.timeLeft = action.payload;
      }
    },
    nextPlace: (state) => {
      if (state.currentRoom?.votingSession) {
        state.currentRoom.votingSession.currentPlaceIndex += 1;
        state.currentRoom.votingSession.timeLeft = 30;
      }
    },
export const { 
  setCurrentRoom, 
  addMember, 
  updateMemberStatus, 
  addVote, 
    startVotingSession: (state) => {
  updateRoomStatus, 
      if (state.currentRoom) {
  startVotingSession,
        state.currentRoom.status = 'voting';
  endVotingSession,
        state.currentRoom.votingSession = {
  updateVotingTimer,
          isActive: true,
  nextPlace,
          currentPlaceIndex: 0,
  startVotingSession,
  endVotingSession,
  updateVotingTimer,
  nextPlace,
  setLoading, 
          timeLeft: 30,
  setError 
          autoVoteEnabled: true,
} = roomSlice.actions;