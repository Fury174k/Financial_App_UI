import React, { useEffect, useState, useRef } from 'react';
import { Bell, X, Check } from 'lucide-react';

const NotificationPanel = ({ userToken, apiBaseUrl = 'https://financial-tracker-api-1wlt.onrender.com', showBellWithBadge = true }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef();

  const fetchNotifications = async () => {
    if (!userToken) return;
    try {
      const res = await fetch(`${apiBaseUrl}/api/notifications/`, {
        headers: { Authorization: `Token ${userToken}` },
      });
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        setNotifications(data);
      } else {
        console.error('Expected JSON but received:', await res.text());
        setNotifications([]);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch(`${apiBaseUrl}/api/notifications/${id}/read/`, {
        method: 'POST',
        headers: { Authorization: `Token ${userToken}` },
      });
      setNotifications((prev) =>
        prev.map((notif) => (notif.id === id ? { ...notif, is_read: true } : notif))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await fetch(`${apiBaseUrl}/api/notifications/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${userToken}` },
      });
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userToken, fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative inline-block" ref={panelRef}>
      {showBellWithBadge && (
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2 rounded-full hover:bg-gray-100"
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {open && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 shadow-lg w-80 rounded-xl">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="overflow-y-auto max-h-80">
            {notifications.length === 0 ? (
              <div className="p-4 text-sm text-gray-600">No notifications.</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start justify-between gap-2 p-4 border-b hover:bg-gray-50 ${
                    notif.is_read ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{notif.title}</p>
                    <p className="mt-1 text-sm text-gray-600">{notif.message}</p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {!notif.is_read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-green-600 hover:text-green-800"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
