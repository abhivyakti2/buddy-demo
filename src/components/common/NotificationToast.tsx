import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { removeNotification } from '../../store/slices/uiSlice';
import { cn } from '../../utils/cn';

const NotificationToast: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector((state) => state.ui.notifications);

  const iconMap = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const colorMap = {
    success: 'notification-magical text-green-800 border-green-300',
    error: 'notification-magical text-pink-800 border-pink-300',
    warning: 'notification-magical text-yellow-800 border-yellow-300',
    info: 'notification-magical text-violet-800 border-violet-300',
  };

  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration !== 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration || 5000);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type];
        return (
          <div
            key={notification.id}
            className={cn(
              'flex items-center p-5 rounded-3xl border-2 shadow-glow animate-slide-up',
              'max-w-sm w-full backdrop-blur-sm transform hover:scale-105 transition-all duration-300',
              colorMap[notification.type]
            )}
          >
            <div className="relative mr-3">
              <Icon className="w-6 h-6 flex-shrink-0 animate-twinkle" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <p className="text-sm font-bold flex-1">{notification.message}</p>
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-sparkle" />
            </div>
            <p className="text-sm font-bold flex-1">{notification.message}</p>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-3 flex-shrink-0 hover:opacity-70 transition-all duration-300 hover:scale-110 p-1 rounded-full hover:bg-white/20"
            >
              <X className="w-5 h-5 animate-twinkle" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationToast;