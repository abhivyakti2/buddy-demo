import { io, Socket } from 'socket.io-client';
import { Room, RoomMember, Vote, Place } from '../types';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string) {
    this.socket = io('http://localhost:3001', {
      query: { userId },
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave-room', roomId);
    }
  }

  submitVote(vote: Vote) {
    if (this.socket) {
      this.socket.emit('submit-vote', vote);
    }
  }

  onMemberJoined(callback: (member: RoomMember) => void) {
    if (this.socket) {
      this.socket.on('member-joined', callback);
    }
  }

  onMemberLeft(callback: (memberId: string) => void) {
    if (this.socket) {
      this.socket.on('member-left', callback);
    }
  }

  onVoteUpdate(callback: (vote: Vote) => void) {
    if (this.socket) {
      this.socket.on('vote-update', callback);
    }
  }

  onRoomUpdate(callback: (room: Room) => void) {
    if (this.socket) {
      this.socket.on('room-update', callback);
    }
  }

  onNewSuggestions(callback: (places: Place[]) => void) {
    if (this.socket) {
      this.socket.on('new-suggestions', callback);
    }
  }
}

export default new SocketService();