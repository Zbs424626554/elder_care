import { http } from "../utils/request";

// 消息列表项接口
export interface MessageListItem {
  id: string;
  users: Array<{
    username: string;
    realname: string;
    role: string;
  }>;
  lastMessage?: {
    sender: string;
    content: any;
    sendTime: number;
    type: string;
    receiver: string[];
  };
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

// 聊天联系人接口
export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage?: {
    id: string;
    content: string;
    timestamp: Date | string | number;
    isRead: boolean;
    type: string;
  };
  unreadCount: number;
  isOnline: boolean;
  role: string;
  updatedAt: string;
}

// 聊天消息接口
export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  sendTime: number;
  type: string;
  receiver: string[];
}

// 对话详情接口
export interface ConversationDetail {
  conversationId: string;
  users: Array<{
    username: string;
    realname?: string;
    role: string;
  }>;
  messages: ChatMessage[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API响应接口
export interface MessageListResponse {
  list: MessageListItem[] | ChatItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class MessageService {
  // 获取消息列表
  static async getMessageList(
    params: {
      username?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<MessageListResponse> {
    const { data } = await http.get<MessageListResponse>("/messagelist", {
      params,
    });
    return data;
  }

  // 根据用户名获取对话列表
  static async getUserChatList(
    username: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<MessageListResponse> {
    const { data } = await http.get<MessageListResponse>(
      `/messagelist/${username}`,
      {
        params,
      }
    );
    return data;
  }

  // 获取对话详情
  static async getConversationDetail(
    conversationId: string,
    params: {
      page?: number;
      limit?: number;
    } = {}
  ) {
    const { data } = await http.get(`/conversation/${conversationId}`, {
      params,
    });
    return data;
  }

  // 发送消息
  static async sendMessage(data: {
    conversationId: string;
    content: string;
    sender: string;
    type?: string;
    receiver: string[];
  }) {
    const { data: responseData } = await http.post(
      `/conversation/${data.conversationId}/send`,
      {
        content: data.content,
        sender: data.sender,
        type: data.type || "text",
        receiver: data.receiver,
      }
    );
    return responseData;
  }

  // 创建新对话
  static async createConversation(data: {
    participants: Array<{
      username: string;
      realname?: string;
      role: string;
    }>;
    initialMessage?: {
      content: string;
      type?: string;
    };
  }) {
    const { data: responseData } = await http.post(
      "/conversation/create",
      data
    );
    return responseData;
  }
}
