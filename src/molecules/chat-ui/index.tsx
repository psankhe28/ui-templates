import Chat from '@samagra-x/chatui';
import '@samagra-x/chatui/dist/index.css';
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './index.module.css'
import { getMsgType } from './utils/getMsgType';
import MessageItem from '../message-item';
import toast from 'react-hot-toast';
import { recordUserLocation } from './utils/location';
import chatHistory from './chatHistory.json';
import config from './config.json';
import ShareButtons from '../share-buttons';

export const ChatUI: React.FC = () => {
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHistory = () => {
      const normalizedChats = normalizedChat(chatHistory);
      if (normalizedChats.length > 0) {
        setMessages(normalizedChats);
      }
    };
    fetchHistory();
    recordUserLocation();
  }, []);

  const normalizedChat = (chats: any): any => {
    console.log('in normalized', chats);
    const history = chats.flatMap((item: any) =>
        [
          item.query?.length && {
            text: item.query,
            position: 'right',
            repliedTimestamp: item.createdAt,
            // messageId: uuidv4(),
          },
          {
            text: item.response,
            position: 'left',
            sentTimestamp: item.createdAt,
            reaction: item.reaction,
            msgId: item.id,
            messageId: item.id,
            audio_url: item.audioURL,
            isEnd: true,
            optionClicked: true,
          },
        ].filter(Boolean)
      );

    return history;
  };
  const sendMessage = (text: string) => {
    setMessages((prev: any) => [
      ...prev,
      {
        text,
        position: 'right',
      },
    ]);
    setLoading(true);

    // dummy response
    setTimeout(() => {
      setMessages((prev: any) => [
        ...prev,
        {
          text: "This is a dummy response.",
          position: 'left',
          reaction: 0,
          isEnd: true // Used to determine whether a streaming response has ended
        },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleSend = useCallback(async (type: string, msg: any) => {
    if (msg.length === 0) {
      toast.error('Please enter message');
      return;
    }
    if (type === 'text' && msg.trim()) {
      sendMessage(msg.trim());
    }
  }, []);


  const normalizeMsgs = useMemo(
    () =>
      messages?.map((msg: any) => ({
        type: getMsgType(msg),
        content: { text: msg?.text, data: { ...msg } },
        position: msg?.position ?? 'right',
      })),
    [messages]
  );

  const msgToRender = useMemo(() => {
    return loading
      ? [
          ...normalizeMsgs,
          {
            type: 'loader',
            position: 'left',
          },
        ]
      : normalizeMsgs;
  }, [loading, normalizeMsgs]);

  const placeholder = useMemo(() => config?.component?.placeholder ?? "Ask Your Question", [config]);

  return (
    <div className={styles.container}>
      <Chat
        btnColor={config.theme.secondaryColor.value}
        background="white"
        disableSend={false}
        showTransliteration={config.component.allowTransliteration}
        transliterationConfig={{
          transliterationApi: config.component.transliterationApi,
          transliterationInputLanguage: config.component.transliterationInputLanguage,
          transliterationOutputLanguage: config.component.transliterationOutputLanguage,
          transliterationProvider: config.component.transliterationProvider,
          transliterationSuggestions: config.component.transliterationSuggestions
        }}
        //@ts-ignore
        messages={msgToRender}
        renderMessageContent={(props): ReactElement => (
          <MessageItem message={props} config={config} />
        )}
        onSend={handleSend}
        locale="en-US"
        placeholder={placeholder}
      />
      
      <ShareButtons />
      
    </div>
  );
};


