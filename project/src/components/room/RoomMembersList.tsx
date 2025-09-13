import React from 'react';
import { Users, Circle } from 'lucide-react';
import { RoomMember } from '../../types';
import Card from '../common/Card';

interface RoomMembersListProps {
  members: RoomMember[];
}

const RoomMembersList: React.FC<RoomMembersListProps> = ({ members }) => {
  return (
    <Card className="p-4">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 mr-2 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Room Members ({members.length})
        </h3>
      </div>
      
      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="ml-3 text-gray-900 font-medium">{member.name}</span>
            </div>
            
            <div className="flex items-center">
              <Circle
                className={`w-3 h-3 mr-2 ${
                  member.isOnline
                    ? 'text-green-500 fill-current'
                    : 'text-gray-400 fill-current'
                }`}
              />
              <span className={`text-sm ${
                member.isOnline ? 'text-green-600' : 'text-gray-500'
              }`}>
                {member.isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RoomMembersList;