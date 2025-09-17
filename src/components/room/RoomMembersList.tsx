import React from 'react';
import { Users, Circle, Sparkles, Heart } from 'lucide-react';
import { RoomMember } from '../../types';
import Card from '../common/Card';

interface RoomMembersListProps {
  members: RoomMember[];
}

const RoomMembersList: React.FC<RoomMembersListProps> = ({ members }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center mb-6">
        <div className="relative mr-3">
          <Users className="w-6 h-6 text-violet-600 animate-twinkle" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-pink-500 animate-sparkle" />
        </div>
        <h3 className="text-xl font-bold gradient-text">
          ✨ Magical Members ({members.length}) 💕
        </div>
        <h3 className="text-xl font-bold gradient-text">
          ✨ Magical Members ({members.length}) 💕
        </h3>
      </div>
      
      <div className="space-y-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/20 backdrop-blur-sm border border-pink-200 hover:bg-white/30 transition-all duration-300 hover:scale-105 shadow-sparkle">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-400 via-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-glow animate-float">
                <span className="text-white text-sm font-bold">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="ml-4">
                <span className="text-violet-900 font-bold text-lg">{member.name}</span>
                <Heart className="w-4 h-4 inline ml-2 text-pink-500 animate-heartbeat" />
              </div>
                <span className="text-violet-900 font-bold text-lg">{member.name}</span>
                <Heart className="w-4 h-4 inline ml-2 text-pink-500 animate-heartbeat" />
              </div>
            </div>
            
            <div className="flex items-center">
              <Circle
                className={`w-4 h-4 mr-3 animate-twinkle ${
                  member.isOnline
                    ? 'text-green-400 fill-current drop-shadow-glow'
                    : 'text-gray-300 fill-current'
                }`}
              />
              <span className={`text-sm font-bold ${
                member.isOnline ? 'text-green-600' : 'text-gray-400'
              }`}>
                {member.isOnline ? 'Online ✨' : 'Offline 💤'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RoomMembersList;