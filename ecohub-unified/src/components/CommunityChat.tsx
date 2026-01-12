import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from 'stream-chat-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Users, Leaf, Sun, Car, Recycle, Globe, Hash } from 'lucide-react';
import { config } from '../config/config';
import { useAuth } from '../context/AuthContext';

import 'stream-chat-react/dist/css/v2/index.css';

interface ChatChannel {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const CHAT_CHANNELS: ChatChannel[] = [
  {
    id: 'ecohub-general',
    name: 'General',
    icon: <Globe className="w-4 h-4" />,
    description: 'General eco-discussions',
    color: 'bg-primary-500',
  },
  {
    id: 'ecohub-solar',
    name: 'Solar Energy',
    icon: <Sun className="w-4 h-4" />,
    description: 'Solar panels & renewable energy',
    color: 'bg-yellow-500',
  },
  {
    id: 'ecohub-conservation',
    name: 'Conservation',
    icon: <Leaf className="w-4 h-4" />,
    description: 'Wildlife & nature conservation',
    color: 'bg-green-500',
  },
  {
    id: 'ecohub-transport',
    name: 'Green Transport',
    icon: <Car className="w-4 h-4" />,
    description: 'EVs & sustainable transport',
    color: 'bg-blue-500',
  },
  {
    id: 'ecohub-waste',
    name: 'Waste Exchange',
    icon: <Recycle className="w-4 h-4" />,
    description: 'Recycling & waste management',
    color: 'bg-orange-500',
  },
];

const CommunityChat = () => {
  const { user, isAuthenticated } = useAuth();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [activeChannelId, setActiveChannelId] = useState('ecohub-general');
  const [isOpen, setIsOpen] = useState(false);
  const [showChannelList, setShowChannelList] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user || !config.forum.streamChat.enabled) return;

    const initChat = async () => {
      setIsConnecting(true);
      setError(null);

      try {
        const chatClient = StreamChat.getInstance(config.forum.streamChat.apiKey);

        const userId = user.id || user.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';
        const token = chatClient.devToken(userId);

        await chatClient.connectUser(
          {
            id: userId,
            name: user.name || 'EcoHub User',
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=22c55e&color=fff`,
          },
          token
        );

        // Join the default channel
        const defaultChannel = chatClient.channel('messaging', activeChannelId, {
          name: CHAT_CHANNELS.find(c => c.id === activeChannelId)?.name || 'General',
          image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=100&q=80',
        });

        await defaultChannel.watch();

        setClient(chatClient);
        setChannel(defaultChannel);

        // Listen for new messages for unread count
        chatClient.on('message.new', () => {
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          }
        });

      } catch (err: any) {
        console.error('Stream Chat Error:', err);
        setError(err.message || 'Failed to connect to chat');
      } finally {
        setIsConnecting(false);
      }
    };

    initChat();

    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [isAuthenticated, user]);

  const switchChannel = async (channelId: string) => {
    if (!client) return;

    setIsConnecting(true);
    try {
      const channelInfo = CHAT_CHANNELS.find(c => c.id === channelId);
      const newChannel = client.channel('messaging', channelId, {
        name: channelInfo?.name || 'Channel',
      });

      await newChannel.watch();
      setChannel(newChannel);
      setActiveChannelId(channelId);
      setShowChannelList(false);
    } catch (err) {
      console.error('Error switching channel:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  if (!config.forum.streamChat.enabled) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-6 right-6 z-50 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors"
        onClick={() => window.location.href = '/login'}
        title="Sign in to chat"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    );
  }

  const activeChannel = CHAT_CHANNELS.find(c => c.id === activeChannelId);

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => isOpen ? setIsOpen(false) : handleOpenChat()}
        className="fixed bottom-6 right-6 z-50 bg-primary-500 text-white p-4 rounded-full shadow-lg hover:bg-primary-600 transition-colors relative"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </>
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
          >
            {/* Header */}
            <div className={`${activeChannel?.color || 'bg-primary-500'} text-white p-4 transition-colors`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    {activeChannel?.icon || <Leaf className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{activeChannel?.name || 'Community'}</h3>
                    <div className="flex items-center text-xs text-white/80">
                      <Users className="w-3 h-3 mr-1" />
                      <span>EcoHub Community</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowChannelList(!showChannelList)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    title="Switch Channel"
                  >
                    <Hash className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Channel List */}
            <AnimatePresence>
              {showChannelList && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-gray-200 bg-gray-50 overflow-hidden"
                >
                  <div className="p-3 space-y-1">
                    <p className="text-xs text-gray-500 font-medium mb-2 px-2">CHANNELS</p>
                    {CHAT_CHANNELS.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => switchChannel(ch.id)}
                        className={`w-full flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                          activeChannelId === ch.id
                            ? 'bg-primary-100 text-primary-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 ${ch.color} rounded-lg flex items-center justify-center text-white`}>
                          {ch.icon}
                        </div>
                        <div className="text-left flex-1">
                          <div className="text-sm font-medium">{ch.name}</div>
                          <div className="text-xs text-gray-500 truncate">{ch.description}</div>
                        </div>
                        {activeChannelId === ch.id && (
                          <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Chat Content */}
            <div className="flex-1 overflow-hidden">
              {isConnecting ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                    <p className="text-gray-500 text-sm">Connecting to {activeChannel?.name || 'chat'}...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-red-500" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Connection Error</p>
                    <p className="text-gray-500 text-sm mb-4">{error}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : client && channel ? (
                <Chat client={client} theme="str-chat__theme-light">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageInput placeholder={`Message #${activeChannel?.name.toLowerCase() || 'general'}...`} />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chat not available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Tips Footer */}
            <div className="border-t border-gray-100 p-2 bg-gray-50">
              <p className="text-xs text-gray-400 text-center">
                💡 Share eco-tips and connect with the community!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CommunityChat;
