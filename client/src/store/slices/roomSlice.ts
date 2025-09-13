import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Room, RoomMember, Vote } from '../../types';

interface RoomState {
  currentRoom: Room | null;
  rooms: Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  currentRoom: null,
  rooms: [],
  loading: false,
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<Room>) => {
      state.currentRoom = action.payload;
    },
    addMember: (state, action: PayloadAction<RoomMember>) => {
      if (state.currentRoom) {
        state.currentRoom.members.push(action.payload);
      }
    },
    updateMemberStatus: (state, action: PayloadAction<{ memberId: string; isOnline: boolean }>) => {
      if (state.currentRoom) {
        const member = state.currentRoom.members.find(m => m.id === action.payload.memberId);
        if (member) {
          member.isOnline = action.payload.isOnline;
        }
      }
    },
    addVote: (state, action: PayloadAction<Vote>) => {
      if (state.currentRoom) {
        const existingVoteIndex = state.currentRoom.votes.findIndex(
          v => v.userId === action.payload.userId && v.placeId === action.payload.placeId
        );
        if (existingVoteIndex >= 0) {
          state.currentRoom.votes[existingVoteIndex] = action.payload;
        } else {
          state.currentRoom.votes.push(action.payload);
        }
      }
    },
    updateRoomStatus: (state, action: PayloadAction<Room['status']>) => {
      if (state.currentRoom) {
        state.currentRoom.status = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCurrentRoom, 
  addMember, 
  updateMemberStatus, 
  addVote, 
  updateRoomStatus, 
  setLoading, 
  setError 
} = roomSlice.actions;
export default roomSlice.reducer;